

// // D:\csc-platform\apps\web\src\hooks\useDeliveryBroadcaster.ts
// "use client";

// import { useEffect, useRef, useCallback } from "react";
// import { socket } from "@/lib/socket";
// import { updateDeliveryLocationAction } from "@/app/actions/admin";

// export function useDeliveryBroadcaster(requestId: string, isDelivering: boolean) {
//   const lastDbUpdate = useRef<number>(0);
//   const watchIdRef = useRef<number | null>(null);
//   const pathBuffer = useRef<[number, number][]>([]);

//   // Send location to server with throttled DB sync
//   const broadcastLocation = useCallback(
//     async (position: GeolocationPosition) => {
//       const payload = {
//         request_id: requestId,
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//         heading: position.coords.heading || 0,
//         accuracy: position.coords.accuracy,
//         speed: position.coords.speed,
//       };

//       // Instant socket broadcast
//       socket.emit("update_location", payload);

//       // Buffer for DB (throttled to every 30s for better real-time feel)
//       pathBuffer.current.push([payload.lat, payload.lng]);
      
//       const now = Date.now();
//       if (now - lastDbUpdate.current > 30000) {
//         lastDbUpdate.current = now;
//         try {
//           await updateDeliveryLocationAction({
//             request_id: requestId,
//             current_lat: payload.lat,
//             current_lng: payload.lng,
//             heading: payload.heading,
//           });
//         } catch (err) {
//           console.error("DB Sync Failed", err);
//         }
//       }
//     },
//     [requestId]
//   );

//   useEffect(() => {
//     if (!isDelivering || !requestId) {
//       if (watchIdRef.current !== null) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//         watchIdRef.current = null;
//       }
//       return;
//     }

//     // Immediate first ping
//     navigator.geolocation.getCurrentPosition(
//       broadcastLocation,
//       (err) => console.warn("Initial GPS error:", err),
//       { enableHighAccuracy: true, timeout: 5000 }
//     );

//     // Start high-frequency tracking
//     watchIdRef.current = navigator.geolocation.watchPosition(
//       broadcastLocation,
//       (error) => {
//         console.warn("GPS Warning:", error.message);
//         if (error.code === 1) {
//           alert("Location permission denied. Please enable GPS for live tracking.");
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 0,
//         timeout: 3000, // Faster timeout for responsiveness
//       }
//     );

//     return () => {
//       if (watchIdRef.current !== null) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//         watchIdRef.current = null;
//       }
//     };
//   }, [isDelivering, requestId, broadcastLocation]);
// }


// D:\csc-platform\apps\web\src\hooks\useDeliveryBroadcaster.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { socket } from "@/lib/socket";
import { updateDeliveryLocationAction } from "@/app/actions/admin";
import { GpsKalmanFilter } from "@/lib/kalman";

export function useDeliveryBroadcaster(requestId: string, isDelivering: boolean) {
  const lastDbUpdate = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);
  const pathBuffer = useRef<[number, number][]>([]);
  const kalman = useRef(new GpsKalmanFilter()).current;

  // Send location to server with throttled DB sync
  const broadcastLocation = useCallback(
    async (position: GeolocationPosition) => {
      const { latitude, longitude, heading, accuracy, speed } = position.coords;
      const now = Date.now();

      // 1. Kalman smooth BEFORE sending
      const smoothed = kalman.update(
        latitude,
        longitude,
        accuracy ?? 20,
        now,
        speed,
        heading ?? null
      );

      // 2. Skip obvious outlier bursts
      if (smoothed.isOutlier && accuracy && accuracy > 30) {
        console.warn("Dropped outlier GPS burst");
        return;
      }

      const payload = {
        request_id: requestId,
        lat: smoothed.lat,
        lng: smoothed.lng,
        heading: smoothed.heading,
        accuracy: accuracy ?? 20,
        speed: speed ?? 0,
      };

      // Instant socket broadcast
      socket.emit("update_location", payload);

      // Buffer for DB (throttled to every 30s)
      pathBuffer.current.push([payload.lat, payload.lng]);
      
      const dbNow = Date.now();
      if (dbNow - lastDbUpdate.current > 30000) {
        lastDbUpdate.current = dbNow;
        try {
          await updateDeliveryLocationAction({
            request_id: requestId,
            current_lat: payload.lat,
            current_lng: payload.lng,
            heading: payload.heading,
          });
        } catch (err) {
          console.error("DB Sync Failed", err);
        }
      }
    },
    [requestId, kalman]
  );

  useEffect(() => {
    if (!isDelivering || !requestId) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    // Immediate first ping
    navigator.geolocation.getCurrentPosition(
      broadcastLocation,
      (err) => console.warn("Initial GPS error:", err),
      { enableHighAccuracy: true, timeout: 5000 }
    );

    // Start high-frequency tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      broadcastLocation,
      (error) => {
        console.warn("GPS Warning:", error.message);
        if (error.code === 1) {
          alert("Location permission denied. Please enable GPS for live tracking.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 3000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isDelivering, requestId, broadcastLocation]);
}