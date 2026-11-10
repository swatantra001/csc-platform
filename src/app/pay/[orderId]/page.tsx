// "use client";
// // app/pay/[orderId]/page.tsx
// // Razorpay Payment Page
// // Design: Railway reservation challan — trust-first, ink-stamped, physical receipt feel

// import { useState, useEffect, useRef } from "react";

// // ── Types ──────────────────────────────────────────────────────────────────
// type Lang = "hi" | "en";
// type PayStatus = "idle" | "loading" | "processing" | "success" | "failed";

// interface PaymentOrder {
//   orderId: string;
//   requestId: string;
//   service: string;
//   serviceHi: string;
//   amount: number;
//   userName: string;
//   mobile: string;
//   adminNote: string;
//   adminNoteHi: string;
//   createdBy: string;
//   expiresAt: string;
// }

// interface ReceiptData {
//   receiptNo: string;
//   paidAt: string;
//   paymentId: string;
//   amount: number;
//   method: string;
// }

// // ── Mock order (replace with API fetch using orderId param) ────────────────
// const MOCK_ORDER: PaymentOrder = {
//   orderId:     "order_PkXmN9Qa2Bv7Ry",
//   requestId:   "REQ-2025-003",
//   service:     "UP Scholarship Form 2025",
//   serviceHi:   "UP छात्रवृत्ति फॉर्म 2025",
//   amount:      30,
//   userName:    "Sunita Devi",
//   mobile:      "9123456789",
//   adminNote:   "Service fee for filling UP Scholarship form 2025. Amount will be deducted from your wallet or paid via Razorpay.",
//   adminNoteHi: "UP छात्रवृत्ति फॉर्म 2025 भरने का सेवा शुल्क। राशि आपके वॉलेट से काटी जाएगी या Razorpay से भुगतान होगा।",
//   createdBy:   "Ramesh Ji",
//   expiresAt:   "11 May 2025, 11:59 PM",
// };

// const T: Record<Lang, Record<string, string>> = {
//   hi: {
//     title:        "भुगतान पर्ची",
//     subtitle:     "जन सेवा केंद्र, बक्सा — जौनपुर",
//     payNow:       "अभी भुगतान करें",
//     payWallet:    "वॉलेट से भुगतान करें",
//     orPay:        "— या ऑनलाइन भुगतान करें —",
//     upi:          "UPI / GPay / PhonePe",
//     card:         "डेबिट / क्रेडिट कार्ड",
//     netBanking:   "नेट बैंकिंग",
//     processing:   "भुगतान प्रक्रिया जारी है...",
//     success:      "भुगतान सफल!",
//     successSub:   "आपका भुगतान प्राप्त हो गया। रसीद नीचे है।",
//     failed:       "भुगतान विफल",
//     failedSub:    "कृपया दोबारा प्रयास करें।",
//     retry:        "दोबारा प्रयास करें",
//     receipt:      "रसीद / Receipt",
//     receiptNo:    "रसीद संख्या",
//     paidAt:       "भुगतान समय",
//     paymentId:    "भुगतान ID",
//     method:       "भुगतान विधि",
//     downloadRec:  "रसीद डाउनलोड करें",
//     backDash:     "डैशबोर्ड पर जाएं",
//     requestId:    "आवेदन ID",
//     service:      "सेवा",
//     amount:       "राशि",
//     expiry:       "वैधता",
//     note:         "नोट",
//     walletBal:    "वॉलेट शेष",
//     secureNote:   "यह भुगतान Razorpay द्वारा सुरक्षित है।",
//     testMode:     "परीक्षण मोड — वास्तविक राशि नहीं कटेगी",
//     stamp:        "प्राप्त",
//   },
//   en: {
//     title:        "Payment Challan",
//     subtitle:     "Jan Seva Kendra, Shambhuganj — Jaunpur",
//     payNow:       "Pay Now",
//     payWallet:    "Pay from Wallet",
//     orPay:        "— or pay online —",
//     upi:          "UPI / GPay / PhonePe",
//     card:         "Debit / Credit Card",
//     netBanking:   "Net Banking",
//     processing:   "Processing payment...",
//     success:      "Payment Successful!",
//     successSub:   "Your payment was received. Receipt is below.",
//     failed:       "Payment Failed",
//     failedSub:    "Please try again.",
//     retry:        "Try Again",
//     receipt:      "Receipt",
//     receiptNo:    "Receipt No.",
//     paidAt:       "Paid At",
//     paymentId:    "Payment ID",
//     method:       "Method",
//     downloadRec:  "Download Receipt",
//     backDash:     "Go to Dashboard",
//     requestId:    "Application ID",
//     service:      "Service",
//     amount:       "Amount",
//     expiry:       "Valid Until",
//     note:         "Note",
//     walletBal:    "Wallet Balance",
//     secureNote:   "This payment is secured by Razorpay.",
//     testMode:     "Test Mode — no real amount will be charged",
//     stamp:        "RECEIVED",
//   },
// };

// // ── Razorpay script loader ─────────────────────────────────────────────────
// function loadRazorpay(): Promise<boolean> {
//   return new Promise((resolve) => {
//     if ((window as any).Razorpay) { resolve(true); return; }
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload  = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// }

// // ── Main component ─────────────────────────────────────────────────────────
// export default function PaymentPage() {
//   const [lang, setLang]         = useState<Lang>("hi");
//   const [dark, setDark]         = useState(false);
//   const [status, setStatus]     = useState<PayStatus>("idle");
//   const [receipt, setReceipt]   = useState<ReceiptData | null>(null);
//   const [walletBal]             = useState(150);
//   const [showReceipt, setShowReceipt] = useState(false);
//   const receiptRef              = useRef<HTMLDivElement>(null);
//   const order                   = MOCK_ORDER;
//   const t                       = T[lang];
//   const canUseWallet            = walletBal >= order.amount;

//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-color-scheme: dark)");
//     setDark(mq.matches);
//     mq.addEventListener("change", (e) => setDark(e.matches));
//   }, []);

//   // ── Razorpay checkout ───────────────────────────────────────────────────
//   const handleRazorpay = async () => {
//     setStatus("loading");
//     const loaded = await loadRazorpay();
//     if (!loaded) { setStatus("failed"); return; }

//     // In production: fetch order from /api/payments/create-order
//     // const res = await fetch("/api/payments/create-order", { method: "POST", body: JSON.stringify({ requestId: order.requestId, amount: order.amount }) });
//     // const { razorpayOrderId } = await res.json();

//     const options = {
//       key:          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
//       amount:       order.amount * 100, // paise
//       currency:     "INR",
//       name:         "Jan Seva Kendra, Shambhuganj",
//       description:  order.service,
//       order_id:     order.orderId, // from Razorpay API in production
//       prefill: {
//         name:    order.userName,
//         contact: `+91${order.mobile}`,
//       },
//       notes:        { requestId: order.requestId },
//       theme:        { color: "#1a4a2a" },
//       modal: {
//         ondismiss: () => { if (status === "loading") setStatus("idle"); },
//       },
//       handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
//         setStatus("processing");
//         // In production: verify payment server-side
//         // await fetch("/api/payments/verify", { method: "POST", body: JSON.stringify(response) });
//         await new Promise((r) => setTimeout(r, 1200)); // simulate verification
//         const rec: ReceiptData = {
//           receiptNo: `RCP-${Date.now().toString().slice(-8)}`,
//           paidAt:    new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
//           paymentId: response.razorpay_payment_id || `pay_demo_${Math.random().toString(36).slice(2, 10)}`,
//           amount:    order.amount,
//           method:    "Online (Razorpay)",
//         };
//         setReceipt(rec);
//         setStatus("success");
//         setTimeout(() => setShowReceipt(true), 400);
//       },
//     };

//     try {
//       setStatus("processing");
//       const rz = new (window as any).Razorpay(options);
//       rz.on("payment.failed", () => setStatus("failed"));
//       rz.open();
//     } catch {
//       setStatus("failed");
//     }
//   };

//   // ── Wallet payment ──────────────────────────────────────────────────────
//   const handleWalletPay = async () => {
//     setStatus("processing");
//     await new Promise((r) => setTimeout(r, 1000));
//     const rec: ReceiptData = {
//       receiptNo: `RCP-${Date.now().toString().slice(-8)}`,
//       paidAt:    new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
//       paymentId: `wallet_${Math.random().toString(36).slice(2, 10)}`,
//       amount:    order.amount,
//       method:    "Wallet",
//     };
//     setReceipt(rec);
//     setStatus("success");
//     setTimeout(() => setShowReceipt(true), 400);
//   };

//   // Colors — forest green + cream challan palette
//   const bg      = dark ? "#080e0a" : "#f0ece0";
//   const paper   = dark ? "#0e1510" : "#fafdf5";
//   const ink     = dark ? "#d8e8d0" : "#101c12";
//   const inkMid  = dark ? "#8aaa88" : "#3a5a3c";
//   const inkLt   = dark ? "#3a5a3c" : "#9ab89a";
//   const bord    = dark ? "#1e3020" : "#c8d8c0";
//   const bord2   = dark ? "#2a4030" : "#a8c0a8";
//   const green   = "#1a4a2a";
//   const greenL  = "#2a6a3a";
//   const accent  = "#c45c1a";
//   const red     = "#8a1a0a";
//   const stamp   = dark ? "#1a3010" : "#e8f5e0";

//   const challanLine = (label: string, value: string, mono = false, highlight = false) => (
//     <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "9px 0", borderBottom: `1px dashed ${bord}` }}>
//       <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: inkLt }}>{label}</span>
//       <span style={{ fontSize: highlight ? 18 : 13, fontWeight: highlight ? 900 : 600, color: highlight ? green : ink, fontFamily: mono || highlight ? "'IBM Plex Mono', monospace" : "inherit" }}>
//         {highlight ? `₹ ${value}` : value}
//       </span>
//     </div>
//   );

//   return (
//     <div style={{ background: bg, color: ink, minHeight: "100vh", fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "32px 16px 80px" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@700;900&family=IBM+Plex+Mono:wght@400;500;700&family=Noto+Sans:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');
//         *{box-sizing:border-box;margin:0;padding:0;}

//         @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
//         @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
//         @keyframes stampIn{0%{opacity:0;transform:scale(2.5) rotate(-15deg);}60%{transform:scale(0.9) rotate(2deg);}100%{opacity:1;transform:scale(1) rotate(-3deg);}}
//         @keyframes receiptSlide{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);}}
//         @keyframes checkDraw{from{stroke-dashoffset:100;}to{stroke-dashoffset:0;}}
//         @keyframes pulseGreen{0%,100%{box-shadow:0 0 0 0 rgba(26,74,42,0.4);}70%{box-shadow:0 0 0 10px rgba(26,74,42,0);}}

//         .pay-method-btn{width:100%;padding:13px 18px;background:${paper};border:1.5px solid ${bord2};border-radius:8px;color:${ink};font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s;display:flex;align-items:center;gap:12px;text-align:left;}
//         .pay-method-btn:hover{border-color:${green};background:${stamp};}
//         .pay-method-btn:disabled{opacity:0.4;cursor:not-allowed;}

//         .primary-pay-btn{width:100%;padding:16px;background:${green};border:none;border-radius:8px;color:#e8f5e0;font-size:15px;font-weight:900;cursor:pointer;font-family:'Noto Serif Devanagari',serif;letter-spacing:0.04em;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:10px;}
//         .primary-pay-btn:hover{background:${greenL};transform:translateY(-1px);}
//         .primary-pay-btn:disabled{background:${bord};color:${inkLt};cursor:not-allowed;transform:none;}

//         .mono{font-family:'IBM Plex Mono',monospace;}
//         .serif{font-family:'Noto Serif Devanagari',serif;}

//         .challan-border{border:2px solid ${bord2};border-radius:0;position:relative;}
//         .challan-border::before{content:'';position:absolute;inset:4px;border:1px dashed ${bord};pointer-events:none;}

//         .test-banner{background:${dark?"#1a1008":"#fff8e8"};border:1.5px solid ${dark?"#5c3808":"#e8c060"};border-radius:6px;padding:8px 14px;font-size:11px;color:${dark?"#e0a020":"#8a6010"};font-weight:700;display:flex;align-items:center;gap:8px;margin-bottom:16px;}

//         .receipt-paper{background:${paper};border:2px solid ${bord2};border-radius:4px;overflow:hidden;animation:receiptSlide 0.4s ease;}
//         .receipt-stamp{position:absolute;top:16px;right:16px;width:64px;height:64px;border-radius:50%;border:3px solid ${dark?"#2a5a2a":"#1a4a2a"};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;color:${dark?"#2a5a2a":"#1a4a2a"};text-transform:uppercase;letter-spacing:0.08em;text-align:center;line-height:1.3;transform:rotate(-12deg);animation:stampIn 0.5s ease 0.3s both;}

//         .lang-toggle{background:${dark?"#1e2818":"#e8f0e0"};border:1px solid ${bord};border-radius:20px;padding:4px 14px;font-size:11px;color:${inkMid};cursor:pointer;font-weight:700;font-family:inherit;}
//         .dark-toggle{background:${dark?"#1e2818":"#e8f0e0"};border:1px solid ${bord};border-radius:20px;width:32px;height:32px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;}
//       `}</style>

//       {/* Controls */}
//       <div style={{ width: "100%", maxWidth: 440, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
//         <a href="/dashboard" style={{ fontSize: 13, color: inkMid, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>← {lang === "hi" ? "वापस" : "Back"}</a>
//         <div style={{ display: "flex", gap: 8 }}>
//           <button onClick={() => setLang(l => l === "hi" ? "en" : "hi")} className="lang-toggle">{lang === "hi" ? "EN" : "हि"}</button>
//           <button onClick={() => setDark(d => !d)} className="dark-toggle">{dark ? "☀️" : "🌙"}</button>
//         </div>
//       </div>

//       {/* ── SUCCESS STATE ── */}
//       {status === "success" && receipt && (
//         <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.4s ease" }}>
//           {/* Success icon */}
//           <div style={{ textAlign: "center", marginBottom: 24 }}>
//             <div style={{ width: 72, height: 72, borderRadius: "50%", background: dark ? "#0a1a0a" : "#e8f8ee", border: `3px solid ${dark ? "#2a5a2a" : "#1a7a3a"}`, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulseGreen 1.5s ease 2" }}>
//               <svg viewBox="0 0 40 40" width="36" height="36">
//                 <path d="M8 20 L16 28 L32 12" fill="none" stroke={dark ? "#70c870" : "#1a7a3a"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="0" style={{ animation: "checkDraw 0.5s ease forwards" }} />
//               </svg>
//             </div>
//             <h2 className="serif" style={{ fontSize: 24, fontWeight: 900, color: dark ? "#70c870" : "#1a4a2a" }}>{t.success}</h2>
//             <p style={{ fontSize: 13, color: inkMid, marginTop: 4 }}>{t.successSub}</p>
//           </div>

//           {/* Receipt */}
//           {showReceipt && (
//             <div className="receipt-paper" ref={receiptRef}>
//               {/* Header */}
//               <div style={{ background: green, padding: "16px 20px", position: "relative" }}>
//                 <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 14, fontWeight: 700, color: "#e8f5e0", marginBottom: 2 }}>जन सेवा केंद्र, बक्सा</div>
//                 <div style={{ fontSize: 11, color: "#8ac8a0" }}>Jan Seva Kendra, Shambhuganj — Jaunpur, UP</div>
//                 <div className="receipt-stamp">{t.stamp}</div>
//               </div>

//               {/* Receipt body */}
//               <div style={{ padding: "20px" }}>
//                 <div style={{ textAlign: "center", marginBottom: 16 }}>
//                   <div style={{ fontSize: 11, color: inkLt, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.receipt}</div>
//                   <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: green, marginTop: 2 }}>₹ {receipt.amount}</div>
//                 </div>
//                 <div style={{ height: 1, background: `repeating-linear-gradient(90deg, ${bord} 0, ${bord} 6px, transparent 6px, transparent 12px)`, marginBottom: 16 }} />
//                 {[
//                   [t.receiptNo, receipt.receiptNo, true],
//                   [t.requestId, order.requestId, true],
//                   [t.service, lang === "hi" ? order.serviceHi : order.service, false],
//                   [t.paidAt, receipt.paidAt, false],
//                   [t.paymentId, receipt.paymentId, true],
//                   [t.method, receipt.method, false],
//                 ].map(([l, v, m]) => challanLine(l as string, v as string, m as boolean))}
//               </div>

//               {/* Footer */}
//               <div style={{ background: dark ? "#0e1a10" : "#f0f8f0", padding: "12px 20px", textAlign: "center", borderTop: `1px dashed ${bord}` }}>
//                 <div style={{ fontSize: 11, color: inkLt }}>{lang === "hi" ? "धन्यवाद! आपकी सेवा में हमें खुशी है।" : "Thank you! Happy to serve you."}</div>
//               </div>
//             </div>
//           )}

//           <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
//             <button onClick={() => window.print()} style={{ flex: 1, padding: "12px", background: paper, border: `1.5px solid ${bord2}`, borderRadius: 8, color: ink, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//               🖨️ {t.downloadRec}
//             </button>
//             <a href="/dashboard" style={{ flex: 1, padding: "12px", background: green, border: "none", borderRadius: 8, color: "#e8f5e0", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               {t.backDash} →
//             </a>
//           </div>
//         </div>
//       )}

//       {/* ── FAILED STATE ── */}
//       {status === "failed" && (
//         <div style={{ width: "100%", maxWidth: 440, textAlign: "center", animation: "fadeUp 0.3s ease" }}>
//           <div style={{ fontSize: 52, marginBottom: 12 }}>⚠️</div>
//           <h2 className="serif" style={{ fontSize: 22, fontWeight: 900, color: dark ? "#ff8060" : red, marginBottom: 8 }}>{t.failed}</h2>
//           <p style={{ fontSize: 13, color: inkMid, marginBottom: 24 }}>{t.failedSub}</p>
//           <button className="primary-pay-btn" onClick={() => setStatus("idle")} style={{ maxWidth: 260, margin: "0 auto" }}>{t.retry}</button>
//         </div>
//       )}

//       {/* ── PROCESSING STATE ── */}
//       {(status === "processing" || status === "loading") && (
//         <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease" }}>
//           <div style={{ width: 52, height: 52, border: `3px solid ${bord2}`, borderTopColor: green, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
//           <p style={{ fontSize: 14, color: inkMid, fontWeight: 600 }}>{t.processing}</p>
//         </div>
//       )}

//       {/* ── IDLE / PAYMENT FORM ── */}
//       {status === "idle" && (
//         <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.4s ease" }}>

//           {/* Test mode banner */}
//           <div className="test-banner">
//             <span>🔧</span> {t.testMode}
//           </div>

//           {/* Challan */}
//           <div className="challan-border" style={{ background: paper, padding: "24px", marginBottom: 20 }}>
//             {/* Challan header */}
//             <div style={{ textAlign: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `2px solid ${bord2}` }}>
//               <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center", marginBottom: 8 }}>
//                 <div style={{ width: 36, height: 36, borderRadius: "50%", background: dark ? "#0a1a0a" : "#e8f5e0", border: `2px solid ${green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏛️</div>
//                 <div>
//                   <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 16, fontWeight: 900, color: green, lineHeight: 1.2 }}>{t.subtitle.split(" — ")[0]}</div>
//                   <div style={{ fontSize: 10, color: inkLt, letterSpacing: "0.04em" }}>{t.subtitle.split(" — ")[1]}</div>
//                 </div>
//               </div>
//               <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: inkLt }}>{t.title}</div>
//             </div>

//             {/* Challan fields */}
//             {challanLine(t.requestId, order.requestId, true)}
//             {challanLine(t.service, lang === "hi" ? order.serviceHi : order.service)}
//             {challanLine(t.amount, order.amount.toString(), false, true)}
//             {challanLine(t.expiry, order.expiresAt)}
//             {challanLine(lang === "hi" ? "बनाया गया" : "Issued By", order.createdBy)}

//             {/* Admin note */}
//             <div style={{ marginTop: 14, padding: "10px 14px", background: dark ? "#0a1a0a" : "#f0f8f0", borderRadius: 6, border: `1px solid ${bord}` }}>
//               <div style={{ fontSize: 10, fontWeight: 700, color: inkLt, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{t.note}</div>
//               <p style={{ fontSize: 12, color: inkMid, lineHeight: 1.7 }}>{lang === "hi" ? order.adminNoteHi : order.adminNote}</p>
//             </div>
//           </div>

//           {/* Payment options */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

//             {/* Wallet option */}
//             <button
//               className="pay-method-btn"
//               onClick={handleWalletPay}
//               disabled={!canUseWallet}
//               style={{ background: canUseWallet ? (dark ? "#0a1a0a" : "#f0f8f0") : undefined, borderColor: canUseWallet ? green : undefined }}
//             >
//               <span style={{ fontSize: 24 }}>👛</span>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontWeight: 700 }}>{t.payWallet}</div>
//                 <div style={{ fontSize: 11, color: inkLt }}>{t.walletBal}: ₹{walletBal} {!canUseWallet && `(${lang === "hi" ? "अपर्याप्त" : "Insufficient"})`}</div>
//               </div>
//               {canUseWallet && <span style={{ fontSize: 18, color: green }}>→</span>}
//             </button>

//             <div style={{ textAlign: "center", fontSize: 11, color: inkLt, fontWeight: 600, letterSpacing: "0.06em" }}>{t.orPay}</div>

//             {/* Razorpay button */}
//             <button className="primary-pay-btn" onClick={handleRazorpay}>
//               <span style={{ fontSize: 20 }}>💳</span>
//               {t.payNow} — ₹{order.amount}
//             </button>

//             {/* Method icons */}
//             <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 4 }}>
//               {[["📱", t.upi], ["💳", t.card], ["🏦", t.netBanking]].map(([ic, lb]) => (
//                 <div key={lb} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
//                   <span style={{ fontSize: 20 }}>{ic}</span>
//                   <span style={{ fontSize: 9, color: inkLt, textAlign: "center", maxWidth: 60, lineHeight: 1.3 }}>{lb}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Secure note */}
//             <div style={{ textAlign: "center", fontSize: 11, color: inkLt, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
//               <span>🔒</span> {t.secureNote}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






















// D:\csc-platform\src\app\pay\[orderId]\page.tsx
// Razorpay Payment Page — challan / receipt design
//
// KEPT EXACTLY (logic untouched):
// - Types Lang / PayStatus / PaymentOrder / ReceiptData, MOCK_ORDER verbatim,
//   and the T hi/en string table byte-for-byte (including the "बक्सा" vs
//   "Shambhuganj" wording — see flags below, do not "fix" silently).
// - loadRazorpay script loader; handleRazorpay (key from
//   NEXT_PUBLIC_RAZORPAY_KEY_ID or "rzp_test_placeholder", amount * 100 paise,
//   INR, name "Jan Seva Kendra, Shambhuganj", prefill name/+91 mobile, notes
//   requestId, modal ondismiss, handler with the 1200ms simulated verification,
//   receipt number RCP- + Date.now() slice, payment.failed -> "failed").
// - handleWalletPay (1000ms simulated delay, "wallet_" payment id),
//   walletBal hardcoded at 150 with the canUseWallet check.
// - Status states idle / loading / processing / success / failed; receipt
//   shown 400ms after success; window.print() for the receipt download button.
// - Language toggle hi/en; dark toggle (still follows prefers-color-scheme
//   with a listener; now also syncs the `dark` class on documentElement so
//   Tailwind dark: classes work, and persists the choice to localStorage
//   key "csc_theme" on toggle, as on the other app pages).
// - Challan structure: ruled-line challan card, admin note, wallet option,
//   online (Razorpay) option, method list, secure note, and the receipt with
//   its RECEIVED stamp, ruled rows and print footer.
//
// REMOVED:
// - Forest-green + cream challan palette (greens, creams, orange accent).
// - The <style> block: Google Fonts @import, the global `* { margin: 0;
//   padding: 0 }` reset, and all keyframes (fadeUp, spin, stampIn,
//   receiptSlide, checkDraw, pulseGreen).
// - All inline style objects and gradients; theming is now Tailwind
//   dark: classes with one accent in both themes (deep blue: #2563eb light,
//   #60a5fa dark). No framer-motion, no shadows-as-decoration.
// - Emoji used as icons (temple, wallet, phone, card, bank, lock, wrench,
//   warning, printer and the rest) — replaced with lucide-react icons.
//
// CHANGED:
// - Razorpay checkout theme colour is now blue #2563eb in both themes
//   (was forest green #1a4a2a).
// - Receipt stamp is a plain bordered circle (no stamp-in animation); the
//   success check is a plain icon (no draw animation); the processing
//   spinner is Tailwind animate-spin. Transitions only.
//
// FLAGGED — NOT CHANGED, needs Swatantra's call:
// (1) MOCK_ORDER is mock data. The page never fetches the real order by
//     orderId; the commented-out production fetch lines (/api/payments/
//     create-order and /api/payments/verify) are the only path to real data.
// (2) walletBal is hardcoded 150 and BOTH payments are simulated
//     (setTimeout delays, random payment ids) — no real money moves.
// (3) The test-mode banner says no real amount will be charged.
// (4) Inconsistency as supplied: the hi subtitle says "जन सेवा केंद्र, बक्सा"
//     (Buxa) while the en subtitle says "Jan Seva Kendra, Shambhuganj" —
//     kept verbatim; needs his call on which place is right.
// (5) The receipt header also says "जन सेवा केंद्र, बक्सा" — same issue.
//
// NO NEW FILE NEEDED. Drop-in replacement for src/app/pay/[orderId]/page.tsx.
"use client";
// app/pay/[orderId]/page.tsx
// Razorpay Payment Page
// Design: Railway reservation challan — trust-first, ink-stamped, physical receipt feel

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  Moon,
  Printer,
  ShieldCheck,
  Smartphone,
  Sun,
  Wallet,
  Wrench,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type Lang = "hi" | "en";
type PayStatus = "idle" | "loading" | "processing" | "success" | "failed";

interface PaymentOrder {
  orderId: string;
  requestId: string;
  service: string;
  serviceHi: string;
  amount: number;
  userName: string;
  mobile: string;
  adminNote: string;
  adminNoteHi: string;
  createdBy: string;
  expiresAt: string;
}

interface ReceiptData {
  receiptNo: string;
  paidAt: string;
  paymentId: string;
  amount: number;
  method: string;
}

// ── Mock order (replace with API fetch using orderId param) ────────────────
const MOCK_ORDER: PaymentOrder = {
  orderId:     "order_PkXmN9Qa2Bv7Ry",
  requestId:   "REQ-2025-003",
  service:     "UP Scholarship Form 2025",
  serviceHi:   "UP छात्रवृत्ति फॉर्म 2025",
  amount:      30,
  userName:    "Sunita Devi",
  mobile:      "9123456789",
  adminNote:   "Service fee for filling UP Scholarship form 2025. Amount will be deducted from your wallet or paid via Razorpay.",
  adminNoteHi: "UP छात्रवृत्ति फॉर्म 2025 भरने का सेवा शुल्क। राशि आपके वॉलेट से काटी जाएगी या Razorpay से भुगतान होगा।",
  createdBy:   "Ramesh Ji",
  expiresAt:   "11 May 2025, 11:59 PM",
};

const T: Record<Lang, Record<string, string>> = {
  hi: {
    title:        "भुगतान पर्ची",
    subtitle:     "जन सेवा केंद्र, बक्सा — जौनपुर",
    payNow:       "अभी भुगतान करें",
    payWallet:    "वॉलेट से भुगतान करें",
    orPay:        "— या ऑनलाइन भुगतान करें —",
    upi:          "UPI / GPay / PhonePe",
    card:         "डेबिट / क्रेडिट कार्ड",
    netBanking:   "नेट बैंकिंग",
    processing:   "भुगतान प्रक्रिया जारी है...",
    success:      "भुगतान सफल!",
    successSub:   "आपका भुगतान प्राप्त हो गया। रसीद नीचे है।",
    failed:       "भुगतान विफल",
    failedSub:    "कृपया दोबारा प्रयास करें।",
    retry:        "दोबारा प्रयास करें",
    receipt:      "रसीद / Receipt",
    receiptNo:    "रसीद संख्या",
    paidAt:       "भुगतान समय",
    paymentId:    "भुगतान ID",
    method:       "भुगतान विधि",
    downloadRec:  "रसीद डाउनलोड करें",
    backDash:     "डैशबोर्ड पर जाएं",
    requestId:    "आवेदन ID",
    service:      "सेवा",
    amount:       "राशि",
    expiry:       "वैधता",
    note:         "नोट",
    walletBal:    "वॉलेट शेष",
    secureNote:   "यह भुगतान Razorpay द्वारा सुरक्षित है।",
    testMode:     "परीक्षण मोड — वास्तविक राशि नहीं कटेगी",
    stamp:        "प्राप्त",
  },
  en: {
    title:        "Payment Challan",
    subtitle:     "Jan Seva Kendra, Shambhuganj — Jaunpur",
    payNow:       "Pay Now",
    payWallet:    "Pay from Wallet",
    orPay:        "— or pay online —",
    upi:          "UPI / GPay / PhonePe",
    card:         "Debit / Credit Card",
    netBanking:   "Net Banking",
    processing:   "Processing payment...",
    success:      "Payment Successful!",
    successSub:   "Your payment was received. Receipt is below.",
    failed:       "Payment Failed",
    failedSub:    "Please try again.",
    retry:        "Try Again",
    receipt:      "Receipt",
    receiptNo:    "Receipt No.",
    paidAt:       "Paid At",
    paymentId:    "Payment ID",
    method:       "Method",
    downloadRec:  "Download Receipt",
    backDash:     "Go to Dashboard",
    requestId:    "Application ID",
    service:      "Service",
    amount:       "Amount",
    expiry:       "Valid Until",
    note:         "Note",
    walletBal:    "Wallet Balance",
    secureNote:   "This payment is secured by Razorpay.",
    testMode:     "Test Mode — no real amount will be charged",
    stamp:        "RECEIVED",
  },
};

// ── Razorpay script loader ─────────────────────────────────────────────────
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Main component ─────────────────────────────────────────────────────────
export default function PaymentPage() {
  const [lang, setLang]         = useState<Lang>("hi");
  const [dark, setDark]         = useState(false);
  const [status, setStatus]     = useState<PayStatus>("idle");
  const [receipt, setReceipt]   = useState<ReceiptData | null>(null);
  const [walletBal]             = useState(150);
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef              = useRef<HTMLDivElement>(null);
  const order                   = MOCK_ORDER;
  const t                       = T[lang];
  const canUseWallet            = walletBal >= order.amount;

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) {
      setDark(savedTheme === "dark");
      
      return;
    }
    else {
      setDark(false);
      localStorage.setItem("csc_theme", "light");
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Sync the `dark` class on <html> so Tailwind dark: variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // ── Razorpay checkout ───────────────────────────────────────────────────
  const handleRazorpay = async () => {
    setStatus("loading");
    const loaded = await loadRazorpay();
    if (!loaded) { setStatus("failed"); return; }

    // In production: fetch order from /api/payments/create-order
    // const res = await fetch("/api/payments/create-order", { method: "POST", body: JSON.stringify({ requestId: order.requestId, amount: order.amount }) });
    // const { razorpayOrderId } = await res.json();

    const options = {
      key:          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount:       order.amount * 100, // paise
      currency:     "INR",
      name:         "Jan Seva Kendra, Shambhuganj",
      description:  order.service,
      order_id:     order.orderId, // from Razorpay API in production
      prefill: {
        name:    order.userName,
        contact: `+91${order.mobile}`,
      },
      notes:        { requestId: order.requestId },
      theme:        { color: "#2563eb" },
      modal: {
        ondismiss: () => { if (status === "loading") setStatus("idle"); },
      },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        setStatus("processing");
        // In production: verify payment server-side
        // await fetch("/api/payments/verify", { method: "POST", body: JSON.stringify(response) });
        await new Promise((r) => setTimeout(r, 1200)); // simulate verification
        const rec: ReceiptData = {
          receiptNo: `RCP-${Date.now().toString().slice(-8)}`,
          paidAt:    new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
          paymentId: response.razorpay_payment_id || `pay_demo_${Math.random().toString(36).slice(2, 10)}`,
          amount:    order.amount,
          method:    "Online (Razorpay)",
        };
        setReceipt(rec);
        setStatus("success");
        setTimeout(() => setShowReceipt(true), 400);
      },
    };

    try {
      setStatus("processing");
      const rz = new (window as any).Razorpay(options);
      rz.on("payment.failed", () => setStatus("failed"));
      rz.open();
    } catch {
      setStatus("failed");
    }
  };

  // ── Wallet payment ──────────────────────────────────────────────────────
  const handleWalletPay = async () => {
    setStatus("processing");
    await new Promise((r) => setTimeout(r, 1000));
    const rec: ReceiptData = {
      receiptNo: `RCP-${Date.now().toString().slice(-8)}`,
      paidAt:    new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      paymentId: `wallet_${Math.random().toString(36).slice(2, 10)}`,
      amount:    order.amount,
      method:    "Wallet",
    };
    setReceipt(rec);
    setStatus("success");
    setTimeout(() => setShowReceipt(true), 400);
  };

  const challanLine = (label: string, value: string, mono = false, highlight = false) => (
    <div key={label} className="flex items-baseline justify-between border-b border-dashed border-slate-300 py-2.5 dark:border-slate-700">
      <span className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">{label}</span>
      <span className={`${highlight ? "text-lg font-black text-blue-700 dark:text-blue-400" : "text-[13px] font-semibold text-slate-900 dark:text-slate-100"} ${mono || highlight ? "font-mono" : ""}`}>
        {highlight ? `₹ ${value}` : value}
      </span>
    </div>
  );

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("csc_theme", next ? "dark" : "light");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-100 px-4 pb-20 pt-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Controls */}
      <div className="mb-6 flex w-full max-w-[440px] items-center justify-between">
        <a href="/dashboard" className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400">
          <ArrowLeft className="h-4 w-4" /> {lang === "hi" ? "वापस" : "Back"}
        </a>
        <div className="flex gap-2">
          <button
            onClick={() => setLang(l => l === "hi" ? "en" : "hi")}
            className="rounded-full border border-slate-300 bg-white px-3.5 py-1 text-[11px] font-bold text-slate-500 transition-colors hover:border-blue-700 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            {lang === "hi" ? "EN" : "हि"}
          </button>
          <button
            onClick={toggleDark}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition-colors hover:border-blue-700 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── SUCCESS STATE ── */}
      {status === "success" && receipt && (
        <div className="w-full max-w-[440px]">
          {/* Success icon */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-emerald-700 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950">
              <Check className="h-9 w-9 text-emerald-700 dark:text-emerald-400" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-400">{t.success}</h2>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">{t.successSub}</p>
          </div>

          {/* Receipt */}
          {showReceipt && (
            <div className="overflow-hidden rounded border-2 border-slate-400 bg-white dark:border-slate-600 dark:bg-slate-900" ref={receiptRef}>
              {/* Header */}
              <div className="relative bg-blue-800 px-5 py-4 dark:bg-blue-950">
                <div className="text-sm font-bold text-blue-50">जन सेवा केंद्र, बक्सा</div>
                <div className="text-[11px] text-blue-200">Jan Seva Kendra, Shambhuganj — Jaunpur, UP</div>
                <div className="absolute right-4 top-4 flex h-16 w-16 -rotate-12 items-center justify-center rounded-full border-[3px] border-blue-200 text-center text-[9px] font-black uppercase leading-snug tracking-wide text-blue-200">
                  {t.stamp}
                </div>
              </div>

              {/* Receipt body */}
              <div className="px-5 py-5">
                <div className="mb-4 text-center">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">{t.receipt}</div>
                  <div className="mt-0.5 font-mono text-[22px] font-bold text-blue-700 dark:text-blue-400">₹ {receipt.amount}</div>
                </div>
                <div className="mb-4 h-px bg-[repeating-linear-gradient(90deg,#cbd5e1_0,#cbd5e1_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#334155_0,#334155_6px,transparent_6px,transparent_12px)]" />
                {[
                  [t.receiptNo, receipt.receiptNo, true],
                  [t.requestId, order.requestId, true],
                  [t.service, lang === "hi" ? order.serviceHi : order.service, false],
                  [t.paidAt, receipt.paidAt, false],
                  [t.paymentId, receipt.paymentId, true],
                  [t.method, receipt.method, false],
                ].map(([l, v, m]) => challanLine(l as string, v as string, m as boolean))}
              </div>

              {/* Footer */}
              <div className="border-t border-dashed border-slate-300 bg-slate-50 px-5 py-3 text-center dark:border-slate-700 dark:bg-slate-800/60">
                <div className="text-[11px] text-slate-400 dark:text-slate-500">{lang === "hi" ? "धन्यवाद! आपकी सेवा में हमें खुशी है।" : "Thank you! Happy to serve you."}</div>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2.5">
            <button
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-[1.5px] border-slate-400 bg-white px-3 py-3 text-[13px] font-bold text-slate-900 transition-colors hover:border-blue-700 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:text-blue-400"
            >
              <Printer className="h-4 w-4" /> {t.downloadRec}
            </button>
            <a
              href="/dashboard"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 py-3 text-[13px] font-bold text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {t.backDash} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* ── FAILED STATE ── */}
      {status === "failed" && (
        <div className="w-full max-w-[440px] text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <AlertTriangle className="h-7 w-7 text-red-700 dark:text-red-400" />
          </div>
          <h2 className="text-[22px] font-black text-red-800 dark:text-red-400">{t.failed}</h2>
          <p className="mb-6 mt-2 text-[13px] text-slate-500 dark:text-slate-400">{t.failedSub}</p>
          <button
            onClick={() => setStatus("idle")}
            className="mx-auto flex w-full max-w-[260px] items-center justify-center rounded-lg bg-blue-700 px-4 py-4 text-[15px] font-black text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* ── PROCESSING STATE ── */}
      {(status === "processing" || status === "loading") && (
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-[52px] w-[52px] animate-spin text-blue-700 dark:text-blue-400" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t.processing}</p>
        </div>
      )}

      {/* ── IDLE / PAYMENT FORM ── */}
      {status === "idle" && (
        <div className="w-full max-w-[440px]">
          {/* Test mode banner */}
          <div className="mb-4 flex items-center gap-2 rounded-md border-[1.5px] border-amber-300 bg-amber-50 px-3.5 py-2 text-[11px] font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Wrench className="h-4 w-4 shrink-0" /> {t.testMode}
          </div>

          {/* Challan */}
          <div className="relative mb-5 border-2 border-slate-400 bg-white p-6 dark:border-slate-600 dark:bg-slate-900">
            <div className="pointer-events-none absolute inset-1 border border-dashed border-slate-300 dark:border-slate-700" />
            {/* Challan header */}
            <div className="relative mb-5 border-b-2 border-slate-400 pb-4 text-center dark:border-slate-600">
              <div className="mb-2 flex items-center justify-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-700 bg-blue-50 dark:border-blue-400 dark:bg-blue-950">
                  <Landmark className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-base font-black leading-tight text-blue-800 dark:text-blue-400">{t.subtitle.split(" — ")[0]}</div>
                  <div className="text-[10px] tracking-wide text-slate-400 dark:text-slate-500">{t.subtitle.split(" — ")[1]}</div>
                </div>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">{t.title}</div>
            </div>

            {/* Challan fields */}
            <div className="relative">
              {challanLine(t.requestId, order.requestId, true)}
              {challanLine(t.service, lang === "hi" ? order.serviceHi : order.service)}
              {challanLine(t.amount, order.amount.toString(), false, true)}
              {challanLine(t.expiry, order.expiresAt)}
              {challanLine(lang === "hi" ? "बनाया गया" : "Issued By", order.createdBy)}

              {/* Admin note */}
              <div className="mt-3.5 rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">{t.note}</div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{lang === "hi" ? order.adminNoteHi : order.adminNote}</p>
              </div>
            </div>
          </div>

          {/* Payment options */}
          <div className="flex flex-col gap-2.5">
            {/* Wallet option */}
            <button
              onClick={handleWalletPay}
              disabled={!canUseWallet}
              className={`flex w-full items-center gap-3 rounded-lg border-[1.5px] px-4 py-3.5 text-left text-[13px] font-semibold transition-colors ${
                canUseWallet
                  ? "border-blue-700 bg-blue-50 text-slate-900 hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-950 dark:text-slate-100 dark:hover:bg-blue-900"
                  : "cursor-not-allowed border-slate-300 bg-white text-slate-900 opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              }`}
            >
              <Wallet className="h-6 w-6 shrink-0 text-blue-700 dark:text-blue-400" />
              <div className="flex-1">
                <div className="font-bold">{t.payWallet}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500">{t.walletBal}: ₹{walletBal} {!canUseWallet && `(${lang === "hi" ? "अपर्याप्त" : "Insufficient"})`}</div>
              </div>
              {canUseWallet && <ArrowRight className="h-[18px] w-[18px] text-blue-700 dark:text-blue-400" />}
            </button>

            <div className="text-center text-[11px] font-semibold tracking-[0.06em] text-slate-400 dark:text-slate-500">{t.orPay}</div>

            {/* Razorpay button */}
            <button
              onClick={handleRazorpay}
              className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-blue-700 px-4 py-4 text-[15px] font-black text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <CreditCard className="h-5 w-5" />
              {t.payNow} — ₹{order.amount}
            </button>

            {/* Method icons */}
            <div className="mt-1 flex justify-center gap-8">
              {[
                { icon: Smartphone, label: t.upi },
                { icon: CreditCard, label: t.card },
                { icon: Building2, label: t.netBanking },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <span className="max-w-[60px] text-center text-[9px] leading-snug text-slate-400 dark:text-slate-500">{label}</span>
                </div>
              ))}
            </div>

            {/* Secure note */}
            <div className="mt-1 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 dark:text-slate-500">
              <Lock className="h-3.5 w-3.5" /> {t.secureNote}
              <ShieldCheck className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
