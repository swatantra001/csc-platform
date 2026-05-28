
"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import type { DbPost } from "./PostClient";

export default function SemanticBot({ post, color, isDark }: { post: DbPost; color: string; isDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [extractor, setExtractor] = useState<any>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<{ text: string; embedding: any }[]>([]);
  
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Loading AI model... Please wait a moment." }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    async function loadAI() {
      try {
        const { pipeline, env } = await import(
          /* webpackIgnore: true */
          // @ts-ignore
          "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"
        );
        
        env.allowLocalModels = false;

        const generateEmbedding = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        setExtractor(() => generateEmbedding);

        const start = post.important_dates?.find(d => d.label.toLowerCase().includes("start"))?.date;
        const end = post.important_dates?.find(d => d.label.toLowerCase().includes("last"))?.date;
        
        const rawFacts = [
          `The online application starts on ${start ? new Date(start).toLocaleDateString() : 'To Be Announced'}.`,
          `The last date to submit the application is ${end ? new Date(end).toLocaleDateString() : 'To Be Announced'}.`,
          `The application fee for General, OBC, and EWS candidates is ₹${post.fee_general}.`,
          `The application fee for SC, ST, and Female candidates is ₹${post.fee_sc_st}.`,
          `The application fee for Physically Handicapped (PH) candidates is ₹${post.fee_ph}.`,
          `Payment can be made via ${post.fee_payment_modes?.join(", ") || "online modes"}.`,
          `The minimum age limit is ${post.age_min} years.`,
          `The maximum age limit is ${post.age_max}.`,
          `Age is calculated as on ${post.age_as_on_date ? new Date(post.age_as_on_date).toLocaleDateString() : 'To Be Announced'}.`,
          `Age relaxation details: ${post.age_relaxation || 'As per government rules.'}`,
          `There are a total of ${post.total_posts || (post.vacancy_details || []).reduce((a, b) => a + Number(b.no_of_posts), 0)} vacancies available.`,
          ...(post.eligibility || []).map(e => `To be eligible for ${e.post_name}, candidates must have: ${e.criteria}`),
          ...(post.important_links || []).map(l => `The official link for ${l.label} is: ${l.url}`),
          `To apply, follow these steps: ${post.how_to_apply || 'Please check the official website.'}`,
          ...(post.faqs || []).map(f => `Regarding ${f.question}, the answer is: ${f.answer}`)
        ];

        const kb = [];
        for (const text of rawFacts) {
          const output = await generateEmbedding(text, { pooling: 'mean', normalize: true });
          kb.push({ text, embedding: output.data });
        }
        
        setKnowledgeBase(kb);
        setIsReady(true);
        setMessages([
          { role: "bot", text: "Hi! I'm your AI Assistant. I have read this notification. Ask me anything!" }
        ]);

      } catch (error) {
        console.error("AI Load Error:", error);
        setMessages([
          { role: "bot", text: "Sorry, I couldn't load the AI engine. Please check your internet connection." }
        ]);
      }
    }
    
    if (isOpen && !isReady && !extractor) {
      loadAI();
    }
  }, [isOpen, isReady, extractor, post]);

  const cosineSimilarity = (a: any, b: any) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !isReady || !extractor) return;
    
    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");

    const q = text.toLowerCase();
    if (q.includes("hi") || q.includes("hello")) {
      setMessages(prev => [...prev, { role: "bot", text: "Hello! How can I help you with this recruitment today?" }]);
      return;
    }

    try {
      const userOutput = await extractor(text, { pooling: 'mean', normalize: true });
      const userVector = userOutput.data;

      let bestMatch = "";
      let highestScore = -1;

      for (const fact of knowledgeBase) {
        const score = cosineSimilarity(userVector, fact.embedding);
        if (score > highestScore && score > 0.25) {
          highestScore = score;
          bestMatch = fact.text;
        }
      }

      if (bestMatch) {
        setMessages(prev => [...prev, { role: "bot", text: bestMatch }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: "I'm not sure about that. The notification doesn't seem to explicitly mention it." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "I encountered an error trying to understand your question." }]);
    }
  };

  const PREDEFINED_QUESTIONS = ["Last date?", "Application fee?", "Age limit?", "Apply Link?"];

  const botBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const botBorder = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const chatBg = isDark ? "#080d17" : "#f8fafc";
  const bubbleBot = isDark ? "rgba(255,255,255,0.05)" : "#ffffff";
  const bubbleBotBorder = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const textBot = isDark ? "#f1f5f9" : "#1e293b";
  const inputBgBot = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";
  const inputBorderBot = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ position: "fixed", bottom: 24, right: 24, width: 60, height: 60, borderRadius: "50%", background: color, color: "#fff", border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", cursor: "pointer", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, transition: "transform .2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div style={{ position: "fixed", bottom: 24, right: 24, width: 360, height: 520, background: botBg, borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", zIndex: 1000, display: "flex", flexDirection: "column", border: `1px solid ${botBorder}`, overflow: "hidden", animation: "pop .2s ease" }}>
          
          <div style={{ background: color, color: "#fff", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <span>CSC AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", padding: 4 }}>✕</button>
          </div>

          <div style={{ flex: 1, padding: 16, overflowY: "auto", background: chatBg, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ 
                  maxWidth: "85%", 
                  padding: "10px 14px", 
                  borderRadius: 13, 
                  background: m.role === "user" ? color : bubbleBot, 
                  color: m.role === "user" ? "#fff" : textBot, 
                  border: m.role === "user" ? "none" : `1px solid ${bubbleBotBorder}`, 
                  fontSize: 13, 
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                  boxShadow: m.role === "user" ? `0 2px 8px ${color}44` : "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isReady && messages[messages.length - 1]?.role === "bot" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {PREDEFINED_QUESTIONS.map((q, idx) => (
                  <button key={idx} onClick={() => handleSend(q)} style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "transparent"}`, color: color, fontSize: 11, padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontWeight: 600, transition: "all .15s" }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: 12, borderTop: `1px solid ${botBorder}`, background: botBg, display: "flex", gap: 8, flexShrink: 0 }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleSend(input); }}
              placeholder={isReady ? "Ask a question..." : "Loading AI..."}
              disabled={!isReady}
              style={{ flex: 1, padding: "10px 14px", border: `1px solid ${inputBorderBot}`, borderRadius: 20, outline: "none", fontSize: 13, background: inputBgBot, color: textBot, fontFamily: "'DM Sans', sans-serif" }}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || !isReady}
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: "50%", 
                background: input.trim() && isReady ? color : isDark ? "rgba(255,255,255,0.1)" : "#94a3b8", 
                color: "#fff", 
                border: "none", 
                cursor: input.trim() && isReady ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                transition: "all .15s"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}