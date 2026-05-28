import { NextRequest, NextResponse } from "next/server";

// ─── Environment-aware browser launch ────────────────────────────────────────
// Local dev (Windows/macOS/Linux desktop): uses regular puppeteer with bundled Chrome
// Production (Vercel/AWS Lambda): uses puppeteer-core + @sparticuz/chromium

async function getBrowser() {
  const isLocal = process.env.NODE_ENV === "development" || !process.env.VERCEL;

  if (isLocal) {
    const puppeteer = await import("puppeteer");
    return puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } else {
    const puppeteer = await import("puppeteer-core");
    const chromium = await import("@sparticuz/chromium") as any;  // ← FIX: add 'as any'
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless as any,
    });
  }
}

export async function POST(req: NextRequest) {
  let browser: any = null;

  try {
    const cert = await req.json();

    const verifyUrl = `${req.nextUrl.origin}/verify/${cert.roll_no}`;
    const issueDate = new Date(cert.created_at || Date.now()).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Great+Vibes&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', 'Georgia', serif; color: #1a1a2e; }
    .page { width: 1123px; height: 794px; background: #f8f6f0; position: relative; overflow: hidden; }
    .pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(26,58,138,0.03) 35px,rgba(26,58,138,0.03) 70px); pointer-events: none; }
    .watermark1 { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); font-size: 120px; font-weight: 900; color: rgba(26,58,138,0.025); letter-spacing: 20px; white-space: nowrap; pointer-events: none; font-family: 'DM Sans',sans-serif; }
    .watermark2 { position: absolute; top: 30%; left: 20%; transform: rotate(25deg); font-size: 80px; font-weight: 900; color: rgba(26,58,138,0.02); letter-spacing: 15px; pointer-events: none; font-family: 'DM Sans',sans-serif; }
    .watermark3 { position: absolute; top: 70%; left: 60%; transform: rotate(-15deg); font-size: 90px; font-weight: 900; color: rgba(26,58,138,0.02); letter-spacing: 15px; pointer-events: none; font-family: 'DM Sans',sans-serif; }
    .header-bg { position: absolute; top: 0; left: 0; width: 100%; height: 260px; pointer-events: none; }
    .corner-tl { position: absolute; top: 30px; left: 30px; width: 55px; height: 55px; border-top: 2.5px solid #c9a227; border-left: 2.5px solid #c9a227; opacity: 0.7; }
    .corner-tr { position: absolute; top: 30px; right: 30px; width: 55px; height: 55px; border-top: 2.5px solid #c9a227; border-right: 2.5px solid #c9a227; opacity: 0.7; }
    .corner-bl { position: absolute; bottom: 30px; left: 30px; width: 55px; height: 55px; border-bottom: 2.5px solid #c9a227; border-left: 2.5px solid #c9a227; opacity: 0.7; }
    .corner-br { position: absolute; bottom: 30px; right: 30px; width: 55px; height: 55px; border-bottom: 2.5px solid #c9a227; border-right: 2.5px solid #c9a227; opacity: 0.7; }
    .seal-left { position: absolute; top: 40px; left: 50px; z-index: 10; }
    .logo-right { position: absolute; top: 45px; right: 55px; text-align: center; z-index: 10; }
    .logo-circle { width: 65px; height: 65px; border-radius: 50%; border: 3px solid #c9a227; background: linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%); margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .logo-text1 { font-size: 10px; font-weight: 700; color: #0a1628; margin-top: 6px; font-family: 'DM Sans',sans-serif; letter-spacing: 1px; }
    .logo-text2 { font-size: 8px; color: #64748b; font-family: 'DM Sans',sans-serif; letter-spacing: 0.5px; }
    .content { position: absolute; top: 150px; left: 80px; right: 80px; bottom: 40px; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .cert-title { font-size: 48px; font-weight: 400; color: #1a1a2e; text-transform: uppercase; letter-spacing: 8px; font-family: 'Playfair Display','Georgia',serif; }
    .cert-subtitle { background: linear-gradient(90deg,#0a1628 0%,#1a3a5c 50%,#0a1628 100%); color: #f4e4a6; padding: 8px 45px; border-radius: 30px; font-size: 15px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin-top: 10px; font-family: 'DM Sans',sans-serif; box-shadow: 0 4px 15px rgba(10,22,40,0.3); }
    .presented { margin-top: 22px; display: flex; align-items: center; gap: 12px; }
    .presented-text { font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 2.5px; font-family: 'DM Sans',sans-serif; font-weight: 500; }
    .dot { width: 6px; height: 6px; background: #c9a227; border-radius: 50%; }
    .name-section { margin-top: 16px; position: relative; width: 100%; }
    .student-name { font-size: 52px; font-weight: 400; color: #1a1a2e; font-family: 'Great Vibes','Brush Script MT','Georgia',cursive; letter-spacing: 2px; line-height: 1; }
    .name-line { margin-top: 0; display: flex; align-items: center; justify-content: center; gap: 0; width: 100%; }
    .line-left { width: 180px; height: 1.5px; background: linear-gradient(90deg,transparent,#c9a227); }
    .line-right { width: 180px; height: 1.5px; background: linear-gradient(90deg,#c9a227,transparent); }
    .diamond { width: 8px; height: 8px; background: #c9a227; transform: rotate(45deg); margin: 0 12px; box-shadow: 0 0 6px rgba(201,162,39,0.4); }
    .details { margin-top: 16px; display: flex; justify-content: center; gap: 50px; width: 100%; }
    .detail-item { text-align: center; }
    .detail-label { font-size: 9px; color: #8b7355; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; font-family: 'DM Sans',sans-serif; }
    .detail-value { font-size: 14px; font-weight: 600; color: #1a1a2e; margin-top: 3px; font-family: 'DM Sans',sans-serif; }
    .roll-value { font-size: 14px; font-weight: 700; color: #b8941f; margin-top: 3px; font-family: 'JetBrains Mono',monospace; }
    .description { margin-top: 16px; font-size: 14px; color: #475569; line-height: 1.7; max-width: 720px; font-family: 'DM Sans',sans-serif; }
    .description strong { color: #1a3a5c; }
    .description .grade { color: #b8941f; }
    .footer-area { position: absolute; bottom: 55px; left: 80px; right: 80px; height: 110px; display: flex; align-items: flex-end; justify-content: space-between; }
    .qr-section { display: flex; align-items: center; gap: 10px; }
    .qr-box { border: 2px solid #c9a227; border-radius: 6px; padding: 5px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
    .qr-text { font-size: 10px; font-weight: 700; color: #1a3a5c; font-family: 'DM Sans',sans-serif; }
    .qr-id { font-size: 8px; color: #8b7355; font-family: 'JetBrains Mono',monospace; margin-top: 2px; }
    .qr-date { font-size: 8px; color: #8b7355; font-family: 'DM Sans',sans-serif; margin-top: 1px; }
    .center-seal { display: flex; flex-direction: column; align-items: center; padding-bottom: 5px; }
    .signature-section { display: flex; flex-direction: column; align-items: center; padding-bottom: 8px; }
    .sig-line { border-top: 1.5px solid #1a1a2e; width: 180px; padding-top: 0; text-align: center; }
    .sig-name { font-size: 13px; font-weight: 700; color: #1a1a2e; font-family: 'DM Sans',sans-serif; }
    .sig-title { font-size: 9px; color: #8b7355; font-family: 'DM Sans',sans-serif; margin-top: 2px; letter-spacing: 0.3px; }
    .bottom-bar { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; }
    .bottom-line { width: 80px; height: 1px; background: linear-gradient(90deg,transparent,#c9a227); }
    .bottom-line-r { width: 80px; height: 1px; background: linear-gradient(90deg,#c9a227,transparent); }
    .bottom-dot { width: 5px; height: 5px; background: #c9a227; border-radius: 50%; }
    .bottom-text { font-size: 8px; color: #8b7355; letter-spacing: 1.5px; font-family: 'DM Sans',sans-serif; }
  </style>
</head>
<body>
  <div class="page">
    <div class="pattern"></div>
    <div class="watermark1">SRILALSAHAJ</div>
    <div class="watermark2">SRILALSAHAJ</div>
    <div class="watermark3">SRILALSAHAJ</div>
    <svg class="header-bg" viewBox="0 0 1123 260" preserveAspectRatio="none">
      <path d="M0,0 L1123,0 L1123,70 Q800,190 400,110 Q200,70 0,150 Z" fill="#0a1628"/>
      <path d="M0,18 L1123,18 L1123,83 Q800,203 400,123 Q200,83 0,163 Z" fill="none" stroke="#c9a227" stroke-width="3"/>
      <path d="M0,32 L1123,32 L1123,92 Q800,212 400,132 Q200,92 0,172 Z" fill="none" stroke="#d4af37" stroke-width="1.5" opacity="0.6"/>
      <path d="M0,45 L1123,45 L1123,100 Q800,220 400,140 Q200,100 0,180 Z" fill="none" stroke="#e8c547" stroke-width="0.8" opacity="0.4"/>
    </svg>
    <div class="corner-tl"></div>
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>
    <div class="seal-left">
      <svg width="120" height="120" viewBox="0 0 130 130">
        <defs>
          <radialGradient id="gold-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f4e4a6"/>
            <stop offset="40%" stop-color="#d4af37"/>
            <stop offset="70%" stop-color="#c9a227"/>
            <stop offset="100%" stop-color="#8b6914"/>
          </radialGradient>
        </defs>
        <path d="M65,5 L72,25 L92,18 L82,35 L105,42 L85,52 L100,70 L80,68 L85,90 L68,78 L65,100 L58,78 L38,90 L45,68 L25,70 L42,52 L22,42 L45,35 L35,18 L55,25 Z" fill="url(#gold-grad)" stroke="#b8941f" stroke-width="1"/>
        <circle cx="65" cy="55" r="38" fill="#0a1628" stroke="#d4af37" stroke-width="2.5"/>
        <circle cx="65" cy="55" r="32" fill="none" stroke="#c9a227" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="65" y="32" text-anchor="middle" fill="#d4af37" font-size="10">★ ★ ★</text>
        <text x="65" y="85" text-anchor="middle" fill="#d4af37" font-size="10">★</text>
        <text x="65" y="48" text-anchor="middle" fill="#f4e4a6" font-size="9" font-weight="700" font-family="DM Sans,sans-serif" letter-spacing="1">HONORED</text>
        <text x="65" y="62" text-anchor="middle" fill="#d4af37" font-size="11" font-weight="800" font-family="DM Sans,sans-serif" letter-spacing="1">MENTION</text>
      </svg>
    </div>
    <div class="logo-right">
      <div class="logo-circle">🏛️</div>
      <div class="logo-text1">SRILAL SAHAJ</div>
      <div class="logo-text2">JANSEVA KENDRA</div>
    </div>
    <div class="content">
      <div class="cert-title">Certificate</div>
      <div class="cert-subtitle">of Achievement</div>
      <div class="presented">
        <div class="dot"></div>
        <div class="presented-text">This Certificate is Proudly Presented to</div>
        <div class="dot"></div>
      </div>
      <div class="name-section">
        <div class="student-name">${cert.student_name || "—"}</div>
        <div class="name-line">
          <div class="line-left"></div>
          <div class="diamond"></div>
          <div class="line-right"></div>
        </div>
      </div>
      <div class="details">
        <div class="detail-item">
          <div class="detail-label">Father's Name</div>
          <div class="detail-value">${cert.father_name || "—"}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Mother's Name</div>
          <div class="detail-value">${cert.mother_name || "—"}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Roll Number</div>
          <div class="roll-value">${cert.roll_no || "—"}</div>
        </div>
      </div>
      <div class="description">
        This is to certify that <strong>${cert.student_name || "—"}</strong> 
        <span style="color:#64748b;font-size:12px;">(Roll No: <strong style="color:#b8941f;">${cert.roll_no || "—"}</strong>)</span> 
        has successfully completed the training and examination in 
        <strong>${cert.course_name || "—"}</strong> with 
        <strong class="grade">Grade ${cert.grade || "—"}</strong> under the guidance and supervision of 
        <strong>Srilal Yadav</strong>, Proprietor & Director of Srilal Sahaj Janseva Kendra, 
        Shambhuganj, Jaunpur — 222132, Uttar Pradesh. This certificate is awarded in recognition of their 
        dedication, hard work, and successful completion of all prescribed requirements.
      </div>
    </div>
    <div class="footer-area">
      <div class="qr-section">
        <div class="qr-box">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${encodeURIComponent(verifyUrl)}" width="75" height="75" />
        </div>
        <div>
          <div class="qr-text">Scan to Verify</div>
          <div class="qr-id">ID: ${cert.roll_no || "—"}</div>
          <div class="qr-date">${issueDate}</div>
        </div>
      </div>
      <div class="center-seal">
        <svg width="100" height="100" viewBox="0 0 125 125">
          <defs>
            <radialGradient id="seal-gold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f4e4a6"/>
              <stop offset="30%" stop-color="#e8c547"/>
              <stop offset="60%" stop-color="#d4af37"/>
              <stop offset="100%" stop-color="#8b6914"/>
            </radialGradient>
          </defs>
          <circle cx="62.5" cy="62.5" r="58" fill="none" stroke="url(#seal-gold)" stroke-width="3"/>
          <circle cx="62.5" cy="62.5" r="55" fill="#0a1628" stroke="#c9a227" stroke-width="1.5"/>
          <circle cx="62.5" cy="62.5" r="48" fill="none" stroke="#c9a227" stroke-width="0.8" stroke-dasharray="4,3" opacity="0.6"/>
          <circle cx="62.5" cy="62.5" r="42" fill="none" stroke="#d4af37" stroke-width="0.5" opacity="0.4"/>
          <text x="62.5" y="48" text-anchor="middle" fill="#d4af37" font-size="22">👑</text>
          <text x="62.5" y="68" text-anchor="middle" fill="#f4e4a6" font-size="8" font-weight="700" font-family="DM Sans,sans-serif" letter-spacing="0.5">SRILAL</text>
          <text x="62.5" y="80" text-anchor="middle" fill="#d4af37" font-size="8" font-weight="700" font-family="DM Sans,sans-serif" letter-spacing="0.5">SAHAJ</text>
          <path id="seal-arc" d="M 25,62.5 A 37.5,37.5 0 0,1 100,62.5" fill="none"/>
          <text fill="#c9a227" font-size="7" font-family="DM Sans,sans-serif" letter-spacing="2">
            <textPath href="#seal-arc" startOffset="50%" text-anchor="middle">JANSEVA KENDRA</textPath>
          </text>
        </svg>
      </div>
      <div class="signature-section">
        <svg width="200" height="70" viewBox="0 0 350 180" style="display:block;">
          <path d="M 65 110 C 50 120, 50 100, 65 70 C 80 40, 100 20, 100 30 C 100 40, 75 90, 85 95 C 95 100, 105 75, 110 95 C 115 105, 125 75, 125 95 C 135 45, 140 40, 135 95 C 145 80, 150 80, 150 95 C 160 45, 165 40, 160 95 C 165 95, 170 85, 175 85" fill="none" stroke="#11214d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 190 65 C 190 90, 210 90, 215 65 C 205 100, 195 160, 180 150 C 165 140, 180 110, 215 85 C 225 75, 230 75, 230 90 C 240 75, 250 75, 245 90 C 255 40, 255 40, 250 90 C 260 75, 270 75, 265 90 C 275 85, 280 75, 280 85 C 290 95, 295 90, 310 85" fill="none" stroke="#11214d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="120" cy="40" r="2.5" fill="#11214d" />
        </svg>
        <div class="sig-line">
          <div class="sig-name">Srilal Yadav</div>
          <div class="sig-title">Authorized Signatory & Proprietor</div>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="bottom-line"></div>
      <div class="bottom-dot"></div>
      <div class="bottom-text">SHAMBHUGANJ, JAUNPUR — 222132, UTTAR PRADESH</div>
      <div class="bottom-dot"></div>
      <div class="bottom-line-r"></div>
    </div>
  </div>
</body>
</html>`;

    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" as any });

    const pdfBuffer = await page.pdf({
      width: "1123px",
      height: "794px",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();
    browser = null;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${(cert.student_name?.replace(/\s+/g, "_") || "Certificate")}_${cert.roll_no || "cert"}.pdf"`,
      },
    });
  } catch (err: any) {
    if (browser) {
      try { await browser.close(); } catch { /* ignore */ }
    }
    console.error("Certificate PDF generation error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}