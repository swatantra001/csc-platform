
"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { supabase } from "@/lib/supabase";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Custom Bike Icon (Matches your dark theme)
const bikeIcon = new L.DivIcon({
  html: `<div style="background:#10b981; border:3px solid #fff; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3); font-size:18px;">🛵</div>`,
  className: "bike-marker",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

// 2. Custom Destination Icon
const destIcon = new L.DivIcon({
  html: `<div style="background:#ef4444; border:3px solid #fff; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3); font-size:18px;">📍</div>`,
  className: "dest-marker",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

// 3. Auto-Center Map Logic
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

export default function LiveDeliveryMap({ requestId, destinationLat, destinationLng }: { requestId: string, destinationLat?: number, destinationLng?: number }) {
  const [currentLoc, setCurrentLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [path, setPath] = useState<[number, number][]>([]);
  const [areaName, setAreaName] = useState<string>("Locating area...");
  const [isConnected, setIsConnected] = useState(false);

  // ✨ REVERSE GEOCODING: Convert Lat/Lng to actual Street Name
  const fetchAreaName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      // Grabs the suburb, neighborhood, or road name
      const name = data.address?.suburb || data.address?.neighbourhood || data.address?.road || data.address?.city || "Unknown Area";
      setAreaName(name);
    } catch (e) {
      console.error("Geocoding failed", e);
    }
  };

  useEffect(() => {
    if (!requestId) return;

    // 1. INSTANT LOAD: Fetch the last known location from the DB so it doesn't get stuck waiting!
    const fetchInitialLoc = async () => {
      const { data } = await supabase.from('delivery_tracking').select('*').eq('request_id', requestId).single();
      if (data) {
        setCurrentLoc({ lat: data.current_lat, lng: data.current_lng });
        setPath([[data.current_lat, data.current_lng]]);
        fetchAreaName(data.current_lat, data.current_lng);
      }
    };
    fetchInitialLoc();

    // 2. SOCKET SETUP: Listen for live movement
    socket.emit("join_tracking", requestId);
    
    const handleLiveUpdate = (payload: any) => {
      setIsConnected(true);
      setCurrentLoc({ lat: payload.lat, lng: payload.lng });
      
      // Add the new point to our continuous line!
      setPath(prev => [...prev, [payload.lat, payload.lng]]);
      
      // Update area name every time they move significantly
      fetchAreaName(payload.lat, payload.lng);
    };

    socket.on("location_updated", handleLiveUpdate);

    return () => {
      socket.off("location_updated", handleLiveUpdate);
      socket.emit("leave_tracking", requestId); // Cleanup room
    };
  }, [requestId]);

  if (!currentLoc) {
    return (
      <div style={{ height: 400, borderRadius: 12, background: "#1e293b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 16 }} />
        <div style={{ fontWeight: 700 }}>Connecting to Agent's GPS...</div>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #334155", position: "relative", height: 450 }}>
      
      {/* Overlay UI (Zomato Style) */}
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, zIndex: 1000, display: "flex", gap: 10 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(8px)", padding: "10px 16px", borderRadius: 12, flex: 1, border: "1px solid rgba(255,255,255,0.1)", color: "#fff", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 24 }}>{isConnected ? "🟢" : "🟡"}</div>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Location</div>
            <div style={{ fontSize: 15, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{areaName}</div>
          </div>
        </div>
      </div>

      {/* The Map */}
      <MapContainer center={[currentLoc.lat, currentLoc.lng]} zoom={15} style={{ height: "100%", width: "100%", background: "#0f172a" }} zoomControl={false}>
        {/* Dark Mode Map Tiles */}
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        {/* The Continuous Path Line */}
        <Polyline positions={path} pathOptions={{ color: "#10b981", weight: 5, opacity: 0.8, lineCap: "round", lineJoin: "round", dashArray: "1, 8" }} />

        {/* The Agent's Bike */}
        <Marker position={[currentLoc.lat, currentLoc.lng]} icon={bikeIcon}>
          <Popup>Agent is here</Popup>
        </Marker>

        {/* The Destination (If passed via props) */}
        {destinationLat && destinationLng && (
          <Marker position={[destinationLat, destinationLng]} icon={destIcon}>
            <Popup>Delivery Destination</Popup>
          </Marker>
        )}

        {/* Keeps camera locked on bike */}
        <RecenterMap lat={currentLoc.lat} lng={currentLoc.lng} />
      </MapContainer>
      
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}