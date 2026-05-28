"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { uploadAndIssueCertificateAction } from "@/app/actions/certificates";

const generateCertId = () =>
  `CSC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

type Mode = "system" | "manual";

export default function CertificateGenerator({
  targetUserId,
  targetUserName,
  isDark,
}: {
  targetUserId: string;
  targetUserName: string;
  isDark: boolean;
}) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const hiddenConvertRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("system");
  const [courseName, setCourseName] = useState("");
  const [certId, setCertId] = useState("");
  const [isAutoId, setIsAutoId] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const [manualFile, setManualFile] = useState<File | null>(null);
  const [manualPreview, setManualPreview] = useState<string | null>(null);
  const [convertError, setConvertError] = useState<string | null>(null);

  useEffect(() => {
    if (isAutoId || !certId) setCertId(generateCertId());
  }, [isAutoId]);

  const convertFileToPdf = useCallback(
    async (sourceFile: File): Promise<File> => {
      const fileName = `${certId || generateCertId()}.pdf`;

      if (sourceFile.type === "application/pdf") {
        return new File([sourceFile], fileName, { type: "application/pdf" });
      }

      if (sourceFile.type.startsWith("image/")) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL("image/jpeg", 0.92);

            const pdf = new jsPDF({
              orientation: canvas.width > canvas.height ? "landscape" : "portrait",
              unit: "px",
              format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
            const blob = pdf.output("blob");
            resolve(new File([blob], fileName, { type: "application/pdf" }));
            URL.revokeObjectURL(img.src);
          };
          img.onerror = () => {
            URL.revokeObjectURL(img.src);
            reject(new Error("Failed to load image"));
          };
          img.src = URL.createObjectURL(sourceFile);
        });
      }

      if (
        sourceFile.name.endsWith(".docx") ||
        sourceFile.type.includes("wordprocessingml")
      ) {
        try {
          const mammoth = await import("mammoth");
          const arrayBuffer = await sourceFile.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });

          // Build certificate-styled HTML from DOCX content
          const temp = document.createElement("div");
          temp.style.position = "fixed";
          temp.style.left = "-9999px";
          temp.style.top = "0";
          temp.innerHTML = `
          <div style="width:1123px;height:794px;padding:55px;background:#fff;font-family:'DM Sans',Arial,sans-serif;color:#1e293b;box-sizing:border-box;position:relative;">
            <!-- Gold borders -->
            <div style="position:absolute;inset:12px;border:3px solid #b45309;border-radius:4px;"></div>
            <div style="position:absolute;inset:20px;border:1px solid #d97706;border-radius:2px;"></div>
            
            <!-- Header -->
            <div style="text-align:center;margin-bottom:30px;">
              <div style="font-size:40px;font-weight:bold;color:#1e3a8a;font-family:'DM Serif Display',serif;">Srilal Sahaj Janseva Kendra</div>
              <div style="font-size:15px;color:#475569;margin-top:4px;font-weight:600;">Shambhuganj, Jaunpur — 222132, Uttar Pradesh</div>
              <div style="width:140px;height:3px;background:#d97706;margin:10px auto 0;border-radius:2px;"></div>
            </div>
            
            <div style="font-size:18px;color:#64748b;text-align:center;margin-bottom:20px;">Certificate Document</div>
            
            <!-- DOCX Content -->
            <div style="font-size:16px;line-height:1.8;padding:20px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
              ${result.value}
            </div>
            
            <!-- Footer -->
            <div style="position:absolute;bottom:40px;left:55px;right:55px;display:flex;justify-content:space-between;align-items:flex-end;">
              <div>
                <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;">Date of Issue</div>
                <div style="font-size:17px;font-weight:700;color:#1e293b;font-family:'JetBrains Mono',monospace;margin-top:6px;">${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</div>
              </div>
              <div style="text-align:center;">
                <div style="width:100px;height:100px;border-radius:50%;border:3px solid #d97706;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#b45309;font-weight:800;font-size:10px;text-align:center;line-height:1.3;font-family:'DM Sans',sans-serif;transform:rotate(-12deg);opacity:0.9;">
                  <div style="font-size:24px;margin-bottom:2px;">🏛️</div>
                  <div>SRILAL SAHAJ</div>
                  <div>JANSEVA KENDRA</div>
                </div>
              </div>
              <div style="text-align:right;">
                <svg width="180" height="50" viewBox="0 0 180 50">
                  <path d="M8,35 C15,20 25,15 35,22 C40,26 38,32 32,34 C26,36 22,30 25,25 M45,28 C50,18 60,12 70,18 C76,22 73,30 66,32 C59,34 55,28 58,23 M80,26 C85,16 95,10 105,16 C111,20 108,28 101,30 C94,32 90,26 93,21 M115,24 C120,14 130,8 140,14 C146,18 143,26 136,28 C129,30 125,24 128,19 M150,22 C155,14 165,10 175,14" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
                  <path d="M6,42 C40,46 90,44 140,46 C160,47 172,45 178,43" fill="none" stroke="#1e3a8a" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
                </svg>
                <div style="border-top:1.5px solid #1e293b;padding-top:6px;margin-top:4px;">
                  <div style="font-size:13px;font-weight:700;color:#475569;">Srilal Yadav</div>
                  <div style="font-size:11px;color:#64748b;">Authorized Signatory & Proprietor</div>
                </div>
              </div>
            </div>
          </div>`;
          document.body.appendChild(temp);

          const dataUrl = await toJpeg(temp.firstElementChild as HTMLElement, {
            quality: 0.95,
            backgroundColor: "#ffffff",
          });
          document.body.removeChild(temp);

          const pdf = new jsPDF("l", "mm", "a4");
          pdf.addImage(dataUrl, "JPEG", 0, 0, 297, 210);
          return new File([pdf.output("blob")], fileName, {
            type: "application/pdf",
          });
        } catch (err: any) {
          throw new Error(
            "DOCX conversion failed: " + (err?.message || "Unknown error")
          );
        }
      }

      if (
        sourceFile.name.endsWith(".xlsx") ||
        sourceFile.type.includes("spreadsheetml") ||
        sourceFile.name.endsWith(".xls")
      ) {
        try {
          const XLSX = await import("xlsx");
          const arrayBuffer = await sourceFile.arrayBuffer();
          const wb = XLSX.read(arrayBuffer, { type: "array" });

          // Build styled HTML from ALL sheets — works with ANY format
          let allSheetsHtml = "";

          wb.SheetNames.forEach((sheetName: string) => {
            const ws = wb.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

            if (!jsonData.length) return;

            // Auto-detect if it's a label-value pair format (2 columns) or table
            const isLabelValue = jsonData.length > 1 && jsonData[0].length === 2;

            if (isLabelValue) {
              // Render as styled label-value pairs (like your screenshot)
              const pairsHtml = jsonData
                .filter((row: any[]) => row.length >= 2 && (row[0] || row[1]))
                .map((row: any[], idx: number) => {
                  const label = row[0] ? String(row[0]) : "";
                  const value = row[1] ? String(row[1]) : "";
                  const isHeader = idx === 0 || !label; // First row or empty label = header style
                  return `
                    <div style="display:flex;border-bottom:1px solid #e2e8f0;${isHeader ? 'background:#1e3a8a;color:#fff;' : idx % 2 === 0 ? 'background:#f8fafc;' : 'background:#fff;'}">
                      <div style="flex:1;padding:14px 18px;font-size:14px;font-weight:${isHeader ? '700' : '600'};border-right:1px solid ${isHeader ? 'rgba(255,255,255,0.2)' : '#e2e8f0'};">${label}</div>
                      <div style="flex:1.5;padding:14px 18px;font-size:14px;font-weight:${isHeader ? '700' : '400'};">${value}</div>
                    </div>
                  `;
                })
                .join("");

              allSheetsHtml += `
                <div style="margin-bottom:30px;">
                  <div style="font-size:18px;font-weight:700;color:#1e3a8a;margin-bottom:12px;border-bottom:2px solid #d97706;padding-bottom:6px;">${sheetName}</div>
                  <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">${pairsHtml}</div>
                </div>
              `;
            } else {
              // Render as standard table
              const rowsHtml = jsonData
                .map((row: any[], rowIdx: number) => {
                  const isHeader = rowIdx === 0;
                  const cells = row
                    .map((cell: any) => {
                      const val = cell === null || cell === undefined ? "" : String(cell);
                      return `<td style="padding:12px 16px;border:1px solid #d1d5db;font-size:13px;${isHeader ? 'background:#1e3a8a;color:#fff;font-weight:700;' : rowIdx % 2 === 0 ? 'background:#f8fafc;' : 'background:#fff;'}">${val}</td>`;
                    })
                    .join("");
                  return `<tr>${cells}</tr>`;
                })
                .join("");

              allSheetsHtml += `
                <div style="margin-bottom:30px;">
                  <div style="font-size:18px;font-weight:700;color:#1e3a8a;margin-bottom:12px;border-bottom:2px solid #d97706;padding-bottom:6px;">${sheetName}</div>
                  <table style="width:100%;border-collapse:collapse;border:1px solid #d1d5db;">${rowsHtml}</table>
                </div>
              `;
            }
          });

          const temp = document.createElement("div");
          temp.style.position = "fixed";
          temp.style.left = "-9999px";
          temp.style.top = "0";
          temp.innerHTML = `
            <div style="width:1123px;min-height:794px;padding:50px;background:#fff;font-family:'DM Sans',Arial,sans-serif;color:#1e293b;box-sizing:border-box;position:relative;">
              <!-- Gold borders -->
              <div style="position:absolute;inset:12px;border:3px solid #b45309;border-radius:4px;"></div>
              <div style="position:absolute;inset:20px;border:1px solid #d97706;border-radius:2px;"></div>
              
              <!-- Header -->
              <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #d97706;">
                <div style="font-size:36px;font-weight:bold;color:#1e3a8a;font-family:'DM Serif Display',serif;">Srilal Sahaj Janseva Kendra</div>
                <div style="font-size:14px;color:#475569;margin-top:6px;">Shambhuganj, Jaunpur — 222132, Uttar Pradesh</div>
                <div style="font-size:12px;color:#64748b;margin-top:4px;">Certificate Data Export</div>
              </div>
              
              <!-- Data -->
              ${allSheetsHtml}
              
              <!-- Footer -->
              <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:11px;color:#94a3b8;">Generated on ${new Date().toLocaleDateString("en-IN")}</div>
                <div style="font-size:11px;color:#94a3b8;">Srilal Sahaj Janseva Kendra • Shambhuganj, Jaunpur</div>
              </div>
            </div>`;
          document.body.appendChild(temp);

          const dataUrl = await toJpeg(temp.firstElementChild as HTMLElement, {
            quality: 0.95,
            backgroundColor: "#ffffff",
          });
          document.body.removeChild(temp);

          const pdf = new jsPDF("l", "mm", "a4");
          const imgProps = pdf.getImageProperties(dataUrl);
          const pageW = 297;
          const pageH = 210;
          const imgW = imgProps.width;
          const imgH = imgProps.height;

          // Scale to fit, maintain aspect ratio
          let finalW = pageW;
          let finalH = (imgH * pageW) / imgW;

          // If too tall, scale by height instead
          if (finalH > pageH) {
            finalH = pageH;
            finalW = (imgW * pageH) / imgH;
          }

          const x = (pageW - finalW) / 2;
          const y = (pageH - finalH) / 2;

          pdf.addImage(dataUrl, "JPEG", x, y, finalW, finalH);
          return new File([pdf.output("blob")], fileName, {
            type: "application/pdf",
          });
        } catch (err: any) {
          throw new Error("XLSX conversion failed: " + (err?.message || "Unknown error"));
        }
      }

      throw new Error(
        "Unsupported file. Please upload PDF, Image, DOCX, or XLSX."
      );
    },
    [certId]
  );

  // ── FIXED: Robust XLSX → PDF conversion ──
  const convertXlsxToPdf = async (
    sourceFile: File,
    fileName: string
  ): Promise<File> => {
    try {
      const XLSX = await import("xlsx");
      const arrayBuffer = await sourceFile.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array" });

      // Build styled HTML manually from sheet data — independent of any format
      let allSheetsHtml = "";

      wb.SheetNames.forEach((sheetName: string) => {
        const ws = wb.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        if (!jsonData.length) return;

        // Build rows from raw data — works with ANY column layout
        const rowsHtml = jsonData
          .map((row: any[], rowIdx: number) => {
            const isHeader = rowIdx === 0;
            const cells = row
              .map((cell: any) => {
                const val =
                  cell === null || cell === undefined ? "" : String(cell);
                return `<td style="padding:10px 14px;border:1px solid #d1d5db;font-size:13px;color:#1e293b;${isHeader ? "background:#1e3a8a;color:#fff;font-weight:700;" : rowIdx % 2 === 0 ? "background:#f8fafc;" : "background:#fff;"}">${val}</td>`;
              })
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("");

        allSheetsHtml += `
          <div style="margin-bottom:30px;">
            <div style="font-size:18px;font-weight:700;color:#1e3a8a;margin-bottom:12px;border-bottom:2px solid #d97706;padding-bottom:6px;">${sheetName}</div>
            <table style="width:100%;border-collapse:collapse;border:1px solid #d1d5db;">${rowsHtml}</table>
          </div>
        `;
      });

      const temp = document.createElement("div");
      temp.style.position = "fixed";
      temp.style.left = "-9999px";
      temp.style.top = "0";
      temp.innerHTML = `
        <div style="width:1100px;padding:50px;background:#fff;font-family:'DM Sans',Arial,sans-serif;color:#1e293b;">
          <div style="text-align:center;margin-bottom:40px;padding-bottom:20px;border-bottom:3px solid #d97706;">
            <div style="font-size:36px;font-weight:bold;color:#1e3a8a;font-family:'DM Serif Display',serif;">Srilal Sahaj Janseva Kendra</div>
            <div style="font-size:14px;color:#475569;margin-top:6px;">Shambhuganj, Jaunpur — 222132, Uttar Pradesh</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px;">Certificate Data Export</div>
          </div>
          ${allSheetsHtml}
        </div>`;
      document.body.appendChild(temp);

      const dataUrl = await toJpeg(temp.firstElementChild as HTMLElement, {
        quality: 0.95,
        backgroundColor: "#ffffff",
      });
      document.body.removeChild(temp);

      const pdf = new jsPDF("l", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfH = pdf.internal.pageSize.getHeight();
      const pdfW = (imgProps.width * pdfH) / imgProps.height;

      // If image is wider than page, scale to fit width instead
      const finalW = pdfW > 297 ? 297 : pdfW;
      const finalH = pdfW > 297 ? (imgProps.height * 297) / imgProps.width : pdfH;

      pdf.addImage(dataUrl, "JPEG", 0, 0, finalW, finalH);
      return new File([pdf.output("blob")], fileName, {
        type: "application/pdf",
      });
    } catch (err: any) {
      throw new Error("XLSX conversion failed: " + (err?.message || "Unknown error"));
    }
  };

  const handleManualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setManualFile(f);
    setConvertError(null);
    if (f.type.startsWith("image/")) {
      setManualPreview(URL.createObjectURL(f));
    } else {
      setManualPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!courseName.trim()) return alert("Please enter a certificate title!");
    if (!certId.trim()) return alert("Certificate ID is required!");
    if (mode === "manual" && !manualFile) return alert("Please upload a file!");

    setIsGenerating(true);
    setConvertError(null);

    try {
      let pdfFile: File;

      if (mode === "system") {
        const imgData = await toJpeg(certificateRef.current!, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
        const blob = pdf.output("blob");
        pdfFile = new File([blob], `${certId}.pdf`, {
          type: "application/pdf",
        });
      } else {
        pdfFile = await convertFileToPdf(manualFile!);
      }

      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("targetUserId", targetUserId);
      formData.append("targetUserName", targetUserName);
      formData.append("courseName", courseName);
      formData.append("certNumber", certId);

      await uploadAndIssueCertificateAction(formData);

      alert(`✅ Certificate ${certId} issued successfully!`);
      setCourseName("");
      setManualFile(null);
      setManualPreview(null);
      if (isAutoId) setCertId(generateCertId());
    } catch (err: any) {
      alert("Error: " + (err?.message || "Unknown error"));
      if (mode === "manual") setConvertError(err?.message || "Conversion failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
    color: isDark ? "#f8fafc" : "#1e293b",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'DM Sans',sans-serif",
    marginBottom: 14,
  };

  const labelBase: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: ".07em",
    color: isDark ? "rgba(255,255,255,0.45)" : "#64748b",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div style={{ padding: "10px 0" }}>
      {/* ── Mode Toggle ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
          padding: 4,
          borderRadius: 10,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
        }}
      >
        {([
          { key: "system", label: "🖥️ System Generated", desc: "Auto-create PDF" },
          { key: "manual", label: "📤 Manual Upload", desc: "Upload & convert" },
        ] as { key: Mode; label: string; desc: string }[]).map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setMode(m.key);
              setConvertError(null);
            }}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: mode === m.key ? (isDark ? "rgba(245,158,11,0.15)" : "#fff") : "transparent",
              color: mode === m.key ? (isDark ? "#f59e0b" : "#2563eb") : isDark ? "rgba(255,255,255,0.5)" : "#64748b",
              fontWeight: 700,
              fontSize: 13,
              transition: "all .2s",
              boxShadow: mode === m.key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <div>{m.label}</div>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, marginTop: 2 }}>
              {m.desc}
            </div>
          </button>
        ))}
      </div>

      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 16,
          color: isDark ? "#f8fafc" : "#1e293b",
        }}
      >
        Issue to:{" "}
        <span style={{ color: isDark ? "#f59e0b" : "#2563eb" }}>
          {targetUserName}
        </span>
      </h3>

      <label style={labelBase}>Certificate Title / Course</label>
      <input
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder="e.g. Basic Computer Course, Tally, CCC, etc."
        style={inputBase}
      />

      <label style={labelBase}>Certificate ID</label>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          value={certId}
          onChange={(e) => setCertId(e.target.value.toUpperCase())}
          disabled={isAutoId}
          placeholder="CSC-XXXXXX-XXX"
          style={{ ...inputBase, marginBottom: 0, flex: 1, opacity: isAutoId ? 0.5 : 1 }}
        />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
            cursor: "pointer",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={isAutoId}
            onChange={(e) => setIsAutoId(e.target.checked)}
            style={{ accentColor: isDark ? "#f59e0b" : "#2563eb", width: 16, height: 16 }}
          />
          Auto-generate
        </label>
      </div>

      {mode === "manual" && (
        <div style={{ marginBottom: 20 }}>
          <label style={labelBase}>Upload File (PDF, Image, DOCX, XLSX)</label>
          <div
            style={{
              border: `2px dashed ${convertError ? "#ef4444" : isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1"}`,
              borderRadius: 12,
              padding: "28px 20px",
              textAlign: "center",
              background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
              transition: "all .2s",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("manual-cert-input")?.click()}
          >
            <input
              id="manual-cert-input"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
              style={{ display: "none" }}
              onChange={handleManualFileChange}
            />
            {manualPreview ? (
              <img
                src={manualPreview}
                alt="Preview"
                style={{ maxHeight: 180, borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
            ) : manualFile ? (
              <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#f8fafc" : "#1e293b" }}>
                📄 {manualFile.name}
                <div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.4)" : "#94a3b8", marginTop: 4 }}>
                  {(manualFile.size / 1024).toFixed(1)} KB — Click to change
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#f8fafc" : "#1e293b" }}>
                  Click to upload certificate file
                </div>
                <div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.4)" : "#94a3b8", marginTop: 4 }}>
                  PDF, JPG, PNG, DOCX, XLSX accepted
                </div>
              </>
            )}
          </div>
          {convertError && (
            <div style={{ color: "#ef4444", fontSize: 12, marginTop: 8, fontWeight: 600 }}>
              ⚠️ {convertError}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isGenerating || !courseName.trim() || (mode === "manual" && !manualFile)}
        style={{
          width: "100%",
          padding: "12px",
          background: isDark
            ? "linear-gradient(135deg, #f59e0b, #d97706)"
            : "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: isDark ? "#000" : "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 800,
          cursor: isGenerating ? "not-allowed" : "pointer",
          transition: "opacity 0.2s",
          opacity: isGenerating || !courseName.trim() || (mode === "manual" && !manualFile) ? 0.6 : 1,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {isGenerating
          ? mode === "system"
            ? "Generating & Uploading…"
            : "Converting & Uploading…"
          : mode === "system"
            ? "Generate & Issue Certificate"
            : "Upload & Issue Certificate"}
      </button>

      {/* ═══════════════════════════════════════════════════════
          HIDDEN SYSTEM CERTIFICATE TEMPLATE
          FIXED: QR aligned with sign, handwritten signature
      ═══════════════════════════════════════════════════════ */}
      <div style={{ overflow: "hidden", height: 0, width: 0, position: "absolute" }}>
        <div
          ref={certificateRef}
          style={{
            width: "1123px",
            height: "794px",
            background: "#ffffff",
            position: "relative",
            boxSizing: "border-box",
            fontFamily: "'Georgia','Times New Roman',serif",
            color: "#1e293b",
            padding: 0,
          }}
        >
          {/* Outer gold border */}
          <div
            style={{
              position: "absolute",
              inset: 12,
              border: "3px solid #b45309",
              borderRadius: 4,
            }}
          />
          {/* Inner thin line */}
          <div
            style={{
              position: "absolute",
              inset: 20,
              border: "1px solid #d97706",
              borderRadius: 2,
            }}
          />

          {/* Corner ornaments — FIXED: perfectly aligned */}
          <div style={{ position: "absolute", width: 50, height: 50, borderTop: "3px solid #b45309", borderLeft: "3px solid #b45309", top: 28, left: 28 }} />
          <div style={{ position: "absolute", width: 50, height: 50, borderTop: "3px solid #b45309", borderRight: "3px solid #b45309", top: 28, right: 28 }} />
          <div style={{ position: "absolute", width: 50, height: 50, borderBottom: "3px solid #b45309", borderLeft: "3px solid #b45309", bottom: 28, left: 28 }} />
          <div style={{ position: "absolute", width: 50, height: 50, borderBottom: "3px solid #b45309", borderRight: "3px solid #b45309", bottom: 28, right: 28 }} />

          {/* Content */}
          <div
            style={{
              position: "absolute",
              inset: 55,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Institute Header */}
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: "bold",
                  color: "#1e3a8a",
                  letterSpacing: "1px",
                  fontFamily: "'DM Serif Display',serif",
                }}
              >
                Srilal Sahaj Janseva Kendra
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#475569",
                  fontFamily: "'DM Sans',sans-serif",
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                Shambhuganj, Jaunpur — 222132, Uttar Pradesh
              </div>
              <div
                style={{
                  width: 140,
                  height: 3,
                  background: "#d97706",
                  margin: "10px auto 0",
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 50,
                fontWeight: "bold",
                color: "#b45309",
                marginTop: 12,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontFamily: "'DM Serif Display',serif",
              }}
            >
              Certificate of Completion
            </div>

            {/* Body */}
            <div
              style={{
                fontSize: 20,
                color: "#334155",
                marginTop: 18,
                fontFamily: "'DM Sans',sans-serif",
                lineHeight: 1.6,
              }}
            >
              This is to certify that
            </div>

            <div
              style={{
                fontSize: 48,
                fontWeight: "bold",
                color: "#1e3a8a",
                marginTop: 12,
                textTransform: "capitalize",
                borderBottom: "2px solid #e2e8f0",
                display: "inline-block",
                padding: "0 50px",
                fontStyle: "italic",
                fontFamily: "'DM Serif Display',serif",
              }}
            >
              {targetUserName}
            </div>

            <div
              style={{
                fontSize: 18,
                color: "#475569",
                marginTop: 16,
                fontFamily: "'DM Sans',sans-serif",
                maxWidth: 800,
                lineHeight: 1.5,
              }}
            >
              has successfully completed the training/program in
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: "bold",
                color: "#1e293b",
                marginTop: 10,
                fontFamily: "'DM Serif Display',serif",
              }}
            >
              {courseName || "[Certificate Title]"}
            </div>

            <div
              style={{
                fontSize: 15,
                color: "#64748b",
                marginTop: 8,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              under the guidance of{" "}
              <span style={{ fontWeight: 700, color: "#1e3a8a" }}>
                Srilal Yadav
              </span>{" "}
              (Proprietor).
            </div>

            {/* ═══════════════════════════════════════════════════════
                FOOTER — 3 COLUMN GRID
                Left: Date | Center: Seal | Right: QR + Signature
            ═══════════════════════════════════════════════════════ */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                alignItems: "end",
                gap: 30,
              }}
            >
              {/* ── LEFT: Date of Issue ── */}
              <div style={{ textAlign: "left", paddingBottom: 8 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    fontFamily: "'DM Sans',sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 700,
                  }}
                >
                  Date of Issue
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1e293b",
                    marginTop: 6,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* ── CENTER: Official Seal ── */}
              <div style={{ display: "flex", justifyContent: "center", paddingBottom: 4 }}>
                <div
                  style={{
                    width: 115,
                    height: 115,
                    borderRadius: "50%",
                    border: "3px solid #d97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: "#b45309",
                    fontWeight: 800,
                    fontSize: 11,
                    textAlign: "center",
                    lineHeight: 1.3,
                    fontFamily: "'DM Sans',sans-serif",
                    transform: "rotate(-12deg)",
                    opacity: 0.9,
                    background: "radial-gradient(circle, rgba(217,119,6,0.05) 0%, transparent 70%)",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 2 }}>🏛️</div>
                  <div>SRILAL SAHAJ</div>
                  <div>JANSEVA KENDRA</div>
                </div>
              </div>

              {/* ── RIGHT: QR + Signature (ALIGNED) ── */}
              <div style={{ textAlign: "right", paddingBottom: 8 }}>
                {/* QR Code */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: 10 }}>
                  <QRCodeSVG
                    value={`${process.env.NEXT_PUBLIC_APP_URL}/verify/${certId}`}
                    size={90}
                    level="H"
                  />
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#1d4ed8",
                      marginTop: 6,
                    }}
                  >
                    Scan to Verify
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                      fontFamily: "monospace",
                      marginTop: 3,
                    }}
                  >
                    ID: {certId}
                  </div>
                </div>

                {/* Beautiful Cursive Signature */}
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <svg
                    width="200"
                    height="60"
                    viewBox="0 0 200 60"
                    style={{ display: "block" }}
                  >
                    <defs>
                      <filter id="ink-texture" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                      </filter>
                      <linearGradient id="ink-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#2563eb" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>

                    {/* Main cursive stroke for "Srilal Yadav" */}
                    <path
                      d="M8,38 
         C12,28 18,22 24,26 C28,29 26,35 22,36 C18,37 16,33 18,30 
         M30,32 C32,24 38,20 44,24 C48,27 46,33 42,34 C38,35 36,31 38,28 
         M50,30 C52,22 58,18 64,22 C68,25 66,31 62,32 C58,33 56,29 58,26 
         M72,28 C74,20 80,16 86,20 C90,23 88,29 84,30 C80,31 78,27 80,24 
         M95,26 C98,18 105,14 112,18 C117,22 114,30 108,32 C102,34 98,30 100,26 
         M118,24 C122,16 130,12 138,16 C144,20 140,28 134,30 C128,32 124,28 126,24 
         M145,22 C150,14 158,10 166,14 C172,18 168,26 162,28 C156,30 152,26 154,22 
         M170,20 C175,14 182,12 188,16 C192,19 190,24 186,25"
                      fill="none"
                      stroke="url(#ink-gradient)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#ink-texture)"
                      style={{ opacity: 0.9 }}
                    />

                    {/* Dot on 'i' in Srilal */}
                    <ellipse cx="52" cy="18" rx="2" ry="2.5" fill="#1e3a8a" opacity="0.8" />

                    {/* Elegant underline flourish */}
                    <path
                      d="M6,44 
         C30,48 60,46 90,47 
         C120,48 150,50 180,46 
         C190,45 195,43 198,42"
                      fill="none"
                      stroke="#1e3a8a"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.35"
                    />

                    {/* Secondary subtle flourish below */}
                    <path
                      d="M20,50 C50,52 100,54 160,50"
                      fill="none"
                      stroke="#1e3a8a"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      opacity="0.2"
                    />
                  </svg>

                  <div
                    style={{
                      borderTop: "1.5px solid #1e293b",
                      paddingTop: 6,
                      width: 200,
                      marginTop: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontFamily: "'DM Sans',sans-serif",
                        color: "#475569",
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      Srilal Yadav
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#64748b",
                        fontFamily: "'DM Sans',sans-serif",
                        marginTop: 2,
                        textAlign: "right",
                      }}
                    >
                      Authorized Signatory & Proprietor
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={hiddenConvertRef} style={{ position: "fixed", left: "-99999px", top: 0 }} />
    </div>
  );
}