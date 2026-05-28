// apps/web/src/lib/kalman.ts — 2D GPS Kalman with outlier rejection & dynamic measurement noise

class ScalarKalman {
  private x = 0;
  private p = 1;
  private q: number;
  private initialized = false;

  constructor(q = 1e-6) {
    this.q = q;
  }

  update(measurement: number, r: number, dt: number, velocity: number = 0) {
    if (!this.initialized) {
      this.x = measurement;
      this.initialized = true;
      return measurement;
    }

    // Predict with constant-velocity model
    this.x += velocity * dt;
    this.p += this.q * dt;

    // Update
    const k = this.p / (this.p + r);
    this.x += k * (measurement - this.x);
    this.p = (1 - k) * this.p;

    return this.x;
  }

  getEstimate() {
    return this.x;
  }
}

export interface KalmanResult {
  lat: number;
  lng: number;
  heading: number;
  isOutlier: boolean;
}

export class GpsKalmanFilter {
  private latFilter = new ScalarKalman(1e-6);
  private lngFilter = new ScalarKalman(1e-6);
  private lastLat = 0;
  private lastLng = 0;
  private lastTime = 0;
  private lastHeading = 0;

  update(
    lat: number,
    lng: number,
    accuracy: number,
    timestamp: number,
    speed?: number | null,
    heading?: number | null
  ): KalmanResult {
    const dt = this.lastTime > 0 ? (timestamp - this.lastTime) / 1000 : 0;

    // Convert accuracy (meters) to degrees variance
    const mPerDegLat = 111000;
    const mPerDegLng = 111000 * Math.cos((lat * Math.PI) / 180);
    const rLat = (accuracy / mPerDegLat) ** 2;
    const rLng = (accuracy / mPerDegLng) ** 2;

    // Derive velocity from previous smoothed positions
    let vLat = 0;
    let vLng = 0;
    if (dt > 0 && this.lastTime > 0) {
      vLat = (lat - this.lastLat) / dt;
      vLng = (lng - this.lastLng) / dt;

      // If GPS speed/heading is reliable (>1 m/s), blend it in
      if (speed && speed > 1 && heading != null) {
        const hRad = (heading * Math.PI) / 180;
        const sLat = (speed * Math.cos(hRad)) / mPerDegLat;
        const sLng = (speed * Math.sin(hRad)) / mPerDegLng;
        vLat = vLat * 0.3 + sLat * 0.7;
        vLng = vLng * 0.3 + sLng * 0.7;
      }
    }

    // Outlier rejection: if measurement is >3× accuracy away from prediction, dampen trust
    const predLat = this.latFilter.getEstimate() + vLat * dt;
    const predLng = this.lngFilter.getEstimate() + vLng * dt;
    const distSq = (lat - predLat) ** 2 + (lng - predLng) ** 2;
    const threshold = ((accuracy * 3) / 111000) ** 2;
    const isOutlier = this.lastTime > 0 && distSq > threshold;

    const adjRLat = isOutlier ? rLat * 25 : rLat;
    const adjRLng = isOutlier ? rLng * 25 : rLng;

    const smoothedLat = this.latFilter.update(lat, adjRLat, dt, vLat);
    const smoothedLng = this.lngFilter.update(lng, adjRLng, dt, vLng);

    // Heading from smoothed displacement if GPS heading is missing or stationary
    let smoothedHeading = heading ?? 0;
    if (dt > 0 && (speed == null || speed < 1.5)) {
      const dLat = smoothedLat - this.lastLat;
      const dLng = smoothedLng - this.lastLng;
      if (Math.abs(dLng) > 1e-9 || Math.abs(dLat) > 1e-9) {
        smoothedHeading =
          ((Math.atan2(
            dLng * Math.cos((lat * Math.PI) / 180),
            dLat
          ) *
            180) /
            Math.PI +
            360) %
          360;
      } else {
        smoothedHeading = this.lastHeading;
      }
    }

    this.lastLat = smoothedLat;
    this.lastLng = smoothedLng;
    this.lastTime = timestamp;
    this.lastHeading = smoothedHeading;

    return {
      lat: smoothedLat,
      lng: smoothedLng,
      heading: smoothedHeading,
      isOutlier,
    };
  }
}