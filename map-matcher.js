// map-matcher.js — Hidden Markov Model Map Matcher using self-hosted OSRM
const fetch = globalThis.fetch || require("node-fetch");
// import fetch from "node-fetch";


class HMMMapMatcher {
  constructor(osrmBaseUrl, options = {}) {
    this.osrm = osrmBaseUrl.replace(/\/$/, "");
    this.maxCandidates = options.maxCandidates || 3;   // candidates per GPS point
    this.beta = options.beta || 8;                     // transition flexibility (meters)
    this.defaultSigma = options.defaultSigma || 10;    // GPS noise (meters)
    this.maxSearchRadius = options.maxSearchRadius || 50;
    this.snapCache = new Map();
    this.cacheTTL = 5000; // ms
  }

  /* ─── Geo Utils ─── */
  haversine(lat1, lng1, lat2, lng2) {
    const R = 6371e3;
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /* ─── Fast Single-Point Snap (for live marker) ─── */
  async fastSnap(lat, lng) {
    // 1.1 m precision cache key
    const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
    const cached = this.snapCache.get(key);
    if (cached && Date.now() - cached.ts < this.cacheTTL) return cached.data;

    try {
      const url = `${this.osrm}/nearest/v1/driving/${lng},${lat}?number=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`OSRM nearest ${res.status}`);
      const data = await res.json();

      if (!data.waypoints?.length) {
        return { lat, lng, name: null, distance: Infinity };
      }
      const wp = data.waypoints[0];
      const result = {
        lat: wp.location[1],
        lng: wp.location[0],
        name: wp.name || "Unknown Road",
        distance: wp.distance,
      };
      this.snapCache.set(key, { data: result, ts: Date.now() });
      return result;
    } catch (err) {
      // Fallback to raw so the system never dies
      return { lat, lng, name: null, distance: Infinity, error: true };
    }
  }

  /* ─── Multi-Candidate Search (for HMM states) ─── */
  async getCandidates(obs) {
    try {
      const url = `${this.osrm}/nearest/v1/driving/${obs.lng},${obs.lat}?number=${this.maxCandidates}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`OSRM nearest ${res.status}`);
      const data = await res.json();
      if (!data.waypoints) return [];

      return data.waypoints
        .map((wp) => ({
          lat: wp.location[1],
          lng: wp.location[0],
          name: wp.name || "Unknown Road",
          distance: wp.distance, // meters from raw GPS
        }))
        .filter((c) => c.distance <= this.maxSearchRadius);
    } catch (err) {
      return [];
    }
  }

  /* ─── Transition Matrix between two adjacent candidate sets ─── */
  async getTransitionMatrix(candidatesA, candidatesB) {
    if (!candidatesA.length || !candidatesB.length) return null;
    const all = [...candidatesA, ...candidatesB];
    const coordsStr = all.map((c) => `${c.lng},${c.lat}`).join(";");
    const sources = candidatesA.map((_, i) => i).join(";");
    const destinations = candidatesB.map((_, i) => candidatesA.length + i).join(";");

    const url = `${this.osrm}/table/v1/driving/${coordsStr}?sources=${sources}&destinations=${destinations}&annotations=distance`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`OSRM table ${res.status}`);
      const data = await res.json();
      if (data.code !== "Ok" || !data.distances) return null;
      // OSRM returns null for unreachable pairs; replace with Infinity
      return data.distances.map((row) => row.map((d) => (d === null ? Infinity : d)));
    } catch (err) {
      return null;
    }
  }

  /* ─── HMM Probabilities (log-space) ─── */
  emissionLogProb(obs, candidate) {
    // sigma scales with reported GPS accuracy
    const sigma = obs.accuracy ? Math.max(obs.accuracy, 4) : this.defaultSigma;
    const d = candidate.distance;
    return -(d * d) / (2 * sigma * sigma);
  }

  transitionLogProb(routeDist, obsDist) {
    if (!isFinite(routeDist)) return -Infinity;
    const diff = Math.abs(routeDist - obsDist);
    return -diff / this.beta;
  }

  /* ─── Core Viterbi HMM ───
   * observations: [{lat, lng, accuracy?, timestamp?, ...}]
   * Returns: Array aligned with observations; null = no match found
   */
  async match(observations) {
    if (!observations || observations.length < 2) return null;

    // 1. Generate candidate sets per observation
    const allCandidates = await Promise.all(observations.map((o) => this.getCandidates(o)));

    // Keep only observations that have at least one candidate road segment
    const valid = [];
    for (let i = 0; i < observations.length; i++) {
      if (allCandidates[i].length > 0) {
        valid.push({ obs: observations[i], cands: allCandidates[i], origIdx: i });
      }
    }
    if (valid.length < 2) return null; // insufficient road data

    // 2. Viterbi dynamic programming tables
    const V = []; // log probabilities
    const prev = []; // back-pointers

    // Initialize first observation
    const first = valid[0];
    V[0] = first.cands.map((c) => this.emissionLogProb(first.obs, c));
    prev[0] = first.cands.map(() => -1);

    // 3. Recursion
    for (let i = 1; i < valid.length; i++) {
      const curr = valid[i];
      const prevObs = valid[i - 1];

      // Road-network distances between every candidate of prevObs and curr
      const transMatrix = await this.getTransitionMatrix(prevObs.cands, curr.cands);
      const obsDist = this.haversine(
        prevObs.obs.lat,
        prevObs.obs.lng,
        curr.obs.lat,
        curr.obs.lng
      );

      V[i] = [];
      prev[i] = [];

      for (let k = 0; k < curr.cands.length; k++) {
        let maxLogProb = -Infinity;
        let bestJ = -1;

        for (let j = 0; j < prevObs.cands.length; j++) {
          if (!transMatrix) continue;
          const routeDist = transMatrix[j][k];
          const tLog = this.transitionLogProb(routeDist, obsDist);
          if (!isFinite(tLog)) continue;

          const prob = V[i - 1][j] + tLog;
          if (prob > maxLogProb) {
            maxLogProb = prob;
            bestJ = j;
          }
        }

        const eLog = this.emissionLogProb(curr.obs, curr.cands[k]);
        V[i][k] = maxLogProb + eLog;
        prev[i][k] = bestJ;
      }
    }

    // 4. Backtrack to recover best path
    const path = new Array(observations.length).fill(null);
    let maxFinal = -Infinity;
    let bestK = -1;
    for (let k = 0; k < V[valid.length - 1].length; k++) {
      if (V[valid.length - 1][k] > maxFinal) {
        maxFinal = V[valid.length - 1][k];
        bestK = k;
      }
    }

    for (let i = valid.length - 1; i >= 0; i--) {
      if (bestK === -1) break;
      const cand = valid[i].cands[bestK];
      path[valid[i].origIdx] = {
        ...valid[i].obs,
        lat: cand.lat,
        lng: cand.lng,
        roadName: cand.name,
        snapped: true,
        // rough confidence proxy (higher = better). Normalize later if needed.
        confidence: Math.exp(V[i][bestK]),
      };
      bestK = prev[i][bestK];
    }

    return path;
  }
}

module.exports = { HMMMapMatcher };