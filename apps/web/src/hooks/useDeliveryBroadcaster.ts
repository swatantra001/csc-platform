

"use client";
import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { updateDeliveryLocationAction } from "@/app/actions/admin"; 

export function useDeliveryBroadcaster(requestId: string, isDelivering: boolean) {
  const lastDbUpdate = useRef<number>(0);

  useEffect(() => {
    if (!isDelivering || !requestId) return;

    // ✨ ULTRA-ROBUST FIX: Force an immediate ping before watchPosition starts
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit("update_location", { request_id: requestId, lat: position.coords.latitude, lng: position.coords.longitude, heading: position.coords.heading || 0 });
    }, () => {}, { enableHighAccuracy: true });

    // Start continuous tracking
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const payload = {
          request_id: requestId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          heading: position.coords.heading || 0,
        };

        // Instant Socket Broadcast
        socket.emit("update_location", payload);

        // Throttle DB updates to 60 seconds
        const now = Date.now();
        if (now - lastDbUpdate.current > 60000) {
          lastDbUpdate.current = now;
          try {
            await updateDeliveryLocationAction({ request_id: payload.request_id, current_lat: payload.lat, current_lng: payload.lng, heading: payload.heading });
          } catch (err) { console.error("DB Sync Failed", err); }
        }
      },
      (error) => {
        console.warn("GPS Warning:", error.message);
        if (error.code === 1) console.error("Location permission denied by agent.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId); 
  }, [isDelivering, requestId]);
}