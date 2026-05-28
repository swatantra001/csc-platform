// 🛑 KILL TURBOPACK 🛑
// process.env.TURBOPACK = "0";
// process.env.TURBO_FORCE = "false";

require("dotenv").config({ path: ".env.local" }); // 👈 Tell it to read your .env.local file

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { HMMMapMatcher } = require("./map-matcher");

// ─── FIREBASE ADMIN ─── ADD THIS
const admin = require("firebase-admin");
const serviceAccount = {
	project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // 👈 Change this line
	client_email: process.env.FIREBASE_CLIENT_EMAIL,
	private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// 3. Debugging catch block to tell you EXACTLY what is missing if it fails
if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
	console.error("❌ CRITICAL ERROR: Firebase Environment variables are missing!");
	console.log("Loaded Project ID:", serviceAccount.project_id);
	console.log("Loaded Client Email:", serviceAccount.client_email);
	process.exit(1);
}

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});
const messaging = admin.messaging();
// ─── END FIREBASE ADMIN ───

// ─── SUPABASE ADMIN CLIENT ─── ADD THIS
const { createClient } = require("@supabase/supabase-js");
const ws = require("ws");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: ws,  // ← THIS IS REQUIRED in Node.js 20
    },
  }
);
// ─── END SUPABASE ───

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
const OSRM_URL = process.env.OSRM_URL || "http://localhost:5000";

const app = next({ dev, hostname, port, dir: "." });
// const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

// ─── In-memory stores ───
const deliveryPaths = new Map(); // requestId -> snapped path array [[lat,lng], ...]
const rawBuffers = new Map(); // requestId -> raw GPS ring buffer
const lastPositions = new Map(); // requestId -> latest snapped position object
const lastProcessedTimes = new Map(); // requestId -> last HMM batch timestamp
const lastSnapTimes = new Map(); // requestId -> last fastSnap timestamp
const lastSnapCoords = new Map(); // requestId -> last snapped coords

const matcher = new HMMMapMatcher(OSRM_URL, {
	maxCandidates: 3,
	beta: 8,
	defaultSigma: 10,
});

// ─── FCM NOTIFICATION HELPER ─── ADD THIS
async function notifyAdminsViaFCM(message, requestId) {
	try {
		const { data: admins, error } = await supabaseAdmin
			.from("users")
			.select("push_token")
			.in("role", ["main_admin", "co_admin"])
			.not("push_token", "is", null);

		if (error || !admins?.length) return;

		const tokens = admins.map(a => a.push_token).filter(Boolean);
		if (!tokens.length) return;

		const payload = {
			notification: {
				title: `📩 New Message`,
				body: message.content?.slice(0, 100) || "New message received",
				//sound: "admin_alert",
			},
			data: {
				requestId: requestId || message.request_id,
				screen: "AdminDashboard",
				click_action: "FLUTTER_NOTIFICATION_CLICK",
			},
			android: {
				priority: "high",
				notification: {
					channelId: "admin-alerts-v2", // 👈 Change to v2
					sound: "admin_alert",
					priority: "high",
					vibrateTimings: ["0.3s", "0.1s", "0.3s"],
				},
			},
			apns: {
				payload: {
					aps: {
						sound: "admin_alert.wav",
						badge: 1,
					},
				},
			},
		};

		// Send to all admin tokens
		const response = await messaging.sendEachForMulticast({
			tokens,
			...payload,
		});

		console.log(`📲 FCM: ${response.successCount} success, ${response.failureCount} failed`);

		// Remove invalid tokens
		if (response.responses) {
			const invalidTokens = [];
			response.responses.forEach((resp, idx) => {
				// 👇 ADD THIS LINE TO PRINT THE EXACT ERROR 👇
                if (!resp.success) console.log("❌ FCM Error Details:", resp.error);

				if (!resp.success && (
					resp.error?.code === "messaging/invalid-registration-token" ||
					resp.error?.code === "messaging/registration-token-not-registered"
				)) {
					invalidTokens.push(tokens[idx]);
				}
			});

			if (invalidTokens.length) {
				await supabaseAdmin
					.from("users")
					.update({ push_token: null })
					.in("push_token", invalidTokens);
				console.log(`🗑️ Cleared ${invalidTokens.length} invalid FCM tokens`);
			}
		}
	} catch (error) {
		console.error("❌ FCM send error:", error.message);
	}
}
// ─── END FCM HELPER ───

app.prepare().then(() => {
	const httpServer = createServer((req, res) => {
		const parsedUrl = parse(req.url, true);
		handle(req, res, parsedUrl);
	});

	const io = new Server(httpServer, { cors: { origin: "*" } });

	/* ─── Background Batch HMM Processor ───
	 * Every 5s, grab the rolling window of raw points per delivery,
	 * run the full Viterbi HMM, and broadcast the cleaned polyline.
	 */
	setInterval(async () => {
		const now = Date.now();
		for (const [requestId, buffer] of rawBuffers.entries()) {
			const lastProc = lastProcessedTimes.get(requestId) || 0;
			const newPoints = buffer.filter((p) => p.timestamp > lastProc);

			// Trigger: ≥5 new points OR ≥8s since last run
			if (newPoints.length >= 5 || (newPoints.length > 0 && now - lastProc > 8000)) {
				try {
					// Use last 35 points for context (HMM needs history to disambiguate)
					const window = buffer.slice(-35);
					const matched = await matcher.match(window);

					if (matched && matched.some((p) => p !== null)) {
						const snappedPath = matched
							.filter((p) => p !== null)
							.map((p) => [p.lat, p.lng]);

						deliveryPaths.set(requestId, snappedPath);

						io.to(`tracking_${requestId}`).emit("path_snapped", {
							path: snappedPath,
							roadName: matched[matched.length - 1]?.roadName || null,
							timestamp: now,
						});
					}
					lastProcessedTimes.set(requestId, now);
				} catch (err) {
					console.error(`[HMM Batch Error] ${requestId}:`, err.message);
				}
			}
		}
	}, 5000);

	io.on("connection", (socket) => {
		console.log("🟢 Client connected:", socket.id);

		/* ─── Chat / Queue (your existing events) ─── */
		socket.on("join_chat", (chatId) => socket.join(chatId));
		socket.on("send_message", async (msg) => {
			io.to(msg.request_id).emit("new_message", msg);
			io.emit("global_message_alert", msg);

			// ─── SEND FCM PUSH TO ALL ADMINS ─── ADD THIS
			// Only send FCM if message is from a user (not admin-to-admin)
			if (msg.sender_role === "user" || msg.sender_role === "co_admin") {
				await notifyAdminsViaFCM(msg, msg.request_id);
			}
			// ─── END FCM ───
		});
		socket.on("trigger_queue_refresh", () => io.emit("refresh_queue"));
		socket.on("force_logout_user", (targetUserId) => {
			io.emit(`logout_command_${targetUserId}`);
		});

		/* ─── Tracking Rooms ─── */
		socket.on("join_tracking", (requestId) => {
			socket.join(`tracking_${requestId}`);
			console.log(`📍 ${socket.id} joined tracking_${requestId}`);

			// Seed with existing clean path + current position
			if (deliveryPaths.has(requestId)) {
				socket.emit("path_history", deliveryPaths.get(requestId));
			}
			if (lastPositions.has(requestId)) {
				socket.emit("location_updated", lastPositions.get(requestId));
			}
		});

		socket.on("leave_tracking", (requestId) => {
			socket.leave(`tracking_${requestId}`);
		});

		/* ─── GPS Ingestion ─── */
		socket.on("update_location", async (payload) => {
			const { request_id, lat, lng, heading, accuracy, speed } = payload;
			const now = Date.now();

			// 1. Buffer raw observation
			if (!rawBuffers.has(request_id)) rawBuffers.set(request_id, []);
			const buf = rawBuffers.get(request_id);
			buf.push({ lat, lng, heading, accuracy, speed, timestamp: now });
			if (buf.length > 250) buf.shift(); // rolling 250-point window (~12 min @ 3s)

			// 2. Throttle fastSnap: only re-snap if moved >8m OR >2s passed
			const lastCoord = lastSnapCoords.get(request_id);
			const moved =
				!lastCoord || matcher.haversine(lastCoord.lat, lastCoord.lng, lat, lng) > 8;
			const timeOk = now - (lastSnapTimes.get(request_id) || 0) > 2000;

			if (!moved && !timeOk) {
				// Re-broadcast last known snapped position so client stays warm
				const last = lastPositions.get(request_id);
				if (last) io.to(`tracking_${request_id}`).emit("location_updated", last);
				return;
			}

			// 3. Fast nearest-road snap for live marker
			try {
				const snap = await matcher.fastSnap(lat, lng);
				const snapped = {
					lat: snap.lat,
					lng: snap.lng,
					heading: heading || 0,
					timestamp: now,
					roadName: snap.name,
					snapped: true,
				};
				lastPositions.set(request_id, snapped);
				lastSnapCoords.set(request_id, { lat: snap.lat, lng: snap.lng });
				lastSnapTimes.set(request_id, now);
				io.to(`tracking_${request_id}`).emit("location_updated", snapped);
			} catch (err) {
				// OSRM down? broadcast raw so tracking doesn't freeze
				const raw = { lat, lng, heading: heading || 0, timestamp: now, snapped: false };
				lastPositions.set(request_id, raw);
				io.to(`tracking_${request_id}`).emit("location_updated", raw);
			}
		});

		socket.on("disconnect", () => {
			console.log("🔴 Client disconnected:", socket.id);
		});
	});

	httpServer.listen(port, () => {
		console.log(`> Ready on http://${hostname}:${port}`);
		console.log(`> OSRM Map Matcher: ${OSRM_URL}`);
	});
});