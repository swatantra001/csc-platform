"use client";
import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { updateDeliveryLocationAction } from "@/app/actions/admin"; 

export function useDeliveryBroadcaster(requestId: string, isDelivering: boolean) {
  // ✨ Use a ref to track the last time we wrote to the database
  const lastDbUpdate = useRef<number>(0);

  useEffect(() => {
    if (!isDelivering || !requestId) return;

    // 1. Ask browser for live high-accuracy GPS tracking
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const payload = {
          request_id: requestId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          heading: position.coords.heading || 0, // Direction the bike is facing
        };

        // 2. INSTANT UPDATE: Blast to Socket.io for Zomato-style live movement (Free & Unlimited)
        socket.emit("update_location", payload);

        // 3. PERSISTENT UPDATE: Throttle DB writes to once every 10 seconds!
        const now = Date.now();
        if (now - lastDbUpdate.current > 10000) {
          lastDbUpdate.current = now; // Update the timer
          
          try {
            await updateDeliveryLocationAction({
              request_id: payload.request_id,
              current_lat: payload.lat,
              current_lng: payload.lng,
              heading: payload.heading,
            });
            console.log("📍 Location synced to database.");
          } catch (err) {
            console.error("Failed to save location to DB", err);
          }
        }
      },
      (error) => {
        console.error("GPS Error:", error.message);
        if (error.code === 1) {
          alert("Please enable GPS/Location Services in your browser to broadcast delivery.");
        }
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 0, 
        timeout: 5000 
      }
    );

    // Stop tracking your phone's battery/GPS when you stop the delivery
    return () => navigator.geolocation.clearWatch(watchId); 
  }, [isDelivering, requestId]);
}