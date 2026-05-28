import { io } from "socket.io-client";

// This automatically connects to the Socket.io server running on your current domain (localhost:3000)
// If you ever deploy to production, it will automatically use your live domain!
const URL = process.env.NEXT_PUBLIC_APP_URL || "";

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true, // Automatically tries to reconnect if the user's internet drops
});