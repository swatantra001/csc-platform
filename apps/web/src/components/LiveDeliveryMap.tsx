"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { socket } from "@/lib/socket";

// Fix Leaflet's default icon missing issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A mini-component to smoothly pan the map when the bike moves
function DynamicMapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function LiveDeliveryMap({ requestId }: { requestId: string }) {
  // Default coordinates (approx center of India, will update instantly on connect)
  const [location, setLocation] = useState({ lat: 25.7464, lng: 82.6837, heading: 0 }); 
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    socket.emit("join_tracking", requestId);

    socket.on("location_updated", (data:any) => {
      setLocation({ lat: data.lat, lng: data.lng, heading: data.heading });
      setIsActive(true);
    });

    return () => {
      socket.off("location_updated");
    };
  }, [requestId]);

  // Create a stunning rotating marker for the bike
  const bikeIcon = L.divIcon({
    html: `
      <div style="
        transform: rotate(${location.heading}deg); 
        font-size: 32px; 
        filter: drop-shadow(0 10px 15px rgba(0,0,0,0.4)); 
        transition: transform 1s ease-out;
      ">🏍️</div>`,
    className: "bg-transparent border-none",
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Center the icon perfectly
  });

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 mt-6 relative bg-white">
      
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-4 flex justify-between items-center z-10 relative">
        <div className="font-bold flex items-center gap-2">
          <span className="text-xl">📍</span> Live Delivery Tracking
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
          {isActive ? "Driver Active" : "Waiting for GPS..."}
        </div>
      </div>

      {/* Map Viewport */}
      <div className="h-[380px] w-full relative z-0">
        <MapContainer 
          center={[location.lat, location.lng]} 
          zoom={16} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          {/* CartoDB Voyager - Super clean, high contrast map tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">Carto</a>'
          />
          <DynamicMapCenter center={[location.lat, location.lng]} />
          
          <Marker position={[location.lat, location.lng]} icon={bikeIcon}>
            <Popup className="font-bold text-slate-800">
              Your document is on the way! 🚀
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}