// "use client";
// import { useState, useEffect, useRef, useCallback, type DragEvent } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type TxType     = "credit" | "debit";
// type QueueStatus = "idle" | "extracting" | "review" | "submitted" | "error";

// interface ExtractedData {
//   txId:         string;
//   senderName:   string;
//   receiverName: string;
//   amount:       string;
//   type:         TxType;
//   category:     string;
//   date:         string;
//   time:         string;
//   bank:         string;
//   upiId:        string;
//   rawText:      string;
//   confidence: {
//     overall:  number;
//     txId:     number;
//     amount:   number;
//     names:    number;
//     datetime: number;
//     category: number;
//   };
// }

// interface TxForm extends ExtractedData {
//   notes:    string;
//   operator: string;
// }

// interface FraudFlag {
//   level:  "critical" | "warning" | "info";
//   msg:    string;
//   detail: string;
// }

// interface QueueItem {
//   id:         string;
//   file:       File;
//   previewUrl: string | null;
//   status:     QueueStatus;
//   form:       TxForm | null;
//   flags:      FraudFlag[];
//   error:      string;
// }

// interface SubmittedTx extends TxForm {
//   id?:        string; 
//   queueId:    string;
//   submittedAt: string;
//   flags:      FraudFlag[];
//   fileName:   string;
// }

// interface HourlyData {
//   hour: string;
//   credit: number;
//   debit: number;
//   count: number;
// }

// interface ChartDataPoint {
//   x: number;
//   y: number;
// }

// // ─── Constants ─────────────────────────────────────────────────────────────
// const CATEGORIES = [
//   "UPI Transfer","Bank Transfer","NEFT/RTGS",
//   "Wallet (Paytm/PhonePe)","Cash Deposit","Cash Withdrawal",
//   "Recharge","Bill Payment","IMPS","Other",
// ];

// const OPERATORS = [
//   "Ramesh Ji",
//   "Priya Devi",
//   "Deepak Yadav",
//   "Anjali Gupta",
// ];

// const EMPTY_FORM: TxForm = {
//   txId:"", senderName:"", receiverName:"", amount:"",
//   type:"credit", category:"UPI Transfer", date:"", time:"",
//   bank:"", upiId:"", rawText:"", notes:"", operator: OPERATORS[0],
//   confidence:{ overall:0, txId:0, amount:0, names:0, datetime:0, category:0 },
// };

// function fmt(n: number): string { return n.toLocaleString("en-IN"); }
// function fmtShort(n: number): string { if(n>=100000) return `₹${(n/100000).toFixed(1)}L`; if(n>=1000) return `₹${(n/1000).toFixed(1)}K`; return `₹${n}`; }

// // ─── Fraud Detection ───────────────────────────────────────────────────────
// function detectFraud(form: TxForm, existing: SubmittedTx[]): FraudFlag[] {
//   const flags: FraudFlag[] = [];
//   const amt = parseFloat(form.amount || "0");

//   if (form.txId && existing.some(t => t.txId && t.txId.toLowerCase() === form.txId.toLowerCase())) {
//     flags.push({ level:"critical", msg:"Duplicate Transaction ID", detail:`"${form.txId}" already exists in today's ledger` });
//   }
//   const sameAmt = existing.filter(t => Math.abs(parseFloat(t.amount||"0") - amt) < 1 && t.type === form.type);
//   if (sameAmt.length >= 2) {
//     flags.push({ level:"warning", msg:"Repeated amount detected", detail:`₹${amt} (${form.type}) appears ${sameAmt.length+1} times` });
//   }
//   if (amt >= 50000 && amt % 10000 === 0) {
//     flags.push({ level:"warning", msg:"Large round-figure transaction", detail:`₹${amt.toLocaleString("en-IN")} — verify manually` });
//   }
//   if (!form.txId) flags.push({ level:"info", msg:"Transaction ID missing", detail:"OCR couldn't extract TX ID — fill manually" });
//   if (!form.senderName && !form.receiverName) flags.push({ level:"info", msg:"Party names missing", detail:"Neither sender nor receiver name extracted" });

//   return flags;
// }

// // ─── API Extract Wrapper ──────────────────────────────────────────────────
// async function extractWithGroq(file: File): Promise<ExtractedData> {
//   const base64 = await new Promise<string>((res, rej) => {
//     const reader = new FileReader();
//     reader.onload  = () => res((reader.result as string).split(",")[1]);
//     reader.onerror = () => rej(new Error("File read failed"));
//     reader.readAsDataURL(file);
//   });

//   const response = await fetch("/api/admin/ocr-extract", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ base64, mimeType: file.type }),
//     credentials: "include",
//   });

//   if (!response.ok) {
//     const err = await response.json().catch(() => ({}));
//     throw new Error(err.error || err.message || "OCR API error");
//   }
//   const data = await response.json();
//   return data.extracted as ExtractedData;
// }

// // ─── UI Components ─────────────────────────────────────────────────────────
// function ConfBar({ value, label, dark }: { value: number; label: string; dark: boolean }) {
//   const color = value >= 85 ? "#00c8a0" : value >= 60 ? "#e0a020" : "#e05040";
//   return (
//     <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
//       <span style={{ fontSize:9, color: dark?"#5a5a6a":"#9a9aaa", width:72, flexShrink:0, fontFamily:"'JetBrains Mono',monospace" }}>{label}</span>
//       <div style={{ flex:1, height:3, background: dark?"#1e1e2e":"#e0e0ee", borderRadius:2, overflow:"hidden" }}>
//         <div style={{ width:`${value}%`, height:"100%", background:color, borderRadius:2, transition:"width 0.8s ease" }} />
//       </div>
//       <span style={{ fontSize:9, fontFamily:"'JetBrains Mono',monospace", color, width:28, textAlign:"right" }}>{value}%</span>
//     </div>
//   );
// }

// function FraudBadge({ flag, dark }: { flag: FraudFlag; dark: boolean }) {
//   const cfg = {
//     critical: { bg: dark?"#2a0808":"#fff0f0", border: dark?"#c03030":"#f0b0b0", color:"#e05040", icon:"🚨" },
//     warning:  { bg: dark?"#2a1800":"#fff8e8", border: dark?"#b07000":"#e8c060", color:"#e0a020", icon:"⚠️" },
//     info:     { bg: dark?"#081028":"#eef4ff", border: dark?"#1a4a9a":"#b0c8f0", color:"#3a7ae0", icon:"ℹ️" },
//   }[flag.level];
//   return (
//     <div style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:4, padding:"7px 10px", marginBottom:6 }}>
//       <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
//         <span style={{ fontSize:11 }}>{cfg.icon}</span>
//         <span style={{ fontSize:11, fontWeight:700, color:cfg.color, fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.03em" }}>
//           {flag.msg.toUpperCase()}
//         </span>
//       </div>
//       <div style={{ fontSize:11, color: dark?"#8a8a9a":"#6a6a7a", paddingLeft:20 }}>{flag.detail}</div>
//     </div>
//   );
// }

// function Field({ label, value, onChange, type="text", options, mono, aiTag, prefix, dark, required }: any) {
//   const surf2  = dark ? "#12121e" : "#f4f2ee";
//   const bord2  = dark ? "#2a2a3a" : "#d8d4cc";
//   const ink    = dark ? "#e0dcd0" : "#1a1810";
//   const inkLt  = dark ? "#5a5a6a" : "#a8a498";

//   const base: React.CSSProperties = {
//     width:"100%", padding: prefix ? "8px 10px 8px 28px" : "8px 10px",
//     border:`1.5px solid ${aiTag ? "#00c8a050" : bord2}`,
//     borderRadius:4, background:surf2, color:ink,
//     fontSize:12, fontFamily: mono?"'JetBrains Mono',monospace":"inherit",
//     outline:"none", transition:"border-color 0.15s",
//   };

//   return (
//     <div style={{ marginBottom:10 }}>
//       <label style={{ fontSize:9, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color: aiTag ? "#00c8a0" : (dark?"#5a5a6a":"#9a9aaa"), marginBottom:4, fontFamily:"'JetBrains Mono',monospace", display:"flex", alignItems:"center", gap:6 }}>
//         {label}
//         {required && <span style={{ color:"#e05040" }}>*</span>}
//         {aiTag && value && <span style={{ fontSize:8, background:"#00c8a018", border:"1px solid #00c8a040", color:"#00c8a0", borderRadius:3, padding:"1px 5px" }}>AI FILLED</span>}
//       </label>
//       {options ? (
//         <select value={value} onChange={e=>onChange(e.target.value)} style={{ ...base, cursor:"pointer" }}>
//           {options.map((o:string)=><option key={o} value={o} style={{ background: dark?"#12121e":"#fff" }}>{o}</option>)}
//         </select>
//       ) : (
//         <div style={{ position:"relative" }}>
//           {prefix && <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13, color:inkLt, fontFamily:"'JetBrains Mono',monospace", pointerEvents:"none" }}>{prefix}</span>}
//           <input type={type} value={value} onChange={e=>onChange(e.target.value)} style={base} onFocus={e=>(e.target.style.borderColor = aiTag?"#00c8a080":"#8080b0")} onBlur={e=>(e.target.style.borderColor  = aiTag?"#00c8a050":bord2)} />
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main Application ──────────────────────────────────────────────────────────
// export default function TransactionApp() {
//   const [dark, setDark]               = useState(true);
//   const [isMobile, setIsMobile]       = useState(false);

//   // Data States
//   const [queue, setQueue]             = useState<QueueItem[]>([]);
//   const [activeIdx, setActiveIdx]     = useState<number | null>(null);
//   const [form, setForm]               = useState<TxForm>(EMPTY_FORM);
//   const [flags, setFlags]             = useState<FraudFlag[]>([]);
//   const [submitted, setSubmitted]     = useState<SubmittedTx[]>([]);

//   // UI States
//   const [view, setView]               = useState<"queue"|"ledger"|"analytics">("queue");
//   const [showManual, setShowManual]   = useState(false);
//   const [dragOver, setDragOver]       = useState(false);
//   const [extracting, setExtracting]   = useState(false);
//   const [extractMsg, setExtractMsg]   = useState("");
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fileInputRef  = useRef<HTMLInputElement>(null);
//   const cameraRef     = useRef<HTMLInputElement>(null);

//   // 1. Detect Mobile
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ✨ 2. FETCH LEDGER FROM DB ON MOUNT
//   useEffect(() => {
//     async function loadLedger() {
//       try {
//         const res = await fetch("/api/admin/transactions");
//         if (res.ok) {
//           const data = await res.json();
//           setSubmitted(data.transactions || []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch ledger", err);
//       }
//     }
//     loadLedger();
//   }, []);

//   // 3. Re-run fraud detection
//   useEffect(() => {
//     if (!form.amount && !form.txId) { setFlags([]); return; }
//     setFlags(detectFraud(form, submitted));
//   }, [form.txId, form.amount, form.type, submitted]);

//   const setField = <K extends keyof TxForm>(key: K, val: TxForm[K]) =>
//     setForm(prev => ({ ...prev, [key]: val }));

//   const activeItem = activeIdx !== null ? queue[activeIdx] : null;

//   // Colors
//   const bg     = dark ? "#080810" : "#f5f2ec";
//   const surf   = dark ? "#10101c" : "#ffffff";
//   const surf2  = dark ? "#16162a" : "#f0ede6";
//   const surf3  = dark ? "#1e1e30" : "#e8e4dc";
//   const bord   = dark ? "#22223a" : "#dddac8";
//   const bord2  = dark ? "#2e2e48" : "#ccc8b4";
//   const ink    = dark ? "#e0dcd8" : "#1a1810";
//   const inkM   = dark ? "#8a8898" : "#6a6258";
//   const inkL   = dark ? "#4a4a58" : "#b0a898";
//   const teal   = "#00c8a0";
//   const coral  = "#e06060";
//   const amber  = "#e0a020";

//   const totalCredit = submitted.filter(t=>t.type==="credit").reduce((a,t)=>a+parseFloat(t.amount||"0"),0);
//   const totalDebit  = submitted.filter(t=>t.type==="debit").reduce((a,t)=>a+parseFloat(t.amount||"0"),0);
//   const netBalance  = totalCredit - totalDebit;

//   // ── Handlers ───────────────────────────────────────────────────────────
//   const addFiles = useCallback((files: FileList | File[]) => {
//     const arr = Array.from(files).filter(f => f.type.startsWith("image/") || f.type === "application/pdf");
//     if (!arr.length) return;

//     const newItems: QueueItem[] = arr.map(file => ({
//       id:         `Q-${Date.now().toString().slice(-4)}`,
//       file,
//       previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
//       status:     "idle",
//       form:       null,
//       flags:      [],
//       error:      "",
//     }));

//     setQueue(prev => {
//       const updated = [...prev, ...newItems];
//       if (activeIdx === null) setTimeout(() => setActiveIdx(prev.length), 50);
//       return updated;
//     });
//   }, [activeIdx]);

//   const onDragOver  = (e: DragEvent) => { e.preventDefault(); setDragOver(true); };
//   const onDragLeave = ()             => setDragOver(false);
//   const onDrop      = (e: DragEvent) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

//   const selectItem = (idx: number) => {
//     const item = queue[idx];
//     if (!item) return;
//     setActiveIdx(idx);
//     setForm(item.form || { ...EMPTY_FORM, operator: OPERATORS[0] });
//     setFlags(item.flags || []);
//     setShowManual(false);
//   };

//   const runExtract = async (idx: number) => {
//     const item = queue[idx];
//     if (!item || extracting) return;

//     setExtracting(true);
//     setExtractMsg("Sending to Groq Vision AI…");
//     setQueue(prev => prev.map((q, i) => i===idx ? {...q, status:"extracting"} : q));

//     try {
//       const extracted = await extractWithGroq(item.file);
//       const newForm: TxForm = {
//         txId:         extracted.txId || "",
//         senderName:   extracted.senderName || "",
//         receiverName: extracted.receiverName || "",
//         amount:       extracted.amount?.toString() || "",
//         type:         extracted.type === "debit" ? "debit" : "credit",
//         category:     CATEGORIES.includes(extracted.category) ? extracted.category : "UPI Transfer",
//         date:         extracted.date || new Date().toISOString().split("T")[0],
//         time:         extracted.time || new Date().toTimeString().slice(0,5),
//         bank:         extracted.bank || "",
//         upiId:        extracted.upiId || "",
//         rawText:      extracted.rawText || "",
//         notes:        "",
//         operator:     OPERATORS[0],
//         confidence:   extracted.confidence || { overall:70, txId:60, amount:80, names:65, datetime:70, category:75 },
//       };

//       const newFlags = detectFraud(newForm, submitted);
//       setQueue(prev => prev.map((q, i) => i===idx ? { ...q, status:"review", form:newForm, flags:newFlags } : q));
//       setForm(newForm);
//       setFlags(newFlags);
//     } catch (err: any) {
//       setQueue(prev => prev.map((q, i) => i===idx ? {...q, status:"error", error:err.message} : q));
//       setFlags([{ level:"critical", msg:"AI Extraction Failed", detail:err.message + " — use manual entry" }]);
//     } finally {
//       setExtracting(false);
//       setExtractMsg("");
//     }
//   };

//   // ✨ CONNECTED SUBMIT TO DATABASE (Handles Both Manual and Queue)
//   const submitTransaction = async () => {
//     if (!form.amount || parseFloat(form.amount) <= 0) return;
//     if (flags.some(f => f.level === "critical") && !window.confirm("Critical fraud flags detected. Submit anyway?")) return;

//     setSubmitLoading(true);
//     try {
//       const payload = {
//         ...form,
//         queueId:     activeItem?.id || `MAN-${Date.now()}`,
//         flags:       flags,
//         fileName:    activeItem?.file.name || "manual",
//       };

//       // Push to the API
//       const res = await fetch("/api/admin/transactions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Failed to save transaction to database");

//       // Refetch the entire ledger to ensure everything is synced perfectly
//       const ledgerRes = await fetch("/api/admin/transactions");
//       if (ledgerRes.ok) {
//         const ledgerData = await ledgerRes.json();
//         setSubmitted(ledgerData.transactions || []);
//       }

//       // Cleanup UI state
//       if (showManual) {
//         setShowManual(false);
//         setForm(EMPTY_FORM);
//         setFlags([]);
//       } else if (activeIdx !== null) {
//         // Mark current as submitted
//         setQueue(prev => prev.map((q, i) => i === activeIdx ? { ...q, status: "submitted" } : q));

//         // Auto-advance to the next item
//         const nextIdx = queue.findIndex((q, i) => i > activeIdx && q.status === "idle");
//         if (nextIdx !== -1) {
//           selectItem(nextIdx);
//           setTimeout(() => runExtract(nextIdx), 100);
//         } else {
//           setActiveIdx(null);
//           setForm(EMPTY_FORM);
//         }
//       }
//     } catch (err: any) {
//       alert("Submit failed: " + err.message);
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   // ── Render ─────────────────────────────────────────────────────────────
//   return (
//     <div style={{ background:bg, color:ink, height:"100vh", display:"flex", flexDirection:"column", fontFamily:"'IBM Plex Sans','Noto Sans',sans-serif", overflow:"hidden" }}>
//       <style>{`
//         * { box-sizing:border-box; margin:0; padding:0; }
//         ::-webkit-scrollbar { width:4px; height:4px; }
//         ::-webkit-scrollbar-track { background:transparent; }
//         ::-webkit-scrollbar-thumb { background:${bord2}; border-radius:2px; }
//         @keyframes scan { from{top:-2px;} to{top:100%;} }
//         @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

//         .tab { padding:12px 16px; background:transparent; border:none; color:${inkM}; font-size:12px; font-weight:700; text-transform:uppercase; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.12s; flex: 1; text-align: center; }
//         .tab.on { color:${teal}; border-bottom-color:${teal}; }

//         .btn { padding:10px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px; border:1.5px solid; transition:all 0.15s; }
//         .btn-teal { background:${teal}; border-color:${teal}; color:#080810; }
//         .btn-teal:disabled { background:${surf3}; border-color:${bord}; color:${inkL}; cursor:not-allowed; }
//         .btn-outline { background:transparent; border-color:${bord2}; color:${ink}; }

//         .queue-item { padding:10px; cursor:pointer; border-bottom:1px solid ${bord}; transition:background 0.12s; display:flex; gap:10px; align-items:center; }
//         .queue-item.active { background:${dark?"#10201a":"#edfaf4"}; border-left:3px solid ${teal}; }

//         .type-btn { flex:1; padding:12px; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer; font-family:'JetBrains Mono',monospace; border:1.5px solid; transition:all 0.15s; text-align:center; }

//         .fab { position: fixed; bottom: 20px; right: 20px; width: 64px; height: 64px; border-radius: 32px; background: ${teal}; color: #000; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 16px rgba(0,200,160,0.4); z-index: 100; border: none; cursor: pointer; }
//       `}</style>

//       {/* ── TOP NAV ── */}
//       <div style={{ background:surf, borderBottom:`1px solid ${bord}`, display:"flex", alignItems:"center", zIndex:10 }}>
//         <div style={{ padding:"12px 16px", borderRight:`1px solid ${bord}`, display:"flex", alignItems:"center", gap:8 }}>
//           <div style={{ width:6, height:22, background:teal, borderRadius:1 }} />
//           <div style={{ fontSize:14, fontWeight:700, letterSpacing:"0.05em" }}>CSC ENTRY</div>
//         </div>
//         <div style={{ display:"flex", flex:1 }}>
//           <button className={`tab ${view==="queue"?"on":""}`} onClick={()=>{setView("queue"); setActiveIdx(null); setShowManual(false);}}>Queue</button>
//           <button className={`tab ${view==="ledger"?"on":""}`} onClick={()=>setView("ledger")}>Ledger</button>
//         </div>
//         <div style={{ paddingRight:16 }}>
//            <button className="btn btn-outline" style={{ fontSize:11, padding:"6px 12px" }} onClick={() => { setShowManual(true); setActiveIdx(null); setView("queue"); setForm(EMPTY_FORM); setFlags([]); }}>
//              ✏️ Manual
//            </button>
//         </div>
//       </div>

//       {/* ── MAIN LAYOUT ── */}
//       <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative" }}>

//         {/* ════ QUEUE VIEW ════ */}
//         {view === "queue" && (
//           <>
//             {/* Desktop Left Sidebar / Mobile Full List */}
//             <div style={{ width: isMobile ? "100%" : 280, borderRight:`1px solid ${bord}`, background:surf, display: (isMobile && (activeIdx !== null || showManual)) ? "none" : "flex", flexDirection:"column", zIndex:10 }}>

//               <div style={{ padding:"12px", borderBottom:`1px solid ${bord}` }}>
//                 <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf" style={{ display:"none" }} onChange={e => e.target.files && addFiles(e.target.files)} />
//                 <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => e.target.files && addFiles(e.target.files)} />

//                 {!isMobile && (
//                   <div style={{ display:"flex", gap:8, marginBottom:8 }}>
//                     <button className="btn btn-outline" style={{flex:1}} onClick={()=>fileInputRef.current?.click()}>📂 Gallery</button>
//                     <button className="btn btn-outline" style={{flex:1}} onClick={()=>cameraRef.current?.click()}>📸 Camera</button>
//                   </div>
//                 )}
//                 <div style={{ fontSize:11, color:inkM, textAlign:"center" }}>{queue.length} items in queue</div>
//               </div>

//               <div style={{ flex:1, overflowY:"auto" }}>
//                 {queue.map((item, idx) => (
//                   <div key={item.id} className={`queue-item ${activeIdx===idx?"active":""}`} onClick={()=>selectItem(idx)}>
//                     <div style={{ width:48, height:48, borderRadius:6, background:surf2, overflow:"hidden", position:"relative", flexShrink:0 }}>
//                       {item.previewUrl ? <img src={item.previewUrl} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>📄</span>}
//                       {item.status === "extracting" && <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)'}}><div className="scan-line" /></div>}
//                       {item.status === "submitted" && <div style={{position:'absolute', inset:0, background:'rgba(0,200,160,0.3)', display:'flex', alignItems:'center', justifyContent:'center'}}>✅</div>}
//                     </div>
//                     <div style={{ flex:1, minWidth:0 }}>
//                       <div style={{ fontSize:10, fontWeight:700, color: item.status==="extracting"?amber:item.status==="submitted"?teal:inkM, marginBottom:2 }}>
//                         {item.status.toUpperCase()}
//                       </div>
//                       <div style={{ fontSize:12, color:ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.file.name}</div>
//                       {item.form?.amount && <div style={{ fontSize:11, color:item.form.type==="credit"?teal:coral, fontWeight:700, marginTop:2 }}>₹{item.form.amount}</div>}
//                     </div>
//                   </div>
//                 ))}
//                 {queue.length === 0 && !showManual && (
//                   <div style={{ padding:40, textAlign:"center", color:inkL }}>
//                     <div style={{ fontSize:40, marginBottom:10 }}>📸</div>
//                     <div>Capture bills to start</div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Desktop Right Area / Mobile Detail View */}
//             <div style={{ flex:1, display: (isMobile && activeIdx === null && !showManual) ? "none" : "flex", flexDirection: isMobile ? "column" : "row", background:bg, overflow:"hidden" }}>

//               {/* Image Preview (Top on Mobile, Left on Desktop) */}
//               {activeItem && !showManual && (
//                 <div style={{ width: isMobile ? "100%" : 360, height: isMobile ? "30vh" : "100%", borderRight: isMobile ? "none" : `1px solid ${bord}`, borderBottom: isMobile ? `1px solid ${bord}` : "none", background:surf2, display:"flex", flexDirection:"column" }}>

//                   {isMobile && (
//                     <div style={{ padding:"10px", background:surf, display:"flex", alignItems:"center", borderBottom:`1px solid ${bord}` }}>
//                       <button onClick={()=>setActiveIdx(null)} style={{ background:"none", border:"none", color:ink, fontSize:24, paddingRight:16 }}>←</button>
//                       <div style={{ fontSize:12, fontWeight:700 }}>{activeItem.file.name}</div>
//                     </div>
//                   )}

//                   <div style={{ flex:1, padding:16, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative" }}>
//                     {activeItem.previewUrl ? <img src={activeItem.previewUrl} style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain", borderRadius:8, boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }} /> : <div style={{fontSize:40}}>📄</div>}
//                     {activeItem.status === "extracting" && <div style={{ position:"absolute", inset:16, borderRadius:8, overflow:"hidden", border:`2px solid ${teal}` }}><div className="scan-line" /></div>}
//                   </div>

//                   {!isMobile && (
//                     <div style={{ padding:16, background:surf, borderTop:`1px solid ${bord}` }}>
//                       <button className="btn btn-teal" style={{ width:"100%" }} onClick={()=>runExtract(queue.indexOf(activeItem))} disabled={extracting || activeItem.status==="submitted"}>
//                         {extracting ? "Extracting..." : "🤖 Run AI Extraction"}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Form Area */}
//               {(activeItem || showManual) && (
//                 <div style={{ flex:1, overflowY:"auto", padding: isMobile ? 16 : 24 }}>

//                   {isMobile && !showManual && (
//                     <div style={{ marginBottom: 16 }}>
//                       <button className="btn btn-teal" style={{ width:"100%" }} onClick={()=>runExtract(queue.indexOf(activeItem as any))} disabled={extracting || activeItem?.status==="submitted"}>
//                           {extracting ? "Extracting..." : "🤖 Run AI Extraction"}
//                       </button>
//                     </div>
//                   )}

//                   {isMobile && showManual && (
//                      <div style={{ paddingBottom:"16px", display:"flex", alignItems:"center" }}>
//                         <button onClick={()=>setShowManual(false)} style={{ background:"none", border:"none", color:ink, fontSize:24, paddingRight:16 }}>←</button>
//                         <div style={{ fontSize:16, fontWeight:700, color:teal }}>MANUAL ENTRY</div>
//                      </div>
//                   )}

//                   {!isMobile && showManual && (
//                     <div style={{ paddingBottom:"20px", display:"flex", alignItems:"center", gap: 10 }}>
//                         <div style={{ fontSize:20, fontWeight:700, color:teal }}>✏️ MANUAL ENTRY</div>
//                         <button onClick={()=>setShowManual(false)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:inkM, fontSize:18 }}>✕ Cancel</button>
//                     </div>
//                   )}

//                   {flags.length > 0 && <div style={{ marginBottom:20 }}>{flags.map((f,i) => <FraudBadge key={i} flag={f} dark={dark} />)}</div>}

//                   <div style={{ marginBottom:16 }}>
//                     <label style={{ fontSize:10, fontWeight:700, color:inkL, marginBottom:8, display:"block" }}>TRANSACTION TYPE</label>
//                     <div style={{ display:"flex", gap:10 }}>
//                       <button className="type-btn" onClick={()=>setField("type","credit")} style={{ background:form.type==="credit"?`${teal}20`:"transparent", borderColor:form.type==="credit"?teal:bord2, color:form.type==="credit"?teal:inkM }}>▲ CREDIT</button>
//                       <button className="type-btn" onClick={()=>setField("type","debit")} style={{ background:form.type==="debit"?`${coral}20`:"transparent", borderColor:form.type==="debit"?coral:bord2, color:form.type==="debit"?coral:inkM }}>▼ DEBIT</button>
//                     </div>
//                   </div>

//                   <div style={{ background: form.type==="credit"?`${teal}10`:`${coral}10`, border:`1px solid ${form.type==="credit"?teal:coral}40`, borderRadius:8, padding:"16px", marginBottom:20 }}>
//                     <label style={{ fontSize:10, fontWeight:700, color:form.type==="credit"?teal:coral, marginBottom:8, display:"block" }}>AMOUNT (₹)</label>
//                     <input type="number" value={form.amount} onChange={e=>setField("amount",e.target.value)} placeholder="0.00" style={{ width:"100%", background:"transparent", border:"none", outline:"none", fontSize:40, fontWeight:700, color:form.type==="credit"?teal:coral, fontFamily:"'JetBrains Mono',monospace" }} />
//                   </div>

//                   <Field label="Transaction ID" value={form.txId} onChange={(v:string)=>setField("txId",v)} mono dark={dark} />
//                   <Field label="Category" value={form.category} onChange={(v:string)=>setField("category",v)} options={CATEGORIES} dark={dark} />
//                   <Field label="Sender Name" value={form.senderName} onChange={(v:string)=>setField("senderName",v)} dark={dark} />
//                   <Field label="Receiver Name" value={form.receiverName} onChange={(v:string)=>setField("receiverName",v)} dark={dark} />

//                   <div style={{ display:"flex", gap:12 }}>
//                     <div style={{flex:1}}><Field label="Date" type="date" value={form.date} onChange={(v:string)=>setField("date",v)} dark={dark} /></div>
//                     <div style={{flex:1}}><Field label="Time" type="time" value={form.time} onChange={(v:string)=>setField("time",v)} dark={dark} /></div>
//                   </div>

//                   <Field label="Notes" value={form.notes} onChange={(v:string)=>setField("notes",v)} dark={dark} />

//                   <div style={{ marginTop:24 }}>
//                     <button className="btn btn-teal" onClick={submitTransaction} disabled={!form.amount || submitLoading || (activeItem?.status==="submitted" && !showManual)} style={{ width:"100%", padding:"16px", fontSize:16, background: flags.some(f=>f.level==="critical")?coral:teal, color: flags.some(f=>f.level==="critical")?"#fff":"#000", borderColor: flags.some(f=>f.level==="critical")?coral:teal }}>
//                       {submitLoading ? "Saving..." : (activeItem?.status==="submitted" && !showManual) ? "✅ Saved to Ledger" : "💾 Submit Transaction"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Mobile FAB Camera Button */}
//             {isMobile && activeIdx === null && !showManual && (
//               <button className="fab" onClick={()=>cameraRef.current?.click()}>📸</button>
//             )}
//           </>
//         )}

//         {/* ════ LEDGER VIEW ════ */}
//         {view === "ledger" && (
//           <div style={{ flex:1, overflowY:"auto", padding: isMobile ? 12 : 24, background:bg }}>

//             {/* KPI Cards */}
//             <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap:12, marginBottom:24 }}>
//               <div style={{ background:surf, padding:16, borderRadius:8, border:`1px solid ${bord}` }}>
//                 <div style={{ fontSize:10, color:inkM, fontWeight:700 }}>CREDIT</div>
//                 <div style={{ fontSize:20, color:teal, fontWeight:700 }}>₹{totalCredit.toLocaleString("en-IN")}</div>
//               </div>
//               <div style={{ background:surf, padding:16, borderRadius:8, border:`1px solid ${bord}` }}>
//                 <div style={{ fontSize:10, color:inkM, fontWeight:700 }}>DEBIT</div>
//                 <div style={{ fontSize:20, color:coral, fontWeight:700 }}>₹{totalDebit.toLocaleString("en-IN")}</div>
//               </div>
//               <div style={{ background:surf, padding:16, borderRadius:8, border:`1px solid ${bord}`, gridColumn: isMobile ? "span 2" : "span 1" }}>
//                 <div style={{ fontSize:10, color:inkM, fontWeight:700 }}>NET BALANCE</div>
//                 <div style={{ fontSize:24, color:netBalance>=0?teal:coral, fontWeight:700 }}>{netBalance>=0?"+":"−"}₹{Math.abs(netBalance).toLocaleString("en-IN")}</div>
//               </div>
//             </div>

//             {/* Table */}
//             <div style={{ background:surf, borderRadius:8, border:`1px solid ${bord}`, overflowX:"auto" }}>
//               <table style={{ width:"100%", borderCollapse:"collapse", minWidth: 600 }}>
//                 <thead style={{ background:surf2, borderBottom:`1px solid ${bord}`, textAlign:"left", fontSize:11, color:inkL }}>
//                   <tr>
//                     <th style={{ padding:"12px 16px" }}>Time</th>
//                     <th style={{ padding:"12px 16px" }}>Amount</th>
//                     <th style={{ padding:"12px 16px" }}>Type</th>
//                     <th style={{ padding:"12px 16px" }}>Category</th>
//                     <th style={{ padding:"12px 16px" }}>Operator</th>
//                     <th style={{ padding:"12px 16px" }}>TX ID</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {submitted.length === 0 ? (
//                     <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:inkL }}>No transactions submitted yet.</td></tr>
//                   ) : submitted.map((tx, i) => (
//                     <tr key={i} style={{ borderBottom:`1px solid ${bord}` }}>
//                       <td style={{ padding:"12px 16px", fontSize:12, color:inkM }}>{tx.time}</td>
//                       <td style={{ padding:"12px 16px", fontSize:14, fontWeight:700, color:tx.type==="credit"?teal:coral }}>₹{parseFloat(tx.amount).toLocaleString("en-IN")}</td>
//                       <td style={{ padding:"12px 16px", fontSize:12, color:tx.type==="credit"?teal:coral }}>{tx.type==="credit"?"▲ CR":"▼ DR"}</td>
//                       <td style={{ padding:"12px 16px", fontSize:12, color:ink }}>{tx.category}</td>
//                       <td style={{ padding:"12px 16px", fontSize:12, color:ink }}>{tx.operator}</td>
//                       <td style={{ padding:"12px 16px", fontSize:11, color:inkM, fontFamily:"'JetBrains Mono',monospace" }}>{tx.txId || "—"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




















"use client";
import { useAuth } from "@/components/AuthProvider";
import React, { useState, useEffect, useRef, useCallback, type DragEvent } from "react";

// ════════════════════════════════════════════════════════════════════════════════
// DUAL THEME TOKENS (from reference admin panel)
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
// THEME CSS GENERATOR
// ════════════════════════════════════════════════════════════════════════════════
function buildCss(T: ThemeTokens): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px;}
.serif{font-family:'DM Serif Display',serif;}
.mono{font-family:'DM Mono',monospace;}

/* NAV */
.top-nav-link{
  display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
  font-size:12px;font-weight:600;color:${T.navText};cursor:pointer;
  transition:all .15s;text-decoration:none;border:1px solid transparent;white-space:nowrap;
}
.top-nav-link:hover{background:rgba(255,255,255,0.12);color:${T.navTextHover};}

/* SECTION TABS */
.sec-tab{
  display:flex;flex-direction:column;align-items:center;gap:4px;
  padding:10px 22px;cursor:pointer;background:transparent;border:none;
  border-bottom:2px solid transparent;color:${T.subTabText};
  font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  transition:all .15s;font-family:'DM Sans',sans-serif;
}
.sec-tab.on{color:${T.subTabActive};border-bottom-color:${T.subTabBorder};}
.sec-tab:hover:not(.on){color:${T.textSecondary};}

/* QUEUE ROW */
.q-item{
  padding:13px 14px;cursor:pointer;border-bottom:1px solid ${T.divider};
  transition:background .12s;display:flex;gap:12px;align-items:center;position:relative;
}
.q-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:transparent;border-radius:0 2px 2px 0;transition:background .2s;}
.q-item:hover{background:${T.rowHover};}
.q-item.active{background:${T.chatRowActiveBg};}
.q-item.active::before{background:${T.chatRowActiveBorder};}

/* CARD */
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;
  overflow:hidden;box-shadow:${T.cardShadow};}

/* SECTION HEADER */
.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

/* INPUT */
.inp{
  width:100%;padding:10px 14px;background:${T.inputBg};border:1px solid ${T.inputBorder};
  border-radius:7px;color:${T.inputText};font-size:13.5px;outline:none;
  transition:border-color .18s,background .18s;font-family:'DM Sans',sans-serif;
}
.inp:focus{border-color:${T.inputFocusBorder};}
.inp::placeholder{color:${T.inputPlaceholder};}
/* ✨ FIX: Dynamic Select Option colors in Dark Mode */
select option {
  background-color: ${T.pageBg}; /* MUST be a solid hex color, browsers reject rgba here */
  color: ${T.textPrimary};
  font-weight: 600;
}
select.inp option{background:${T.modalBg};color:${T.inputText};}

/* BUTTONS */
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

/* TYPE TOGGLE */
.type-btn{flex:1;padding:14px 10px;border-radius:10px;font-size:13px;
  font-weight:700;cursor:pointer;font-family:'DM Mono',monospace;
  border:2px solid;transition:all .2s;text-align:center;letter-spacing:.04em;}
.type-btn:hover{transform:translateY(-1px);}

/* SUBMIT */
.submit-btn{width:100%;padding:15px;border:none;border-radius:12px;
  font-size:15px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .2s;letter-spacing:.02em;}
.submit-btn:hover:not(:disabled){transform:translateY(-2px);}
.submit-btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important;}

/* UPLOAD */
.upload-zone{border:2.5px dashed ${T.accentBorder};border-radius:16px;
  padding:40px 20px;text-align:center;cursor:pointer;transition:all .2s;
  background:${T.cardBg};}
.upload-zone:hover,.upload-zone.dragover{border-color:${T.accent};background:${T.accentLight};}

/* KPI */
.kpi-card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:14px;
  padding:18px 20px;position:relative;overflow:hidden;box-shadow:${T.cardShadow};}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}

/* LEDGER TABLE */
.ledger-table{width:100%;border-collapse:collapse;}
.ledger-table th{padding:11px 16px;text-align:left;font-size:10px;
  font-weight:800;text-transform:uppercase;letter-spacing:.08em;
  color:${T.textMuted};background:${T.inputBg};border-bottom:2px solid ${T.divider};}
.ledger-table td{padding:12px 16px;border-bottom:1px solid ${T.divider};
  font-size:13px;color:${T.textPrimary};vertical-align:middle;}
.ledger-table tr:hover td{background:${T.rowHover};}
.ledger-table tr:last-child td{border-bottom:none;}

/* THEME TOGGLE */
.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

/* MOBILE DETAIL */
.mobile-detail{position:fixed;inset:0;z-index:150;background:${T.pageBg};
  display:flex;flex-direction:column;overflow:hidden;
  animation:slideUp .3s cubic-bezier(.34,1.56,.64,1);}

/* SCAN */
.ai-scan-bar{position:absolute;left:0;right:0;height:3px;
  background:linear-gradient(90deg,transparent,${T.accent},transparent);
  animation:scan 1.5s linear infinite;border-radius:2px;}

/* ANIMS */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideUp{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}
@keyframes spinSlow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes scan{0%{top:0;}100%{top:100%;}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
@keyframes ripple{0%{box-shadow:0 0 0 0 ${T.accent}33;}70%{box-shadow:0 0 0 10px transparent;}100%{box-shadow:0 0 0 0 transparent;}}

@media(max-width:768px){
  .nav-links{display:none!important;}
  .nav-divider{display:none!important;}
  .desktop-only{display:none!important;}
}
@media(min-width:769px){
  .mobile-only{display:none!important;}
}
`;
}

// ════════════════════════════════════════════════════════════════════════════════
// ICONS (inline SVG)
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
// AVATAR
// ════════════════════════════════════════════════════════════════════════════════
function Avatar({ name, size = 40, isDark }: { name?: string | null; size?: number; isDark: boolean }) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  const grad = isDark
    ? "linear-gradient(135deg,#334155,#1e293b)"
    : "linear-gradient(135deg,#64748b,#475569)";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: grad,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
      border: "1.5px solid rgba(255,255,255,0.18)"
    }}>
      {ch}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION HEADER
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
// TYPES (UNCHANGED)
// ════════════════════════════════════════════════════════════════════════════════
type TxType = "credit" | "debit";
type QueueStatus = "idle" | "extracting" | "review" | "submitted" | "error";

interface ExtractedData {
  txId: string;
  senderName: string;
  receiverName: string;
  amount: string;
  type: TxType;
  category: string;
  date: string;
  time: string;
  bank: string;
  upiId: string;
  rawText: string;
  confidence: {
    overall: number;
    txId: number;
    amount: number;
    names: number;
    datetime: number;
    category: number;
  };
}

interface TxForm extends ExtractedData {
  notes: string;
  operator: string;
}

interface FraudFlag {
  level: "critical" | "warning" | "info";
  msg: string;
  detail: string;
}

interface QueueItem {
  id: string;
  file: File;
  previewUrl: string | null;
  status: QueueStatus;
  form: TxForm | null;
  flags: FraudFlag[];
  error: string;
}

interface SubmittedTx extends TxForm {
  id?: string;
  queueId: string;
  submittedAt: string;
  flags: FraudFlag[];
  fileName: string;
}

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS (UNCHANGED)
// ════════════════════════════════════════════════════════════════════════════════
const CATEGORIES = [
  "UPI Transfer", "Bank Transfer", "NEFT/RTGS",
  "Wallet (Paytm/PhonePe)", "Cash Deposit", "Cash Withdrawal",
  "Recharge", "Bill Payment", "IMPS", "Other",
];
const OPERATORS = ["Ramesh Ji", "Priya Devi", "Deepak Yadav", "Anjali Gupta"];
const EMPTY_FORM: TxForm = {
  txId: "", senderName: "", receiverName: "", amount: "",
  type: "credit", category: "UPI Transfer", date: "", time: "",
  bank: "", upiId: "", rawText: "", notes: "", operator: OPERATORS[0],
  confidence: { overall: 0, txId: 0, amount: 0, names: 0, datetime: 0, category: 0 },
};

// ════════════════════════════════════════════════════════════════════════════════
// UTILS (UNCHANGED)
// ════════════════════════════════════════════════════════════════════════════════
function detectFraud(form: TxForm, existing: SubmittedTx[]): FraudFlag[] {
  const flags: FraudFlag[] = [];
  const amt = parseFloat(form.amount || "0");
  if (form.txId && existing.some(t => t.txId && t.txId.toLowerCase() === form.txId.toLowerCase()))
    flags.push({ level: "critical", msg: "Duplicate Transaction ID", detail: `"${form.txId}" already exists in today's ledger` });
  const sameAmt = existing.filter(t => Math.abs(parseFloat(t.amount || "0") - amt) < 1 && t.type === form.type);
  if (sameAmt.length >= 2)
    flags.push({ level: "warning", msg: "Repeated amount detected", detail: `₹${amt} (${form.type}) appears ${sameAmt.length + 1} times` });
  if (amt >= 50000 && amt % 10000 === 0)
    flags.push({ level: "warning", msg: "Large round-figure transaction", detail: `₹${amt.toLocaleString("en-IN")} — verify manually` });
  if (!form.txId)
    flags.push({ level: "info", msg: "Transaction ID missing", detail: "OCR couldn't extract TX ID — fill manually" });
  if (!form.senderName && !form.receiverName)
    flags.push({ level: "info", msg: "Party names missing", detail: "Neither sender nor receiver name extracted" });
  return flags;
}

async function extractWithGroq(file: File): Promise<ExtractedData> {
  const base64 = await new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res((reader.result as string).split(",")[1]);
    reader.onerror = () => rej(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
  const response = await fetch("/api/admin/ocr-extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64, mimeType: file.type }),
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || err.message || "OCR API error");
  }
  const data = await response.json();
  return data.extracted as ExtractedData;
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function TransactionApp() {
  // THEME STATE
  const [isDark, setIsDark] = useState(false);
  const T = isDark ? THEMES.dark : THEMES.light;

  // ─── Original State ───────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [form, setForm] = useState<TxForm>(EMPTY_FORM);
  const [flags, setFlags] = useState<FraudFlag[]>([]);
  const [submitted, setSubmitted] = useState<SubmittedTx[]>([]);
  const [view, setView] = useState<"queue" | "ledger">("queue");
  const [showManual, setShowManual] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();


  // ─── Effects (UNCHANGED) ────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, [user]);

  useEffect(() => {
    async function loadLedger() {
      try {
        const res = await fetch("/api/admin/transactions");
        if (res.ok) { const data = await res.json(); setSubmitted(data.transactions || []); }
      } catch (err) { console.error("Failed to fetch ledger", err); }
    }
    loadLedger();
  }, []);

  useEffect(() => {
    if (!form.amount && !form.txId) { setFlags([]); return; }
    setFlags(detectFraud(form, submitted));
  }, [form.txId, form.amount, form.type, submitted]);

  // ─── HANDLERS ─── (Preserved Exactly)
  const toggleTheme = () => {
    const newDark = !isDark; setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  // ─── Helpers (UNCHANGED) ────────────────────────────────────────────────
  const setField = <K extends keyof TxForm>(key: K, val: TxForm[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const activeItem = activeIdx !== null ? queue[activeIdx] : null;

  const totalCredit = submitted.filter(t => t.type === "credit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0);
  const totalDebit = submitted.filter(t => t.type === "debit").reduce((a, t) => a + parseFloat(t.amount || "0"), 0);
  const netBalance = totalCredit - totalDebit;

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/") || f.type === "application/pdf");
    if (!arr.length) return;
    const newItems: QueueItem[] = arr.map(file => ({
      id: `Q-${Date.now().toString().slice(-4)}`,
      file, previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      status: "idle", form: null, flags: [], error: "",
    }));
    setQueue(prev => {
      const updated = [...prev, ...newItems];
      if (activeIdx === null) setTimeout(() => { setActiveIdx(prev.length); if (isMobile) setMobileShowDetail(true); }, 50);
      return updated;
    });
  }, [activeIdx, isMobile]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files);
  };

  const selectItem = (idx: number) => {
    const item = queue[idx];
    if (!item) return;
    setActiveIdx(idx);
    setForm(item.form || { ...EMPTY_FORM, operator: OPERATORS[0] });
    setFlags(item.flags || []);
    setShowManual(false);
    if (isMobile) setMobileShowDetail(true);
  };

  const runExtract = async (idx: number) => {
    const item = queue[idx];
    if (!item || extracting) return;
    setExtracting(true);
    setQueue(prev => prev.map((q, i) => i === idx ? { ...q, status: "extracting" } : q));
    try {
      const extracted = await extractWithGroq(item.file);
      const newForm: TxForm = {
        txId: extracted.txId || "", senderName: extracted.senderName || "",
        receiverName: extracted.receiverName || "", amount: extracted.amount?.toString() || "",
        type: extracted.type === "debit" ? "debit" : "credit",
        category: CATEGORIES.includes(extracted.category) ? extracted.category : "UPI Transfer",
        date: extracted.date || new Date().toISOString().split("T")[0],
        time: extracted.time || new Date().toTimeString().slice(0, 5),
        bank: extracted.bank || "", upiId: extracted.upiId || "",
        rawText: extracted.rawText || "", notes: "", operator: OPERATORS[0],
        confidence: extracted.confidence || { overall: 70, txId: 60, amount: 80, names: 65, datetime: 70, category: 75 },
      };
      const newFlags = detectFraud(newForm, submitted);
      setQueue(prev => prev.map((q, i) => i === idx ? { ...q, status: "review", form: newForm, flags: newFlags } : q));
      setForm(newForm); setFlags(newFlags);
    } catch (err: any) {
      setQueue(prev => prev.map((q, i) => i === idx ? { ...q, status: "error", error: err.message } : q));
      setFlags([{ level: "critical", msg: "AI Extraction Failed", detail: err.message + " — use manual entry" }]);
    } finally { setExtracting(false); }
  };

  const submitTransaction = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    if (flags.some(f => f.level === "critical") && !window.confirm("Critical fraud flags detected. Submit anyway?")) return;
    setSubmitLoading(true);
    try {
      const payload = {
        ...form,
        queueId: activeItem?.id || `MAN-${Date.now()}`,
        flags: flags,
        fileName: activeItem?.file.name || "manual",
      };
      const res = await fetch("/api/admin/transactions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save transaction to database");
      const ledgerRes = await fetch("/api/admin/transactions");
      if (ledgerRes.ok) { const d = await ledgerRes.json(); setSubmitted(d.transactions || []); }
      if (showManual) {
        setShowManual(false); setForm(EMPTY_FORM); setFlags([]);
      } else if (activeIdx !== null) {
        setQueue(prev => prev.map((q, i) => i === activeIdx ? { ...q, status: "submitted" } : q));
        const nextIdx = queue.findIndex((q, i) => i > activeIdx && q.status === "idle");
        if (nextIdx !== -1) { selectItem(nextIdx); setTimeout(() => runExtract(nextIdx), 100); }
        else { setActiveIdx(null); setForm(EMPTY_FORM); if (isMobile) setMobileShowDetail(false); }
      }
    } catch (err: any) { alert("Submit failed: " + err.message); }
    finally { setSubmitLoading(false); }
  };

  const statusColor = (s: QueueStatus) => ({ idle: T.textMuted, extracting: "#d97706", review: T.accent, submitted: "#16a34a", error: "#dc2626" }[s] || T.textMuted);
  const statusIcon = (s: QueueStatus) => ({ idle: "○", extracting: "◌", review: "◉", submitted: "✓", error: "✕" }[s] || "○");

  const creditFlags = flags.some(f => f.level === "critical");

  // ─── Sub-components (themed) ────────────────────────────────────────────
  function FraudBadge({ flag }: { flag: FraudFlag }) {
    const cfg = {
      critical: { bg: isDark ? "rgba(220,38,38,0.12)" : "#fff1f2", border: isDark ? "rgba(252,165,165,0.3)" : "#fca5a5", color: isDark ? "#f87171" : "#b91c1c", icon: "🚨", label: "CRITICAL" },
      warning: { bg: isDark ? "rgba(217,119,6,0.12)" : "#fffbeb", border: isDark ? "rgba(252,211,77,0.3)" : "#fcd34d", color: isDark ? "#fbbf24" : "#b45309", icon: "⚠️", label: "WARNING" },
      info: { bg: isDark ? "rgba(37,99,235,0.12)" : "#eff6ff", border: isDark ? "rgba(147,197,253,0.3)" : "#93c5fd", color: isDark ? "#93c5fd" : "#1d4ed8", icon: "ℹ️", label: "INFO" },
    }[flag.level];
    return (
      <div style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: cfg.color, letterSpacing: "0.06em", marginBottom: 2 }}>{cfg.label} · {flag.msg}</div>
          <div style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.5 }}>{flag.detail}</div>
        </div>
      </div>
    );
  }

  function ConfBar({ value, label }: { value: number; label: string }) {
    const color = value >= 85 ? "#16a34a" : value >= 60 ? "#d97706" : "#dc2626";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: T.textMuted, width: 76, flexShrink: 0, fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{label}</span>
        <div style={{ flex: 1, height: 4, background: T.divider, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
        </div>
        <span style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color, width: 28, textAlign: "right", fontWeight: 700 }}>{value}%</span>
      </div>
    );
  }

  function FormField({ label, value, onChange, type = "text", options, mono, aiTag, prefix, required }: any) {
    const [focused, setFocused] = useState(false);
    const base: React.CSSProperties = {
      width: "100%",
      padding: prefix ? "9px 12px 9px 28px" : "9px 12px",
      border: `1.5px solid ${aiTag ? (focused ? T.accent : T.accentBorder) : (focused ? T.inputFocusBorder : T.inputBorder)}`,
      borderRadius: 8, backgroundColor: focused ? (isDark?"#1e293b":T.cardBg) : (isDark?"#0f172a":T.inputBg), // ✨ FIX: Use solid hex colors and backgroundColor
      color: T.inputText, fontSize: 13,
      fontFamily: mono ? "'DM Mono',monospace" : "'DM Sans',sans-serif",
      outline: "none", transition: "all 0.18s",
      boxShadow: focused ? `0 0 0 3px ${isDark ? T.accentBorder : "#1d4ed820"}` : "none",
    };
    return (
      <div style={{ marginBottom: 12 }}>
        <label style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
          color: aiTag ? T.accent : T.textMuted,
          marginBottom: 5, display: "flex", alignItems: "center", gap: 6
        }}>
          {label}
          {required && <span style={{ color: "#ef4444" }}>*</span>}
          {aiTag && value && (
            <span style={{ fontSize: 9, background: T.accentLight, border: `1px solid ${T.accentBorder}`, color: T.accent, borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>
              AI FILLED
            </span>
          )}
        </label>
        {options ? (
          <select value={value} onChange={e => onChange(e.target.value)}
            style={{
              ...base, cursor: "pointer", appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center"
            }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <div style={{ position: "relative" }}>
            {prefix && <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: T.inputPlaceholder, pointerEvents: "none", fontFamily: "'DM Mono',monospace" }}>{prefix}</span>}
            <input type={type} value={value} onChange={e => onChange(e.target.value)} style={base}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
          </div>
        )}
      </div>
    );
  }

  // ─── NAV LINKS ──────────────────────────────────────────────────────────
  const navLinks = [
    { label: "Admin", href: "/admin", icon: "⚙️" },
    { label: "Posts", href: "/admin/posts", icon: "📝" },
    { label: "Gallery", href: "/admin/galary", icon: "🖼️" },
    { label: "Transactions", href: "/admin/transactions", icon: "₹" },
    { label: "Profile", href: "/dashboard/profile", icon: "👤" },
  ];

  return (
    <div style={{
      background: T.pageBg, color: T.textPrimary, height: "100dvh", display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif", overflow: "hidden", transition: "background .25s, color .25s"
    }}>
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

      {/* ═══ HEADER ═══ */}
      <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>

        {/* Row 1 — brand + nav links + toggle */}
        <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Brand */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
            <div>
              <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
                CSC<span style={{ color: T.navBrandAccent }}>Entry</span>
              </div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>TRANSACTION PORTAL</div>
            </div>
          </a>

          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

          {/* Nav links */}
          <nav className="nav-links" style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="top-nav-link">
                <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </nav>

          {/* Theme toggle */}
          <button className="tog" onClick={toggleTheme}>
            <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
          </button>

          {/* User chip */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
            <Avatar name="Admin" size={28} isDark={isDark} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Operator</div>
              <div className="mono" style={{ fontSize: 9, color: T.navBrandAccent, marginTop: 2, letterSpacing: ".07em" }}>ADMIN</div>
            </div>
          </div>
        </div>

        {/* Row 2 — view tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 8, background: "rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", paddingLeft: 8, background: "rgba(0,0,0,0.12)" }}>
            <button className={`sec-tab ${view === "queue" ? "on" : ""}`}
              onClick={() => { setView("queue"); setActiveIdx(null); setShowManual(false); }}>
              <span style={{ fontSize: 17 }}>📥</span>Queue
              {queue.filter(q => q.status === "idle").length > 0 && (
                <span style={{ background: T.navBottomBorder, color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 10, padding: "1px 6px", minWidth: 16, marginLeft: 4 }}>
                  {queue.filter(q => q.status === "idle").length}
                </span>
              )}
            </button>
            <button className={`sec-tab ${view === "ledger" ? "on" : ""}`}
              onClick={() => setView("ledger")}>
              <span style={{ fontSize: 17 }}>📋</span>Ledger
            </button>
          </div>
          {/* ✨ FIX: Manual Entry Button Restored */}
          <button
            className="btn btn-outline"
            style={{ justifyContent: "center", height: 32, marginBottom: 2, border: `1px solid ${T.accentBorder}`, color: T.accent }}
            onClick={() => {
              setShowManual(true);
              setActiveIdx(null);
              setForm({ ...EMPTY_FORM, operator: user?.name || "Admin" });
              setFlags([]);
            }}
          >
            ✏️ Manual Entry
          </button>
        </div>
      </header>

      {/* Hidden file inputs (UNCHANGED) */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf" style={{ display: "none" }} onChange={e => e.target.files && addFiles(e.target.files)} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => e.target.files && addFiles(e.target.files)} />

      {/* ═══ BODY ═══ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* ──────────── QUEUE VIEW ──────────── */}
        {view === "queue" && (
          <>
            {/* DESKTOP: 3-column layout */}
            <div className="desktop-only" style={{ display: "flex", flex: 1, overflow: "hidden" }}>

              {/* Column 1 – Queue list */}
              <div style={{ width: 280, background: T.sidebarBg, borderRight: `1px solid ${T.divider}`, display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: isDark ? "none" : "2px 0 8px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: 12, borderBottom: `1px solid ${T.divider}`, background: T.sidebarHeaderBg }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="btn btn-g" style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "7px 8px" }}>
                      📂 Gallery
                    </button>
                    <button onClick={() => cameraRef.current?.click()}
                      className="btn btn-g" style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "7px 8px" }}>
                      📸 Camera
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted, textAlign: "center", fontWeight: 600 }}>
                    {queue.length === 0 ? "No items" : `${queue.length} item${queue.length > 1 ? "s" : ""} · ${queue.filter(q => q.status === "submitted").length} submitted`}
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                  {queue.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center" }}>
                      <div style={{ width: 60, height: 60, borderRadius: 16, background: T.accentLight, border: `2px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 14px" }}>📸</div>
                      <div style={{ fontSize: 13, color: T.textSecondary, fontWeight: 600, marginBottom: 6 }}>Queue is empty</div>
                      <div style={{ fontSize: 12, color: T.textMuted }}>Upload receipts or take photos</div>
                    </div>
                  ) : queue.map((item, idx) => (
                    <div key={item.id} className={`q-item ${activeIdx === idx ? "active" : ""}`} onClick={() => selectItem(idx)}>
                      <div style={{ width: 46, height: 46, borderRadius: 9, background: T.pageBg, overflow: "hidden", position: "relative", flexShrink: 0, border: `1px solid ${T.divider}` }}>
                        {item.previewUrl
                          ? <img src={item.previewUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                          : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: T.textMuted }}>📄</div>}
                        {item.status === "extracting" && (
                          <div style={{ position: "absolute", inset: 0, background: "rgba(37,99,235,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} />
                          </div>
                        )}
                        {item.status === "submitted" && (
                          <div style={{ position: "absolute", inset: 0, background: "rgba(22,163,74,0.75)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>✓</div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                          <span style={{ fontSize: 9, fontWeight: 800, color: statusColor(item.status), textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Mono',monospace" }}>
                            {statusIcon(item.status)} {item.status}
                          </span>
                          {item.flags.some(f => f.level === "critical") && <span style={{ fontSize: 9 }}>🚨</span>}
                        </div>
                        <div style={{ fontSize: 12, color: T.textPrimary, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.file.name}</div>
                        {item.form?.amount && (
                          <div style={{ fontSize: 12, color: item.form.type === "credit" ? "#16a34a" : "#dc2626", fontWeight: 700, marginTop: 2, fontFamily: "'DM Mono',monospace" }}>
                            {item.form.type === "credit" ? "▲" : "▼"} ₹{parseFloat(item.form.amount).toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2 – Image preview */}
              {(activeItem || showManual) && (
                <div style={{ width: 340, borderRight: `1px solid ${T.divider}`, background: T.inputBg, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                  {activeItem && !showManual ? (
                    <>
                      <div style={{ flex: 1, padding: 20, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop}>
                        {dragOver && <div style={{ position: "absolute", inset: 0, background: `${T.accent}14`, border: "3px dashed " + T.accent, borderRadius: 12, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: T.accent, fontWeight: 700 }}>Drop to add</div>}
                        {activeItem.previewUrl
                          ? <img src={activeItem.previewUrl} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} alt="receipt" />
                          : <div style={{ textAlign: "center", color: T.textMuted }}><div style={{ fontSize: 48, marginBottom: 8 }}>📄</div><div style={{ fontSize: 13 }}>PDF Document</div></div>}
                        {activeItem.status === "extracting" && (
                          <div style={{ position: "absolute", inset: 20, borderRadius: 12, overflow: "hidden", border: "2px solid " + T.accent, pointerEvents: "none" }}>
                            <div className="ai-scan-bar" />
                            <div style={{ position: "absolute", inset: 0, background: `${T.accent}0F` }} />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.divider}`, background: T.cardBg }}>
                        {activeItem.status === "submitted" ? (
                          <div style={{ padding: 13, background: isDark ? "rgba(22,163,74,0.15)" : "#f0fdf4", border: "1.5px solid " + (isDark ? "rgba(134,239,172,0.3)" : "#86efac"), borderRadius: 10, textAlign: "center", color: "#16a34a", fontWeight: 700, fontSize: 14 }}>
                            ✅ Submitted to Ledger
                          </div>
                        ) : (
                          <button onClick={() => runExtract(queue.indexOf(activeItem))} disabled={extracting}
                            className="btn btn-p" style={{ width: "100%", padding: "13px", justifyContent: "center", fontSize: 14, boxShadow: extracting ? "none" : "0 4px 14px " + T.btnPrimaryGlow }}>
                            {extracting
                              ? <><div style={{ width: 16, height: 16, border: "2px solid " + (isDark ? T.accentBorder : "#93c5fd"), borderTopColor: T.accent, borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} /> Extracting with AI…</>
                              : <>🤖 Run AI Extraction</>}
                          </button>
                        )}
                        {activeItem.form?.confidence?.overall && activeItem.form.confidence.overall > 0 && (
                          <div style={{ marginTop: 12 }}>
                            <button onClick={() => setShowConfidence(!showConfidence)}
                              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: T.textMuted, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", fontFamily: "'DM Sans',sans-serif" }}>
                              <span>AI Confidence · {activeItem.form.confidence.overall || 0}%</span>
                              <span>{showConfidence ? "▲" : "▼"}</span>
                            </button>
                            {showConfidence && (
                              <div style={{ marginTop: 8 }}>
                                {(Object.entries(activeItem.form.confidence) as [string, number][])
                                  .filter(([k]) => k !== "overall")
                                  .map(([k, v]) => <ConfBar key={k} label={k} value={v} />)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, textAlign: "center" }}>
                      <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg,${T.accentLight},${T.accentBorder})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>✏️</div>
                      <div>
                        <div className="serif" style={{ fontSize: 18, color: T.textPrimary, marginBottom: 6 }}>Manual Entry</div>
                        <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6 }}>Fill in transaction details manually without a receipt image</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Column 3 – Form */}
              {(activeItem || showManual) ? (
                <div style={{ flex: 1, overflowY: "auto", padding: 24, background: T.pageBg }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      <div className="serif" style={{ fontSize: 20, color: T.textPrimary }}>
                        {showManual ? "Manual Transaction" : "Review & Submit"}
                      </div>
                      <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 2 }}>
                        {showManual ? "Enter details manually" : `Source: ${activeItem?.file.name}`}
                      </div>
                    </div>
                    {showManual && (
                      <button onClick={() => setShowManual(false)} className="btn btn-g" style={{ fontSize: 12 }}>✕ Cancel</button>
                    )}
                  </div>

                  {flags.length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      {flags.map((f, i) => <FraudBadge key={i} flag={f} />)}
                    </div>
                  )}

                  {/* Type toggle */}
                  <div className="card" style={{ marginBottom: 16 }}>
                    <SecHdr icon="💳" label="Transaction Type" />
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button className="type-btn" onClick={() => setField("type", "credit")} style={{
                          background: form.type === "credit" ? (isDark ? "rgba(34,197,94,0.12)" : "#f0fdf4") : "transparent",
                          borderColor: form.type === "credit" ? (isDark ? "rgba(187,247,208,0.4)" : "#22c55e") : (isDark ? T.cardBorder : "#e2e8f0"),
                          color: form.type === "credit" ? "#16a34a" : T.textMuted,
                          boxShadow: form.type === "credit" ? "0 4px 12px rgba(34,197,94,0.2)" : "none",
                        }}>▲ CREDIT IN</button>
                        <button className="type-btn" onClick={() => setField("type", "debit")} style={{
                          background: form.type === "debit" ? (isDark ? "rgba(248,113,113,0.12)" : "#fff1f2") : "transparent",
                          borderColor: form.type === "debit" ? (isDark ? "rgba(254,202,202,0.4)" : "#f87171") : (isDark ? T.cardBorder : "#e2e8f0"),
                          color: form.type === "debit" ? "#dc2626" : T.textMuted,
                          boxShadow: form.type === "debit" ? "0 4px 12px rgba(248,113,113,0.2)" : "none",
                        }}>▼ DEBIT OUT</button>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="card" style={{ marginBottom: 16 }}>
                    <div style={{ padding: "20px 20px 16px" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: form.type === "credit" ? "#16a34a" : "#dc2626", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: form.type === "credit" ? (isDark ? "rgba(34,197,94,0.2)" : "#dcfce7") : (isDark ? "rgba(239,68,68,0.2)" : "#fee2e2"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                          {form.type === "credit" ? "▲" : "▼"}
                        </div>
                        Amount (₹) *
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 28, color: T.textMuted, fontFamily: "'DM Mono',monospace", fontWeight: 500 }}>₹</span>
                        <input type="number" value={form.amount} onChange={e => setField("amount", e.target.value)}
                          placeholder="0.00"
                          style={{
                            flex: 1, background: "transparent", border: "none", outline: "none",
                            fontSize: 40, fontWeight: 700, fontFamily: "'DM Mono',monospace",
                            color: form.type === "credit" ? "#16a34a" : "#dc2626", padding: 0
                          }} />
                      </div>
                      <div style={{ height: 2, background: `linear-gradient(90deg,${form.type === "credit" ? "#22c55e" : "#ef4444"},transparent)`, marginTop: 8, borderRadius: 1 }} />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="card" style={{ marginBottom: 16 }}>
                    <SecHdr icon="📄" label="Transaction Details" />
                    <div style={{ padding: "14px 16px" }}>
                      <FormField label="Transaction ID" value={form.txId} onChange={(v: string) => setField("txId", v)} mono aiTag={!!activeItem?.form?.txId} />
                      <FormField label="Category" value={form.category} onChange={(v: string) => setField("category", v)} options={CATEGORIES} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <FormField label="Date" type="date" value={form.date} onChange={(v: string) => setField("date", v)} required aiTag={!!activeItem?.form?.date} />
                        <FormField label="Time" type="time" value={form.time} onChange={(v: string) => setField("time", v)} aiTag={!!activeItem?.form?.time} />
                      </div>
                    </div>
                  </div>

                  {/* Parties */}
                  <div className="card" style={{ marginBottom: 16 }}>
                    <SecHdr icon="👤" label="Parties" />
                    <div style={{ padding: "14px 16px" }}>
                      <FormField label="Sender Name" value={form.senderName} onChange={(v: string) => setField("senderName", v)} aiTag={!!activeItem?.form?.senderName} />
                      <FormField label="Receiver Name" value={form.receiverName} onChange={(v: string) => setField("receiverName", v)} aiTag={!!activeItem?.form?.receiverName} />
                      <FormField label="Bank / Wallet" value={form.bank} onChange={(v: string) => setField("bank", v)} aiTag={!!activeItem?.form?.bank} />
                      <FormField label="UPI ID" value={form.upiId} onChange={(v: string) => setField("upiId", v)} mono aiTag={!!activeItem?.form?.upiId} />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="card" style={{ marginBottom: 20 }}>
                    <SecHdr icon="📝" label="Meta" />
                    <div style={{ padding: "14px 16px" }}>
                      {/* <FormField label="Operator" value={form.operator} onChange={(v: string) => setField("operator", v)} options={OPERATORS} /> */}
                      <FormField
                        label="Operator"
                        value={user?.name || "Admin"}
                        onChange={() => { }}
                        prefix="👤"
                        readOnly={true}
                      />
                      <FormField label="Notes" value={form.notes} onChange={(v: string) => setField("notes", v)} />
                    </div>
                  </div>

                  {/* Submit */}
                  <button className="submit-btn btn-p" onClick={submitTransaction}
                    disabled={!form.amount || parseFloat(form.amount) <= 0 || submitLoading || (activeItem?.status === "submitted" && !showManual)}
                    style={{
                      background: (activeItem?.status === "submitted" && !showManual)
                        ? "linear-gradient(135deg,#16a34a,#15803d)"
                        : creditFlags
                          ? "linear-gradient(135deg,#dc2626,#b91c1c)"
                          : T.btnPrimary,
                      color: "#fff",
                      boxShadow: (activeItem?.status === "submitted" && !showManual) ? "0 4px 14px rgba(22,163,74,0.35)" : creditFlags ? "0 4px 14px rgba(220,38,38,0.35)" : T.btnPrimaryGlow,
                    }}>
                    {submitLoading
                      ? <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} /> Saving…</>
                      : (activeItem?.status === "submitted" && !showManual)
                        ? "✅ Saved to Ledger"
                        : creditFlags
                          ? "🚨 Submit with Warnings"
                          : "💾 Submit Transaction"}
                  </button>
                </div>
              ) : (
                /* Empty state */
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: 40 }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop}>
                  <div className={`upload-zone ${dragOver ? "dragover" : ""}`} style={{ width: "100%", maxWidth: 420, cursor: "default" }}
                    onClick={() => fileInputRef.current?.click()}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg,${T.accentLight},${T.accentBorder})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 16px" }}>📷</div>
                    <div className="serif" style={{ fontSize: 20, color: T.textPrimary, marginBottom: 8 }}>Drop receipts here</div>
                    <div style={{ fontSize: 13, color: T.textSecondary, marginBottom: 16 }}>or click to browse files</div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                      {["JPG", "PNG", "PDF", "WEBP"].map(ext => (
                        <span key={ext} style={{ background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: T.accent }}>{ext}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE: List view */}
            <div className="mobile-only" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.pageBg }}>
              <div style={{ flex: 1, overflowY: "auto", background: T.cardBg }}>
                {queue.length === 0 ? (
                  <div style={{ padding: 60, textAlign: "center" }}>
                    <div style={{ fontSize: 52, marginBottom: 14, opacity: 0.5, color: T.textMuted }}>📸</div>
                    <div className="serif" style={{ fontSize: 20, color: T.textPrimary, marginBottom: 8 }}>No receipts yet</div>
                    <div style={{ fontSize: 13, color: T.textSecondary }}>Tap the camera button to capture a bill</div>
                  </div>
                ) : queue.map((item, idx) => (
                  <div key={item.id} className="q-item" onClick={() => selectItem(idx)}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, background: T.pageBg, overflow: "hidden", position: "relative", flexShrink: 0, border: `1px solid ${T.divider}` }}>
                      {item.previewUrl
                        ? <img src={item.previewUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                        : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: T.textMuted }}>📄</div>}
                      {item.status === "submitted" && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(22,163,74,0.8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20 }}>✓</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{item.file.name}</span>
                        <span style={{ fontSize: 9, fontWeight: 800, color: statusColor(item.status), textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, marginLeft: 6, fontFamily: "'DM Mono',monospace" }}>{item.status}</span>
                      </div>
                      {item.form?.amount
                        ? <div style={{ fontSize: 14, color: item.form.type === "credit" ? "#16a34a" : "#dc2626", fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{item.form.type === "credit" ? "▲" : "▼"} ₹{parseFloat(item.form.amount).toLocaleString("en-IN")}</div>
                        : <div style={{ fontSize: 12, color: T.textMuted }}>Tap to review →</div>}
                    </div>
                    <span style={{ color: T.divider, fontSize: 18, flexShrink: 0 }}>›</span>
                  </div>
                ))}
              </div>

              {/* Mobile camera FAB */}
              <button style={{ position: "fixed", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%", background: T.btnPrimary, color: T.btnPrimaryText, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 6px 20px " + T.btnPrimaryGlow, zIndex: 200, border: "none", cursor: "pointer", animation: "ripple 2s infinite" }} onClick={() => cameraRef.current?.click()}>📸</button>
            </div>

            {/* MOBILE: Detail sheet */}
            {isMobile && mobileShowDetail && (activeItem || showManual) && (
              <div className="mobile-detail">
                <div style={{ background: T.navBg, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <button onClick={() => { setMobileShowDetail(false); setShowManual(false); }}
                    style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, cursor: "pointer" }}>←</button>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{showManual ? "Manual Entry" : activeItem?.file.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>{showManual ? "Fill transaction details" : "Tap Extract AI to auto-fill"}</div>
                  </div>
                  {activeItem && !showManual && (
                    <span style={{ fontSize: 10, fontWeight: 800, color: statusColor(activeItem.status), background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 8px", fontFamily: "'DM Mono',monospace", textTransform: "uppercase" }}>{activeItem.status}</span>
                  )}
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                  {activeItem?.previewUrl && !showManual && (
                    <div style={{ height: 200, background: T.pageBg, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={activeItem.previewUrl} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} alt="receipt" />
                      {activeItem.status === "extracting" && (
                        <div style={{ position: "absolute", inset: 0, background: `${T.accent}26`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: T.accent, fontWeight: 700, fontSize: 14 }}>
                          <div style={{ width: 20, height: 20, border: "2px solid " + (isDark ? T.accentBorder : "#93c5fd"), borderTopColor: T.accent, borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} /> Extracting…
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ padding: 16 }}>
                    {activeItem && !showManual && activeItem.status !== "submitted" && (
                      <button onClick={() => runExtract(queue.indexOf(activeItem))} disabled={extracting}
                        className="btn btn-p" style={{ width: "100%", padding: 14, justifyContent: "center", fontSize: 14, marginBottom: 16, boxShadow: extracting ? "none" : "0 4px 14px " + T.btnPrimaryGlow }}>
                        {extracting ? <><div style={{ width: 16, height: 16, border: "2px solid " + (isDark ? T.accentBorder : "#93c5fd"), borderTopColor: T.accent, borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} /> Extracting…</> : <>🤖 Run AI Extraction</>}
                      </button>
                    )}

                    {flags.length > 0 && <div style={{ marginBottom: 16 }}>{flags.map((f, i) => <FraudBadge key={i} flag={f} />)}</div>}

                    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                      <button className="type-btn" onClick={() => setField("type", "credit")} style={{ background: form.type === "credit" ? (isDark ? "rgba(34,197,94,0.12)" : T.cardBg) : T.cardBg, borderColor: form.type === "credit" ? (isDark ? "rgba(187,247,208,0.4)" : "#22c55e") : (isDark ? T.cardBorder : T.divider), color: form.type === "credit" ? "#16a34a" : T.textMuted }}>▲ CREDIT</button>
                      <button className="type-btn" onClick={() => setField("type", "debit")} style={{ background: form.type === "debit" ? (isDark ? "rgba(248,113,113,0.12)" : T.cardBg) : T.cardBg, borderColor: form.type === "debit" ? (isDark ? "rgba(254,202,202,0.4)" : "#f87171") : (isDark ? T.cardBorder : T.divider), color: form.type === "debit" ? "#dc2626" : T.textMuted }}>▼ DEBIT</button>
                    </div>

                    <div style={{ background: T.cardBg, borderRadius: 12, padding: "16px", border: `2px solid ${form.type === "credit" ? (isDark ? "rgba(187,247,208,0.3)" : "#bbf7d0") : (isDark ? "rgba(254,202,202,0.3)" : "#fecaca")}`, marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: form.type === "credit" ? "#16a34a" : "#dc2626", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Amount (₹)*</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 24, color: T.textMuted, fontFamily: "'DM Mono',monospace" }}>₹</span>
                        <input type="number" value={form.amount} onChange={e => setField("amount", e.target.value)} placeholder="0.00"
                          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 36, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: form.type === "credit" ? "#16a34a" : "#dc2626" }} />
                      </div>
                    </div>

                    <div style={{ background: T.cardBg, borderRadius: 12, padding: 16, border: `1px solid ${isDark ? T.cardBorder : T.divider}`, marginBottom: 16 }}>
                      <FormField label="Transaction ID" value={form.txId} onChange={(v: string) => setField("txId", v)} mono aiTag={!!activeItem?.form?.txId} />
                      <FormField label="Category" value={form.category} onChange={(v: string) => setField("category", v)} options={CATEGORIES} />
                      <FormField label="Sender" value={form.senderName} onChange={(v: string) => setField("senderName", v)} aiTag={!!activeItem?.form?.senderName} />
                      <FormField label="Receiver" value={form.receiverName} onChange={(v: string) => setField("receiverName", v)} aiTag={!!activeItem?.form?.receiverName} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <FormField label="Date" type="date" value={form.date} onChange={(v: string) => setField("date", v)} />
                        <FormField label="Time" type="time" value={form.time} onChange={(v: string) => setField("time", v)} />
                      </div>
                      <FormField label="Operator" value={form.operator} onChange={(v: string) => setField("operator", v)} options={OPERATORS} />
                      <FormField label="Notes" value={form.notes} onChange={(v: string) => setField("notes", v)} />
                    </div>

                    <button className="submit-btn" onClick={submitTransaction}
                      disabled={!form.amount || parseFloat(form.amount) <= 0 || submitLoading || (activeItem?.status === "submitted" && !showManual)}
                      style={{ background: (activeItem?.status === "submitted" && !showManual) ? "linear-gradient(135deg,#16a34a,#15803d)" : creditFlags ? "linear-gradient(135deg,#dc2626,#b91c1c)" : T.btnPrimary, color: "#fff", boxShadow: "0 4px 14px " + T.btnPrimaryGlow, marginBottom: 32 }}>
                      {submitLoading
                        ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} /> Saving…</>
                        : (activeItem?.status === "submitted" && !showManual) ? "✅ Saved to Ledger"
                          : "💾 Submit Transaction"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ──────────── LEDGER VIEW ──────────── */}
        {view === "ledger" && (
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 12 : 24, background: T.pageBg }}>

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
              <div className="kpi-card" style={{ borderTop: "3px solid #22c55e" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Total Credit</div>
                <div className="serif" style={{ fontSize: isMobile ? 22 : 28, color: "#16a34a", lineHeight: 1 }}>₹{totalCredit.toLocaleString("en-IN")}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{submitted.filter(t => t.type === "credit").length} transactions</div>
              </div>
              <div className="kpi-card" style={{ borderTop: "3px solid #f87171" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Total Debit</div>
                <div className="serif" style={{ fontSize: isMobile ? 22 : 28, color: "#dc2626", lineHeight: 1 }}>₹{totalDebit.toLocaleString("en-IN")}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{submitted.filter(t => t.type === "debit").length} transactions</div>
              </div>
              <div className="kpi-card" style={{ borderTop: `3px solid ${netBalance >= 0 ? T.accent : "#f97316"}`, gridColumn: isMobile ? "span 2" : "span 1" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Net Balance</div>
                <div className="serif" style={{ fontSize: isMobile ? 22 : 28, color: netBalance >= 0 ? T.accent : "#f97316", lineHeight: 1 }}>
                  {netBalance >= 0 ? "+" : "−"}₹{Math.abs(netBalance).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{submitted.length} total entries</div>
              </div>
            </div>

            {/* Ledger table */}
            <div className="card" style={{ overflowX: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${T.divider}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>Transaction Ledger</span>
                <span style={{ background: T.accentLight, color: T.accent, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 10px", border: `1px solid ${T.accentBorder}` }}>{submitted.length} entries</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="ledger-table" style={{ minWidth: 600 }}>
                  <thead>
                    <tr>
                      <th>Date / Time</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Parties</th>
                      <th>Operator</th>
                      <th>TX ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submitted.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: T.textMuted }}>
                        <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.4 }}>📋</div>
                        No transactions yet. Submit one from the queue.
                      </td></tr>
                    ) : submitted.map((tx, i) => (
                      <tr key={i} style={{ animation: `fadeUp 0.3s ease ${i * 0.03}s both` }}>
                        <td>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}>{tx.date}</div>
                          <div style={{ fontSize: 11, color: T.textMuted, fontFamily: "'DM Mono',monospace" }}>{tx.time}</div>
                        </td>
                        <td>
                          <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 800, fontSize: 14, color: tx.type === "credit" ? "#16a34a" : "#dc2626" }}>
                            {tx.type === "credit" ? "+" : "-"}₹{parseFloat(tx.amount || "0").toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: tx.type === "credit" ? (isDark ? "rgba(34,197,94,0.12)" : "#f0fdf4") : (isDark ? "rgba(248,113,113,0.12)" : "#fff1f2"), color: tx.type === "credit" ? "#16a34a" : "#dc2626", border: `1.5px solid ${tx.type === "credit" ? (isDark ? "rgba(187,247,208,0.3)" : "#bbf7d0") : (isDark ? "rgba(254,202,202,0.3)" : "#fecaca")}` }}>
                            {tx.type === "credit" ? "▲ CR" : "▼ DR"}
                          </span>
                        </td>
                        <td style={{ color: T.textSecondary, fontSize: 12 }}>{tx.category}</td>
                        <td>
                          {tx.senderName && <div style={{ fontSize: 12, color: T.textPrimary, fontWeight: 600 }}>{tx.senderName}</div>}
                          {tx.receiverName && <div style={{ fontSize: 11, color: T.textMuted }}>→ {tx.receiverName}</div>}
                        </td>
                        <td>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.inputBg, border: `1px solid ${T.divider}`, borderRadius: 7, padding: "4px 10px" }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: T.accent }}>
                              {(tx.operator || "?")[0].toUpperCase()}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}>{tx.operator}</span>
                          </div>
                        </td>
                        <td>
                          {tx.txId
                            ? <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: T.textSecondary, background: T.inputBg, border: `1px solid ${T.divider}`, borderRadius: 5, padding: "2px 7px" }}>{tx.txId}</span>
                            : <span style={{ color: T.divider, fontSize: 12 }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}