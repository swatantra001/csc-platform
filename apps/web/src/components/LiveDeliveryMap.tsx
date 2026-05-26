


// D:\csc-platform\apps\web\src\components\LiveDeliveryMap.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { socket } from "@/lib/socket";
import { supabase } from "@/lib/supabase";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import 'leaflet-rotatedmarker'
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// ─── Custom Icons ───
const createPulseIcon = (color: string) =>
  new L.DivIcon({
    html: `
      <div style="
        background: ${color};
        border: 3px solid #fff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 0 ${color};
        animation: pulse-ring 2s infinite;
        font-size: 20px;
      ">🛵</div>
      <style>
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 ${color}80; }
          70% { box-shadow: 0 0 0 15px ${color}00; }
          100% { box-shadow: 0 0 0 0 ${color}00; }
        }
      </style>
    `,
    className: "bike-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const destIcon = new L.DivIcon({
  html: `<div style="
    background: #ef4444;
    border: 3px solid #fff;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 18px;
  ">🏠</div>`,
  className: "dest-marker",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const shopIcon = new L.DivIcon({
  html: `<div style="
    background: #3b82f6;
    border: 3px solid #fff;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    font-size: 16px;
  ">🏪</div>`,
  className: "shop-marker",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// ─── Auto-center with smooth flyTo ───
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

// ─── Route Polyline using OSRM (free, no API key needed) ───
function RouteLine({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number];
}) {
  const map = useMap();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.routes?.[0]?.geometry?.coordinates) {
          // OSRM returns [lng, lat], we need [lat, lng]
          const coords = data.routes[0].geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] as [number, number]
          );
          setRouteCoords(coords);
        }
      } catch (e) {
        console.error("Route fetch failed:", e);
      }
    };
    fetchRoute();
  }, [from, to]);

  if (!routeCoords.length) return null;

  return (
    <Polyline
      positions={routeCoords}
      pathOptions={{
        color: "#3b82f6",
        weight: 5,
        opacity: 0.7,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "10, 10",
      }}
    />
  );
}

// ─── Main Component ───
export default function LiveDeliveryMap({
  requestId,
  destinationLat,
  destinationLng,
  destinationAddress,
  shopLat,
  shopLng,
  isAgentView = false, // true for delivery agent, false for customer
}: {
  requestId: string;
  destinationLat?: number;
  destinationLng?: number;
  destinationAddress?: string;
  shopLat?: number;
  shopLng?: number;
  isAgentView?: boolean;
}) {
  const [currentLoc, setCurrentLoc] = useState<{ lat: number; lng: number; heading: number } | null>(null);
  const [pathHistory, setPathHistory] = useState<[number, number][]>([]);
  const [areaName, setAreaName] = useState<string>("Locating...");
  const [isConnected, setIsConnected] = useState(false);
  const [eta, setEta] = useState<string>("Calculating...");
  const [distance, setDistance] = useState<string>("");
  const [snappedPath, setSnappedPath] = useState<[number, number][]>([]);

  // Reverse geocoding
  const fetchAreaName = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const name =
        data.address?.suburb ||
        data.address?.neighbourhood ||
        data.address?.road ||
        data.address?.city ||
        "Unknown Area";
      setAreaName(name);
    } catch (e) {
      console.error("Geocoding failed", e);
    }
  }, []);

  // Calculate ETA & Distance
  const calculateMetrics = useCallback(
    async (lat: number, lng: number) => {
      if (!destinationLat || !destinationLng) return;
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${destinationLng},${destinationLat}?overview=false`
        );
        const data = await res.json();
        if (data.routes?.[0]) {
          const route = data.routes[0];
          const mins = Math.round(route.duration / 60);
          const kms = (route.distance / 1000).toFixed(1);
          setEta(mins < 1 ? "Arriving now" : `${mins} min${mins > 1 ? "s" : ""}`);
          setDistance(`${kms} km`);
        }
      } catch (e) {
        console.error("ETA calc failed", e);
      }
    },
    [destinationLat, destinationLng]
  );

  useEffect(() => {
    if (!requestId) return;

    // 1. Load initial location from DB
    const fetchInitialLoc = async () => {
      const { data } = await supabase
        .from("delivery_tracking")
        .select("*")
        .eq("request_id", requestId)
        .single();
      if (data) {
        setCurrentLoc({
          lat: data.current_lat,
          lng: data.current_lng,
          heading: data.heading || 0,
        });
        setPathHistory([[data.current_lat, data.current_lng]]);
        fetchAreaName(data.current_lat, data.current_lng);
        calculateMetrics(data.current_lat, data.current_lng);
      }
    };
    fetchInitialLoc();

    // 2. Join socket room
    socket.emit("join_tracking", requestId);

    // 3. Receive path history on join
    const handlePathHistory = (history: [number, number][]) => {
      setPathHistory(history);
    };

    // 4. Live updates
    const handleLiveUpdate = (payload: any) => {
      setIsConnected(true);
      setCurrentLoc({
        lat: payload.lat,
        lng: payload.lng,
        heading: payload.heading || 0,
      });
      setPathHistory((prev) => [...prev, [payload.lat, payload.lng]]);
      fetchAreaName(payload.lat, payload.lng);
      calculateMetrics(payload.lat, payload.lng);
    };

    const handlePathSnapped = (data: { path: [number, number][]; roadName?: string }) => {
      setSnappedPath(data.path);
      if (data.roadName) setAreaName(data.roadName);
    };

    socket.on("path_history", handlePathHistory);
    socket.on("location_updated", handleLiveUpdate);
    socket.on("path_snapped", handlePathSnapped); // ← ADD THIS


    return () => {
      socket.off("path_history", handlePathHistory);
      socket.off("location_updated", handleLiveUpdate);
      socket.off("path_snapped", handlePathSnapped); // ← ADD THIS
      socket.emit("leave_tracking", requestId);
    };
  }, [requestId, fetchAreaName, calculateMetrics]);

  const bikeIcon = useMemo(() => createPulseIcon(isAgentView ? "#f59e0b" : "#10b981"), [isAgentView]);

  // ─── Loading State ───
  if (!currentLoc) {
    return (
      <div
        style={{
          height: 450,
          borderRadius: 16,
          background: "#1e293b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "#10b981",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          {isAgentView ? "Starting GPS Navigation..." : "Connecting to Agent's GPS..."}
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }


  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #334155",
        position: "relative",
        height: 500,
        background: "#0f172a",
      }}
    >
      {/* ─── Overlay UI (Uber/Zomato Style) ─── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Status Card */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(12px)",
            padding: "12px 16px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ fontSize: 24 }}>{isConnected ? "🟢" : "🟡"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {isAgentView ? "Your Location" : "Agent Location"}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {areaName}
            </div>
          </div>
          {distance && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.2)",
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              {distance}
            </div>
          )}
        </div>

        {/* ETA Card (only for customer view) */}
        {!isAgentView && eta && (
          <div
            style={{
              background: "rgba(245, 158, 11, 0.9)",
              backdropFilter: "blur(12px)",
              padding: "10px 16px",
              borderRadius: 12,
              color: "#000",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 800,
              fontSize: 14,
              boxShadow: "0 4px 15px rgba(245,158,11,0.3)",
              alignSelf: "flex-start",
            }}
          >
            <span>⏱️</span>
            <span>ETA: {eta}</span>
          </div>
        )}
      </div>

      {/* ─── The Map ─── */}
      <MapContainer
        center={[currentLoc.lat, currentLoc.lng]}
        zoom={16}
        style={{ height: "100%", width: "100%", background: "#0f172a" }}
        zoomControl={false}
      >
                {/* Base map — dark roads, buildings, water */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {/* Labels layer — street names, shops, POIs on top */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          zIndex={1000}
        />

        {/* Shop Marker (start point) */}
        {shopLat && shopLng && (
          <Marker position={[shopLat, shopLng]} icon={shopIcon}>
            <Popup>CSC Shop - Starting Point</Popup>
          </Marker>
        )}

        {/* Route from Shop to Destination (for agent view) */}
        {isAgentView && shopLat && shopLng && destinationLat && destinationLng && (
          <RouteLine from={[shopLat, shopLng]} to={[destinationLat, destinationLng]} />
        )}

        {/* Route from Current Location to Destination (for agent view - remaining path) */}
        {isAgentView && destinationLat && destinationLng && (
          <RouteLine
            from={[currentLoc.lat, currentLoc.lng]}
            to={[destinationLat, destinationLng]}
          />
        )}

        {/* Traveled Path History (for customer view) */}
        {/* SNAPPED PATH (HMM-cleaned from server) — primary route */}
        {!isAgentView && snappedPath.length > 1 && (
          <Polyline
            positions={snappedPath}
            pathOptions={{
              color: "#10b981",
              weight: 5,
              opacity: 0.8,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {/* RAW GHOST PATH (faint, for debug/verification) */}
        {!isAgentView && pathHistory.length > 1 && snappedPath.length > 1 && (
          <Polyline
            positions={pathHistory}
            pathOptions={{
              color: "rgba(148,163,184,0.2)",
              weight: 3,
              opacity: 0.4,
              dashArray: "6, 10",
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {/* Current Position Marker */}
        <Marker
          position={[currentLoc.lat, currentLoc.lng]}
          icon={bikeIcon}
          rotationAngle={currentLoc.heading}
        >
          <Popup>
            {isAgentView ? "You are here" : "Agent is here"}
            <br />
            <small>{new Date().toLocaleTimeString()}</small>
          </Popup>
        </Marker>

        {/* Heading indicator */}
        <CircleMarker
          center={[
            currentLoc.lat + Math.cos((currentLoc.heading * Math.PI) / 180) * 0.0005,
            currentLoc.lng + Math.sin((currentLoc.heading * Math.PI) / 180) * 0.0005,
          ]}
          radius={3}
          pathOptions={{ color: "#fff", fillColor: "#fff", fillOpacity: 1 }}
        />

        {/* Destination Marker */}
        {destinationLat && destinationLng && (
          <Marker position={[destinationLat, destinationLng]} icon={destIcon}>
            <Popup>
              {destinationAddress || "Delivery Destination"}
              <br />
              <small>Lat: {destinationLat.toFixed(4)}, Lng: {destinationLng.toFixed(4)}</small>
            </Popup>
          </Marker>
        )}

        <RecenterMap lat={currentLoc.lat} lng={currentLoc.lng} />
      </MapContainer>

      {/* ─── Bottom Info Bar ─── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(15,23,42,0.95))",
          padding: "30px 16px 16px",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ color: "#94a3b8", fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>
            {isAgentView ? "Navigate to Destination" : "Your Delivery is on the way"}
          </div>
          <div>
            {snappedPath.length > 0
              ? `Snapped route: ${snappedPath.length} points`
              : pathHistory.length > 0
                ? `${pathHistory.length} raw updates`
                : "Waiting for location updates..."}
          </div>
        </div>
        {isAgentView && destinationLat && destinationLng && (
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}&travelmode=driving`;
              window.open(url, "_blank");
            }}
            style={{
              background: "#10b981",
              border: "none",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🧭 Open in Maps
          </button>
        )}
      </div>
    </div>
  );
}