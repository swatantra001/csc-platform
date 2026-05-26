"use client";

import React, { useState } from "react";

// ─── MOCK DATA ───
const mockCert = {
  roll_no: "893412452",
  created_at: new Date().toISOString(),
  student_name: "Neelu Maurya",
  father_name: "Ram Prasad Maurya",
  mother_name: "Sita Devi",
  course_name: "Advanced Diploma in Computer Applications (ADCA)",
  grade: "A+",
  duration: "12 Months",
};

export default function TestCertificatePage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExcelCertPdf = async (cert: any) => {
    setIsGenerating(true);
    try {
      const [{ toJpeg }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const verifyUrl = `${window.location.origin}/verify/${cert.roll_no}`;
      const issueDate = new Date(cert.created_at || Date.now()).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      const createdAt = new Date(cert.created_at || Date.now()).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      
      container.innerHTML = `
      <div style="width:1123px;height:794px;background:#f8f6f0;position:relative;box-sizing:border-box;font-family:'Georgia','Times New Roman',serif;color:#1a1a2e;overflow:hidden;">
        
        <!-- SVG GENERATED WAVE TEXTURE (No image file needed) -->
        <svg style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.12;pointer-events:none;z-index:0;" preserveAspectRatio="none">
          <defs>
            <pattern id="waveTexture" x="0" y="0" width="400" height="100" patternUnits="userSpaceOnUse">
              <!-- Seamless wavy bezier curves -->
              <path d="M0,20 C100,5 200,35 300,20 S400,5 400,20" fill="none" stroke="#1a3a5c" stroke-width="0.6" opacity="0.8"/>
              <path d="M0,40 C100,25 200,55 300,40 S400,25 400,40" fill="none" stroke="#1a3a5c" stroke-width="0.5" opacity="0.6"/>
              <path d="M0,60 C100,45 200,75 300,60 S400,45 400,60" fill="none" stroke="#1a3a5c" stroke-width="0.5" opacity="0.5"/>
              <path d="M0,80 C100,65 200,95 300,80 S400,65 400,80" fill="none" stroke="#1a3a5c" stroke-width="0.4" opacity="0.4"/>
              <path d="M0,100 C100,85 200,115 300,100 S400,85 400,100" fill="none" stroke="#1a3a5c" stroke-width="0.4" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waveTexture)"/>
        </svg>

        <div style="position:absolute;inset:0;opacity:0.04;background-image:repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(26,58,138,0.03) 35px,rgba(26,58,138,0.03) 70px);pointer-events:none;"></div>
        
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:120px;font-weight:900;color:rgba(26,58,138,0.025);letter-spacing:20px;white-space:nowrap;pointer-events:none;font-family:'DM Sans',sans-serif;">SRILALSAHAJ</div>
        <div style="position:absolute;top:30%;left:20%;transform:rotate(25deg);font-size:80px;font-weight:900;color:rgba(26,58,138,0.02);letter-spacing:15px;pointer-events:none;font-family:'DM Sans',sans-serif;">SRILALSAHAJ</div>
        <div style="position:absolute;top:70%;left:60%;transform:rotate(-15deg);font-size:90px;font-weight:900;color:rgba(26,58,138,0.02);letter-spacing:15px;pointer-events:none;font-family:'DM Sans',sans-serif;">SRILALSAHAJ</div>

        <svg style="position:absolute;top:0;left:0;width:100%;height:260px;pointer-events:none;" viewBox="0 0 1123 260" preserveAspectRatio="none">
          <path d="M0,0 L1123,0 L1123,70 Q800,190 400,110 Q200,70 0,150 Z" fill="#0a1628"/>
          <path d="M0,18 L1123,18 L1123,83 Q800,203 400,123 Q200,83 0,163 Z" fill="none" stroke="#c9a227" stroke-width="3"/>
          <path d="M0,32 L1123,32 L1123,92 Q800,212 400,132 Q200,92 0,172 Z" fill="none" stroke="#d4af37" stroke-width="1.5" opacity="0.6"/>
          <path d="M0,45 L1123,45 L1123,100 Q800,220 400,140 Q200,100 0,180 Z" fill="none" stroke="#e8c547" stroke-width="0.8" opacity="0.4"/>
        </svg>

        <div style="position:absolute;top:40px;left:50px;z-index:10;">
          <svg width="120" height="120" viewBox="0 0 130 130">
            <defs>
              <radialGradient id="gold-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f4e4a6"/>
                <stop offset="40%" stop-color="#d4af37"/>
                <stop offset="70%" stop-color="#c9a227"/>
                <stop offset="100%" stop-color="#8b6914"/>
              </radialGradient>
              <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
              </filter>
            </defs>
            <path d="M65,5 L72,25 L92,18 L82,35 L105,42 L85,52 L100,70 L80,68 L85,90 L68,78 L65,100 L58,78 L38,90 L45,68 L25,70 L42,52 L22,42 L45,35 L35,18 L55,25 Z" fill="url(#gold-grad)" filter="url(#seal-shadow)" stroke="#b8941f" stroke-width="1"/>
            <circle cx="65" cy="55" r="38" fill="#0a1628" stroke="#d4af37" stroke-width="2.5"/>
            <circle cx="65" cy="55" r="32" fill="none" stroke="#c9a227" stroke-width="0.8" stroke-dasharray="3,2"/>
            <text x="65" y="32" text-anchor="middle" fill="#d4af37" font-size="10">★ ★ ★</text>
            <text x="65" y="85" text-anchor="middle" fill="#d4af37" font-size="10">★</text>
            <text x="65" y="48" text-anchor="middle" fill="#f4e4a6" font-size="9" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="1">HONORED</text>
            <text x="65" y="62" text-anchor="middle" fill="#d4af37" font-size="11" font-weight="800" font-family="'DM Sans',sans-serif" letter-spacing="1">MENTION</text>
          </svg>
        </div>

        <div style="position:absolute;top:45px;right:55px;text-align:center;z-index:10;">
          <div style="width:65px;height:65px;border-radius:50%;border:3px solid #c9a227;background:linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%);margin:0 auto;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(0,0,0,0.2);">
            <span style="font-size:26px;">🏛️</span>
          </div>
          <div style="font-size:10px;font-weight:700;color:#0a1628;margin-top:6px;font-family:'DM Sans',sans-serif;letter-spacing:1;">SRILAL SAHAJ</div>
          <div style="font-size:8px;color:#64748b;font-family:'DM Sans',sans-serif;letter-spacing:0.5;">JANSEVA KENDRA</div>
        </div>

        <div style="position:absolute;top:30px;left:30px;width:55px;height:55px;border-top:2.5px solid #c9a227;border-left:2.5px solid #c9a227;opacity:0.7;"></div>
        <div style="position:absolute;top:30px;right:30px;width:55px;height:55px;border-top:2.5px solid #c9a227;border-right:2.5px solid #c9a227;opacity:0.7;"></div>
        <div style="position:absolute;bottom:30px;left:30px;width:55px;height:55px;border-bottom:2.5px solid #c9a227;border-left:2.5px solid #c9a227;opacity:0.7;"></div>
        <div style="position:absolute;bottom:30px;right:30px;width:55px;height:55px;border-bottom:2.5px solid #c9a227;border-right:2.5px solid #c9a227;opacity:0.7;"></div>

        <div style="position:absolute;top:150px;left:80px;right:80px;bottom:40px;display:flex;flex-direction:column;align-items:center;text-align:center;">
          
          <div style="font-size:48px;font-weight:400;color:#1a1a2e;text-transform:uppercase;letter-spacing:8px;font-family:'Playfair Display','Georgia',serif;">Certificate</div>
          
          <div style="background:linear-gradient(90deg,#0a1628 0%,#1a3a5c 50%,#0a1628 100%);color:#f4e4a6;padding:8px 45px;border-radius:30px;font-size:15px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-top:10px;font-family:'DM Sans',sans-serif;box-shadow:0 4px 15px rgba(10,22,40,0.3);">
            of Achievement
          </div>

          <div style="margin-top:22px;display:flex;align-items:center;gap:12px;">
            <div style="width:6px;height:6px;background:#c9a227;border-radius:50%;"></div>
            <div style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:2.5px;font-family:'DM Sans',sans-serif;font-weight:500;">
              This Certificate is Proudly Presented to
            </div>
            <div style="width:6px;height:6px;background:#c9a227;border-radius:50%;"></div>
          </div>

          <div style="margin-top:16px;position:relative;width:100%;">
            <div style="font-size:52px;font-weight:400;color:#1a1a2e;font-family:'Great Vibes','Brush Script MT','Georgia',cursive;letter-spacing:2px;line-height:1;">
              ${cert.student_name}
            </div>
            
            <div style="margin-top:0px;display:flex;align-items:center;justify-content:center;gap:0;width:100%;">
              <div style="width:180px;height:1.5px;background:linear-gradient(90deg,transparent,#c9a227);"></div>
              <div style="width:8px;height:8px;background:#c9a227;transform:rotate(45deg);margin:0 12px;box-shadow:0 0 6px rgba(201,162,39,0.4);"></div>
              <div style="width:180px;height:1.5px;background:linear-gradient(90deg,#c9a227,transparent);"></div>
            </div>
          </div>

          <div style="margin-top:16px;display:flex;justify-content:center;gap:50px;width:100%;">
            <div style="text-align:center;">
              <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;">Father's Name</div>
              <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:3px;font-family:'DM Sans',sans-serif;">${cert.father_name || "—"}</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;">Mother's Name</div>
              <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:3px;font-family:'DM Sans',sans-serif;">${cert.mother_name || "—"}</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;">Roll Number</div>
              <div style="font-size:14px;font-weight:700;color:#b8941f;margin-top:3px;font-family:'JetBrains Mono',monospace;">${cert.roll_no}</div>
            </div>
          </div>
          <div style="margin-top:16px;font-size:14px;color:#475569;line-height:1.7;max-width:720px;font-family:'DM Sans',sans-serif;">
            This is to certify that <strong style="color:#1a3a5c;">${cert.student_name}</strong> 
            <span style="color:#64748b;font-size:12px;">(Roll No: <strong style="color:#b8941f;">${cert.roll_no}</strong>)</span> 
            has successfully completed the training and examination in 
            <strong style="color:#1a3a5c;">${cert.course_name}</strong> with 
            <strong style="color:#b8941f;">Grade ${cert.grade || "—"}</strong> under the guidance and supervision of 
            <strong style="color:#1a3a5c;">Srilal Yadav</strong>, Proprietor & Director of Srilal Sahaj Janseva Kendra, 
            Shambhuganj, Jaunpur — 222132, Uttar Pradesh. This certificate is awarded in recognition of their 
            dedication, hard work, and successful completion of all prescribed requirements.
          </div>
        </div>

        <div style="position:absolute;bottom:55px;left:80px;right:80px;height:110px;display:flex;align-items:flex-end;justify-content:space-between;">

          <div style="display:flex;align-items:center;gap:10px;">
            <div style="border:2px solid #c9a227;border-radius:6px;padding:5px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
              <img crossorigin="anonymous" src="https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${encodeURIComponent(verifyUrl)}" width="75" height="75" style="display:block;" />
            </div>
            <div style="padding-bottom:4px;">
              <div style="font-size:10px;font-weight:700;color:#1a3a5c;font-family:'DM Sans',sans-serif;">Scan to Verify</div>
              <div style="font-size:8px;color:#8b7355;font-family:'JetBrains Mono',monospace;margin-top:2px;">ID: ${cert.roll_no}</div>
              <div style="font-size:8px;color:#8b7355;font-family:'DM Sans',sans-serif;margin-top:1px;">${createdAt}</div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;align-items:center;padding-bottom:5px;">
            <svg width="100" height="100" viewBox="0 0 125 125">
              <defs>
                <radialGradient id="seal-gold" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#f4e4a6"/>
                  <stop offset="30%" stop-color="#e8c547"/>
                  <stop offset="60%" stop-color="#d4af37"/>
                  <stop offset="100%" stop-color="#8b6914"/>
                </radialGradient>
                <filter id="seal-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
              </defs>
              <circle cx="62.5" cy="62.5" r="58" fill="none" stroke="url(#seal-gold)" stroke-width="3" filter="url(#seal-glow)"/>
              <circle cx="62.5" cy="62.5" r="55" fill="#0a1628" stroke="#c9a227" stroke-width="1.5"/>
              <circle cx="62.5" cy="62.5" r="48" fill="none" stroke="#c9a227" stroke-width="0.8" stroke-dasharray="4,3" opacity="0.6"/>
              <circle cx="62.5" cy="62.5" r="42" fill="none" stroke="#d4af37" stroke-width="0.5" opacity="0.4"/>
              <circle cx="62.5" cy="62.5" r="38" fill="url(#ink-seal-bg)"/>
              <text x="62.5" y="48" text-anchor="middle" fill="#d4af37" font-size="22">👑</text>
              <text x="62.5" y="68" text-anchor="middle" fill="#f4e4a6" font-size="8" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="0.5">SRILAL</text>
              <text x="62.5" y="80" text-anchor="middle" fill="#d4af37" font-size="8" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="0.5">SAHAJ</text>
              <path id="seal-arc" d="M 25,62.5 A 37.5,37.5 0 0,1 100,62.5" fill="none"/>
              <text fill="#c9a227" font-size="7" font-family="'DM Sans',sans-serif" letter-spacing="2">
                <textPath href="#seal-arc" startOffset="50%" text-anchor="middle">JANSEVA KENDRA</textPath>
              </text>
            </svg>
          </div>

          <div style="display:flex;flex-direction:column;align-items:flex-between;padding-bottom:8px;">
            <svg width="200" height="70" viewBox="0 0 350 180" style="display:block;">
              <path d="M 65 110 C 50 120, 50 100, 65 70 C 80 40, 100 20, 100 30 C 100 40, 75 90, 85 95 C 95 100, 105 75, 110 95 C 115 105, 125 75, 125 95 C 135 45, 140 40, 135 95 C 145 80, 150 80, 150 95 C 160 45, 165 40, 160 95 C 165 95, 170 85, 175 85" fill="none" stroke="#11214d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M 190 65 C 190 90, 210 90, 215 65 C 205 100, 195 160, 180 150 C 165 140, 180 110, 215 85 C 225 75, 230 75, 230 90 C 240 75, 250 75, 245 90 C 255 40, 255 40, 250 90 C 260 75, 270 75, 265 90 C 275 85, 280 75, 280 85 C 290 95, 295 90, 310 85" fill="none" stroke="#11214d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="120" cy="40" r="2.5" fill="#11214d" />
            </svg>
           
            <div style="border-top:1.5px solid #1a1a2e;width:180px;padding-top:0px;text-align:center;">
              <div style="font-size:13px;font-weight:700;color:#1a1a2e;font-family:'DM Sans',sans-serif;">Srilal Yadav</div>
              <div style="font-size:9px;color:#8b7355;font-family:'DM Sans',sans-serif;margin-top:2px;letter-spacing:0.3px;">Authorized Signatory & Proprietor</div>
            </div>
          </div>
        </div>

        <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px;">
          <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,#c9a227);"></div>
          <div style="width:5px;height:5px;background:#c9a227;border-radius:50%;"></div>
          <div style="font-size:8px;color:#8b7355;letter-spacing:1.5px;font-family:'DM Sans',sans-serif;">SHAMBHUGANJ, JAUNPUR — 222132, UTTAR PRADESH</div>
          <div style="width:5px;height:5px;background:#c9a227;border-radius:50%;"></div>
          <div style="width:80px;height:1px;background:linear-gradient(90deg,#c9a227,transparent);"></div>
        </div>

      </div>`;

      document.body.appendChild(container);

      const dataUrl = await toJpeg(container.firstElementChild as HTMLElement, {
        quality: 0.98,
        backgroundColor: "#f8f6f0",
        pixelRatio: 2,
      });
      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(dataUrl, "JPEG", 0, 0, 297, 210);
      window.open(pdf.output("bloburl"), "_blank");
    } catch (err) {
      console.error("Certificate generation failed:", err);
      alert("Failed to generate certificate PDF.");
    } finally {
      setIsGenerating(false);
      const tempElement = document.body.lastElementChild;
      if (tempElement && tempElement.tagName === 'DIV') {
        document.body.removeChild(tempElement);
      }
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>Certificate PDF Tester</h2>
      <button 
        onClick={() => generateExcelCertPdf(mockCert)} 
        disabled={isGenerating}
        style={{
          padding: "12px 24px",
          background: "#1a3a5c",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: isGenerating ? "wait" : "pointer",
          fontWeight: "bold"
        }}
      >
        {isGenerating ? "Generating..." : "Generate Test Certificate"}
      </button>
    </div>
  );
}