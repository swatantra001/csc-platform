// "use client";

// import { useState, useEffect, useRef, type DragEvent, useCallback } from "react";
// import { useAuth } from "@/components/AuthProvider";
// import { fetchMyRequestsAction, createRequestAction, sendChatMessageAction } from "@/app/actions/requests";
// import { updateUserProfile } from "../actions/user";
// import { uploadChatFileAction } from "../actions/storage";
// import { fetchNotificationsAction, markNotificationsReadAction } from "@/app/actions/notifications";
// import { io, Socket } from "socket.io-client";
// import { createRazorpayOrderAction, verifyRazorpayPaymentAction } from "@/app/actions/payment";

// // ─── Types ─────────────────────────────────────────────────────────────────
// interface AppNotification {
//   id: string;
//   title: string;
//   title_hi: string;
//   body: string;
//   body_hi: string;
//   type: string;
//   is_read: boolean;
//   created_at: string;
// }

// interface TimelineEvent {
//   event: "submitted" | "seen" | "processing" | "done" | "payment";
//   time: string;
//   eventEn: string;
//   timeEn: string;
// }

// interface MessageDoc {
//   name: string;
//   size: string;
//   icon: string;
//   url?: string;
//   isResult?: boolean;
// }

// interface Message {
//   id: number | string;
//   from: "user" | "admin";
//   time: string;
//   date: string;
//   type: string;
//   text?: string;
//   textEn?: string;
//   doc?: MessageDoc;
//   amount?: number;
//   paymentStatus?: string;
//   adminName?: string;
//   adminRole?: string;
//   status?: "seen" | "delivered";
//   replyToId?: string | number | null;
//   reply_to_msg?: Message; // Mapped locally for UI
// }

// interface ResolvedBy {
//   name: string;
//   role: string;
// }

// interface Request {
//   id: string;
//   displayId?: string;
//   title: string;
//   titleEn: string;
//   service: string;
//   status: "pending" | "processing" | "done";
//   unread: number;
//   lastMsg: string;
//   lastMsgEn: string;
//   lastTime: string;
//   resolvedBy: ResolvedBy | null;
//   paymentPending: boolean;
//   paymentAmount?: number;
//   messages: Message[];
//   timeline: TimelineEvent[];
// }

// // ─── Utils & Formats ───────────────────────────────────────────────────────
// const formatBytes = (bytes: number) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };
// const fmtCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// // ─── Language strings ──────────────────────────────────────────────────────
// const T = {
//   hi: {
//     appName: "श्रीलाल जन सेवा केंद्र",
//     myRequests: "मेरे आवेदन",
//     newRequest: "नया आवेदन",
//     search: "खोजें...",
//     all: "सभी",
//     pending: "लंबित",
//     processing: "प्रक्रिया में",
//     done: "पूर्ण",
//     sent: "भेजा",
//     seen: "देखा",
//     online: "ऑनलाइन",
//     today: "आज",
//     yesterday: "कल",
//     typeMsg: "संदेश लिखें...",
//     send: "भेजें",
//     attach: "दस्तावेज़ जोड़ें",
//     requestTitle: "आवेदन का विषय",
//     requestDesc: "विवरण लिखें",
//     serviceType: "सेवा चुनें",
//     submitRequest: "आवेदन जमा करें",
//     uploadDoc: "दस्तावेज़ अपलोड करें",
//     dragDrop: "फ़ाइल यहाँ खींचें या क्लिक करें",
//     timeline: "गतिविधि",
//     payNow: "अभी भुगतान करें",
//     download: "डाउनलोड",
//     resolvedBy: "द्वारा हल किया गया",
//     viewingDoc: "आपके दस्तावेज़ देख रहे हैं",
//     noRequests: "अभी कोई आवेदन नहीं",
//     startNew: "नया आवेदन शुरू करें",
//     wallet: "वॉलेट",
//     notifications: "सूचनाएं",
//     profile: "प्रोफ़ाइल",
//     logout: "लॉगआउट",
//     cancel: "रद्द करें",
//     close: "बंद करें",
//     priority: "प्राथमिकता",
//     prepaid: "प्रीपेड (तेज़ सेवा)",
//     regular: "सामान्य",
//   },
//   en: {
//     appName: "Shreelal Jan Seva Kendra",
//     myRequests: "My Requests",
//     newRequest: "New Request",
//     search: "Search...",
//     all: "All",
//     pending: "Pending",
//     processing: "Processing",
//     done: "Done",
//     sent: "Sent",
//     seen: "Seen",
//     online: "Online",
//     today: "Today",
//     yesterday: "Yesterday",
//     typeMsg: "Type a message...",
//     send: "Send",
//     attach: "Attach Document",
//     requestTitle: "Request Subject",
//     requestDesc: "Describe your need",
//     serviceType: "Select Service",
//     submitRequest: "Submit Request",
//     uploadDoc: "Upload Document",
//     dragDrop: "Drag file here or click to browse",
//     timeline: "Activity",
//     payNow: "Pay Now",
//     download: "Download",
//     resolvedBy: "Resolved by",
//     viewingDoc: "is viewing your document",
//     noRequests: "No requests yet",
//     startNew: "Start a new request",
//     wallet: "Wallet",
//     notifications: "Notifications",
//     profile: "Profile",
//     logout: "Logout",
//     cancel: "Cancel",
//     close: "Close",
//     priority: "Priority",
//     prepaid: "Prepaid (Faster Service)",
//     regular: "Regular",
//   },
// };

// const SERVICES = ["आधार अपडेट / Aadhaar Update", "पैन कार्ड / PAN Card", "जाति प्रमाण पत्र / Caste Certificate", "छात्रवृत्ति / Scholarship", "PM किसान / PM Kisan", "आयुष्मान कार्ड / Ayushman Card", "टिकट बुकिंग / Ticket Booking", "पैसे ट्रांसफर / Money Transfer", "अन्य / Other"];

// const STATUS_CONFIG: Record<string, any> = {
//   pending: { color: "#b07a10", bg: "#fffbf0", bgDark: "#2a1f08", border: "#f0d090", borderDark: "#5c3d0a", label: "लंबित", labelEn: "Pending", icon: "⏳" },
//   seen: { color: "#1a5aa0", bg: "#f0f5ff", bgDark: "#080f1f", border: "#90b0e0", borderDark: "#0a2a5c", label: "देखा गया", labelEn: "Seen", icon: "👁️" },
//   processing: { color: "#1a5aa0", bg: "#f0f5ff", bgDark: "#080f1f", border: "#90b0e0", borderDark: "#0a2a5c", label: "प्रक्रिया में", labelEn: "Processing", icon: "⚙️" },
//   payment_pending: { color: "#c45c1a", bg: "#fff5ee", bgDark: "#2a1208", border: "#f0b090", borderDark: "#5c2a0a", label: "भुगतान बाकी", labelEn: "Payment Pending", icon: "💳" },
//   done: { color: "#1a7a3a", bg: "#f0fbf4", bgDark: "#0a1f0f", border: "#90d0a0", borderDark: "#1a5c30", label: "पूर्ण", labelEn: "Done", icon: "✅" },
//   cancelled: { color: "#6b6259", bg: "#f7f5f0", bgDark: "#202020", border: "#dedad2", borderDark: "#2c2c2c", label: "रद्द", labelEn: "Cancelled", icon: "❌" }
// };

// const TIMELINE_ICONS = { submitted: "📤", seen: "👁️", processing: "⚙️", done: "✅", payment: "💳" };

// // ─── Waveform component ────────────────────────────────────────────────────
// function VoiceWave({ playing, dark }: { playing: boolean, dark: boolean }) {
//   const bars = [4, 8, 14, 10, 18, 12, 8, 16, 10, 6, 12, 16, 8, 14, 10];
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 2, height: 24 }}>
//       {bars.map((h, i) => (
//         <div key={i} style={{
//           width: 3, height: h, borderRadius: 2,
//           background: playing ? "#25d366" : (dark ? "#5a6a5a" : "#90b090"),
//           animation: playing ? `waveAnim 0.8s ease-in-out infinite alternate` : "none",
//           animationDelay: `${i * 0.05}s`,
//         }} />
//       ))}
//     </div>
//   );
// }

// // ─── Main component ────────────────────────────────────────────────────────
// export default function CSCUserDashboard() {
//   const [lang, setLang] = useState("en");
//   const [dark, setDark] = useState(false);
//   const [activeTab, setActiveTab] = useState("all");
//   const [activeRequest, setActiveRequest] = useState<Request | null>(null);
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [notifications, setNotifications] = useState<AppNotification[]>([]);
//   const [socket, setSocket] = useState<Socket | null>(null);

//   // UI State
//   const [showNew, setShowNew] = useState(false);
//   const [showTimeline, setShowTimeline] = useState(false);
//   const [searchVal, setSearchVal] = useState("");
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [viewingAlert, setViewingAlert] = useState(false);

//   // Chat/Input State
//   const [msgVal, setMsgVal] = useState("");
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   // New Request Form State
//   const [newTitle, setNewTitle] = useState("");
//   const [newDesc, setNewDesc] = useState("");
//   const [newService, setNewService] = useState("");
//   const [newPriority, setNewPriority] = useState("regular");
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

//   const msgEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const t = T[lang as "hi" | "en"] as typeof T["hi"];

//   const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

//   // ─── AUTH & INIT ───
//   useEffect(() => {
//     if (!authLoading && !isLoggedIn) window.location.href = "/";
//   }, [authLoading, isLoggedIn]);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("csc_theme");
//     if (savedTheme) setDark(savedTheme === "dark");
//     else setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
//     if (user?.preferred_lang) setLang(user.preferred_lang);
//   }, [user]);

//   // ─── FETCH LOGIC ───
//   const loadRequests = useCallback(async () => {
//     if (!isLoggedIn) return;
//     try {
//       const data = await fetchMyRequestsAction();

//       // Link replies locally for UI visualization
//       const enrichedData = data.map((req: any) => ({
//         ...req,
//         messages: req.messages.map((m: any) => ({
//           ...m,
//           reply_to_msg: m.replyToId ? req.messages.find((old: any) => old.id === m.replyToId) : undefined
//         }))
//       }));

//       setRequests(enrichedData);

//       // Use functional state update to break the dependency loop
//       setActiveRequest(prev => {
//         if (!prev) return prev;
//         const updated = enrichedData.find((r: any) => r.id === prev.id);
//         return updated || prev;
//       });
//     } catch (e) { console.error(e); }
//   }, [isLoggedIn]);

//   // Initial Data Load
//   useEffect(() => {
//     if (isLoggedIn) {
//       loadRequests();
//       fetchNotificationsAction().then((data) => setNotifications(data as any));
//     }
//   }, [isLoggedIn, loadRequests]);

//   // ─── SOCKET CONNECTION (Connects ONLY once) ───
//   useEffect(() => {
//     const socketInstance = io();
//     setSocket(socketInstance);
//     // Cleanup ONLY when the whole component unmounts (tab closes)
//     return () => { socketInstance.disconnect(); };
//   }, []);

//   // ─── SOCKET LISTENERS ───
//   useEffect(() => {
//     if (!socket) return;
//     // Listen for queue refresh events
//     const handleRefresh = () => loadRequests();
//     socket.on("refresh_queue", handleRefresh);
//     return () => { socket.off("refresh_queue", handleRefresh); };
//   }, [socket, loadRequests]);

//   // Join Chat Room & Listen for Messages
//   const activeReqId = activeRequest?.id; // Extract ID so object reference changes don't trigger the hook

//   useEffect(() => {
//     if (!activeReqId || !socket) return;

//     socket.emit("join_chat", activeReqId);

//     const handleNewMessage = (newMsg: any) => {
//       const formattedMsg: Message = {
//         id: newMsg.id,
//         from: newMsg.sender_role === "user" ? "user" : "admin",
//         text: newMsg.content,
//         textEn: newMsg.content,
//         time: new Date(newMsg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
//         date: "today",
//         type: newMsg.message_type || "text",
//         doc: (newMsg.doc_url || newMsg.file_url) ? {
//           name: newMsg.doc_name || newMsg.file_name,
//           size: newMsg.doc_size || newMsg.file_size,
//           icon: "📄",
//           url: newMsg.doc_url || newMsg.file_url
//         } : undefined,
//         amount: newMsg.payment_amount,
//         replyToId: newMsg.reply_to_id || null,
//         adminName: newMsg.users?.name,
//         adminRole: newMsg.users?.role
//       };

//       setRequests(prev => prev.map(req => {
//         if (req.id === newMsg.request_id) {
//           if (req.messages.some(m => m.id === formattedMsg.id)) return req; // Prevent dupes

//           const repMsg = formattedMsg.replyToId ? req.messages.find(old => old.id === formattedMsg.replyToId) : undefined;
//           formattedMsg.reply_to_msg = repMsg;

//           return { ...req, messages: [...req.messages, formattedMsg] };
//         }
//         return req;
//       }));

//       // Update active request message list safely
//       setActiveRequest(prev => {
//         if (!prev || prev.id !== newMsg.request_id) return prev;
//         if (prev.messages.some(m => m.id === formattedMsg.id)) return prev;

//         const repMsg = formattedMsg.replyToId ? prev.messages.find(old => old.id === formattedMsg.replyToId) : undefined;
//         formattedMsg.reply_to_msg = repMsg;

//         return { ...prev, messages: [...prev.messages, formattedMsg] };
//       });
//     };

//     socket.on("new_message", handleNewMessage);

//     return () => {
//       socket.off("new_message", handleNewMessage);
//     };
//   }, [activeReqId, socket]);

//   useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeRequest?.messages]);

//   // Simulate admin viewing notification
//   useEffect(() => {
//     if (activeRequest?.status === "processing") {
//       const t = setTimeout(() => setViewingAlert(true), 3000);
//       return () => clearTimeout(t);
//     }
//     setViewingAlert(false);
//   }, [activeRequest]);

//   // ─── LISTEN FOR FORCED LOGOUT (User Side) ───
//   useEffect(() => {
//     if (!socket || !user) return;

//     const handleKick = () => {
//       alert("Your account role has been updated by an Administrator. Please log in again to sync your access.");
//       logout(); // This safely logs them out and redirects to home
//     };

//     socket.on(`logout_command_${user.id}`, handleKick);

//     return () => {
//       socket.off(`logout_command_${user.id}`, handleKick);
//     };
//   }, [socket, user, logout]);

//   // ─── HANDLERS ───
//   const toggleTheme = () => {
//     const newDark = !dark; setDark(newDark);
//     localStorage.setItem("csc_theme", newDark ? "dark" : "light");
//   };

//   const toggleLanguage = async () => {
//     const newLang = lang === "hi" ? "en" : "hi"; setLang(newLang);
//     if (user) await updateUserProfile({ preferred_lang: newLang });
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
//   };

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault(); setIsDragOver(false);
//     if (e.dataTransfer.files) setAttachedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
//   };

//   const handleDownload = async (url: string, filename: string) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = blobUrl; link.download = filename || "download";
//       document.body.appendChild(link); link.click();
//       document.body.removeChild(link); window.URL.revokeObjectURL(blobUrl);
//     } catch (e) {
//       window.open(url, '_blank');
//     }
//   };

//   const handlePayment = async (messageId: string, amount: number) => { // ✨ Added messageId
//     if (!activeRequest || !user) return;

//     // 1. Dynamically load Razorpay SDK Script
//     const loadScript = () => new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//     const res = await loadScript();
//     if (!res) {
//       alert("Razorpay SDK failed to load. Are you online?");
//       return;
//     }

//     try {
//       // Pass messageId instead of activeRequest.id
//       const orderRes = await createRazorpayOrderAction(messageId, amount);
//       if (!orderRes.success) throw new Error(orderRes.error || "Could not create order");
//       if (!orderRes.order) throw new Error("Invalid order response from server");
//       // 3. Configure Razorpay Popup
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: orderRes.order.amount, // Convert to paise
//         currency: "INR",
//         name: "CSC Shambhuganj - Shrilal Yadav",
//         description: `Payment for ${activeRequest.title}`,
//         order_id: orderRes.order.id,
//         prefill: {
//           name: user.name || "",
//           contact: user.mobile || "",
//           email: user.email || "",
//         },
//         theme: { color: "#c45c1a" },
//         handler: async function (response: any) {
//           // 4. Verification Callback
//           try {
//             // Pass messageId here too
//             await verifyRazorpayPaymentAction(
//               messageId,
//               activeRequest.id,
//               response.razorpay_order_id,
//               response.razorpay_payment_id,
//               response.razorpay_signature
//             );
//             alert("Payment Successful! Your request is now processing.");
//             loadRequests(); // Refresh UI
//             socket?.emit("trigger_queue_refresh"); // Tell Admin
//           } catch (err) {
//             alert("Payment Verification Failed!");
//           }
//         },
//       };

//       // Open Razorpay
//       const paymentObject = new (window as any).Razorpay(options);
//       paymentObject.open();

//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const sendMessage = async () => {
//     if (!activeRequest || !user) return;
//     if (!msgVal.trim() && attachedFiles.length === 0) return;

//     setIsSending(true);
//     const replyId = replyingTo?.id ? String(replyingTo.id) : undefined;
//     const textToSend = msgVal.trim();

//     try {
//       // 1. Upload & Send Files
//       const uploadedDocs = [];
//       for (const file of attachedFiles) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("requestId", activeRequest.id);

//         const uploadResult = await uploadChatFileAction(formData);
//         if (!uploadResult.success) throw new Error(uploadResult.error);

//         uploadedDocs.push({ name: uploadResult.name, url: uploadResult.url, size: formatBytes(file.size) });
//       }

//       // 2. Send Text
//       if (textToSend) {
//         // Send strictly mapped arguments to the Database action
//         await sendChatMessageAction(activeRequest.id, textToSend, undefined, undefined, undefined, replyId);

//         // Emit enriched payload for Real-time UI
//         const msgPayload = {
//           id: `temp-${Date.now()}`,
//           request_id: activeRequest.id,
//           sender_id: user.id,
//           sender_role: "user",
//           message_type: "text",
//           content: textToSend,
//           reply_to_id: replyId || null,
//           created_at: new Date().toISOString(),
//           users: { name: user.name }
//         };
//         socket?.emit("send_message", msgPayload);
//         socket?.emit("trigger_queue_refresh");
//       }

//       // 3. Send Docs
//       for (const doc of uploadedDocs) {
//         await sendChatMessageAction(activeRequest.id, "", doc.url, doc.name, doc.size, replyId);

//         const docPayload = {
//           id: `temp-${Date.now()}-${Math.random()}`,
//           request_id: activeRequest.id,
//           sender_id: user.id,
//           sender_role: "user",
//           message_type: "doc",
//           doc_name: doc.name,
//           doc_url: doc.url,
//           doc_size: doc.size,
//           file_name: doc.name, file_url: doc.url, file_size: doc.size, // Fallbacks
//           reply_to_id: replyId || null,
//           created_at: new Date().toISOString(),
//           users: { name: user.name }
//         };
//         socket?.emit("send_message", docPayload);
//         socket?.emit("trigger_queue_refresh");
//       }

//       setMsgVal(""); setAttachedFiles([]); setReplyingTo(null);
//     } catch (err: any) {
//       alert("Failed to send message: " + err.message);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const submitNewRequest = async () => {
//     if (!newTitle || !newService) return;
//     try {
//       await createRequestAction({ service: newService, title: newTitle, desc: newDesc, priority: newPriority });
//       loadRequests();
//       socket?.emit("trigger_queue_refresh"); // Notify admins
//       setShowNew(false); setNewTitle(""); setNewDesc(""); setNewService(""); setNewPriority("regular"); setUploadedFiles([]);
//     } catch (error) { alert("Failed to submit request."); }
//   };

//   const unreadNotifsCount = notifications.filter(n => !n.is_read).length;

//   // Safely filter requests
//   const filtered = requests.filter(r => {
//     if (activeTab !== "all" && r.status !== activeTab) return false;
//     const q = searchVal.toLowerCase();
//     if (q) {
//       const matchTitle = (r.title || "").toLowerCase().includes(q);
//       const matchTitleEn = (r.titleEn || "").toLowerCase().includes(q);
//       const matchId = (r.displayId || r.id || "").toLowerCase().includes(q);
//       if (!matchTitle && !matchTitleEn && !matchId) return false;
//     }
//     return true;
//   });

//   const bg = dark ? "#0d0d0d" : "#f2f0ea";
//   const surface = dark ? "#181818" : "#ffffff";
//   const surface2 = dark ? "#202020" : "#f7f5f0";
//   const surface3 = dark ? "#252525" : "#edeae3";
//   const border = dark ? "#2c2c2c" : "#dedad2";
//   const text = dark ? "#eee8dc" : "#1a1612";
//   const textMid = dark ? "#9a9080" : "#6b6259";
//   const textLight = dark ? "#5a5248" : "#aaa098";
//   const accent = "#c45c1a";
//   const accentDark = "#a34a12";
//   const navy = "#1a3a5c";
//   const accentGreen = "#1a7a3a";
//   const waBubble = dark ? "#1a2e1a" : "#dcf8c6";
//   const adminBubble = dark ? "#1e1e1e" : "#ffffff";
//   const adminBubbleBorder = dark ? "#2e2e2e" : "#e8e2d8";

//   return (
//     <div style={{ background: bg, color: text, height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif", overflow: "hidden" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 2px; }

//         @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
//         @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
//         @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
//         @keyframes waveAnim { from { transform:scaleY(0.4); } to { transform:scaleY(1); } }
//         @keyframes notifSlide { from { transform:translateY(-20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
//         @keyframes ringPulse { 0%,100% { box-shadow:0 0 0 0 rgba(196,92,26,0.4); } 70% { box-shadow:0 0 0 8px rgba(196,92,26,0); } }

//         .req-row { display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer; border-bottom:1px solid ${border}; transition:background 0.15s; }
//         .req-row:hover { background:${surface3}; }
//         .req-row.active { background:${dark ? "#1e1a14" : "#fff5ee"}; border-left:3px solid ${accent}; padding-left:13px; }

//         .tab-btn { padding:6px 14px; border-radius:20px; border:1.5px solid ${border}; background:transparent; color:${textMid}; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.15s; white-space:nowrap; }
//         .tab-btn.active { background:${accent}; border-color:${accent}; color:#fff; }
//         .tab-btn:hover:not(.active) { border-color:${accent}; color:${accent}; }

//         .msg-input { flex:1; padding:12px 18px; border:1.5px solid ${border}; border-radius:24px; background:${surface2}; color:${text}; font-size:15px; outline:none; font-family:inherit; resize:none; max-height:120px; transition:border-color 0.2s; line-height:1.5; }
//         .msg-input:focus { border-color:${accent}; }
//         .msg-input::placeholder { color:${textLight}; }

//         .send-btn { width:46px; height:46px; border-radius:50%; background:${accent}; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.15s, transform 0.1s; }
//         .send-btn:hover { background:${accentDark}; }
//         .send-btn:active { transform:scale(0.92); }
//         .send-btn:disabled { opacity:0.5; cursor:not-allowed; }

//         .icon-btn { background:transparent; border:1.5px solid ${border}; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px; transition:border-color 0.15s, background 0.15s; flex-shrink:0; color:${textMid}; }
//         .icon-btn:hover { border-color:${accent}; background:${dark ? "#1e1208" : "#fff5ee"}; color:${accent}; }

//         .doc-card { display:flex; align-items:center; gap:10px; padding:10px 14px; background:${dark ? "#151515" : "#f7f3ec"}; border:1px solid ${border}; border-radius:10px; cursor:pointer; transition:border-color 0.15s; }
//         .doc-card:hover { border-color:${accent}; }

//         .pay-card { background:${dark ? "#1a1208" : "#fffbf0"}; border:1.5px solid ${dark ? "#5c3d0a" : "#f0d090"}; border-radius:12px; padding:14px 16px; }

//         .timeline-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }

//         .new-drawer { position:fixed; inset:0; z-index:200; display:flex; flex-direction:column; justify-content:flex-end; }
//         .new-drawer-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.5); }
//         .new-drawer-box { position:relative; background:${surface}; border-radius:20px 20px 0 0; padding:24px 20px 32px; animation:slideUp 0.3s ease; max-height:92vh; overflow-y:auto; }

//         .csc-input { width:100%; padding:11px 14px; border:1.5px solid ${border}; border-radius:10px; background:${surface2}; color:${text}; font-size:14px; outline:none; font-family:inherit; transition:border-color 0.2s; }
//         .csc-input:focus { border-color:${accent}; }
//         .csc-input::placeholder { color:${textLight}; }

//         .drop-zone { border:2px dashed ${isDragOver ? accent : border}; border-radius:12px; padding:24px; text-align:center; cursor:pointer; transition:all 0.2s; background:${isDragOver ? (dark ? "#1e1208" : "#fff5ee") : "transparent"}; }

//         .status-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:700; border:1px solid; }

//         .viewing-banner { position:absolute; top:0; left:0; right:0; background:${dark ? "#1a2a1a" : "#e8f8e8"}; border-bottom:1px solid ${dark ? "#2a5a2a" : "#a0d0a0"}; padding:8px 16px; display:flex; align-items:center; gap:8px; font-size:12px; color:${dark ? "#70c870" : "#1a6a1a"}; z-index:10; animation:notifSlide 0.3s ease; }

//         .notif-dot { width:8px; height:8px; border-radius:50%; background:#2a9a2a; animation:pulse 1.5s infinite; flex-shrink:0; }

//         .priority-opt { flex:1; padding:10px; border:1.5px solid ${border}; border-radius:10px; cursor:pointer; text-align:center; transition:all 0.15s; font-family:inherit; }
//         .priority-opt.selected { border-color:${accent}; background:${dark ? "#1e1208" : "#fff5ee"}; }

//         .avatar { border-radius:50%; width:42px; height:42px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:15px; flex-shrink:0; }

//         .sidebar-overlay { position:fixed; inset:0; z-index:150; display:flex; }
//         .sidebar-backdrop { flex:1; background:rgba(0,0,0,0.4); }
//         .sidebar-panel { width:260px; background:${surface}; height:100%; padding:24px 0; display:flex; flex-direction:column; animation:slideIn 0.25s ease; border-right:1px solid ${border}; }

//         .chat-date-sep { text-align:center; margin:16px 0; }
//         .chat-date-pill { display:inline-block; background:${surface3}; border:1px solid ${border}; border-radius:99px; padding:3px 14px; font-size:11px; color:${textMid}; }

//         .unread-badge { min-width:20px; height:20px; border-radius:10px; background:${accent}; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 5px; }
//         .unread-badge-green { background:#2a9a2a; }

//         .tick-seen { color:#53bdeb; }
//         .tick-delivered { color:${textLight}; }

//         /* WhatsApp Style Bubbles */
//         .msg-bubble-admin, .msg-bubble-user { position:relative; padding:10px 14px; border-radius:8px; max-width:75%; box-shadow:0 1px 2px rgba(0,0,0,0.1); display:flex; flex-direction:column; }
//         .msg-bubble-admin { background:${adminBubble}; border:1px solid ${adminBubbleBorder}; border-top-left-radius:0; }
//         .msg-bubble-user { background:${waBubble}; border:1px solid ${dark ? "#2a5a2a" : "#b8e890"}; border-top-right-radius:0; }

//         .msg-bubble-admin::before { content:''; position:absolute; top:0; left:-8px; width:0; height:0; border-top:10px solid ${adminBubble}; border-left:10px solid transparent; }
//         .msg-bubble-user::before { content:''; position:absolute; top:0; right:-8px; width:0; height:0; border-top:10px solid ${waBubble}; border-right:10px solid transparent; }

//         .reply-block { background:rgba(0,0,0,0.06); border-left:4px solid ${accent}; padding:6px 10px; border-radius:4px; margin-bottom:6px; cursor:pointer; }
//         .reply-block .rep-name { font-size:12px; font-weight:700; color:${accent}; margin-bottom:2px; }
//         .reply-block .rep-text { font-size:13px; color:${text}; opacity:0.8; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

//         .doc-img { width:220px; height:220px; object-fit:cover; border-radius:6px; margin-top:4px; cursor:pointer; border:1px solid ${border}; }

//         .group:hover .msg-reply-btn { opacity: 0.5; } 
//         .msg-reply-btn:hover { opacity: 1 !important; color:${accent} !important; }

//         @media (max-width: 700px) {
//           .desktop-list { display: none !important; }
//           .chat-panel { display: flex !important; }
//         }
//       `}</style>

//       {/* ── TOP BAR ── */}
//       <div style={{ background: navy, color: "#fff", padding: "0 16px", display: "flex", alignItems: "center", height: 56, gap: 12, flexShrink: 0, zIndex: 50 }}>
//         <button onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "none", color: "#e8dfc8", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", padding: 4 }}>☰</button>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 17, fontWeight: 700, color: "#e8dfc8", lineHeight: 1.2 }}>{t.appName}</div>
//           <div style={{ fontSize: 10, color: "#8a9ab0", letterSpacing: "0.04em" }}>Shambhuganj, Jaunpur · UP</div>
//         </div>
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           <button onClick={toggleLanguage} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "4px 12px", fontSize: 11, color: "#e8dfc8", cursor: "pointer", fontWeight: 700 }}>
//             {lang === "hi" ? "EN" : "हि"}
//           </button>
//           <button onClick={toggleTheme} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 50, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>
//             {dark ? "☀️" : "🌙"}
//           </button>
//           <button onClick={() => {
//             setNotifOpen(true);
//             if (unreadNotifsCount > 0) {
//               setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
//               markNotificationsReadAction();
//             }
//           }} style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", fontSize: 20, color: "#e8dfc8" }}>
//             🔔
//             {unreadNotifsCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, background: "#e63a1a", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>{unreadNotifsCount}</span>}
//           </button>
//         </div>
//       </div>

//       {/* ── MAIN LAYOUT ── */}
//       <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

//         {/* ── SIDEBAR / REQUEST LIST ── */}
//         <div style={{ width: 340, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", background: surface, flexShrink: 0, overflow: "hidden" }}>

//           {/* Search + filter */}
//           <div style={{ padding: "12px 14px 8px", borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
//             <div style={{ position: "relative", marginBottom: 10 }}>
//               <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: textLight }}>🔍</span>
//               <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder={t.search} style={{ width: "100%", padding: "9px 12px 9px 36px", border: `1.5px solid ${border}`, borderRadius: 20, background: surface2, color: text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
//             </div>
//             <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
//               {["all", "pending", "processing", "done"].map(tab => (
//                 <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn ${activeTab === tab ? "active" : ""}`}>
//                   {tab === "all" ? t.all : tab === "pending" ? t.pending : tab === "processing" ? t.processing : t.done}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Request rows */}
//           <div style={{ flex: 1, overflowY: "auto" }}>
//             {filtered.length === 0 ? (
//               <div style={{ padding: 32, textAlign: "center", color: textMid }}>
//                 <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
//                 <div style={{ fontSize: 14, marginBottom: 8 }}>{t.noRequests}</div>
//                 <button onClick={() => setShowNew(true)} style={{ background: "none", border: "none", color: accent, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.startNew}</button>
//               </div>
//             ) : filtered.map((req) => {
//               const sc = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
//               if (!sc) return null;
//               const isActive = activeRequest?.id === req.id;
//               return (
//                 <div key={req.id} className={`req-row ${isActive ? "active" : ""}`} onClick={() => { setActiveRequest(req as any); setRequests(prev => prev.map(r => r.id === req.id ? { ...r, unread: 0 } : r) as any); }}>
//                   {/* Avatar */}
//                   <div className="avatar" style={{ background: dark ? "#1e1208" : "#fde8d8", color: accent, fontSize: 18 }}>
//                     {req.service.includes("आधार") || req.service.includes("Aadhaar") ? "🪪" : req.service.includes("किसान") || req.service.includes("Kisan") ? "🌾" : req.service.includes("छात्र") || req.service.includes("Scholar") ? "🎓" : "📋"}
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
//                       <span style={{ fontWeight: 600, fontSize: 14, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{lang === "hi" ? req.title : req.titleEn}</span>
//                       <span style={{ fontSize: 11, color: textLight, flexShrink: 0, marginLeft: 6 }}>{req.lastTime}</span>
//                     </div>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <span style={{ fontSize: 12, color: textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>{lang === "hi" ? req.lastMsg : req.lastMsgEn}</span>
//                       <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0, marginLeft: 4 }}>
//                         {req.paymentPending && <span style={{ fontSize: 10 }}>💳</span>}
//                         {req.unread > 0 ? <span className="unread-badge">{req.unread}</span> : <span style={{ fontSize: 10 }}>{sc.icon}</span>}
//                       </div>
//                     </div>
//                     <div style={{ marginTop: 4 }}>
//                       <span className="status-pill" style={{ background: dark ? sc.bgDark : sc.bg, color: sc.color, borderColor: dark ? sc.borderDark : sc.border }}>
//                         {lang === "hi" ? sc.label : sc.labelEn}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* New request FAB */}
//           <div style={{ padding: "12px 14px", borderTop: `1px solid ${border}`, flexShrink: 0 }}>
//             <button onClick={() => setShowNew(true)} style={{ width: "100%", padding: "12px", background: accent, border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.15s", animation: "ringPulse 2s infinite" }}>
//               <span style={{ fontSize: 18 }}>✏️</span> {t.newRequest}
//             </button>
//           </div>
//         </div>

//         {/* ── CHAT PANEL ── */}
//         {activeRequest ? (
//           <div
//             style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
//             onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
//             onDragLeave={() => setIsDragOver(false)}
//             onDrop={handleDrop}
//           >

//             {isDragOver && (
//               <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 700, border: `4px dashed ${accent}`, margin: 16, borderRadius: 16 }}>
//                 Drop files here to attach
//               </div>
//             )}

//             {/* Chat header */}
//             <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, zIndex: 10 }}>
//               <div className="avatar" style={{ background: dark ? "#1e1208" : "#fde8d8", color: accent }}>
//                 {activeRequest.service.includes("आधार") || activeRequest.service.includes("Aadhaar") ? "🪪" : activeRequest.service.includes("किसान") ? "🌾" : activeRequest.service.includes("छात्र") ? "🎓" : "📋"}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 16, fontWeight: 700, color: text }}>{lang === "hi" ? activeRequest.title : activeRequest.titleEn}</div>
//                 <div style={{ fontSize: 11, color: textMid }}>{(activeRequest as any).displayId || activeRequest.id.split('-')[0].toUpperCase()} · {lang === "hi" ? activeRequest.service : activeRequest.service}</div>
//               </div>
//               <div style={{ display: "flex", gap: 8 }}>
//                 {activeRequest.resolvedBy && (
//                   <div style={{ fontSize: 12, color: accentGreen, background: dark ? "#0a1f0f" : "#f0fbf4", border: `1px solid ${dark ? "#1a5c30" : "#90d0a0"}`, borderRadius: 8, padding: "4px 10px" }}>
//                     {t.resolvedBy}: {activeRequest.resolvedBy.name}
//                   </div>
//                 )}
//                 <button onClick={() => setShowTimeline(true)} className="icon-btn" title="Activity">📋</button>
//               </div>
//             </div>

//             {/* Viewing alert banner */}
//             {viewingAlert && (
//               <div className="viewing-banner">
//                 <div className="notif-dot"></div>
//                 <span>
//                   {/* ✨ Automatically grabs the name of the admin handling this chat ✨ */}
//                   {activeRequest?.messages?.find(m => m.from === "admin")?.adminName || "An Operator"} {t.viewingDoc}
//                 </span>
//                 <button onClick={() => setViewingAlert(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 14 }}>✕</button>
//               </div>
//             )}

//             {/* Messages */}
//             <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 4, background: dark ? "#111" : "#ebe5d9", backgroundImage: dark ? "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" : "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>

//               {activeRequest.messages.map((msg: Message, idx: number) => {
//                 const isUser = msg.from === "user";
//                 const prevMsg = activeRequest.messages[idx - 1];
//                 const showDate = !prevMsg || prevMsg.date !== msg.date;
//                 const showSender = !isUser && (!prevMsg || prevMsg.from !== "user" && (prevMsg.type !== "doc" || prevMsg.adminName !== msg.adminName));

//                 return (
//                   <div key={msg.id}>
//                     {showDate && (
//                       <div className="chat-date-sep">
//                         <span className="chat-date-pill">{msg.date === "today" ? t.today : t.yesterday}</span>
//                       </div>
//                     )}

//                     <div className="group" style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 8, marginBottom: 6, alignItems: "flex-end", position: "relative" }}>

//                       {!isUser && (
//                         <div className="avatar" style={{ width: 30, height: 30, background: dark ? "#1a2a3a" : "#e0eaf5", color: navy, fontSize: 12, marginBottom: 2 }}>
//                           {msg.adminName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2) || "OP"}
//                         </div>
//                       )}

//                       <div style={{ maxWidth: "70%" }}>
//                         {!isUser && showSender && (
//                           <div style={{ fontSize: 11, color: accent, fontWeight: 700, marginBottom: 3, paddingLeft: 4 }}>{msg.adminName} · {msg.adminRole}</div>
//                         )}

//                         <div style={{ background: isUser ? waBubble : adminBubble, border: `1px solid ${isUser ? (dark ? "#2a5a2a" : "#b8e890") : adminBubbleBorder}`, borderRadius: isUser ? "12px 12px 0 12px" : "12px 12px 12px 0", padding: msg.type === "doc" ? 4 : "8px 12px 6px", overflow: "hidden", minWidth: msg.type === "doc" ? 180 : 0 }}>

//                           {/* ── RENDER REPLIED MESSAGE PREVIEW ── */}
//                           {msg.reply_to_msg && (
//                             <div className="reply-block" style={{ background: isUser ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.04)", padding: "6px 10px", borderRadius: 8, marginBottom: 6, fontSize: 12, borderLeft: `3px solid ${isUser ? (dark ? "#4ade80" : "#16a34a") : accent}` }}>
//                               <div style={{ fontWeight: 700, opacity: 0.7, marginBottom: 2 }}>{msg.reply_to_msg.from === 'user' ? 'You' : 'Admin'}</div>
//                               <div style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
//                                 {msg.reply_to_msg.text || (msg.reply_to_msg.type === "doc" ? "📄 Document" : "💳 Payment")}
//                               </div>
//                             </div>
//                           )}

//                           {/* ── MESSAGE CONTENT ── */}
//                           {msg.type === "payment" ? (
//                             <div style={{ minWidth: 240, padding: 8 }}>
//                               <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
//                                 <span style={{ background: msg.paymentStatus === "paid" ? "#27ae60" : accent, padding: 8, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}>
//                                   {msg.paymentStatus === "paid" ? "✅" : "💳"}
//                                 </span>
//                                 <div style={{ fontSize: 15, fontWeight: 700, color: text }}>
//                                   {msg.paymentStatus === "paid" ? "Payment Completed" : "Payment Request"}
//                                 </div>
//                               </div>

//                               <button
//                                 onClick={() => msg.paymentStatus !== "paid" && handlePayment(String(msg.id), msg.amount || 0)}
//                                 disabled={msg.paymentStatus === "paid"}
//                                 style={{ width: "100%", background: "none", border: "none", textAlign: "left", padding: 0, cursor: msg.paymentStatus === "paid" ? "default" : "pointer", transition: "transform 0.1s", opacity: msg.paymentStatus === "paid" ? 0.8 : 1 }}
//                                 onMouseDown={e => msg.paymentStatus !== "paid" && (e.currentTarget.style.transform = "scale(0.98)")}
//                                 onMouseUp={e => msg.paymentStatus !== "paid" && (e.currentTarget.style.transform = "scale(1)")}
//                               >
//                                 <div className="mono" style={{ fontSize: 36, fontWeight: 800, color: msg.paymentStatus === "paid" ? "#27ae60" : accent, marginBottom: 12 }}>
//                                   {fmtCurrency(msg.amount || 0)}
//                                 </div>
//                                 <div style={{ fontSize: 14, color: "#fff", background: msg.paymentStatus === "paid" ? "#27ae60" : accent, padding: "12px 16px", borderRadius: 8, width: "100%", textAlign: "center", fontWeight: 700, boxShadow: msg.paymentStatus === "paid" ? "none" : "0 4px 12px rgba(196,92,26,0.3)" }}>
//                                   {msg.paymentStatus === "paid" ? "Amount Received ✓" : "Pay securely via Razorpay →"}
//                                 </div>
//                               </button>
//                             </div>
//                           ) : msg.type === "doc" && msg.doc ? (
//                             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                               {msg.doc.name?.match(/\.(jpeg|jpg|gif|png|webp)$/i) && msg.doc.url ? (
//                                 <div style={{ position: "relative" }}>
//                                   <img src={msg.doc.url} alt="attachment" className="doc-img" onClick={() => window.open(msg.doc?.url || "", "_blank")} />
//                                   <button onClick={(e) => { e.stopPropagation(); handleDownload(msg.doc?.url || "", msg.doc?.name || "file"); }} style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", cursor: "pointer", padding: 8, borderRadius: "50%" }}>⬇</button>
//                                 </div>
//                               ) : (
//                                 <div className="doc-card" onClick={() => msg.doc?.url && window.open(msg.doc.url, '_blank')}>
//                                   <div className="doc-icon" style={{ background: accent }}>{msg.doc.icon || "📄"}</div>
//                                   <div style={{ flex: 1, minWidth: 100 }}>
//                                     <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: text }}>{msg.doc.name}</div>
//                                     <div style={{ fontSize: 12, color: textMid }}>{msg.doc.size}</div>
//                                   </div>
//                                   <button onClick={(e) => { e.stopPropagation(); handleDownload(msg.doc?.url || "", msg.doc?.name || "file"); }} style={{ background: dark ? "#333" : "#fff", border: `1px solid ${border}`, color: text, cursor: "pointer", padding: 8, borderRadius: 6 }}>⬇</button>
//                                 </div>
//                               )}
//                               {msg.text && <span style={{ fontSize: 15, marginTop: 4 }}>{lang === "hi" ? msg.text : (msg.textEn || msg.text)}</span>}
//                             </div>
//                           ) : (
//                             <div style={{ fontSize: 14, color: text, lineHeight: 1.6 }}>{lang === "hi" ? msg.text : (msg.textEn || msg.text)}</div>
//                           )}

//                           {/* Timestamps */}
//                           <div style={{ padding: msg.type === "doc" ? "4px 10px 6px" : "0", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: msg.type === "doc" ? 0 : 4 }}>
//                             <span style={{ fontSize: 10, color: textLight }}>{msg.time}</span>
//                             {isUser && <span style={{ fontSize: 12 }} className={msg.status === "seen" ? "tick-seen" : "tick-delivered"}>✓✓</span>}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Hover Reply Button */}
//                       <button
//                         onClick={() => setReplyingTo(msg)}
//                         style={{ opacity: 0, transition: "opacity 0.2s", background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 4 }}
//                         onMouseEnter={e => e.currentTarget.style.opacity = "1"}
//                         onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}
//                         className="msg-reply-btn"
//                         title="Reply"
//                       >
//                         ↩️
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={msgEndRef} />
//             </div>

//             {/* ── MESSAGE INPUT ── */}
//             <div style={{ background: surface, borderTop: `1px solid ${border}`, padding: "10px 14px", flexShrink: 0 }}>

//               {/* ✨ PASTE REPLY BANNER HERE ✨ */}
//               {replyingTo && (
//                 <div style={{ background: surface2, borderLeft: `4px solid ${accent}`, padding: "8px 12px", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, zIndex: 1, position: "relative" }}>
//                   <div style={{ fontSize: 12 }}>
//                     <div style={{ fontWeight: 700, color: accent }}>{lang === "hi" ? "जवाब दे रहे हैं:" : "Replying to"} {replyingTo.from === 'user' ? 'You' : 'Admin'}</div>
//                     <div style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }}>
//                       {replyingTo.text || (replyingTo.type === "doc" ? "📄 Document" : "💳 Payment")}
//                     </div>
//                   </div>
//                   <button onClick={() => setReplyingTo(null)} style={{ background: "none", border: "none", cursor: "pointer", color: textLight, fontSize: 16 }}>✕</button>
//                 </div>
//               )}

//               {/* ✨ EXISTING ATTACHED FILES PREVIEW ✨ */}
//               {attachedFiles.length > 0 && (
//                 <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
//                   {attachedFiles.map((f, i) => (
//                     <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: surface2, border: `1px solid ${border}`, borderRadius: 8, padding: "4px 10px", fontSize: 12 }}>
//                       <span>📄</span><span style={{ color: textMid }}>{(f as File).name}</span>
//                       <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: textLight, fontSize: 14 }}>✕</button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* ✨ EXISTING TEXT AREA AND SEND BUTTON ✨ */}
//               <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
//                 <button className="icon-btn" onClick={() => { const el = document.createElement("input"); el.type = "file"; el.multiple = true; el.onchange = e => setAttachedFiles(Array.from((e.target as HTMLInputElement).files || [])); el.click(); }}>📎</button>

//                 <textarea
//                   className="msg-input"
//                   rows={1}
//                   value={msgVal}
//                   onChange={e => { setMsgVal(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
//                   onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
//                   placeholder={t.typeMsg}
//                 />

//                 <button className="send-btn" onClick={sendMessage} disabled={isSending || (!msgVal.trim() && attachedFiles.length === 0)} style={{ opacity: (isSending || (!msgVal.trim() && attachedFiles.length === 0)) ? 0.5 : 1 }}>
//                   {isSending ? <div style={{ width: 20, height: 20, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "pulse 1s linear infinite" }} /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: textMid }}>
//             <div style={{ fontSize: 64, opacity: 0.3 }}>📬</div>
//             <div style={{ fontSize: 18, fontFamily: "'Noto Serif Devanagari', serif", color: textMid }}>
//               {lang === "hi" ? "कोई आवेदन चुनें" : "Select a request"}
//             </div>
//             <div style={{ fontSize: 13, color: textLight }}>{lang === "hi" ? "या नया आवेदन शुरू करें" : "or start a new request"}</div>
//             <button onClick={() => setShowNew(true)} style={{ padding: "10px 24px", background: accent, border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.newRequest} ✏️</button>
//           </div>
//         )}

//         {/* ── TIMELINE PANEL ── */}
//         {showTimeline && activeRequest && (
//           <div style={{ width: 280, borderLeft: `1px solid ${border}`, background: surface, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", zIndex: 100, position: "absolute", right: 0, height: "100%", boxShadow: "-4px 0 15px rgba(0,0,0,0.1)" }}>
//             <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <span style={{ fontWeight: 700, fontSize: 14, color: text }}>📋 {t.timeline}</span>
//               <button onClick={() => setShowTimeline(false)} style={{ background: "none", border: "none", cursor: "pointer", color: textMid, fontSize: 18 }}>✕</button>
//             </div>
//             <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
//               {activeRequest.timeline.map((ev: TimelineEvent, i: number) => (
//                 <div key={i} style={{ display: "flex", gap: 12, marginBottom: 20 }}>
//                   <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                     <div className="timeline-dot" style={{ background: dark ? "#1e1208" : "#fff5ee", border: `2px solid ${i === activeRequest.timeline.length - 1 ? accent : border}` }}>
//                       <span style={{ fontSize: 12 }}>{TIMELINE_ICONS[ev.event as keyof typeof TIMELINE_ICONS] || "📌"}</span>
//                     </div>
//                     {i < activeRequest.timeline.length - 1 && <div style={{ width: 2, flex: 1, background: border, marginTop: 4, minHeight: 20 }} />}
//                   </div>
//                   <div style={{ paddingTop: 4 }}>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{lang === "hi" ? (ev.event === "submitted" ? "जमा किया गया" : ev.event === "seen" ? "देखा गया" : ev.event === "processing" ? "प्रक्रिया शुरू" : "पूर्ण") : ev.eventEn}</div>
//                     <div style={{ fontSize: 11, color: textMid, marginTop: 2 }}>{lang === "hi" ? ev.time : ev.timeEn}</div>
//                   </div>
//                 </div>
//               ))}
//               {activeRequest.status !== "done" && (
//                 <div style={{ display: "flex", gap: 12 }}>
//                   <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                     <div className="timeline-dot" style={{ background: surface2, border: `2px dashed ${border}`, opacity: 0.5 }}>
//                       <span style={{ fontSize: 12 }}>✅</span>
//                     </div>
//                   </div>
//                   <div style={{ paddingTop: 4, opacity: 0.4 }}>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{lang === "hi" ? "पूर्ण" : "Completed"}</div>
//                     <div style={{ fontSize: 11, color: textMid }}>{lang === "hi" ? "जल्द आएगा" : "Coming soon"}</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* Status badge */}
//             <div style={{ padding: "14px 16px", borderTop: `1px solid ${border}` }}>
//               {(() => {
//                 const sc = STATUS_CONFIG[activeRequest.status as keyof typeof STATUS_CONFIG]; return (
//                   <div style={{ background: dark ? sc.bgDark : sc.bg, border: `1px solid ${dark ? sc.borderDark : sc.border}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
//                     <span style={{ fontSize: 18 }}>{sc.icon}</span>
//                     <div>
//                       <div style={{ fontSize: 12, color: sc.color, fontWeight: 700 }}>{lang === "hi" ? sc.label : sc.labelEn}</div>
//                       <div style={{ fontSize: 11, color: textMid }}>{(activeRequest as any).displayId || activeRequest.id.split('-')[0].toUpperCase()}</div>
//                     </div>
//                   </div>
//                 );
//               })()}
//               {/* ✨ UPDATED GLOBAL PAYMENT BUTTON ✨ */}
//               {(() => {
//                 // Find the first unpaid payment message in the chat
//                 const unpaidMsg = activeRequest.messages.find(m => m.type === "payment" && m.paymentStatus !== "paid");

//                 if (unpaidMsg) {
//                   return (
//                     <button
//                       onClick={() => handlePayment(String(unpaidMsg.id), unpaidMsg.amount || 0)}
//                       style={{ width: "100%", marginTop: 10, padding: "10px", background: "#c47a10", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "transform 0.1s" }}
//                       onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
//                       onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
//                     >
//                       💳 {t.payNow} — {fmtCurrency(unpaidMsg.amount || 0)}
//                     </button>
//                   );
//                 }
//                 return null;
//               })()}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── NEW REQUEST DRAWER ── */}
//       {showNew && (
//         <div className="new-drawer">
//           <div className="new-drawer-backdrop" onClick={() => setShowNew(false)} />
//           <div className="new-drawer-box">
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//               <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 20, fontWeight: 700, color: text }}>
//                 {t.newRequest} ✏️
//               </div>
//               <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: textMid }}>✕</button>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//               {/* Service select */}
//               <div>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: textMid, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.serviceType}</label>
//                 <select value={newService} onChange={e => setNewService(e.target.value)} className="csc-input" style={{ appearance: "none", cursor: "pointer" }}>
//                   <option value="">{lang === "hi" ? "सेवा चुनें..." : "Select service..."}</option>
//                   {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </div>

//               {/* Title */}
//               <div>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: textMid, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.requestTitle}</label>
//                 <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={lang === "hi" ? "जैसे: आधार में नाम सुधार" : "e.g. Name correction in Aadhaar"} className="csc-input" />
//               </div>

//               {/* Description */}
//               <div>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: textMid, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.requestDesc}</label>
//                 <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={lang === "hi" ? "पूरी जानकारी लिखें..." : "Write details..."} className="csc-input" rows={3} style={{ resize: "vertical", lineHeight: 1.6 }} />
//               </div>

//               {/* Priority */}
//               <div>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: textMid, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.priority}</label>
//                 <div style={{ display: "flex", gap: 8 }}>
//                   {["regular", "prepaid"].map(p => (
//                     <button key={p} onClick={() => setNewPriority(p)} className={`priority-opt ${newPriority === p ? "selected" : ""}`} style={{ background: newPriority === p ? (dark ? "#1e1208" : "#fff5ee") : "transparent", borderColor: newPriority === p ? accent : border, color: newPriority === p ? accent : textMid, fontWeight: newPriority === p ? 700 : 400 }}>
//                       <div style={{ fontSize: 18, marginBottom: 4 }}>{p === "regular" ? "🕐" : "⚡"}</div>
//                       <div style={{ fontSize: 12 }}>{p === "regular" ? t.regular : t.prepaid}</div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Upload */}
//               <div>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: textMid, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.uploadDoc}</label>
//                 <div className="drop-zone" onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={e => { e.preventDefault(); setIsDragOver(false); setUploadedFiles(Array.from((e.dataTransfer as DataTransfer).files)); }} onClick={() => { const el = document.createElement("input"); el.type = "file"; el.multiple = true; el.accept = ".pdf,.jpg,.jpeg,.png,.webp"; el.onchange = (event) => { const target = event.target as HTMLInputElement; setUploadedFiles(Array.from(target.files || [])); }; el.click(); }}>
//                   <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
//                   <div style={{ fontSize: 13, color: textMid }}>{t.dragDrop}</div>
//                   <div style={{ fontSize: 11, color: textLight, marginTop: 4 }}>PDF, JPG, PNG</div>
//                 </div>
//                 {uploadedFiles.length > 0 && (
//                   <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
//                     {uploadedFiles.map((f, i) => (
//                       <div key={i} className="doc-card">
//                         <span>📄</span>
//                         <span style={{ flex: 1, fontSize: 13, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
//                         <button onClick={(e) => { e.stopPropagation(); setUploadedFiles(prev => prev.filter((_, j) => j !== i)); }} style={{ background: "none", border: "none", cursor: "pointer", color: textLight, fontSize: 16 }}>✕</button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <button onClick={submitNewRequest} disabled={!newTitle || !newService} style={{ padding: "14px", background: newTitle && newService ? accent : (dark ? "#2a2020" : "#e0d8d0"), border: "none", borderRadius: 10, color: newTitle && newService ? "#fff" : textLight, fontSize: 15, fontWeight: 700, cursor: newTitle && newService ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s", marginTop: 4 }}>
//                 {t.submitRequest} →
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── SIDEBAR PANEL ── */}
//       {sidebarOpen && (
//         <div className="sidebar-overlay">
//           <div className="sidebar-panel">
//             <div style={{ padding: "0 20px 20px", borderBottom: `1px solid ${border}`, marginBottom: 8 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <div className="avatar" style={{ width: 48, height: 48, background: dark ? "#1e1208" : "#fde8d8", color: accent, fontSize: 20 }}>
//                   {user?.name ? user.name[0].toUpperCase() : "👤"}
//                 </div>
//                 <div>
//                   <div style={{ fontWeight: 700, fontSize: 15, color: text }}>
//                     {user?.name || (lang === "hi" ? "उपयोगकर्ता" : "User")}
//                   </div>
//                   <div style={{ fontSize: 12, color: textMid }}>{user?.mobile ? `+91 ${user.mobile}` : user?.email}</div>
//                 </div>
//               </div>
//               <div style={{ marginTop: 12, background: dark ? "#1a1208" : "#fff5ee", border: `1px solid ${dark ? "#5c3d0a" : "#f0d090"}`, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <div>
//                   <div style={{ fontSize: 11, color: textMid }}>{t.wallet}</div>
//                   <div style={{ fontSize: 22, fontWeight: 700, color: accent, fontFamily: "'Noto Serif Devanagari', serif" }}>₹ {user?.wallet_balance || 0}</div>
//                 </div>
//                 <button style={{ background: accent, border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>
//                   {lang === "hi" ? "जोड़ें" : "Add"}
//                 </button>
//               </div>
//             </div>

//             {/* Dynamic Buttons (Navigation wired up!) */}
//             {[["📋", t.myRequests], ["🔔", t.notifications], ["👤", t.profile], ["🚪", t.logout]].map(([ic, label]) => (
//               <button key={label}
//                 onClick={() => {
//                   if (label === t.logout) logout();
//                   else if (label === t.profile) window.location.href = "/dashboard/profile";
//                   else if (label === t.myRequests) { window.location.href = "/dashboard"; setSidebarOpen(false); }
//                 }}
//                 style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: text, fontSize: 15, fontFamily: "inherit", transition: "background 0.15s" }}
//                 onMouseEnter={e => e.currentTarget.style.background = surface2}
//                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//                 <span style={{ fontSize: 20 }}>{ic}</span>{label}
//               </button>
//             ))}
//           </div>
//           <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
//         </div>
//       )}

//       {/* ── NOTIFICATIONS PANEL ── */}
//       {notifOpen && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", justifyContent: "flex-end" }}>
//           <div style={{ flex: 1 }} onClick={() => setNotifOpen(false)} />
//           <div style={{ width: 320, background: surface, borderLeft: `1px solid ${border}`, height: "100%", display: "flex", flexDirection: "column", animation: "slideIn 0.25s ease" }}>
//             <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <span style={{ fontWeight: 700, fontSize: 16, color: text }}>🔔 {t.notifications}</span>
//               <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: textMid, fontSize: 20 }}>✕</button>
//             </div>
//             <div style={{ flex: 1, overflowY: "auto" }}>
//               {notifications.length === 0 ? (
//                 <div style={{ padding: 32, textAlign: "center", color: textMid, fontSize: 13 }}>
//                   {lang === "hi" ? "कोई नई सूचना नहीं" : "No new notifications"}
//                 </div>
//               ) : (
//                 notifications.map((n) => {
//                   const iconData =
//                     n.type === 'document_viewed' ? { icon: "👁️", color: accentGreen } :
//                       n.type === 'status_changed' ? { icon: "⚙️", color: "#1a5aa0" } :
//                         { icon: "🔔", color: accent };

//                   return (
//                     <div key={n.id} style={{ padding: "14px 20px", borderBottom: `1px solid ${border}`, display: "flex", gap: 12, cursor: "pointer", transition: "background 0.15s", background: n.is_read ? "transparent" : (dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)") }}>
//                       <div style={{ width: 36, height: 36, borderRadius: "50%", background: dark ? "#1a1a1a" : "#f5f0e8", border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
//                         {iconData.icon}
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ fontSize: 13, fontWeight: n.is_read ? 500 : 700, color: text, lineHeight: 1.4 }}>
//                           {lang === "hi" ? (n.title_hi || n.title) : n.title}
//                         </div>
//                         <div style={{ fontSize: 12, color: textMid, marginTop: 2 }}>
//                           {lang === "hi" ? (n.body_hi || n.body) : n.body}
//                         </div>
//                         <div style={{ fontSize: 10, color: textLight, marginTop: 4 }}>
//                           {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </div>
//                       </div>
//                       {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, alignSelf: "center" }} />}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






























"use client";

import { useState, useEffect, useRef, type DragEvent, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchMyRequestsAction, createRequestAction, sendChatMessageAction } from "@/app/actions/requests";
import { updateUserProfile } from "../actions/user";
import { uploadChatFileAction } from "../actions/storage";
import { fetchNotificationsAction, markNotificationsReadAction } from "@/app/actions/notifications";
import { io, Socket } from "socket.io-client";
import { createRazorpayOrderAction, verifyRazorpayPaymentAction } from "@/app/actions/payment";
import { fetchMyAddressesAction, addAddressAction } from "@/app/actions/address"; // ✨ Add this

// ════════════════════════════════════════════════════════════════════════════════
// TYPES (Preserved Exactly)
// ════════════════════════════════════════════════════════════════════════════════
interface AppNotification {
  id: string;
  title: string;
  title_hi: string;
  body: string;
  body_hi: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface TimelineEvent {
  event: "submitted" | "seen" | "processing" | "done" | "payment";
  time: string;
  eventEn: string;
  timeEn: string;
}

interface MessageDoc {
  name: string;
  size: string;
  icon: string;
  url?: string;
  isResult?: boolean;
}

interface Message {
  id: number | string;
  from: "user" | "admin";
  time: string;
  date: string;
  type: string;
  text?: string;
  textEn?: string;
  doc?: MessageDoc;
  amount?: number;
  paymentStatus?: string;
  adminName?: string;
  adminRole?: string;
  status?: "seen" | "delivered";
  replyToId?: string | number | null;
  reply_to_msg?: Message;
}

interface ResolvedBy {
  name: string;
  role: string;
}

interface Request {
  id: string;
  displayId?: string;
  title: string;
  titleEn: string;
  service: string;
  status: "pending" | "processing" | "done";
  unread: number;
  lastMsg: string;
  lastMsgEn: string;
  lastTime: string;
  resolvedBy: ResolvedBy | null;
  paymentPending: boolean;
  paymentAmount?: number;
  deliveryType?: string;   // ✨ Added
  deliveryStatus?: string; // ✨ Added
  urgency?: string;        // ✨ Added
  messages: Message[];
  timeline: TimelineEvent[];
}

// ════════════════════════════════════════════════════════════════════════════════
// UTILS (Preserved + Reference Utils)
// ════════════════════════════════════════════════════════════════════════════════
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const fmtCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtTime = (d: string) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const isImg = (name: string | null) => !!name?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

function useDebounce<T>(value: T, delay: number): T {
  const [v, setV] = useState<T>(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}

// ════════════════════════════════════════════════════════════════════════════════
// LANGUAGE STRINGS (Renamed from T → LANG to free up T for Theme Tokens)
// ════════════════════════════════════════════════════════════════════════════════
const LANG = {
  hi: {
    appName: "श्रीलाल जन सेवा केंद्र",
    myRequests: "मेरे आवेदन", newRequest: "नया आवेदन", search: "खोजें...",
    all: "सभी", pending: "लंबित", processing: "प्रक्रिया में", done: "पूर्ण",
    sent: "भेजा", seen: "देखा", online: "ऑनलाइन", today: "आज", yesterday: "कल",
    typeMsg: "संदेश लिखें...", send: "भेजें", attach: "दस्तावेज़ जोड़ें",
    requestTitle: "आवेदन का विषय", requestDesc: "विवरण लिखें", serviceType: "सेवा चुनें",
    submitRequest: "आवेदन जमा करें", uploadDoc: "दस्तावेज़ अपलोड करें",
    dragDrop: "फ़ाइल यहाँ खींचें या क्लिक करें", timeline: "गतिविधि",
    payNow: "अभी भुगतान करें", download: "डाउनलोड", resolvedBy: "द्वारा हल किया गया",
    viewingDoc: "आपके दस्तावेज़ देख रहे हैं", noRequests: "अभी कोई आवेदन नहीं",
    startNew: "नया आवेदन शुरू करें", wallet: "वॉलेट", notifications: "सूचनाएं",
    profile: "प्रोफ़ाइल", logout: "लॉगआउट", cancel: "रद्द करें", close: "बंद करें",
    priority: "प्राथमिकता", prepaid: "प्रीपेड (तेज़ सेवा)", regular: "सामान्य",
    deliveryOpt: "वितरण विकल्प", pickup: "दुकान से प्राप्त करें", homeDelivery: "होम डिलीवरी (घर पर)",
    urgency: "कितनी जल्दी चाहिए?", flex: "कोई जल्दी नहीं (2-3 दिन)", instant: "तुरंत (तत्काल)",
    selectAddr: "पता चुनें", addAddr: "+ नया पता जोड़ें", addrLabel: "लेबल (जैसे: घर)", addrText: "पूरा पता",
    pin: "पिनकोड", saveAddr: "पता सेव करें", trackLive: "लाइव ट्रैक करें 🛵",
  },
  en: {
    appName: "Shreelal Jan Seva Kendra",
    myRequests: "My Requests", newRequest: "New Request", search: "Search...",
    all: "All", pending: "Pending", processing: "Processing", done: "Done",
    sent: "Sent", seen: "Seen", online: "Online", today: "Today", yesterday: "Yesterday",
    typeMsg: "Type a message...", send: "Send", attach: "Attach Document",
    requestTitle: "Request Subject", requestDesc: "Describe your need", serviceType: "Select Service",
    submitRequest: "Submit Request", uploadDoc: "Upload Document",
    dragDrop: "Drag file here or click to browse", timeline: "Activity",
    payNow: "Pay Now", download: "Download", resolvedBy: "Resolved by",
    viewingDoc: "is viewing your document", noRequests: "No requests yet",
    startNew: "Start a new request", wallet: "Wallet", notifications: "Notifications",
    profile: "Profile", logout: "Logout", cancel: "Cancel", close: "Close",
    priority: "Priority", prepaid: "Prepaid (Faster Service)", regular: "Regular",
    deliveryOpt: "Delivery Options", pickup: "Shop Pickup", homeDelivery: "Home Delivery",
    urgency: "Delivery Urgency", flex: "No Rush (2-3 Days)", instant: "Instant (High Priority)",
    selectAddr: "Select Address", addAddr: "+ Add New Address", addrLabel: "Label (e.g. Home)", addrText: "Full Address",
    pin: "Pincode", saveAddr: "Save Address", trackLive: "Track Live 🛵",
  },
} as const;

const SERVICES = ["आधार अपडेट / Aadhaar Update", "पैन कार्ड / PAN Card", "जाति प्रमाण पत्र / Caste Certificate", "छात्रवृत्ति / Scholarship", "PM किसान / PM Kisan", "आयुष्मान कार्ड / Ayushman Card", "टिकट बुकिंग / Ticket Booking", "पैसे ट्रांसफर / Money Transfer", "अन्य / Other"];

const STATUS_CONFIG: Record<string, any> = {
  pending: { color: "#b45309", bg: "#fffbeb", bgDark: "#1c1400", border: "#fcd34d", borderDark: "#92400e", label: "लंबित", labelEn: "Pending", icon: "⏳" },
  seen: { color: "#1d4ed8", bg: "#eff6ff", bgDark: "#0a1628", border: "#93c5fd", borderDark: "#1e3a8a", label: "देखा गया", labelEn: "Seen", icon: "👁️" },
  processing: { color: "#1d4ed8", bg: "#eff6ff", bgDark: "#0a1628", border: "#93c5fd", borderDark: "#1e3a8a", label: "प्रक्रिया में", labelEn: "Processing", icon: "⚙️" },
  payment_pending: { color: "#c2410c", bg: "#fff7ed", bgDark: "#1a0800", border: "#fb923c", borderDark: "#7c2d12", label: "भुगतान बाकी", labelEn: "Payment Pending", icon: "💳" },
  done: { color: "#15803d", bg: "#f0fdf4", bgDark: "#031a0a", border: "#86efac", borderDark: "#14532d", label: "पूर्ण", labelEn: "Done", icon: "✅" },
  cancelled: { color: "#6b7280", bg: "#f9fafb", bgDark: "#111", border: "#d1d5db", borderDark: "#374151", label: "रद्द", labelEn: "Cancelled", icon: "❌" },
};

const TIMELINE_ICONS = { submitted: "📤", seen: "👁️", processing: "⚙️", done: "✅", payment: "💳" };

// ════════════════════════════════════════════════════════════════════════════════
// DUAL THEME TOKENS (Exact Reference Structure)
// ════════════════════════════════════════════════════════════════════════════════
const THEMES = {
  light: {
    pageBg: "#f1f5f9",
    navBg: "#1e3a8a",
    navBottomBorder: "#3b82f6",
    navText: "rgba(255,255,255,0.65)",
    navTextHover: "#ffffff",
    navActiveBg: "#3b82f6",
    navActiveText: "#ffffff",
    navBrand: "#ffffff",
    navBrandAccent: "#93c5fd",

    sidebarBg: "#ffffff",
    sidebarHeaderBg: "#f8fafc",

    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    cardShadow: "0 1px 4px rgba(0,0,0,0.07)",

    sectionGrad: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",
    sectionGradText: "#ffffff",

    textPrimary: "#1e293b",
    textSecondary: "#475569",
    textMuted: "#94a3b8",

    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentLight: "#eff6ff",
    accentBorder: "#bfdbfe",

    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputFocusBorder: "#3b82f6",
    inputText: "#1e293b",
    inputPlaceholder: "#94a3b8",

    divider: "#e2e8f0",

    chatBg: "#f1f5f9",
    chatPattern: "radial-gradient(#2563eb14 1px,transparent 1px)",
    bubbleAdminBg: "#dbeafe",
    bubbleAdminBorder: "#bfdbfe",
    bubbleAdminText: "#1e293b",
    bubbleUserBg: "#ffffff",
    bubbleUserBorder: "#e2e8f0",
    bubbleUserText: "#1e293b",
    bubbleMeta: "rgba(0,0,0,0.35)",

    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#64748b",
    pillActiveBg: "#dbeafe",
    pillActiveBorder: "#93c5fd",
    pillActiveText: "#1d4ed8",

    chatRowActiveBg: "#eff6ff",
    chatRowActiveBorder: "#2563eb",
    rowHover: "#f8fafc",

    btnPrimary: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    btnPrimaryText: "#ffffff",
    btnPrimaryGlow: "rgba(37,99,235,0.35)",
    btnGhostBg: "#f1f5f9",
    btnGhostBorder: "#e2e8f0",
    btnGhostText: "#475569",
    btnGhostHoverBg: "#eff6ff",
    btnGhostHoverText: "#2563eb",
    btnDangerBg: "#fef2f2",
    btnDangerBorder: "#fecaca",
    btnDangerText: "#dc2626",
    btnSuccessBg: "linear-gradient(135deg,#15803d,#16a34a)",
    btnSuccessText: "#ffffff",

    subTabHdrBg: "#f8fafc",
    subTabText: "#94a3b8",
    subTabActive: "#2563eb",
    subTabBorder: "#2563eb",

    tagBg: "#dbeafe",
    tagText: "#1d4ed8",
    scrollThumb: "#bfdbfe",

    modalOverlay: "rgba(15,23,42,0.55)",
    modalBg: "#ffffff",
    modalBorder: "#e2e8f0",

    teamCardBorder: "#e2e8f0",
    teamCardBg: "#ffffff",
    teamCardHover: "#f8fafc",

    statusDotBorder: "#ffffff",
    toggleIcon: "🌙",
    toggleLabel: "Dark",

    payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
    payPaidGrad: "linear-gradient(135deg,#15803d,#16a34a)",
    docIconBg: "#fef2f2",
    docIconBorder: "#fecaca",
    docIconColor: "#dc2626",
  },
  dark: {
    pageBg: "#060b14",
    navBg: "rgba(6,11,20,0.98)",
    navBottomBorder: "#f59e0b",
    navText: "rgba(255,255,255,0.45)",
    navTextHover: "#ffffff",
    navActiveBg: "rgba(245,158,11,0.18)",
    navActiveText: "#f59e0b",
    navBrand: "#ffffff",
    navBrandAccent: "#f59e0b",

    sidebarBg: "rgba(6,11,20,0.9)",
    sidebarHeaderBg: "rgba(255,255,255,0.02)",

    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardShadow: "0 1px 4px rgba(0,0,0,0.3)",

    sectionGrad: "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
    sectionGradText: "#000000",

    textPrimary: "#f1f5f9",
    textSecondary: "rgba(255,255,255,0.55)",
    textMuted: "rgba(255,255,255,0.28)",

    accent: "#f59e0b",
    accentHover: "#d97706",
    accentLight: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",

    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.08)",
    inputFocusBorder: "rgba(245,158,11,0.5)",
    inputText: "#f1f5f9",
    inputPlaceholder: "rgba(255,255,255,0.25)",

    divider: "rgba(255,255,255,0.06)",

    chatBg: "#080d17",
    chatPattern: "radial-gradient(rgba(245,158,11,0.018) 1px,transparent 1px)",
    bubbleAdminBg: "rgba(245,158,11,0.12)",
    bubbleAdminBorder: "rgba(245,158,11,0.22)",
    bubbleAdminText: "#f1f5f9",
    bubbleUserBg: "rgba(255,255,255,0.05)",
    bubbleUserBorder: "rgba(255,255,255,0.08)",
    bubbleUserText: "#f1f5f9",
    bubbleMeta: "rgba(255,255,255,0.3)",

    pillBg: "rgba(255,255,255,0.03)",
    pillBorder: "rgba(255,255,255,0.08)",
    pillText: "rgba(255,255,255,0.4)",
    pillActiveBg: "rgba(245,158,11,0.15)",
    pillActiveBorder: "rgba(245,158,11,0.4)",
    pillActiveText: "#f59e0b",

    chatRowActiveBg: "rgba(245,158,11,0.08)",
    chatRowActiveBorder: "#f59e0b",
    rowHover: "rgba(255,255,255,0.03)",

    btnPrimary: "linear-gradient(135deg,#f59e0b,#d97706)",
    btnPrimaryText: "#000000",
    btnPrimaryGlow: "rgba(245,158,11,0.35)",
    btnGhostBg: "rgba(255,255,255,0.05)",
    btnGhostBorder: "rgba(255,255,255,0.1)",
    btnGhostText: "rgba(255,255,255,0.7)",
    btnGhostHoverBg: "rgba(245,158,11,0.1)",
    btnGhostHoverText: "#f59e0b",
    btnDangerBg: "rgba(239,68,68,0.1)",
    btnDangerBorder: "rgba(239,68,68,0.25)",
    btnDangerText: "#f87171",
    btnSuccessBg: "linear-gradient(135deg,#10b981,#059669)",
    btnSuccessText: "#ffffff",

    subTabHdrBg: "rgba(6,11,20,0.6)",
    subTabText: "rgba(255,255,255,0.35)",
    subTabActive: "#f59e0b",
    subTabBorder: "#f59e0b",

    tagBg: "rgba(245,158,11,0.15)",
    tagText: "#f59e0b",
    scrollThumb: "rgba(245,158,11,0.3)",

    modalOverlay: "rgba(0,0,0,0.85)",
    modalBg: "#0f172a",
    modalBorder: "rgba(255,255,255,0.1)",

    teamCardBorder: "rgba(255,255,255,0.08)",
    teamCardBg: "rgba(255,255,255,0.03)",
    teamCardHover: "rgba(255,255,255,0.05)",

    statusDotBorder: "#060b14",
    toggleIcon: "☀️",
    toggleLabel: "Light",

    payPendingGrad: "linear-gradient(135deg,#b45309,#d97706)",
    payPaidGrad: "linear-gradient(135deg,#065f46,#047857)",
    docIconBg: "rgba(239,68,68,0.12)",
    docIconBorder: "rgba(239,68,68,0.28)",
    docIconColor: "#f87171",
  },
} as const;

type ThemeTokens = typeof THEMES.light;

// ════════════════════════════════════════════════════════════════════════════════
// NAV LINKS (User Specified)
// ════════════════════════════════════════════════════════════════════════════════
const NAV_LINKS = [
  { href: "/admin", icon: "🏛️", label: "Admin" },
  { href: "/posts", icon: "✏️", label: "Posts" },
  { href: "/galary", icon: "🖼️", label: "Gallery" },
  { href: "/notifications", icon: "🔔", label: "Notifications" },
  { href: "/dashboard/profile", icon: "👤", label: "Profile" },
];

// ════════════════════════════════════════════════════════════════════════════════
// ICONS (Inline SVG from Reference)
// ════════════════════════════════════════════════════════════════════════════════
const Ico = {
  Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>,
  Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  X: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Send: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  Attach: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>,
  Pay: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
  Check: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
  DblChk: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 6 7 17 2 12" /><polyline points="22 6 11 17 7 13" /></svg>,
  Reply: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 00-4-4H4" /></svg>,
  Download: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Doc: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  Team: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  Post: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  ZoomIn: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
};

// ════════════════════════════════════════════════════════════════════════════════
// AVATAR (From Reference)
// ════════════════════════════════════════════════════════════════════════════════
function Avatar({ name, size = 40, isDark }: { name?: string | null; size?: number; isDark: boolean }) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  const grad = isDark ? "linear-gradient(135deg,#334155,#1e293b)" : "linear-gradient(135deg,#64748b,#475569)";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.18)" }}>
      {ch}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// LIGHTBOX (From Reference, adapted to user's download handler)
// ════════════════════════════════════════════════════════════════════════════════
function Lightbox({ src, name, onClose, onDownload }: { src: string; name: string; onClose: () => void; onDownload: (url: string, filename: string) => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.96)", backdropFilter: "blur(14px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "lbIn .2s ease" }}>
      <style>{`@keyframes lbIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 10 }}>
        <button onClick={e => { e.stopPropagation(); onDownload(src, name); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "9px 16px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
          <Ico.Download /> Download
        </button>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: 9, borderRadius: 8, cursor: "pointer", display: "flex" }}><Ico.X /></button>
      </div>
      <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{name}</div>
      <img src={src} alt={name} onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// GENERATED CSS (Theme-aware)
// ════════════════════════════════════════════════════════════════════════════════
function buildCss(T: ThemeTokens): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans','Noto Sans Devanagari',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}

.serif{font-family:'DM Serif Display',serif;}
.mono{font-family:'JetBrains Mono',monospace;}

/* ── NAV LINK ── */
.top-nav-link{
  display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
  font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
  transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

/* ── CHAT ROW ── */
.chat-row{
  padding:13px 14px;cursor:pointer;border-bottom:1px solid ${T.divider};
  transition:background .12s;display:flex;gap:12px;align-items:center;position:relative;
}
.chat-row:hover{background:${T.rowHover};}
.chat-row.active{background:${T.chatRowActiveBg};border-left:3px solid ${T.chatRowActiveBorder};}

/* ── FILTER PILLS ── */
.pill{
  padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;
  cursor:pointer;transition:all .15s;border:1px solid ${T.pillBorder};
  background:${T.pillBg};color:${T.pillText};text-transform:uppercase;
}
.pill:hover{border-color:${T.accent};color:${T.accent};}
.pill.on{background:${T.pillActiveBg};border-color:${T.pillActiveBorder};color:${T.pillActiveText};}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;
  font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;
  font-family:'DM Sans',sans-serif;letter-spacing:.01em;white-space:nowrap;}
.btn-p{background:${T.btnPrimary};color:${T.btnPrimaryText};}
.btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 14px ${T.btnPrimaryGlow};}
.btn-g{background:${T.btnGhostBg};color:${T.btnGhostText};border:1px solid ${T.btnGhostBorder};}
.btn-g:hover{background:${T.btnGhostHoverBg};color:${T.btnGhostHoverText};border-color:${T.accentBorder};}
.btn-d{background:${T.btnDangerBg};color:${T.btnDangerText};border:1px solid ${T.btnDangerBorder};}
.btn-d:hover{filter:brightness(.95);}
.btn-s{background:${T.btnSuccessBg};color:${T.btnSuccessText};}
.btn-s:hover{filter:brightness(1.08);}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}

/* ── INPUT ── */
.inp{
  width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
  border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
  transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}
select.inp option{background:${T.modalBg};color:${T.inputText};}

/* ── CARD ── */
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};}

/* ── SECTION HEADER (gradient) inside card ── */
.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

/* ── BUBBLE ── */
.bubble{max-width:68%;padding:10px 13px;border-radius:13px;position:relative;animation:bub .2s ease;}
.b-admin{background:${T.bubbleAdminBg};border:1px solid ${T.bubbleAdminBorder};color:${T.bubbleAdminText};border-radius:13px 13px 3px 13px;}
.b-user{background:${T.bubbleUserBg};border:1px solid ${T.bubbleUserBorder};color:${T.bubbleUserText};border-radius:13px 13px 13px 3px;}

/* ── REPLY HOVER ── */
.msgrow:hover .rep-btn{opacity:1;}
.rep-btn{opacity:0;transition:opacity .15s;}

/* ── MODAL ── */
.modal-ov{position:fixed;inset:0;background:${T.modalOverlay};backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal-bx{background:${T.modalBg};border:1px solid ${T.modalBorder};border-radius:14px;width:100%;max-width:460px;animation:pop .2s ease;box-shadow:0 30px 60px rgba(0,0,0,0.25);}

/* ── DRAG OVERLAY ── */
.drag-ov{position:absolute;inset:0;background:${T.accentLight};border:2px dashed ${T.accent};border-radius:10px;margin:12px;z-index:50;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}

/* ── DOC BUBBLE ── */
.doc-bub{display:flex;align-items:center;gap:11px;background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:9px;padding:11px 13px;margin-top:4px;}

/* ── THEME TOGGLE ── */
.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

/* ── PULSE ── */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.pulse-dot{animation:pulse 2s ease-in-out infinite;}

/* ── ANIMS ── */
@keyframes bub{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── MOBILE RESPONSIVE ── */
@media(max-width:768px){
  .hide-mobile{display:none!important;}
  .full-mobile{width:100%!important;position:absolute!important;inset:0!important;z-index:20!important;}
  .nav-links{display:none!important;}
  .mobile-back{display:flex!important;}
}
@media(min-width:769px){
  .mobile-back{display:none!important;}
  .desktop-only{display:flex!important;}
}
`;
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION HEADER COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
function SecHdr({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="sec-hdr">
      <span style={{ fontSize: "1.05rem" }}>{icon}</span>
      <span className="sec-hdr-txt">{label}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function CSCUserDashboard() {
  // DEFAULT = LIGHT theme
  const [isDark, setIsDark] = useState(false);
  const T = isDark ? THEMES.dark : THEMES.light;

  const [lang, setLang] = useState("en");
  const t = LANG[lang as "hi" | "en"] as typeof LANG["hi"];

  const [activeTab, setActiveTab] = useState("all");
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [showNew, setShowNew] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingAlert, setViewingAlert] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxName, setLightboxName] = useState<string>("");

  const [msgVal, setMsgVal] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newService, setNewService] = useState("");
  const [newPriority, setNewPriority] = useState("regular");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // ✨ Delivery & Address States
  const [deliveryMode, setDeliveryMode] = useState<"pickup" | "delivery">("pickup");
  const [urgency, setUrgency] = useState("flexible");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddr, setSelectedAddr] = useState("");
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", full: "", pin: "" });

  // Mobile view state
  const [showMobileChat, setShowMobileChat] = useState(false);

  const msgEndRef = useRef<HTMLDivElement>(null);

  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

  // ─── AUTH & INIT ─── (Preserved Exactly)
  useEffect(() => {
    if (!authLoading && !isLoggedIn) window.location.href = "/";
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (user?.preferred_lang) setLang(user.preferred_lang);
  }, [user]);

  // ─── FETCH LOGIC ─── (Preserved Exactly)
  const loadRequests = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const data = await fetchMyRequestsAction();
      const enrichedData = data.map((req: any) => ({
        ...req,
        messages: req.messages.map((m: any) => ({
          ...m,
          reply_to_msg: m.replyToId ? req.messages.find((old: any) => old.id === m.replyToId) : undefined
        }))
      }));
      setRequests(enrichedData);
      setActiveRequest(prev => {
        if (!prev) return prev;
        const updated = enrichedData.find((r: any) => r.id === prev.id);
        return updated || prev;
      });
    } catch (e) { console.error(e); }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      loadRequests();
      fetchNotificationsAction().then((data) => setNotifications(data as any));
      fetchMyAddressesAction().then(data => { setAddresses(data); if (data.length > 0) setSelectedAddr(data[0].id); });
    }
  }, [isLoggedIn, loadRequests]);

  useEffect(() => {
    const socketInstance = io();
    setSocket(socketInstance);
    return () => { socketInstance.disconnect(); };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => loadRequests();
    socket.on("refresh_queue", handleRefresh);
    return () => { socket.off("refresh_queue", handleRefresh); };
  }, [socket, loadRequests]);

  const activeReqId = activeRequest?.id;
  useEffect(() => {
    if (!activeReqId || !socket) return;
    socket.emit("join_chat", activeReqId);
    const handleNewMessage = (newMsg: any) => {
      const formattedMsg: Message = {
        id: newMsg.id,
        from: newMsg.sender_role === "user" ? "user" : "admin",
        text: newMsg.content, textEn: newMsg.content,
        time: new Date(newMsg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        date: "today", type: newMsg.message_type || "text",
        doc: (newMsg.doc_url || newMsg.file_url) ? { name: newMsg.doc_name || newMsg.file_name, size: newMsg.doc_size || newMsg.file_size, icon: "📄", url: newMsg.doc_url || newMsg.file_url } : undefined,
        amount: newMsg.payment_amount, replyToId: newMsg.reply_to_id || null,
        adminName: newMsg.users?.name, adminRole: newMsg.users?.role
      };
      setRequests(prev => prev.map(req => {
        if (req.id !== newMsg.request_id) return req;
        if (req.messages.some(m => m.id === formattedMsg.id)) return req;
        const repMsg = formattedMsg.replyToId ? req.messages.find(old => old.id === formattedMsg.replyToId) : undefined;
        formattedMsg.reply_to_msg = repMsg;
        return { ...req, messages: [...req.messages, formattedMsg] };
      }));
      setActiveRequest(prev => {
        if (!prev || prev.id !== newMsg.request_id) return prev;
        if (prev.messages.some(m => m.id === formattedMsg.id)) return prev;
        const repMsg = formattedMsg.replyToId ? prev.messages.find(old => old.id === formattedMsg.replyToId) : undefined;
        formattedMsg.reply_to_msg = repMsg;
        return { ...prev, messages: [...prev.messages, formattedMsg] };
      });
    };
    socket.on("new_message", handleNewMessage);
    return () => { socket.off("new_message", handleNewMessage); };
  }, [activeReqId, socket]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeRequest?.messages]);

  useEffect(() => {
    if (activeRequest?.status === "processing") {
      const timer = setTimeout(() => setViewingAlert(true), 3000);
      return () => clearTimeout(timer);
    }
    setViewingAlert(false);
  }, [activeRequest]);

  useEffect(() => {
    if (!socket || !user) return;
    const handleKick = () => {
      alert("Your account role has been updated by an Administrator. Please log in again.");
      logout();
    };
    socket.on(`logout_command_${user.id}`, handleKick);
    return () => { socket.off(`logout_command_${user.id}`, handleKick); };
  }, [socket, user, logout]);

  // ─── HANDLERS ─── (Preserved Exactly)
  const toggleTheme = () => {
    const newDark = !isDark; setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const toggleLanguage = async () => {
    const newLang = lang === "hi" ? "en" : "hi"; setLang(newLang);
    if (user) await updateUserProfile({ preferred_lang: newLang });
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl; link.download = filename || "download";
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); window.URL.revokeObjectURL(blobUrl);
    } catch (e) { window.open(url, '_blank'); }
  };

  const openLightbox = (url: string, name: string) => {
    setLightboxUrl(url);
    setLightboxName(name);
  };

  const handlePayment = async (messageId: string, amount: number) => {
    if (!activeRequest || !user) return;
    const loadScript = () => new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true); script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
    const res = await loadScript();
    if (!res) { alert("Razorpay SDK failed to load. Are you online?"); return; }
    try {
      const orderRes = await createRazorpayOrderAction(messageId, amount);
      if (!orderRes.success) throw new Error(orderRes.error || "Could not create order");
      if (!orderRes.order) throw new Error("Invalid order response from server");
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderRes.order.amount, currency: "INR",
        name: "CSC Shambhuganj - Shrilal Yadav",
        description: `Payment for ${activeRequest.title}`,
        order_id: orderRes.order.id,
        prefill: { name: user.name || "", contact: user.mobile || "", email: user.email || "" },
        theme: { color: "#1d4ed8" },
        handler: async function (response: any) {
          try {
            await verifyRazorpayPaymentAction(messageId, activeRequest.id, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
            alert("Payment Successful! Your request is now processing.");
            loadRequests(); socket?.emit("trigger_queue_refresh");
          } catch (err) { alert("Payment Verification Failed!"); }
        },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) { alert(err.message); }
  };

  const sendMessage = async () => {
    if (!activeRequest || !user) return;
    if (!msgVal.trim() && attachedFiles.length === 0) return;
    setIsSending(true);
    const replyId = replyingTo?.id ? String(replyingTo.id) : undefined;
    const textToSend = msgVal.trim();
    try {
      const uploadedDocs = [];
      for (const file of attachedFiles) {
        const formData = new FormData();
        formData.append("file", file); formData.append("requestId", activeRequest.id);
        const uploadResult = await uploadChatFileAction(formData);
        if (!uploadResult.success) throw new Error(uploadResult.error);
        uploadedDocs.push({ name: uploadResult.name, url: uploadResult.url, size: formatBytes(file.size) });
      }
      if (textToSend) {
        await sendChatMessageAction(activeRequest.id, textToSend, undefined, undefined, undefined, replyId);
        const msgPayload = { id: `temp-${Date.now()}`, request_id: activeRequest.id, sender_id: user.id, sender_role: "user", message_type: "text", content: textToSend, reply_to_id: replyId || null, created_at: new Date().toISOString(), users: { name: user.name } };
        socket?.emit("send_message", msgPayload); socket?.emit("trigger_queue_refresh");
      }
      for (const doc of uploadedDocs) {
        await sendChatMessageAction(activeRequest.id, "", doc.url, doc.name, doc.size, replyId);
        const docPayload = { id: `temp-${Date.now()}-${Math.random()}`, request_id: activeRequest.id, sender_id: user.id, sender_role: "user", message_type: "doc", doc_name: doc.name, doc_url: doc.url, doc_size: doc.size, file_name: doc.name, file_url: doc.url, file_size: doc.size, reply_to_id: replyId || null, created_at: new Date().toISOString(), users: { name: user.name } };
        socket?.emit("send_message", docPayload); socket?.emit("trigger_queue_refresh");
      }
      setMsgVal(""); setAttachedFiles([]); setReplyingTo(null);
    } catch (err: any) { alert("Failed to send message: " + err.message); }
    finally { setIsSending(false); }
  };

  const submitNewRequest = async () => {
    if (!newTitle || !newService) return;
    if (deliveryMode === 'delivery' && !selectedAddr) { alert("Please select a delivery address."); return; }
    try {
      await createRequestAction({
        service: newService, title: newTitle, desc: newDesc, priority: newPriority,
        delivery_type: deliveryMode, urgency: deliveryMode === 'delivery' ? urgency : undefined,
        address_id: deliveryMode === 'delivery' ? selectedAddr : undefined
      });
      loadRequests(); socket?.emit("trigger_queue_refresh");
      setShowNew(false); setNewTitle(""); setNewDesc(""); setNewService(""); setNewPriority("regular"); setUploadedFiles([]);
    } catch (error) { alert("Failed to submit request."); }
  };

  const unreadNotifsCount = notifications.filter(n => !n.is_read).length;
  const filtered = requests.filter(r => {
    if (activeTab !== "all" && r.status !== activeTab) return false;
    const q = searchVal.toLowerCase();
    if (q) {
      if (!(r.title || "").toLowerCase().includes(q) && !(r.titleEn || "").toLowerCase().includes(q) && !(r.displayId || r.id || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s", fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

      {lightboxUrl && (
        <Lightbox src={lightboxUrl} name={lightboxName} onClose={() => setLightboxUrl(null)} onDownload={handleDownload} />
      )}

      {/* ════════════════════════════════════════════════════════
          HEADER — navy indigo in both themes
      ════════════════════════════════════════════════════════ */}
      <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Mobile menu + Brand */}
          <button onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 20, padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>☰</button>

          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
            <div>
              <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
                Shrilal<span style={{ color: T.navBrandAccent }}>CSC</span>
              </div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>USER PORTAL</div>
            </div>
          </a>

          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

          {/* Nav links */}
          <nav className="nav-links" style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="top-nav-link">
                <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {/* Language Toggle */}
            <button onClick={toggleLanguage} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "5px 12px", fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}>
              {lang === "hi" ? "EN" : "हि"}
            </button>

            {/* Theme Toggle */}
            <button className="tog" onClick={toggleTheme}>
              <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
            </button>

            {/* Notifications */}
            <button style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, transition: "all 0.2s", position: "relative" }}
              onClick={() => { setNotifOpen(true); if (unreadNotifsCount > 0) { setNotifications(prev => prev.map(n => ({ ...n, is_read: true }))); markNotificationsReadAction(); } }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}>
              🔔
              {unreadNotifsCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>{unreadNotifsCount}</span>
              )}
            </button>

            {/* User chip */}
            <div onClick={() => setSidebarOpen(true)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px 5px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}>
              <Avatar name={user?.name} size={28} isDark={isDark} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{user?.name?.split(" ")[0] || "User"}</div>
                <div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>CITIZEN</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          BODY
      ════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* ─── REQUEST LIST SIDEBAR ─── */}
        <div className={`${showMobileChat ? 'hide-mobile' : ''}`} style={{ width: 360, borderRight: `1px solid ${T.divider}`, display: "flex", flexDirection: "column", background: T.sidebarBg, flexShrink: 0, overflow: "hidden", boxShadow: isDark ? "none" : "2px 0 8px rgba(0,0,0,0.04)" }}>

          {/* Sidebar header */}
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.divider}`, background: T.sidebarHeaderBg, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.inputPlaceholder }}><Ico.Search /></span>
                <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder={t.search}
                  className="inp" style={{ paddingLeft: 33, fontSize: 13 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {["all", "pending", "processing", "done"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pill ${activeTab === tab ? "on" : ""}`}>
                  {tab === "all" ? t.all : tab === "pending" ? t.pending : tab === "processing" ? t.processing : t.done}
                </button>
              ))}
            </div>
          </div>

          {/* Request rows */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: T.textMuted, fontSize: 13 }}>
                <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>📭</div>
                <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 600 }}>{t.noRequests}</div>
                <button onClick={() => setShowNew(true)} style={{ background: "none", border: "none", color: T.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>{t.startNew}</button>
              </div>
            ) : filtered.map((req) => {
              const sc = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
              if (!sc) return null;
              const isActive = activeRequest?.id === req.id;
              const icon = req.service.includes("आधार") || req.service.includes("Aadhaar") ? "🪪" : req.service.includes("किसान") || req.service.includes("Kisan") ? "🌾" : req.service.includes("छात्र") || req.service.includes("Scholar") ? "🎓" : "📋";
              return (
                <div key={req.id} className={`chat-row ${isActive ? "active" : ""}`}
                  onClick={() => { setActiveRequest(req as any); setRequests(prev => prev.map(r => r.id === req.id ? { ...r, unread: 0 } : r) as any); setShowMobileChat(true); }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: isActive ? T.accentLight : T.inputBg, border: `2px solid ${isActive ? T.accent : T.divider}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "all 0.2s" }}>{icon}</div>
                    {req.status === "pending" && <span className="pulse-dot" style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: sc.color, border: `2px solid ${T.sidebarBg}` }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lang === "hi" ? req.title : req.titleEn}</span>
                      <span style={{ fontSize: 11, color: T.textMuted, flexShrink: 0, marginLeft: 8 }}>{req.lastTime}</span>
                    </div>
                    <div style={{ fontSize: 12, color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>
                      {lang === "hi" ? req.lastMsg : req.lastMsgEn}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20, fontSize: "0.65rem", fontWeight: 700, border: "1.5px solid", textTransform: "uppercase", letterSpacing: "0.04em", background: isDark ? sc.bgDark : sc.bg, color: sc.color, borderColor: isDark ? sc.borderDark : sc.border }}>
                        {sc.icon} {lang === "hi" ? sc.label : sc.labelEn}
                      </span>
                      {req.unread > 0 && <span style={{ minWidth: 20, height: 20, borderRadius: 10, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{req.unread}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAB */}
          <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.divider}`, background: T.sidebarHeaderBg, flexShrink: 0 }}>
            <button onClick={() => setShowNew(true)} className="btn btn-p" style={{ width: "100%", justifyContent: "center", borderRadius: 9, padding: "10px" }}>
              <Ico.Plus /> {t.newRequest}
            </button>
          </div>
        </div>

        {/* ─── CHAT PANEL ─── */}
        {activeRequest ? (
          <div className={`${!showMobileChat ? 'hide-mobile' : 'full-mobile'}`} style={{ flex: 1, display: "flex", flexDirection: "column", background: T.chatBg, position: "relative" }}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files) setAttachedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}>

            {isDragOver && (
              <div className="drag-ov">
                <div style={{ textAlign: "center", color: T.accent }}>
                  <div style={{ fontSize: 38, marginBottom: 8 }}>📎</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Drop files to attach</div>
                </div>
              </div>
            )}

            {/* Chat header */}
            <div style={{ background: isDark ? "rgba(6,11,20,0.98)" : T.cardBg, borderBottom: `1px solid ${T.divider}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, zIndex: 10, boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Mobile back button */}
                <button className="mobile-back" onClick={() => { setShowMobileChat(false); setActiveRequest(null); }} style={{ background: "none", border: "none", color: T.textPrimary, cursor: "pointer", fontSize: 20, padding: 4, display: "none" }}>
                  ←
                </button>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: isDark ? "rgba(245,158,11,0.12)" : T.accentLight, border: `2px solid ${isDark ? T.accentBorder : T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {activeRequest.service.includes("आधार") || activeRequest.service.includes("Aadhaar") ? "🪪" : activeRequest.service.includes("किसान") ? "🌾" : activeRequest.service.includes("छात्र") ? "🎓" : "📋"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lang === "hi" ? activeRequest.title : activeRequest.titleEn}</div>
                  <div style={{ fontSize: 11, color: T.textSecondary, fontWeight: 600, marginTop: 2 }}>
                    <span style={{ background: isDark ? "rgba(245,158,11,0.15)" : T.accentLight, color: T.accent, padding: "1px 7px", borderRadius: 5, fontSize: 10, fontWeight: 700, marginRight: 6 }}>{(activeRequest as any).displayId || activeRequest.id.split('-')[0].toUpperCase()}</span>
                    {activeRequest.service}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {activeRequest.resolvedBy && (
                  <div style={{ fontSize: 11, color: "#15803d", background: isDark ? "rgba(21,128,61,0.15)" : "#f0fdf4", border: `1px solid ${isDark ? "rgba(21,128,61,0.3)" : "#86efac"}`, borderRadius: 8, padding: "4px 10px", fontWeight: 700, display: "none" }} className="desktop-only">
                    ✅ {t.resolvedBy}: {activeRequest.resolvedBy.name}
                  </div>
                )}

                {/* ✨ ZOMATO STYLE LIVE TRACKING BANNER ✨ */}
                {activeRequest?.deliveryStatus === 'out_for_delivery' && (
                  <div onClick={() => window.open(`/status?q=${activeRequest.id}`, "_blank")}
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", animation: "fadeUp 0.3s ease", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 20 }}>🛵</span> {lang === 'hi' ? 'आपका दस्तावेज़ रास्ते में है!' : 'Your document is out for delivery!'}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800, backdropFilter: "blur(4px)" }}>
                      {t.trackLive}
                    </div>
                  </div>
                )}
                <button onClick={() => setShowTimeline(true)} className="btn btn-g" style={{ fontSize: 12, padding: "7px 11px" }} title="Activity">📋</button>
              </div>
            </div>

            {/* Viewing banner */}
            {viewingAlert && (
              <div style={{ background: isDark ? "rgba(21,128,61,0.12)" : "#f0fdf4", borderBottom: `2px solid ${isDark ? "rgba(21,128,61,0.3)" : "#86efac"}`, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: isDark ? "#4ade80" : "#15803d", animation: "fadeUp 0.3s ease", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.2s infinite", flexShrink: 0 }} />
                <span>{activeRequest?.messages?.find(m => m.from === "admin")?.adminName || "An Operator"} {t.viewingDoc}</span>
                <button onClick={() => setViewingAlert(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 14, padding: "0 4px" }}>✕</button>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 4, backgroundImage: T.chatPattern, backgroundSize: "28px 28px" }}>
              {activeRequest.messages.map((msg: Message, idx: number) => {
                const isUser = msg.from === "user";
                const prevMsg = activeRequest.messages[idx - 1];
                const showDate = !prevMsg || prevMsg.date !== msg.date;
                const showSender = !isUser && (!prevMsg || prevMsg.from === "user" || prevMsg.adminName !== msg.adminName);
                const isImage = msg.doc?.name?.match(/\.(jpeg|jpg|gif|png|webp)$/i) && msg.doc?.url;

                return (
                  <div key={msg.id} className="msgrow" style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", marginBottom: 8, animation: "fadeUp 0.2s ease" }}>
                    {showDate && (
                      <div style={{ textAlign: "center", margin: "14px 0", width: "100%" }}>
                        <span style={{ display: "inline-block", background: isDark ? "rgba(245,158,11,0.12)" : "rgba(30,58,138,0.08)", border: `1px solid ${isDark ? T.accentBorder : T.accentBorder}`, borderRadius: 20, padding: "3px 14px", fontSize: 11, color: isDark ? T.accent : T.accent, fontWeight: 600, letterSpacing: "0.03em" }}>
                          {msg.date === "today" ? t.today : t.yesterday}
                        </span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: isUser ? "row-reverse" : "row" }}>
                      {!isUser && (
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: isDark ? "rgba(245,158,11,0.12)" : T.accentLight, border: `1.5px solid ${isDark ? T.accentBorder : T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: T.accent, flexShrink: 0, marginBottom: 2 }}>
                          {msg.adminName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2) || "OP"}
                        </div>
                      )}
                      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                        {!isUser && showSender && (
                          <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, marginBottom: 3, paddingLeft: 4 }}>{msg.adminName} · <span style={{ color: T.textMuted }}>{msg.adminRole}</span></div>
                        )}
                        <div className={`bubble ${isUser ? "b-user" : "b-admin"}`} style={{ padding: msg.type === "doc" || isImage ? "6px" : "10px 14px 6px" }}>

                          {/* Reply preview */}
                          {msg.reply_to_msg && (
                            <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(30,58,138,0.06)", borderLeft: `3px solid ${T.accent}`, borderRadius: "0 6px 6px 0", padding: "6px 10px", marginBottom: 8, cursor: "pointer" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 2 }}>{msg.reply_to_msg.from === "user" ? "You" : msg.reply_to_msg.adminName || "Admin"}</div>
                              <div style={{ fontSize: 12, color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                                {msg.reply_to_msg.text || (msg.reply_to_msg.type === "doc" ? "📄 Document" : "💳 Payment")}
                              </div>
                            </div>
                          )}

                          {/* Payment */}
                          {msg.type === "payment" ? (
                            <div style={{ minWidth: 230, background: msg.paymentStatus === "paid" ? T.payPaidGrad : T.payPendingGrad, borderRadius: 11, padding: "16px 18px", margin: "-10px -13px", color: "#fff", position: "relative", overflow: "hidden" }}>
                              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {msg.paymentStatus === "paid" ? <Ico.Check /> : <Ico.Pay />}
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 600 }}>{msg.paymentStatus === "paid" ? "Payment Received" : "Payment Required"}</div>
                                  <div className="mono" style={{ fontSize: 22, fontWeight: 800 }}>{fmtCurrency(msg.amount || 0)}</div>
                                </div>
                              </div>
                              {msg.paymentStatus !== "paid" && <p style={{ fontSize: 11, opacity: 0.85, marginBottom: 12 }}>Secure payment powered by Razorpay</p>}
                              <button className="btn" style={{ width: "100%", padding: 12, border: "none", borderRadius: 10, background: msg.paymentStatus === "paid" ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: msg.paymentStatus === "paid" ? "default" : "pointer", fontFamily: "inherit", boxShadow: msg.paymentStatus === "paid" ? "0 4px 12px rgba(21,128,61,0.3)" : "0 4px 12px rgba(245,158,11,0.3)" }}
                                onClick={() => msg.paymentStatus !== "paid" && handlePayment(String(msg.id), msg.amount || 0)} disabled={msg.paymentStatus === "paid"}>
                                {msg.paymentStatus === "paid" ? (<>✅ Amount Received</>) : (<>💳 {t.payNow} via Razorpay</>)}
                              </button>
                            </div>
                          ) : msg.type === "doc" && msg.doc ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "4px" }}>
                              {isImage ? (
                                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", cursor: "pointer", display: "inline-block", maxWidth: 260 }} onClick={() => openLightbox(msg.doc!.url!, msg.doc!.name)}>
                                  <img src={msg.doc.url} alt="attachment" style={{ width: "100%", maxHeight: 340, objectFit: "cover", objectPosition: "top center", display: "block", borderRadius: 8 }} />
                                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.5))", borderRadius: 8 }} />
                                  <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 6 }}>
                                    <button onClick={(e) => { e.stopPropagation(); openLightbox(msg.doc!.url!, msg.doc!.name); }} style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "4px 10px", color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>🔍 View</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDownload(msg.doc!.url!, msg.doc!.name); }} style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "4px 10px", color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>⬇ Save</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="doc-bub" onClick={() => msg.doc?.url && handleDownload(msg.doc.url, msg.doc.name)} style={{ cursor: "pointer" }}>
                                  <div style={{ width: 36, height: 36, borderRadius: 8, background: T.docIconBg, border: `1px solid ${T.docIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.docIconColor }}><Ico.Doc /></div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.textPrimary }}>{msg.doc.name}</div>
                                    <div style={{ fontSize: 11, color: T.textMuted }}>{msg.doc.size}</div>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); handleDownload(msg.doc?.url || "", msg.doc?.name || "file"); }} style={{ background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary, cursor: "pointer", padding: "6px 10px", borderRadius: 7, fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>⬇</button>
                                </div>
                              )}
                              {msg.text && <span style={{ fontSize: 13, color: T.textPrimary, paddingLeft: 4, paddingTop: 2 }}>{lang === "hi" ? msg.text : (msg.textEn || msg.text)}</span>}
                            </div>
                          ) : (
                            <div style={{ fontSize: 14, lineHeight: 1.6, color: isUser ? T.bubbleUserText : T.bubbleAdminText, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{lang === "hi" ? msg.text : (msg.textEn || msg.text)}</div>
                          )}

                          {/* Timestamp */}
                          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: msg.type === "payment" ? 0 : 4, paddingTop: msg.type === "payment" ? 0 : 2 }}>
                            <span style={{ fontSize: 10, color: T.bubbleMeta, fontWeight: 600 }}>{msg.time}</span>
                            {isUser && <span style={{ fontSize: 11, color: msg.status === "seen" ? "#3b82f6" : T.bubbleMeta }}>✓✓</span>}
                          </div>
                        </div>

                        {/* Reply button */}
                        <button className="rep-btn" onClick={() => setReplyingTo(msg)} title="Reply" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: "2px 6px", color: T.textMuted, fontFamily: "inherit", marginTop: 2 }}>
                          ↩ Reply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={msgEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ background: isDark ? "rgba(6,11,20,0.98)" : T.cardBg, borderTop: `1px solid ${T.divider}`, padding: "10px 14px", flexShrink: 0, boxShadow: isDark ? "none" : "0 -1px 6px rgba(0,0,0,0.05)" }}>
              {/* Reply bar */}
              {replyingTo && (
                <div style={{ background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, border: `2px solid ${isDark ? T.accentBorder : T.accentBorder}`, borderRadius: "10px 10px 0 0", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottom: "none" }}>
                  <div style={{ fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: T.accent, marginBottom: 2 }}>↩ {lang === "hi" ? "जवाब दे रहे हैं:" : "Replying to"} <span style={{ color: T.textPrimary }}>{replyingTo.from === "user" ? "You" : "Admin"}</span></div>
                    <div style={{ color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{replyingTo.text || (replyingTo.type === "doc" ? "📄 Document" : "💳 Payment")}</div>
                  </div>
                  <button onClick={() => setReplyingTo(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 18, padding: "0 4px" }}>✕</button>
                </div>
              )}

              {/* Attached files */}
              {attachedFiles.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  {attachedFiles.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, border: `1px solid ${isDark ? T.accentBorder : T.accentBorder}`, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: T.accent }}>
                      <span>📎</span><span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(f as File).name}</span>
                      <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <button className="btn btn-g" style={{ padding: "7px 11px", fontSize: 12 }} onClick={() => { const el = document.createElement("input"); el.type = "file"; el.multiple = true; el.onchange = e => setAttachedFiles(Array.from((e.target as HTMLInputElement).files || [])); el.click(); }} title={t.attach}>
                  <Ico.Attach />
                </button>
                <textarea className="inp" rows={1} value={msgVal}
                  onChange={e => { setMsgVal(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={t.typeMsg} style={{ resize: "none", maxHeight: 100, lineHeight: 1.5, fontSize: 14 }} />
                <button className="btn btn-p" onClick={sendMessage} disabled={isSending || (!msgVal.trim() && attachedFiles.length === 0)} style={{ width: 46, height: 46, borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isSending
                    ? <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "block" }} />
                    : <Ico.Send />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: T.textMuted }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, border: `2px solid ${isDark ? T.accentBorder : T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📬</div>
            <div className="serif" style={{ fontSize: 20, color: T.textPrimary }}>Select a request to start chatting</div>
            <div style={{ fontSize: 13, color: T.textMuted }}>{lang === "hi" ? "या नया आवेदन शुरू करें" : "or start a new one below"}</div>
            <button onClick={() => setShowNew(true)} className="btn btn-p" style={{ padding: "11px 28px", fontSize: 14 }}>✏️ {t.newRequest}</button>
          </div>
        )}

        {/* ─── TIMELINE PANEL ─── */}
        {showTimeline && activeRequest && (
          <div style={{ width: 300, borderLeft: `1px solid ${T.divider}`, background: T.sidebarBg, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", zIndex: 100, position: "absolute", right: 0, height: "100%", boxShadow: "-4px 0 20px rgba(0,0,0,0.12)", animation: "slideInR 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ padding: "14px 18px", borderBottom: `2px solid ${T.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.sidebarBg }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: T.textPrimary }}>📋 {t.timeline}</div>
              <button onClick={() => setShowTimeline(false)} className="btn btn-g" style={{ padding: "6px 9px", fontSize: 12 }}><Ico.X /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px" }}>
              {activeRequest.timeline.map((ev: TimelineEvent, i: number) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 22 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, background: i === activeRequest.timeline.length - 1 ? T.btnPrimary : T.inputBg, border: `2px solid ${i === activeRequest.timeline.length - 1 ? T.accent : T.divider}`, color: i === activeRequest.timeline.length - 1 ? "#fff" : T.textMuted }}>
                      <span style={{ fontSize: 13 }}>{TIMELINE_ICONS[ev.event as keyof typeof TIMELINE_ICONS] || "📌"}</span>
                    </div>
                    {i < activeRequest.timeline.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${T.accent}44,${T.divider})`, marginTop: 4, minHeight: 20, borderRadius: 1 }} />}
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{lang === "hi" ? (ev.event === "submitted" ? "जमा किया गया" : ev.event === "seen" ? "देखा गया" : ev.event === "processing" ? "प्रक्रिया शुरू" : "पूर्ण") : ev.eventEn}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, fontWeight: 600 }}>{lang === "hi" ? ev.time : ev.timeEn}</div>
                  </div>
                </div>
              ))}
              {activeRequest.status !== "done" && (
                <div style={{ display: "flex", gap: 14, opacity: 0.35 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${T.divider}` }}><span style={{ fontSize: 13 }}>✅</span></div>
                  <div style={{ paddingTop: 6 }}><div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{lang === "hi" ? "पूर्ण" : "Completed"}</div><div style={{ fontSize: 11, color: T.textMuted }}>{lang === "hi" ? "जल्द आएगा" : "Coming soon"}</div></div>
                </div>
              )}
            </div>
            {/* Status + pay */}
            <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.divider}` }}>
              {(() => {
                const sc = STATUS_CONFIG[activeRequest.status as keyof typeof STATUS_CONFIG]; return (
                  <div style={{ background: isDark ? sc.bgDark : sc.bg, border: `1.5px solid ${isDark ? sc.borderDark : sc.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{sc.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, color: sc.color, fontWeight: 800 }}>{lang === "hi" ? sc.label : sc.labelEn}</div>
                      <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600 }}>{(activeRequest as any).displayId || activeRequest.id.split('-')[0].toUpperCase()}</div>
                    </div>
                  </div>
                );
              })()}
              {(() => {
                const unpaidMsg = activeRequest.messages.find(m => m.type === "payment" && m.paymentStatus !== "paid");
                if (unpaidMsg) return (
                  <button className="btn btn-p" style={{ width: "100%", justifyContent: "center" }} onClick={() => handlePayment(String(unpaidMsg.id), unpaidMsg.amount || 0)}>
                    💳 {t.payNow} — {fmtCurrency(unpaidMsg.amount || 0)}
                  </button>
                );
                return null;
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          NEW REQUEST MODAL
      ════════════════════════════════════════════════════════ */}
      {showNew && (
        <div className="modal-ov" onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
          <div className="modal-bx" style={{ maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "17px 22px", borderBottom: `1px solid ${T.divider}` }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Serif Display', serif" }}>✏️ {t.newRequest}</div>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 18 }}><Ico.X /></button>
            </div>
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.serviceType} *</span>
                <select value={newService} onChange={e => setNewService(e.target.value)} className="inp" style={{ appearance: "none", cursor: "pointer" }}>
                  <option value="">{lang === "hi" ? "सेवा चुनें..." : "Select service..."}</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.requestTitle} *</span>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={lang === "hi" ? "जैसे: आधार में नाम सुधार" : "e.g. Name correction in Aadhaar"} className="inp" />
              </div>
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.requestDesc}</span>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={lang === "hi" ? "पूरी जानकारी लिखें..." : "Write details here..."} className="inp" rows={3} style={{ resize: "vertical", lineHeight: 1.6 }} />
              </div>
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.priority}</span>
                <div style={{ display: "flex", gap: 10 }}>
                  {["regular", "prepaid"].map(p => (
                    <button key={p} onClick={() => setNewPriority(p)}
                      style={{ flex: 1, padding: "12px 10px", borderRadius: 12, border: `2px solid ${newPriority === p ? T.accent : T.divider}`, cursor: "pointer", textAlign: "center", transition: "all 0.2s", fontFamily: "inherit", background: newPriority === p ? T.accentLight : "transparent", color: newPriority === p ? T.accent : T.textMuted, fontWeight: newPriority === p ? 700 : 500 }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{p === "regular" ? "🕐" : "⚡"}</div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{p === "regular" ? t.regular : t.prepaid}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.uploadDoc}</span>
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)}
                  onDrop={e => { e.preventDefault(); setIsDragOver(false); setUploadedFiles(Array.from((e.dataTransfer as DataTransfer).files)); }}
                  onClick={() => { const el = document.createElement("input"); el.type = "file"; el.multiple = true; el.accept = ".pdf,.jpg,.jpeg,.png,.webp"; el.onchange = (event) => { const target = event.target as HTMLInputElement; setUploadedFiles(Array.from(target.files || [])); }; el.click(); }}
                  style={{ border: `2px dashed ${isDragOver ? T.accent : T.divider}`, borderRadius: 12, padding: 24, textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: isDragOver ? T.accentLight : "transparent" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                  <div style={{ fontSize: 13, color: T.textSecondary, fontWeight: 600 }}>{t.dragDrop}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>PDF, JPG, PNG up to 10MB</div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="doc-bub">
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: T.docIconBg, border: `1px solid ${T.docIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.docIconColor }}><Ico.Doc /></div>
                        <span style={{ flex: 1, fontSize: 13, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                        <button onClick={e => { e.stopPropagation(); setUploadedFiles(prev => prev.filter((_, j) => j !== i)); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 16 }}><Ico.X /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* ✨ E-COMMERCE DELIVERY SECTION ✨ */}
              <div style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", border: `1px solid ${T.divider}`, borderRadius: 12, padding: 16 }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>{t.deliveryOpt}</span>
                <div style={{ display: "flex", gap: 10, marginBottom: deliveryMode === 'delivery' ? 16 : 0 }}>
                  {(['pickup', 'delivery'] as const).map(mode => (
                    <button key={mode} onClick={() => setDeliveryMode(mode)}
                      style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1.5px solid ${deliveryMode === mode ? T.accent : T.divider}`, background: deliveryMode === mode ? T.accentLight : "transparent", color: deliveryMode === mode ? T.accent : T.textMuted, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>
                      {mode === 'pickup' ? `🏪 ${t.pickup}` : `🛵 ${t.homeDelivery}`}
                    </button>
                  ))}
                </div>

                {deliveryMode === 'delivery' && (
                  <div style={{ animation: "fadeUp 0.2s ease" }}>
                    {/* Urgency */}
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{t.urgency}</span>
                      <select value={urgency} onChange={e => setUrgency(e.target.value)} className="inp" style={{ appearance: "none", cursor: "pointer" }}>
                        <option value="flexible">🟢 {t.flex}</option>
                        <option value="today">🟡 {t.today}</option>
                        <option value="instant">🔴 {t.instant}</option>
                      </select>
                    </div>

                    {/* Address Selection */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.selectAddr} *</span>
                        {!showAddAddr && <button onClick={() => setShowAddAddr(true)} style={{ background: "none", border: "none", color: T.accent, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{t.addAddr}</button>}
                      </div>
                      
                      {showAddAddr ? (
                        <div style={{ border: `1px solid ${T.accentBorder}`, padding: 12, borderRadius: 8, background: isDark ? "rgba(245,158,11,0.05)" : "#fff" }}>
                          <input placeholder={t.addrLabel} className="inp" style={{ marginBottom: 8, padding: 8, fontSize: 13 }} value={newAddr.label} onChange={e => setNewAddr({...newAddr, label: e.target.value})} />
                          <textarea placeholder={t.addrText} className="inp" style={{ marginBottom: 8, padding: 8, fontSize: 13 }} rows={2} value={newAddr.full} onChange={e => setNewAddr({...newAddr, full: e.target.value})} />
                          <input placeholder={t.pin} className="inp" style={{ marginBottom: 8, padding: 8, fontSize: 13 }} value={newAddr.pin} onChange={e => setNewAddr({...newAddr, pin: e.target.value})} />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-g" style={{ flex: 1 }} onClick={() => setShowAddAddr(false)}>{t.cancel}</button>
                            <button className="btn btn-p" style={{ flex: 1 }} disabled={!newAddr.label || !newAddr.full} onClick={async () => { 
                              try {
                                const adr = await addAddressAction({ label: newAddr.label, full_address: newAddr.full, pincode: newAddr.pin });
                                setAddresses([adr, ...addresses]); setSelectedAddr(adr.id); setShowAddAddr(false); setNewAddr({label: "", full: "", pin: ""});
                              } catch(e) { alert("Failed to save address"); }
                            }}>{t.saveAddr}</button>
                          </div>
                        </div>
                      ) : (
                        <select value={selectedAddr} onChange={e => setSelectedAddr(e.target.value)} className="inp" style={{ appearance: "none", cursor: "pointer" }}>
                          <option value="">{t.selectAddr}</option>
                          {addresses.map(a => <option key={a.id} value={a.id}>{a.label} - {a.full_address}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={submitNewRequest} disabled={!newTitle || !newService || (deliveryMode === 'delivery' && !selectedAddr)} className="btn btn-p" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>{t.submitRequest} →</button>
              {/* <button onClick={submitNewRequest} disabled={!newTitle || !newService} className="btn btn-p" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>
                {t.submitRequest} →
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          SIDEBAR PANEL
      ════════════════════════════════════════════════════════ */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div style={{ width: 280, background: T.sidebarBg, height: "100%", padding: 0, display: "flex", flexDirection: "column", animation: "slideInL 0.3s cubic-bezier(0.34,1.56,0.64,1)", borderRight: `1px solid ${T.divider}`, boxShadow: "4px 0 20px rgba(0,0,0,0.15)", overflow: "hidden" }}>
            <div style={{ background: T.sectionGrad, padding: "24px 20px 20px", borderBottom: `2px solid ${T.accentBorder}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20, border: "2px solid rgba(255,255,255,0.3)" }}>
                  {user?.name ? user.name[0].toUpperCase() : "👤"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{user?.name || (lang === "hi" ? "उपयोगकर्ता" : "User")}</div>
                  <div style={{ fontSize: 12, color: T.navBrandAccent }}>{user?.mobile ? `+91 ${user.mobile}` : user?.email}</div>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.wallet}</div>
                  <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>₹ {user?.wallet_balance || 0}</div>
                </div>
                <button style={{ background: T.accent, border: "none", borderRadius: 9, color: "#fff", fontSize: 12, fontWeight: 700, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit" }}>+ Add</button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {[
                { icon: "📋", label: t.myRequests, action: () => { window.location.href = "/dashboard"; setSidebarOpen(false); } },
                { icon: "📝", label: "Posts", action: () => { window.location.href = "/admin/posts"; } },
                { icon: "🖼️", label: "Gallery", action: () => { window.location.href = "/gallery"; } },
                { icon: "🔔", label: t.notifications, action: () => { window.location.href = "/notifications"; } },
                { icon: "📊", label: "Status", action: () => { window.location.href = "/status"; } },
                { icon: "👤", label: t.profile, action: () => { window.location.href = "/dashboard/profile"; } },
              ].map(({ icon, label, action }) => (
                <button key={label} onClick={action}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: T.textPrimary, fontSize: 14, fontFamily: "inherit", transition: "all 0.15s", borderLeft: "3px solid transparent" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.rowHover; e.currentTarget.style.borderLeftColor = T.accent; e.currentTarget.style.color = T.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.color = T.textPrimary; }}>
                  <span style={{ fontSize: 18 }}>{icon}</span><span style={{ fontWeight: 600 }}>{label}</span>
                </button>
              ))}
              <div style={{ height: 1, background: T.divider, margin: "8px 16px" }} />
              <button onClick={() => logout()}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: "#ef4444", fontSize: 14, fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.btnDangerBg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize: 18 }}>🚪</span>{t.logout}
              </button>
            </div>
          </div>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          NOTIFICATIONS PANEL
      ════════════════════════════════════════════════════════ */}
      {notifOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ flex: 1 }} onClick={() => setNotifOpen(false)} />
          <div style={{ width: 360, background: T.sidebarBg, height: "100%", display: "flex", flexDirection: "column", animation: "slideInR 0.3s cubic-bezier(0.34,1.56,0.64,1)", borderLeft: `1px solid ${T.divider}`, boxShadow: "-4px 0 20px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "16px 20px", borderBottom: `2px solid ${T.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.sidebarBg }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: T.textPrimary }}>🔔 {t.notifications}</div>
                {unreadNotifsCount > 0 && <div style={{ fontSize: 11, color: T.textMuted }}>{unreadNotifsCount} unread</div>}
              </div>
              <button onClick={() => setNotifOpen(false)} className="btn btn-g" style={{ padding: "6px 9px", fontSize: 12 }}><Ico.X /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: T.textMuted }}>
                  <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>🔔</div>
                  <div style={{ fontWeight: 600 }}>{lang === "hi" ? "कोई नई सूचना नहीं" : "No new notifications"}</div>
                </div>
              ) : notifications.map((n) => (
                <div key={n.id} style={{ padding: "14px 18px", borderBottom: `1px solid ${T.divider}`, display: "flex", gap: 12, cursor: "pointer", transition: "background 0.15s", background: n.is_read ? "transparent" : (isDark ? "rgba(245,158,11,0.05)" : "rgba(30,58,138,0.04)"), animation: "fadeUp 0.3s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.rowHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = n.is_read ? "transparent" : (isDark ? "rgba(245,158,11,0.05)" : "rgba(30,58,138,0.04)"))}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? "rgba(245,158,11,0.08)" : T.accentLight, border: `1.5px solid ${isDark ? T.accentBorder : T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                    {n.type === "document_viewed" ? "👁️" : n.type === "status_changed" ? "⚙️" : n.type === "payment_request" ? "💳" : "🔔"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: n.is_read ? 500 : 700, color: T.textPrimary, lineHeight: 1.4 }}>{lang === "hi" ? (n.title_hi || n.title) : n.title}</div>
                    <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 2, lineHeight: 1.5 }}>{lang === "hi" ? (n.body_hi || n.body) : n.body}</div>
                    <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4, fontWeight: 600 }}>{new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, alignSelf: "center", flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideInR{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes slideInL{from{transform:translateX(-100%)}to{transform:translateX(0)}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}