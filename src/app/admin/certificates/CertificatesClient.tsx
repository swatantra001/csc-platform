// src/app/admin/certificates/CertificatesClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
// NEW PAGE per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Create at D:\csc-platform\src\app\admin\certificates\CertificatesClient.tsx,
// alongside page.tsx in the same folder. No other file is changed by this page.
// Requires the four actions in admin-certificates-action-snippet.ts — paste all
// of them into src/app/actions/certificates.ts first.
//
// WHAT IT DOES:
// - Admin-only: the whole page sits inside <AuthGuard allowedRoles={["co_admin",
//   "main_admin"]}> (same guard as the main admin panel), and the server actions
//   also throw "Unauthorized" for role "user" or no login.
// - Loads every certificate with getAllCertificatesAction() on mount: the PDF
//   certificates table AND the Excel-backed certificates table, merged and
//   shown newest first.
// - Card form: each card previews the certificate number / roll no (the unique
//   title), student name, course, issue date, and one contact line (mobile for
//   PDF rows, mobile/email and grade for Excel rows).
// - Clicking the title (or Open PDF) opens the certificate PDF in a new tab:
//   PDF rows link straight to file_url; Excel rows generate the certificate PDF
//   on the spot with generateExcelCertPdf below (the dashboard's function,
//   redesigned — see that section) and open it via window.open(bloburl), so
//   the admin downloads or prints from the browser's PDF viewer. Nothing
//   redirects to the verify page from this list any more.
// - Edit: the pencil on a card opens an edit modal (co_admin and main_admin).
//   PDF rows edit certificate number / student / course; Excel rows edit roll
//   no. / student / father / mother / course / grade / email / mobile.
// - Delete: the trash on a card (main_admin only — hidden for co_admin) asks
//   for confirmation, then deleteCertificateAction removes the row.
// - Search matches certificate number / roll no, student name or course;
//   filter pills show All / PDF / Excel with counts.
//
// DESIGN (same admin chrome as the other delivered admin pages):
// - One deep-blue accent in both themes via Tailwind dark: classes; navy
//   header (#0b2239 / dark #081120), plain navy hero panel, no gradients,
//   no emoji (lucide-react only), no THEMES object, no buildCss, no Google
//   Fonts, relative links. Theme: csc_theme localStorage with
//   prefers-color-scheme fallback, plus a dark-class sync effect on
//   document.documentElement. The theme is written to localStorage only when
//   the toggle is pressed — not on every isDark change — so a stored "dark"
//   is never briefly overwritten with "light" on first mount (the quirk
//   flagged on the forms page).
// - Brand "SrilalCSC" + "ADMIN PANEL", user chip from the real useAuth().user.
//   NAV_LINKS are relative; Certificates is marked active. The set is the
//   admin panel's set plus Certificates (9 links).
//
// FLAGS / NOTES (need Swatantra's word):
// 1. EDITING A PDF ROW updates the record only — the stored PDF file itself is
//    unchanged (it was uploaded earlier and still shows the old details). To
//    change what the PDF says, re-issue it from the admin panel.
// 2. EDIT ROLE: co_admin can edit (matches the upload actions). Delete is
//    main_admin-only (matches adminDeletePostAction / adminDeleteAadharScanAction
//    in admin.ts). Say the word if either should change.
// 3. VIEW ROLE: co_admin can view (matches the upload actions). Only
//    issueCertificateAction is main_admin-only. Say the word if viewing should
//    be main_admin-only too.
// 4. The list is sorted by created_at across both tables. If the two tables
//    ever hold the same student under a different number, both cards show —
//    nothing is de-duplicated here (the dashboard de-duplicates Excel rows
//    by roll_no for students, but this is the admin's full record). Excel card
//    keys use the row id, not roll_no, because the same roll_no can appear in
//    more than one row (the bulk-upload action has no uniqueness check).
// 5. The PDF generator needs html-to-image and jspdf — both are already
//    installed (the dashboard's generateExcelCertPdf uses the same two). The
//    QR inside the certificate is fetched live from api.qrserver.com at
//    generation time, exactly as the dashboard's version did.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { AuthGuard } from "@/components/AuthGuard";
import {
  getAllCertificatesAction,
  updateCertificateAction,
  updateExcelCertificateAction,
  deleteCertificateAction,
} from "@/app/actions/certificates";
import {
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Landmark,
  Loader2,
  Moon,
  Pencil,
  PenLine,
  Search,
  ShieldCheck,
  Sun,
  Trash2,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

// ════════════════════════════════════════════════════════════════════════════════
// TYPES — shaped from the supplied certificates.ts actions
// ════════════════════════════════════════════════════════════════════════════════
interface PdfCert {
  id: string;
  certificate_number: string;
  student_name: string;
  course_name: string;
  file_url: string | null;
  created_at: string;
  user_id: string;
  users?: { mobile?: string | null } | null;
}

interface ExcelCert {
  id: string;
  roll_no: string;
  student_name: string;
  father_name?: string | null;
  mother_name?: string | null;
  course_name: string;
  grade?: string | null;
  email?: string | null;
  mobile?: string | null;
  created_at: string;
}

interface CertCard {
  key: string;
  id: string;
  kind: "pdf" | "excel";
  title: string;
  student: string;
  course: string;
  issuedOn: string;
  fileUrl: string | null;
  contact: string | null;
  extra: string | null;
  excel?: ExcelCert;
}

type UserRole = "user" | "co_admin" | "main_admin";

// ════════════════════════════════════════════════════════════════════════════════
// NAV LINKS (relative; Certificates added to the admin panel's set)
// ════════════════════════════════════════════════════════════════════════════════
const NAV_LINKS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/admin", icon: ShieldCheck, label: "Admin" },
  { href: "/admin/posts", icon: PenLine, label: "Posts" },
  { href: "/admin/courses", icon: GraduationCap, label: "Courses" },
  { href: "/admin/verify", icon: BadgeCheck, label: "Verify" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/galary", icon: ImageIcon, label: "Gallery" },
  { href: "/admin/forms", icon: ClipboardList, label: "Forms" },
  { href: "/admin/transactions", icon: CreditCard, label: "Transactions" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

// ─── Shared class strings ───
const btnBase =
  "inline-flex items-center gap-1.5 cursor-pointer rounded-lg px-4 py-2 text-[13px]! font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap";
const btnP = `${btnBase} bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500`;
const btnG = `${btnBase} bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-blue-500/10 dark:hover:text-blue-400`;
const btnD = `${btnBase} bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25`;
const inpCls =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13.5px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 dark:border-white/1₀ dark:bg-white/5 dark:text-slate-1₀₀ dark:placeholder:text-slate-5₀₀ dark:focus:border-blue-4₀₀";
const lblCls =
  "mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500";

// ─── Avatar (solid colour by role, no gradient) ───
function Avatar({
  name,
  size = 40,
  role,
}: {
  name?: string | null;
  size?: number;
  role?: UserRole;
}) {
  const ch = name?.charAt(0).toUpperCase() || "?";
  const bg =
    role === "main_admin"
      ? "bg-blue-800 dark:bg-blue-600"
      : role === "co_admin"
        ? "bg-blue-600 dark:bg-blue-500"
        : "bg-slate-500 dark:bg-slate-600";
  return (
    <div
      className={`${bg} flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-1 ring-white/20`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {ch}
    </div>
  );
}

// ─── Helpers ───
function formatDate(d: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// generateExcelCertPdf — DROP-IN REPLACEMENT
// - TEXTURE FIXED: Uses the EXACT waveTexture SVG (with the 5 bezier curves) 
//   and repeating-linear-gradient you provided from the second screenshot.
// - Keeps all the fixed overlaps, new signature layout, and "SRILAL COMPUTER
//   INSTITUTE" branding.
// ─────────────────────────────────────────────────────────────────────────────
const generateExcelCertPdf = async (cert: any) => {
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

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.innerHTML = `
    <div style="width:1123px;height:794px;background:#f8f6f0;position:relative;box-sizing:border-box;font-family:'Georgia','Times New Roman',serif;color:#1a1a2e;overflow:hidden;">
      
      <!-- SVG GENERATED WAVE TEXTURE (Exactly as provided) -->
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

      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-24deg);font-size:50px;font-weight:900;color:rgba(26,58,138,0.03);letter-spacing:8px;white-space:nowrap;pointer-events:none;font-family:'DM Sans',sans-serif;">SRILAL COMPUTER INSTITUTE</div>

      <svg style="position:absolute;top:0;left:0;width:100%;height:260px;pointer-events:none;z-index:1;" viewBox="0 0 1123 260" preserveAspectRatio="none">
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
        <div style="font-size:10px;font-weight:700;color:#0a1628;margin-top:6px;font-family:'DM Sans',sans-serif;letter-spacing:1;">SRILAL COMPUTER</div>
        <div style="font-size:8px;color:#64748b;font-family:'DM Sans',sans-serif;letter-spacing:0.5;">INSTITUTE</div>
      </div>

      <div style="position:absolute;top:30px;left:30px;width:55px;height:55px;border-top:2.5px solid #c9a227;border-left:2.5px solid #c9a227;opacity:0.7;z-index:2;"></div>
      <div style="position:absolute;top:30px;right:30px;width:55px;height:55px;border-top:2.5px solid #c9a227;border-right:2.5px solid #c9a227;opacity:0.7;z-index:2;"></div>
      <div style="position:absolute;bottom:30px;left:30px;width:55px;height:55px;border-bottom:2.5px solid #c9a227;border-left:2.5px solid #c9a227;opacity:0.7;z-index:2;"></div>
      <div style="position:absolute;bottom:30px;right:30px;width:55px;height:55px;border-bottom:2.5px solid #c9a227;border-right:2.5px solid #c9a227;opacity:0.7;z-index:2;"></div>

      <div style="position:absolute;top:150px;left:80px;right:80px;bottom:40px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:10;">

        <div style="font-size:48px;font-weight:400;color:#1a1a2e;text-transform:uppercase;letter-spacing:8px;font-family:'Playfair Display','Georgia',serif;">Certificate</div>

        <div style="background:linear-gradient(90deg,#0a1628 0%,#1a3a5c 50%,#0a1628 100%);color:#f4e4a6;padding:8px 45px;border-radius:30px;font-size:15px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-top:10px;font-family:'DM Sans',sans-serif;box-shadow:0 4px 15px rgba(10,22,40,0.3);">
          of Achievement
        </div>

        <div style="margin-top:22px;display:flex;align-items:center;gap:12px;">
          <div style="width:6px;height:6px;background:#c9a227;border-radius:50%;"></div>
          <div style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:2.5px;font-family:'DM Sans',sans-serif;font-weight:500;white-space:nowrap;">
            This Certificate is Proudly Presented to
          </div>
          <div style="width:6px;height:6px;background:#c9a227;border-radius:50%;"></div>
        </div>

        <div style="margin-top:22px;position:relative;width:100%;">
          <div style="font-size:52px;font-weight:400;color:#1a1a2e;font-family:'Great Vibes','Brush Script MT','Georgia',cursive;letter-spacing:2px;line-height:1.15;">
            ${cert.student_name}
          </div>

          <div style="margin-top:0px;display:flex;align-items:center;justify-content:center;gap:0;width:100%;">
            <div style="width:180px;height:1.5px;background:linear-gradient(90deg,transparent,#c9a227);"></div>
            <div style="width:8px;height:8px;background:#c9a227;transform:rotate(45deg);margin:0 12px;box-shadow:0 0 6px rgba(201,162,39,0.4);"></div>
            <div style="width:180px;height:1.5px;background:linear-gradient(90deg,#c9a227,transparent);"></div>
          </div>
        </div>

        <div style="margin-top:16px;display:flex;justify-content:center;gap:50px;width:100%;">
          <div style="width:220px;flex-shrink:0;text-align:center;">
            <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.3;">Father's Name</div>
            <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:4px;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.4;">${cert.father_name || "—"}</div>
          </div>
          <div style="width:220px;flex-shrink:0;text-align:center;">
            <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.3;">Mother's Name</div>
            <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:4px;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.4;">${cert.mother_name || "—"}</div>
          </div>
          <div style="width:220px;flex-shrink:0;text-align:center;">
            <div style="font-size:9px;color:#8b7355;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:'DM Sans',sans-serif;white-space:nowrap;line-height:1.3;">Roll Number</div>
            <div style="font-size:14px;font-weight:700;color:#b8941f;margin-top:4px;font-family:'JetBrains Mono',monospace;white-space:nowrap;line-height:1.4;">${cert.roll_no}</div>
          </div>
        </div>
        <div style="margin-top:16px;font-size:14px;color:#475569;line-height:1.7;max-width:720px;font-family:'DM Sans',sans-serif;">
          This is to certify that <strong style="color:#1a3a5c;">${cert.student_name}</strong>
          <span style="color:#64748b;font-size:12px;">(Roll No: <strong style="color:#b8941f;">${cert.roll_no}</strong>)</span>
          has successfully completed the training and examination in
          <strong style="color:#1a3a5c;">${cert.course_name}</strong> with
          <strong style="color:#b8941f;">Grade ${cert.grade || "—"}</strong> under the guidance and supervision of
          <strong style="color:#1a3a5c;">Srilal Yadav</strong>, Proprietor & Director of Srilal Computer Institute (SCI),
          Shambhuganj, Jaunpur — 222132, Uttar Pradesh. This certificate is awarded in recognition of their
          dedication, hard work, and successful completion of all prescribed requirements.
        </div>
      </div>

      <div style="position:absolute;bottom:55px;left:80px;right:80px;height:110px;display:flex;align-items:flex-end;justify-content:space-between;z-index:10;">

        <div style="display:flex;align-items:center;gap:12px;">
          <div style="flex-shrink:0;border:2px solid #c9a227;border-radius:6px;padding:5px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
            <img crossorigin="anonymous" src="https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${encodeURIComponent(verifyUrl)}" width="75" height="75" style="display:block;" />
          </div>
          <div style="width:130px;flex-shrink:0;padding-bottom:4px;">
            <div style="font-size:10px;font-weight:700;color:#1a3a5c;font-family:'DM Sans',sans-serif;white-space:nowrap;">Scan to Verify</div>
            <div style="font-size:8px;color:#8b7355;font-family:'JetBrains Mono',monospace;margin-top:3px;white-space:nowrap;">ID: ${cert.roll_no}</div>
            <div style="font-size:8px;color:#8b7355;font-family:'DM Sans',sans-serif;margin-top:2px;white-space:nowrap;">${issueDate}</div>
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
            <text x="62.5" y="48" text-anchor="middle" fill="#d4af37" font-size="22">👑</text>
            <text x="62.5" y="68" text-anchor="middle" fill="#f4e4a6" font-size="8" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="0.5">SRILAL</text>
            <text x="62.5" y="80" text-anchor="middle" fill="#d4af37" font-size="8" font-weight="700" font-family="'DM Sans',sans-serif" letter-spacing="0.5">SCI</text>
            <path id="seal-arc" d="M 25,62.5 A 37.5,37.5 0 0,1 100,62.5" fill="none"/>
            <text fill="#c9a227" font-size="7" font-family="'DM Sans',sans-serif" letter-spacing="1.5">
              <textPath href="#seal-arc" startOffset="50%" text-anchor="middle">COMPUTER INSTITUTE</textPath>
            </text>
          </svg>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;padding-bottom:6px;width:280px;flex-shrink:0;">
          <div style="font-family:'Great Vibes','Brush Script MT','Segoe Script',cursive;font-size:38px;color:#11214d;line-height:1.2;transform:rotate(-2deg);white-space:nowrap;">Srilal Yadav</div>
          <svg width="190" height="12" viewBox="0 0 190 12" style="display:block;margin-top:4px;">
            <path d="M6 8 C 60 2, 130 2, 184 7" fill="none" stroke="#c9a227" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <div style="margin-top:8px;text-align:center;">
            <div style="font-size:13px;font-weight:700;color:#1a1a2e;font-family:'DM Sans',sans-serif;">Srilal Yadav</div>
            <div style="font-size:9px;color:#8b7355;font-family:'DM Sans',sans-serif;margin-top:2px;letter-spacing:0.3px;">Director, Srilal Computer Institute (SCI)</div>
          </div>
        </div>
      </div>

      <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px;z-index:10;">
        <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,#c9a227);"></div>
        <div style="width:5px;height:5px;background:#c9a227;border-radius:50%;"></div>
        <div style="font-size:8px;color:#8b7355;letter-spacing:1.5px;font-family:'DM Sans',sans-serif;">SHAMBHUGANJ, JAUNPUR — 222132, UTTAR PRADESH</div>
        <div style="width:5px;height:5px;background:#c9a227;border-radius:50%;"></div>
        <div style="width:80px;height:1px;background:linear-gradient(90deg,#c9a227,transparent);"></div>
      </div>

    </div>`;

  document.body.appendChild(container);

  try {
    const dataUrl = await toJpeg(container.firstElementChild as HTMLElement, {
      quality: 0.95,
      backgroundColor: "#ffffff",
    });
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(dataUrl, "JPEG", 0, 0, 297, 210);
    window.open(pdf.output("bloburl"), "_blank");
  } catch (err) {
    alert("Failed to generate certificate PDF. Please try again.");
  } finally {
    document.body.removeChild(container);
  }
};




// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function CertificatesClient() {
  const [isDark, setIsDark] = useState(false);
  const { user } = useAuth();

  const [certs, setCerts] = useState<CertCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pdf" | "excel">("all");

  const [generatingKey, setGeneratingKey] = useState<string | null>(null);
  const [editing, setEditing] = useState<CertCard | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStudent, setEditStudent] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editFather, setEditFather] = useState("");
  const [editMother, setEditMother] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingKey, setIsDeletingKey] = useState<string | null>(null);

  // Theme persistence — read once on mount, write only when toggled
  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else {
      setIsDark(false);
      localStorage.setItem("csc_theme", "light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("csc_theme", next ? "dark" : "light");
  };

  const loadCertificates = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = (await getAllCertificatesAction()) as unknown as {
        pdf: PdfCert[];
        excel: ExcelCert[];
      };
      const pdf: CertCard[] = (res.pdf || []).map((c) => ({
        key: `pdf-${c.certificate_number}`,
        id: c.id,
        kind: "pdf",
        title: c.certificate_number,
        student: c.student_name,
        course: c.course_name,
        issuedOn: c.created_at,
        fileUrl: c.file_url,
        contact: c.users?.mobile ? `Mobile ${c.users.mobile}` : null,
        extra: null,
      }));
      const excel: CertCard[] = (res.excel || []).map((c) => ({
        key: `excel-${c.id}`,
        id: c.id,
        kind: "excel",
        title: c.roll_no,
        student: c.student_name,
        course: c.course_name,
        issuedOn: c.created_at,
        fileUrl: null,
        contact: c.mobile
          ? `Mobile ${c.mobile}`
          : c.email
            ? `Email ${c.email}`
            : null,
        extra: [
          c.grade ? `Grade ${c.grade}` : null,
          c.father_name ? `Father: ${c.father_name}` : null,
          c.mother_name ? `Mother: ${c.mother_name}` : null,
        ]
          .filter(Boolean)
          .join(" · ") || null,
        excel: c,
      }));
      const merged = [...pdf, ...excel].sort(
        (a, b) =>
          new Date(b.issuedOn || 0).getTime() - new Date(a.issuedOn || 0).getTime()
      );
      setCerts(merged);
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : "Failed to load certificates");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const openExcelPdf = async (card: CertCard) => {
    if (!card.excel || generatingKey) return;
    setGeneratingKey(card.key);
    try {
      await generateExcelCertPdf(card.excel);
    } finally {
      setGeneratingKey(null);
    }
  };

  const openEdit = (card: CertCard) => {
    setEditing(card);
    setEditTitle(card.title);
    setEditStudent(card.student);
    setEditCourse(card.course);
    setEditFather(card.excel?.father_name || "");
    setEditMother(card.excel?.mother_name || "");
    setEditGrade(card.excel?.grade || "");
    setEditEmail(card.excel?.email || "");
    setEditMobile(card.excel?.mobile || "");
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!editTitle.trim() || !editStudent.trim() || !editCourse.trim()) {
      alert("Certificate number, student name and course are required.");
      return;
    }
    setIsSaving(true);
    try {
      if (editing.kind === "pdf") {
        await updateCertificateAction(editing.id, {
          certificate_number: editTitle.trim(),
          student_name: editStudent.trim(),
          course_name: editCourse.trim(),
        });
      } else {
        await updateExcelCertificateAction(editing.id, {
          roll_no: editTitle.trim(),
          student_name: editStudent.trim(),
          father_name: editFather.trim() || null,
          mother_name: editMother.trim() || null,
          course_name: editCourse.trim(),
          grade: editGrade.trim() || null,
          email: editEmail.trim() || null,
          mobile: editMobile.trim() || null,
        });
      }
      setEditing(null);
      await loadCertificates();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to save changes.");
    }
    setIsSaving(false);
  };

  const handleDelete = async (card: CertCard) => {
    if (user?.role !== "main_admin") return;
    if (
      !window.confirm(
        `Delete the certificate ${card.title} for ${card.student} permanently? This cannot be undone.`
      )
    )
      return;
    setIsDeletingKey(card.key);
    try {
      await deleteCertificateAction(card.id, card.kind);
      await loadCertificates();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete certificate.");
    }
    setIsDeletingKey(null);
  };

  const q = search.trim().toLowerCase();
  const visible = certs.filter(
    (c) =>
      (filter === "all" || c.kind === filter) &&
      (!q ||
        c.title.toLowerCase().includes(q) ||
        c.student.toLowerCase().includes(q) ||
        c.course.toLowerCase().includes(q))
  );
  const pdfCount = certs.filter((c) => c.kind === "pdf").length;
  const excelCount = certs.length - pdfCount;

  return (
    <AuthGuard allowedRoles={["co_admin", "main_admin"]}>
      <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 transition-colors dark:bg-[#0b1220] dark:text-slate-100">
        {/* ════════════════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════════════════ */}
        <header className="z-10 shrink-0 border-b-[3px] border-blue-600 bg-[#0b2239] shadow-md dark:border-blue-500 dark:bg-[#081120]">
          <div className="flex h-[54px] items-center gap-3.5 border-b border-white/[0.07] px-5">
            <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-white dark:bg-blue-600">
                <Landmark className="h-[17px] w-[17px]" />
              </div>
              <div>
                <div className="text-[17px] leading-none font-bold tracking-tight text-white">
                  Srilal<span className="text-blue-400">CSC</span>
                </div>
                <div className="mt-0.5 text-[9px] tracking-[0.1em] text-white/35">
                  ADMIN PANEL
                </div>
              </div>
            </Link>

            <div className="h-[26px] w-px shrink-0 bg-white/10" />

            <nav className="flex flex-1 gap-1 overflow-x-auto">
              {NAV_LINKS.map((l) => {
                const isActive = l.label === "Certificates";
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <l.icon className="h-3.5 w-3.5" /> {l.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={toggleTheme}
              className="flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-blue-500/40 bg-white/10 px-3.5 py-1.5 text-xs! font-bold text-white/70 transition-colors hover:border-blue-500 hover:text-white"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {isDark ? "Light" : "Dark"}
            </button>

            <div className="flex shrink-0 items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5">
              <Avatar
                name={user?.name}
                size={28}
                role={(user?.role as UserRole) || "user"}
              />
              <div>
                <div className="text-[13px] leading-none font-bold text-white">
                  {user?.name || "Admin"}
                </div>
                <div className="mt-0.5 text-[9px] tracking-wider text-blue-400">
                  {(user?.role || "ADMIN").toString().replace("_", " ").toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════════ */}
        <div className="bg-[#0b2239] px-6 pt-12 pb-16 text-center dark:bg-[#081120]">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Certificates</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">
            Every certificate issued to students, in one place. Select a
            certificate number to open its PDF in a new tab — ready to download
            or print.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════
            FILTER BAR
        ════════════════════════════════════════════════════════ */}
        <div className="relative z-10 mx-auto -mt-9 w-full max-w-6xl px-4">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#111a2e]">
            <div className="relative flex min-w-[240px] flex-1 items-center rounded-lg border border-slate-200 bg-slate-50 px-3.5 dark:border-white/10 dark:bg-white/5 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
              <Search className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by certificate no., student or course…"
                className="w-full flex-1 border-none bg-transparent py-3 text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="cursor-pointer border-none bg-transparent p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {(
                [
                  { key: "all", label: `All (${certs.length})` },
                  { key: "pdf", label: `PDF (${pdfCount})` },
                  { key: "excel", label: `Excel (${excelCount})` },
                ] as const
              ).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setFilter(p.key)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[14px]! font-bold tracking-wide uppercase transition-colors ${
                    filter === p.key
                      ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-400"
                      : "border-slate-200 bg-slate-100 text-slate-500 hover:border-blue-600 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:text-blue-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            CONTENT
        ════════════════════════════════════════════════════════ */}
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {isLoading ? (
            <div className="py-16 text-center text-[13px] text-slate-400">
              <span className="mr-2.5 inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-700 align-middle dark:border-white/10 dark:border-t-blue-400" />
              Loading certificates…
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/25 dark:bg-red-500/10">
              <div className="text-base font-bold text-red-700 dark:text-red-400">
                Could not load certificates
              </div>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                {loadError}
              </p>
              <button onClick={loadCertificates} className={`${btnP} mt-5`}>
                Try again
              </button>
            </div>
          ) : certs.length === 0 ? (
            <div className="rounded-xl border-[1.5px] border-dashed border-slate-300 bg-white p-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/10">
                <Award className="h-7 w-7 text-blue-700 dark:text-blue-400" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                No certificates yet
              </div>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Certificates issued from the admin panel and bulk Excel uploads
                will appear here.
              </p>
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-xl border-[1.5px] border-dashed border-slate-300 bg-white p-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                No certificates match that search
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try a different certificate number, student name or course.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((c) => (
                <article
                  key={c.key}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 pt-5 pb-4 dark:border-white/5">
                    <div className="min-w-0">
                      <div className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                        Certificate No.
                      </div>
                      {c.kind === "pdf" && c.fileUrl ? (
                        <a
                          href={c.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open the certificate PDF in a new tab"
                          className="mt-1 flex items-center gap-1.5 font-mono text-[15px] font-bold break-all text-blue-700 hover:underline dark:text-blue-400"
                        >
                          {c.title}
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        </a>
                      ) : c.kind === "excel" ? (
                        <button
                          type="button"
                          onClick={() => openExcelPdf(c)}
                          disabled={generatingKey === c.key}
                          title="Generate and open the certificate PDF in a new tab"
                          className="mt-1 flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-left font-mono text-[15px] font-bold break-all text-blue-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400"
                        >
                          {generatingKey === c.key ? "Generating…" : c.title}
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        </button>
                      ) : (
                        <span className="mt-1 block font-mono text-[15px] font-bold break-all text-slate-900 dark:text-slate-100">
                          {c.title}
                        </span>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase ${
                        c.kind === "pdf"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400"
                          : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                      }`}
                    >
                      {c.kind === "pdf" ? "PDF" : "Excel"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 px-5 py-4 text-[13px]">
                    <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                      <User className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{c.student}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{c.course}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                      Issued {formatDate(c.issuedOn)}
                    </div>
                    {c.contact && (
                      <div className="truncate text-slate-500 dark:text-slate-400">
                        {c.contact}
                      </div>
                    )}
                    {c.extra && (
                      <div className="truncate text-slate-500 dark:text-slate-400">
                        {c.extra}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 border-t border-slate-100 px-5 py-3 dark:border-white/5">
                    {c.kind === "pdf" && c.fileUrl ? (
                      <a
                        href={c.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`${btnP} flex-1 justify-center no-underline`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open PDF
                      </a>
                    ) : c.kind === "excel" ? (
                      <button
                        type="button"
                        onClick={() => openExcelPdf(c)}
                        disabled={generatingKey === c.key}
                        className={`${btnP} flex-1 justify-center`}
                      >
                        {generatingKey === c.key ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ExternalLink className="h-3.5 w-3.5" />
                        )}
                        {generatingKey === c.key ? "Generating…" : "Open PDF"}
                      </button>
                    ) : (
                      <span className="py-2 text-xs text-slate-400">
                        No file attached to this certificate.
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      title="Edit certificate"
                      className={`${btnG} px-3`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    {user?.role === "main_admin" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        disabled={isDeletingKey === c.key}
                        title="Delete certificate"
                        className={`${btnD} px-3`}
                      >
                        {isDeletingKey === c.key ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════
            EDIT MODAL
        ════════════════════════════════════════════════════════ */}
        {editing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
            onClick={() => !isSaving && setEditing(null)}
          >
            <div
              className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:border dark:border-white/10 dark:bg-[#111a2e]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/5">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Edit certificate
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {editing.kind === "pdf" ? "PDF certificate" : "Excel-backed certificate"} ·{" "}
                    {editing.title}
                  </div>
                </div>
                <button
                  onClick={() => !isSaving && setEditing(null)}
                  className="cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
                <label className="block">
                  <span className={lblCls}>
                    {editing.kind === "pdf" ? "Certificate No." : "Roll No."}
                  </span>
                  <input
                    className={inpCls}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className={lblCls}>Student Name</span>
                  <input
                    className={inpCls}
                    value={editStudent}
                    onChange={(e) => setEditStudent(e.target.value)}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={lblCls}>Course</span>
                  <input
                    className={inpCls}
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                  />
                </label>
                {editing.kind === "excel" && (
                  <>
                    <label className="block">
                      <span className={lblCls}>Father's Name</span>
                      <input
                        className={inpCls}
                        value={editFather}
                        onChange={(e) => setEditFather(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className={lblCls}>Mother's Name</span>
                      <input
                        className={inpCls}
                        value={editMother}
                        onChange={(e) => setEditMother(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className={lblCls}>Grade</span>
                      <input
                        className={inpCls}
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className={lblCls}>Email</span>
                      <input
                        className={inpCls}
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className={lblCls}>Mobile</span>
                      <input
                        className={inpCls}
                        value={editMobile}
                        onChange={(e) => setEditMobile(e.target.value)}
                      />
                    </label>
                  </>
                )}
              </div>

              <p className="px-5 pb-1 text-xs leading-relaxed text-slate-400">
                {editing.kind === "pdf"
                  ? "Editing updates the record only — the stored PDF file itself is unchanged. To change what the PDF says, re-issue it from the admin panel."
                  : "Changing the roll no. changes the unique title, and the verify link / QR on PDFs generated after the change."}
              </p>

              <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4 dark:border-white/5">
                <button
                  className={btnG}
                  onClick={() => setEditing(null)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button className={btnP} onClick={saveEdit} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  {isSaving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
