"use client";

import React, { useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { uploadAndIssueCertificateAction } from "@/app/actions/certificates";

// Helper to generate a unique ID
const generateCertId = () => `CSC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

export default function CertificateGenerator({ targetUserId, targetUserName, isDark }: { targetUserId: string, targetUserName: string, isDark: boolean }) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [courseName, setCourseName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // ✨ FIX: State to hold the REAL Certificate ID before generating
  const [certId, setCertId] = useState("");

  // Set the ID when the modal opens
  useEffect(() => {
    setCertId(generateCertId());
  }, []);

  const generateAndIssue = async () => {
    if (!courseName) return alert("Please enter a course name!");
    if (!certId) return; // Guard clause
    
    setIsGenerating(true);

    try {
      // 1. Render HTML to JPEG (The QR code now perfectly matches certId!)
      const imgData = await toJpeg(certificateRef.current!, {
        quality: 0.9,
        pixelRatio: 1.5,
        backgroundColor: '#ffffff'
      });

      // 2. Create PDF
      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], `${certId}.pdf`, { type: "application/pdf" });

      // 3. Prepare FormData for Server Action
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("targetUserId", targetUserId);
      formData.append("targetUserName", targetUserName);
      formData.append("courseName", courseName);
      formData.append("certNumber", certId); // Use the pre-generated ID

      // 4. Send to Server
      await uploadAndIssueCertificateAction(formData);

      alert(`✅ Certificate ${certId} successfully issued to ${targetUserName}!`);
      
      // Reset for the next certificate
      setCourseName("");
      setCertId(generateCertId()); 
      
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!certId) return null; // Wait until ID is generated on client

  return (
    <div style={{ padding: "10px 0" }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: isDark ? "#f8fafc" : "#1e293b" }}>
        Issue to: <span style={{ color: isDark ? "#f59e0b" : "#2563eb" }}>{targetUserName}</span>
      </h3>
      
      <input 
        value={courseName} 
        onChange={e => setCourseName(e.target.value)} 
        placeholder="Course Name (e.g., Basic Computer Course)" 
        style={{ 
          width: "100%", 
          padding: "12px 14px", 
          borderRadius: 8, 
          background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`, 
          color: isDark ? "#f8fafc" : "#1e293b",
          marginBottom: 16, 
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box"
        }}
      />

      <button 
        onClick={generateAndIssue} 
        disabled={isGenerating || !courseName}
        style={{ 
          width: "100%", 
          padding: "12px", 
          background: isDark ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #2563eb, #1d4ed8)", 
          color: isDark ? "#000" : "#fff", 
          border: "none", 
          borderRadius: 8, 
          fontWeight: 800, 
          cursor: isGenerating ? "not-allowed" : "pointer",
          transition: "opacity 0.2s",
          opacity: (isGenerating || !courseName) ? 0.6 : 1
        }}
      >
        {isGenerating ? "Processing & Uploading..." : "Generate & Issue PDF"}
      </button>

      {/* ── HIDDEN CERTIFICATE TEMPLATE ── */}
      <div style={{ overflow: "hidden", height: 0, width: 0 }}>
        <div ref={certificateRef} style={{ width: "1123px", height: "794px", padding: "40px", background: "#fff", border: "16px solid #1e3a8a", position: "relative", boxSizing: "border-box", fontFamily: "Georgia, 'Times New Roman', serif" }}>
          
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <h1 style={{ fontSize: "56px", color: "#1e3a8a", margin: 0, fontWeight: "bold" }}>CERTIFICATE OF COMPLETION</h1>
            <p style={{ fontSize: "24px", marginTop: "30px", color: "#475569", fontFamily: "Arial, sans-serif" }}>This is proudly presented to</p>
            
            <h2 style={{ fontSize: "70px", color: "#d97706", marginTop: "20px", textTransform: "capitalize", borderBottom: "2px solid #e2e8f0", display: "inline-block", padding: "0 40px", fontStyle: "italic" }}>
              {targetUserName}
            </h2>
            
            <p style={{ fontSize: "24px", marginTop: "30px", color: "#475569", fontFamily: "Arial, sans-serif" }}>for successfully completing the course</p>
            <h3 style={{ fontSize: "42px", marginTop: "20px", color: "#1e293b" }}>{courseName || "[Course Name]"}</h3>
            <p style={{ fontSize: "18px", marginTop: "10px", color: "#64748b", fontFamily: "Arial, sans-serif" }}>at Srilal Sahaj Jan Seva Kendra, Shambhuganj</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "absolute", bottom: "60px", width: "calc(100% - 160px)", left: "80px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ textAlign: "center", width: "250px" }}>
              <div style={{ height: "60px", fontFamily: "cursive", fontSize: "30px", color: "#1e3a8a" }}>Srilal Yadav</div>
              <div style={{ borderTop: "2px solid #1e293b", paddingTop: "10px", fontWeight: 700, fontSize: "16px", color: "#1e293b" }}>Authorized Signatory</div>
            </div>
            
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* ✨ FIX: Now uses the REAL certId! */}
              <QRCodeSVG value={`${process.env.NEXT_PUBLIC_APP_URL}/verify/${certId}`} size={110} level="H" />
              <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: 700, color: "#1d4ed8" }}>Scan to Verify</div>
              <div style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace", marginTop: "4px" }}>ID: {certId}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}