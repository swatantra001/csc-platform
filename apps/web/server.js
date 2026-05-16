const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// ✨ FIX: Set dir to "." since this file is already inside apps/web
const app = next({ dev, hostname, port, dir: "." });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer((req, res) => {
		const parsedUrl = parse(req.url, true);
		handle(req, res, parsedUrl);
	});

	// Attach Socket.io to the Next.js HTTP server
	const io = new Server(httpServer, {
		cors: { origin: "*" },
	});

	io.on("connection", (socket) => {
		console.log("🟢 Client connected:", socket.id);

		// 1. Join a specific chat room
		socket.on("join_chat", (chatId) => {
			socket.join(chatId);
			console.log(`Socket ${socket.id} joined chat: ${chatId}`);
		});

		// 2. Broadcast new messages to everyone in that specific chat
		socket.on("send_message", (messagePayload) => {
			io.to(messagePayload.request_id).emit("new_message", messagePayload);
		});

		// 3. Broadcast to all admins that the queue needs refreshing
		socket.on("trigger_queue_refresh", () => {
			io.emit("refresh_queue");
		});

		// 4. Listen for role changes and broadcast a forced logout command
		socket.on("force_logout_user", (targetUserId) => {
			console.log(`⚠️ Forcing logout for user: ${targetUserId}`);
			io.emit(`logout_command_${targetUserId}`);
		});


		// ✨ NEW: 5. Client joins a specific tracking room
		socket.on("join_tracking", (requestId) => {
			socket.join(`track_${requestId}`);
			console.log(`📍 Socket ${socket.id} joined tracking room: track_${requestId}`);
		});

		// ✨ NEW: 6. Delivery Boy broadcasts live GPS to the client
		socket.on("update_location", (locationPayload) => {
			// payload expects: { request_id, lat, lng, heading }
			io.to(`track_${locationPayload.request_id}`).emit("location_updated", locationPayload);
		});

		socket.on("disconnect", () => {
			console.log("🔴 Client disconnected:", socket.id);
		});

		// Add this right below your trigger_queue_refresh socket event



	});

	httpServer.listen(port, () => {
		console.log(`> Ready on http://${hostname}:${port}`);
	});
});