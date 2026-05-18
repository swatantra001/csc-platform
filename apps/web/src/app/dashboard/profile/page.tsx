
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { updateUserProfile, updatePasswordAction, topUpWalletAction } from "@/app/actions/user";
import { uploadAvatarAction } from "@/app/actions/storage";
import { fetchMyAddressesAction, addAddressAction, deleteAddressAction } from "@/app/actions/address";

// ════════════════════════════════════════════════════════════════════════════════
// TYPES (Preserved Exactly)
// ════════════════════════════════════════════════════════════════════════════════
type Lang = "hi" | "en";

interface WalletTx {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  descriptionHi: string;
  date: string;
  balance: number;
}

interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  preferredLang: Lang;
  walletBalance: number;
  role: "user" | "co_admin" | "main_admin";
  memberSince: string;
  requestsTotal: number;
  requestsDone: number;
}

const MOCK_USER: UserProfile = {
  id: "U-1042",
  name: "User",
  mobile: "",
  preferredLang: "hi",
  walletBalance: 0,
  role: "user",
  memberSince: "Today",
  requestsTotal: 0,
  requestsDone: 0,
};

const MOCK_WALLET_TXS: WalletTx[] = [];

// ════════════════════════════════════════════════════════════════════════════════
// LANGUAGE STRINGS (Renamed from T → LANG to free up T for Theme Tokens)
// ════════════════════════════════════════════════════════════════════════════════
const LANG: Record<Lang, Record<string, string>> = {
  hi: {
    profile: "मेरी प्रोफ़ाइल",
    wallet: "वॉलेट",
    history: "लेन-देन इतिहास",
    settings: "सेटिंग्स",
    name: "नाम",
    mobile: "मोबाइल",
    memberId: "सदस्य ID",
    since: "सदस्य बने",
    totalReq: "कुल आवेदन",
    doneReq: "पूर्ण आवेदन",
    balance: "शेष राशि",
    topUp: "राशि जोड़ें",
    editName: "नाम संपादित करें",
    saveChanges: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    langPref: "भाषा प्राथमिकता",
    setPassword: "पासवर्ड सेट करें / बदलें",
    logout: "लॉगआउट",
    deleteAccount: "खाता हटाएं",
    currentPass: "वर्तमान पासवर्ड",
    newPass: "नया पासवर्ड",
    confirmPass: "पासवर्ड की पुष्टि करें",
    updatePass: "पासवर्ड अपडेट करें",
    passMatch: "पासवर्ड मेल नहीं खाते",
    passShort: "न्यूनतम 6 अक्षर",
    passUpdated: "पासवर्ड सफलतापूर्वक अपडेट हुआ",
    topUpNote: "प्रीपेड उपयोगकर्ताओं को सेवाओं में प्राथमिकता मिलती है।",
    requestHistory: "आवेदन इतिहास",
    editProfile: "प्रोफ़ाइल संपादित करें",
    notSet: "सेट नहीं है",
    credit: "जमा",
    debit: "नामे",
    closing: "शेष",
    noTxn: "कोई लेन-देन नहीं",
    passSection: "पासवर्ड",
    dangerZone: "खतरनाक क्षेत्र",
    deleteConfirm: "क्या आप वाकई अपना खाता हटाना चाहते हैं?",
    savedAddresses: "सेव किए गए पते",
    addAddressBtn: "+ नया पता जोड़ें",
    addrLabel: "लेबल (जैसे: घर, दुकान)",
    fullAddress: "पूरा पता",
    pincode: "पिनकोड",
    delete: "हटाएं",
    noAddresses: "अभी कोई पता सेव नहीं किया गया है।",
  },
  en: {
    profile: "My Profile",
    wallet: "Wallet",
    history: "Transaction History",
    settings: "Settings",
    name: "Name",
    mobile: "Mobile",
    memberId: "Member ID",
    since: "Member Since",
    totalReq: "Total Requests",
    doneReq: "Completed",
    balance: "Balance",
    topUp: "Add Money",
    editName: "Edit Name",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    langPref: "Language Preference",
    setPassword: "Set / Change Password",
    logout: "Logout",
    deleteAccount: "Delete Account",
    currentPass: "Current Password",
    newPass: "New Password",
    confirmPass: "Confirm Password",
    updatePass: "Update Password",
    passMatch: "Passwords do not match",
    passShort: "Minimum 6 characters",
    passUpdated: "Password updated successfully",
    topUpNote: "Prepaid users get priority service on all requests.",
    requestHistory: "Request History",
    editProfile: "Edit Profile",
    notSet: "Not set yet",
    credit: "Credit",
    debit: "Debit",
    closing: "Balance",
    noTxn: "No transactions yet",
    passSection: "Password",
    dangerZone: "Danger Zone",
    deleteConfirm: "Are you sure you want to delete your account?",
    savedAddresses: "Saved Addresses",
    addAddressBtn: "+ Add New Address",
    addrLabel: "Label (e.g. Home, Office)",
    fullAddress: "Full Address",
    pincode: "Pincode",
    delete: "Delete",
    noAddresses: "No saved addresses found.",
  },
};

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
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard" : "http://localhost:3000/dashboard", icon: "📱", label: "Dashboard" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/posts" : "http://localhost:3000/posts", icon: "✏️", label: "Posts" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/galary" : "http://localhost:3000/galary", icon: "🖼️", label: "Gallery" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/notifications" : "http://localhost:3000/notifications", icon: "🔔", label: "Notifications" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/dashboard/profile" : "http://localhost:3000/dashboard/profile", icon: "👤", label: "Profile" },
  { href: process.env.NODE_ENV === "production" ? "https://srilalsahaj.co.in/status" : "http://localhost:3000/status", icon: "📊", label: "Status" },
];

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
.top-nav-link.on{background:${T.navActiveBg};color:${T.navActiveText};border-color:${T.accentBorder};}

/* ── TABS ── */
.tab-btn{
  padding:11px 20px;background:transparent;border:none;border-bottom:2px solid transparent;
  color:${T.subTabText};font-size:13px;font-weight:700;cursor:pointer;
  font-family:'DM Sans',sans-serif;transition:all .15s;letter-spacing:.02em;
}
.tab-btn.on{color:${T.subTabActive};border-bottom-color:${T.subTabBorder};}
.tab-btn:hover:not(.on){color:${T.textSecondary};}

/* ── CARD ── */
.card{background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:12px;overflow:hidden;box-shadow:${T.cardShadow};margin-bottom:16px;animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;}
.sec-hdr{display:flex;align-items:center;gap:9px;padding:11px 17px;background:${T.sectionGrad};}
.sec-hdr-txt{font-size:.75rem;font-weight:800;color:${T.sectionGradText};text-transform:uppercase;letter-spacing:.07em;}

/* ── FIELD ROW ── */
.field-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid ${T.divider};}
.field-row:last-child{border-bottom:none;}
.field-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${T.textMuted};}
.field-value{font-size:14px;color:${T.textPrimary};font-weight:500;}

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
.inp:focus{border-color:${T.inputFocusBorder};box-shadow:0 0 0 3px ${T.accentLight};}
.inp::placeholder{color:${T.inputPlaceholder};}

/* ── WALLET CARD ── */
.wallet-card{background:linear-gradient(135deg,${T.navBg},${T.accent});border-radius:12px;padding:24px;color:#fff;position:relative;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.2);}

/* ── LEDGER ── */
.ledger-row{display:grid;grid-template-columns:1fr 80px 80px 80px;gap:8px;align-items:center;padding:10px 16px;border-bottom:1px solid ${T.divider};}
.ledger-row:last-child{border-bottom:none;}

/* ── LANG OPT ── */
.lang-opt{flex:1;padding:10px;border:1.5px solid ${T.cardBorder};border-radius:8px;cursor:pointer;text-align:center;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:all 0.15s;background:transparent;}
.lang-opt:hover{border-color:${T.accent};}

/* ── TOPUP PRESET ── */
.topup-preset{padding:8px 16px;background:${T.inputBg};border:1.5px solid ${T.inputBorder};border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;font-family:'JetBrains Mono',monospace;color:${T.textPrimary};transition:all 0.15s;}
.topup-preset:hover{border-color:${T.accent};color:${T.accent};}
.topup-preset.on{background:${T.accentLight};border-color:${T.accent};color:${T.accent};}

/* ── THEME TOGGLE ── */
.tog{
  display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:20px;
  border:1.5px solid ${T.accentBorder};background:rgba(255,255,255,0.08);
  color:${T.navText};font-size:12px;font-weight:700;cursor:pointer;
  transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.tog:hover{border-color:${T.navBottomBorder};color:${T.navTextHover};}

/* ── HERO ── */
.hero{background:linear-gradient(135deg,${T.navBg} 0%,${T.accentHover}88 100%);padding:28px 0 0;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='white' opacity='0.06'/%3E%3C/svg%3E") repeat;}
.hero-inner{position:relative;z-index:1;}

/* ── STAT STRIP ── */
.stat-strip{background:rgba(0,0,0,0.25);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,0.1);margin-top:4px;}
.stat-item{text-align:center;padding:8px 4px;}
.stat-val{display:block;font-size:1.5rem;font-weight:700;color:#fff;line-height:1;font-family:'DM Serif Display',serif;}
.stat-label{display:block;font-size:0.65rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.6px;margin-top:2px;font-weight:600;}

/* ── ANIMS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideIn{from{opacity:0;transform:translateX(12px);}to{opacity:1;transform:translateX(0);}}
@keyframes balancePop{from{transform:scale(0.92);opacity:0;}to{transform:scale(1);opacity:1;}}

/* ── MOBILE RESPONSIVE ── */
@media(max-width:768px){
  .nav-links{display:none!important;}
  .ledger-row{grid-template-columns:1fr 60px 60px 60px!important;}
  .stat-strip-inner{grid-template-columns:repeat(3,1fr)!important;}
  .field-row{flex-direction:column;align-items:flex-start!important;gap:6px;}
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
export default function UserProfilePage() {
  // DEFAULT = LIGHT theme
  const [isDark, setIsDark] = useState(false);
  const T = isDark ? THEMES.dark : THEMES.light;

  const { user: realUser, isLoggedIn, loading } = useAuth();

  const [lang, setLang] = useState<Lang>("en");
  const t = LANG[lang];

  const [activeTab, setActiveTab] = useState<"profile" | "wallet" | "settings">("profile");
  const [user, setUser] = useState<UserProfile>(MOCK_USER);

  // Name State
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Mobile State
  const [editingMobile, setEditingMobile] = useState(false);
  const [mobileInput, setMobileInput] = useState("");

  // Password State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  // Wallet State
  const [topUpAmount, setTopUpAmount] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // ✨ Address Book State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", full: "", pin: "" });
  const [isSavingAddr, setIsSavingAddr] = useState(false);

  // ─── 1. SYNC REAL USER FROM DB (Preserved exactly) ───
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      window.location.href = "/";
      return;
    }

    if (realUser) {
      const mappedUser: UserProfile = {
        id: realUser.id?.split("-")[0].toUpperCase() || MOCK_USER.id,
        name: realUser.name || "",
        mobile: realUser.mobile || "",
        preferredLang: (realUser.preferred_lang as Lang) || "hi",
        walletBalance: realUser.wallet_balance || 0,
        role: realUser.role as any || "user",
        memberSince: realUser.created_at ? new Date(realUser.created_at).toLocaleDateString() : "Today",
        requestsTotal: 0,
        requestsDone: 0,
      };

      setUser(mappedUser);
      setNameInput(mappedUser.name);
      setMobileInput(mappedUser.mobile);
      setLang(mappedUser.preferredLang);
      setAvatarUrl((realUser as any).avatar_url || null);

      // ✨ Fetch Addresses
      fetchMyAddressesAction().then(data => setAddresses(data));
    }
  }, [realUser, loading, isLoggedIn]);

  // ─── 2. SYNC THEME (Preserved exactly) ───
  useEffect(() => {
    const savedTheme = localStorage.getItem("csc_theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(mq.matches);
    }
  }, []);

  const handleDarkToggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const handleLangChange = async (newLang: Lang) => {
    setLang(newLang);
    await updateUserProfile({ preferred_lang: newLang });
  };

  // ─── 3. DATABASE ACTION HANDLERS (All preserved exactly) ───
  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    await updateUserProfile({ name: nameInput.trim() });
    setUser((u) => ({ ...u, name: nameInput.trim() }));
    setEditingName(false);
  };

  const handleSaveMobile = async () => {
    const val = mobileInput.replace(/\D/g, "");
    if (val.length !== 10) {
      alert(lang === "hi" ? "कृपया 10 अंकों का मोबाइल नंबर दर्ज करें" : "Please enter a 10-digit mobile number");
      return;
    }
    await updateUserProfile({ mobile: val });
    setUser((u) => ({ ...u, mobile: val }));
    setEditingMobile(false);
  };

  const handleUpdatePassword = async () => {
    setPassError("");
    if (newPass.length < 6) { setPassError(t.passShort); return; }
    if (newPass !== confirmPass) { setPassError(t.passMatch); return; }

    setSavingPass(true);
    try {
      const data = await updatePasswordAction(newPass);
      if (data.success) {
        setPassSuccess(true);
        setCurrentPass(""); setNewPass(""); setConfirmPass("");
        setTimeout(() => setPassSuccess(false), 3000);
      } else {
        setPassError(data.message || "Failed to update password");
      }
    } catch {
      setPassError("Network error");
    } finally {
      setSavingPass(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddr.label.trim() || !newAddr.full.trim() || !newAddr.pin.trim()) return;
    setIsSavingAddr(true);
    try {
      const added = await addAddressAction({ label: newAddr.label, full_address: newAddr.full, pincode: newAddr.pin });
      setAddresses([added, ...addresses]);
      setShowAddAddress(false);
      setNewAddr({ label: "", full: "", pin: "" });
    } catch (e) {
      alert("Failed to save address.");
    } finally {
      setIsSavingAddr(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm(lang === "hi" ? "क्या आप वाकई यह पता हटाना चाहते हैं?" : "Are you sure you want to delete this address?")) return;
    try {
      await deleteAddressAction(id);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (e) {
      alert("Failed to delete address.");
    }
  };

  const handleTopUp = async () => {
    const amt = parseFloat(topUpAmount);
    if (amt < 10) return;

    const result = await topUpWalletAction(amt);
    if (result.success) {
      setShowTopUp(false);
      setTopUpAmount("");
      window.location.reload();
    } else {
      alert("Top-up failed. Please try again.");
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.pageBg, color: T.textPrimary, transition: "background .25s, color .25s", fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: buildCss(T as any) }} />

      {/* ════════════════════════════════════════════════════════
          HEADER — navy indigo in both themes
      ════════════════════════════════════════════════════════ */}
      <header style={{ background: T.navBg, borderBottom: `3px solid ${T.navBottomBorder}`, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)", position: "sticky", top: 0 }}>
        <div style={{ display: "flex", alignItems: "center", height: 54, padding: "0 20px", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${T.navBottomBorder},${T.accentHover})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏛️</div>
            <div>
              <div className="serif" style={{ fontSize: 17, color: T.navBrand, letterSpacing: "-0.3px", lineHeight: 1 }}>
                Srilal<span style={{ color: T.navBrandAccent }}>CSC</span>
              </div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: ".1em" }}>PROFILE</div>
            </div>
          </a>

          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

          {/* Nav links */}
          <nav className="nav-links" style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className={`top-nav-link ${l.href === "/dashboard/profile" ? "on" : ""}`}>
                <span style={{ fontSize: 13 }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button onClick={() => handleLangChange(lang === "hi" ? "en" : "hi")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "5px 12px", fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}>
              {lang === "hi" ? "EN" : "हि"}
            </button>

            {/* Theme Toggle */}
            <button className="tog" onClick={handleDarkToggle}>
              <span style={{ fontSize: 14 }}>{T.toggleIcon}</span> {T.toggleLabel}
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <div className="hero">
        <div className="hero-inner" style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
          <h1 className="serif" style={{ fontSize: "clamp(1.4rem,4vw,2.1rem)", color: "#fff", lineHeight: 1.25, marginBottom: 6 }}>{lang === "hi" ? "जन सेवा केंद्र" : "Jan Seva Kendra"}</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: "0.75rem", padding: "5px 12px", borderRadius: 8, fontWeight: 500 }}>
              👤 <span style={{ color: "#fff", fontWeight: 700 }}>{user.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: "0.75rem", padding: "5px 12px", borderRadius: 8, fontWeight: 500 }}>
              📱 <span>{user.mobile ? `+91 ${user.mobile}` : t.notSet}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: "0.75rem", padding: "5px 12px", borderRadius: 8, fontWeight: 500 }}>
              🏷️ <span style={{ color: "#fff", fontWeight: 700 }}>{user.id}</span>
            </div>
          </div>
        </div>
        <div className="stat-strip">
          <div className="stat-strip-inner" style={{ maxWidth: 640, margin: "0 auto", padding: "14px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 4 }}>
            <div className="stat-item">
              <span className="stat-val">{user.requestsTotal}</span>
              <span className="stat-label">{t.totalReq}</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{user.requestsDone}</span>
              <span className="stat-label">{t.doneReq}</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">₹{user.walletBalance}</span>
              <span className="stat-label">{t.balance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 60px", width: "100%" }}>

        {/* ── TABS ── */}
        <div style={{ borderBottom: `1px solid ${T.divider}`, display: "flex", marginBottom: 24 }}>
          {(["profile", "wallet", "settings"] as const).map((tab) => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? "on" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab === "profile" ? `👤 ${t.profile}` : tab === "wallet" ? `💰 ${t.wallet}` : `⚙️ ${t.settings}`}
            </button>
          ))}
        </div>

        {/* ════════ PROFILE TAB ════════ */}
        {activeTab === "profile" && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <div className="card">
              <SecHdr icon="📖" label={lang === "hi" ? "विवरण पुस्तिका" : "Account Passbook"} />
              <div style={{ padding: "16px 18px" }}>
                {/* Avatar & Name Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${T.divider}` }}>
                  <div style={{ position: "relative", width: 72, height: 72, borderRadius: "50%", background: avatarUrl ? `url(${avatarUrl}) center/cover` : `linear-gradient(135deg,${T.accent},${T.accentHover})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, border: `3px solid ${T.cardBg}`, boxShadow: `0 0 0 2px ${T.divider}` }}>
                    {!avatarUrl && <span style={{ color: "#fff" }}>{user.name?.charAt(0) || "👤"}</span>}
                    <button
                      disabled={isUploadingAvatar}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            setIsUploadingAvatar(true);
                            const formData = new FormData();
                            formData.append("file", file);
                            const result = await uploadAvatarAction(formData);
                            if (result.success && result.url) {
                              setAvatarUrl(result.url);
                            } else {
                              alert("Failed to upload image.");
                            }
                            setIsUploadingAvatar(false);
                          }
                        };
                        input.click();
                      }}
                      style={{ position: "absolute", bottom: -5, right: -5, background: T.cardBg, border: `1px solid ${T.divider}`, borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", opacity: isUploadingAvatar ? 0.5 : 1 }}
                    >
                      {isUploadingAvatar ? "⏳" : "📷"}
                    </button>
                  </div>
                  <div>
                    <h1 className="serif" style={{ fontSize: 24, fontWeight: 900, color: T.textPrimary, lineHeight: 1.2, marginBottom: 4 }}>{user.name}</h1>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span className="mono" style={{ fontSize: 12, color: T.textSecondary }}>{user.mobile ? `+91 ${user.mobile}` : ""}</span>
                      <span className="mono" style={{ fontSize: 11, background: T.tagBg, color: T.tagText, border: `1px solid ${T.accentBorder}`, borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>
                        {user.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* NAME FIELD */}
                <div className="field-row">
                  <div style={{ flex: 1 }}>
                    <div className="field-label">{t.name}</div>
                    {editingName ? (
                      <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                        <input
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="inp"
                          style={{ width: 180, padding: "7px 10px" }}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                          autoFocus
                        />
                        <button className="btn btn-p" style={{ padding: "7px 14px", fontSize: 12 }} onClick={handleSaveName}>{t.saveChanges}</button>
                        <button className="btn btn-g" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => { setEditingName(false); setNameInput(user.name); }}>{t.cancel}</button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                        <span className="field-value serif" style={{ fontSize: 16 }}>{user.name}</span>
                        <button onClick={() => setEditingName(true)} style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: 0 }}>✏️ {t.editName}</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* MOBILE FIELD */}
                <div className="field-row">
                  <div style={{ flex: 1 }}>
                    <div className="field-label">{t.mobile}</div>
                    {editingMobile ? (
                      <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.textSecondary, fontSize: 13, fontFamily: "'JetBrains Mono',monospace" }}>+91</span>
                          <input
                            value={mobileInput}
                            onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="inp mono"
                            style={{ width: 180, padding: "7px 10px 7px 40px" }}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveMobile()}
                            autoFocus
                          />
                        </div>
                        <button className="btn btn-p" style={{ padding: "7px 14px", fontSize: 12 }} onClick={handleSaveMobile}>{t.saveChanges}</button>
                        <button className="btn btn-g" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => { setEditingMobile(false); setMobileInput(user.mobile); }}>{t.cancel}</button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                        <span className="field-value mono" style={{ fontSize: 14 }}>
                          {user.mobile ? `+91 ${user.mobile}` : t.notSet}
                        </span>
                        <button onClick={() => setEditingMobile(true)} style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: 0 }}>
                          ✏️ {lang === "hi" ? "संपादित करें" : "Edit"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* STATIC FIELDS */}
                {[
                  [t.since, user.memberSince, false],
                  ["Role", user.role === "main_admin" ? "Main Admin 🏛️" : user.role === "co_admin" ? "Co-Admin 👷" : (lang === "hi" ? "उपयोगकर्ता" : "User"), false],
                ].map(([label, val, mono]) => (
                  <div key={label as string} className="field-row">
                    <div className="field-label">{label as string}</div>
                    <div className={`field-value ${mono ? "mono" : ""}`} style={{ fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit" }}>{val as string}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* ✨ SAVED ADDRESSES CARD ✨ */}
            <div className="card" style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.sectionGrad, padding: "11px 17px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: "1.05rem" }}>📍</span>
                  <span className="sec-hdr-txt">{t.savedAddresses}</span>
                </div>
                {!showAddAddress && (
                  <button onClick={() => setShowAddAddress(true)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {t.addAddressBtn}
                  </button>
                )}
              </div>

              <div style={{ padding: "16px 18px" }}>
                {showAddAddress && (
                  <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px dashed ${T.accent}`, borderRadius: 10, padding: 16, marginBottom: 16, animation: "fadeUp 0.2s ease" }}>
                    <input className="inp" placeholder={t.addrLabel} value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} style={{ marginBottom: 8 }} />
                    <textarea className="inp" placeholder={t.fullAddress} value={newAddr.full} onChange={e => setNewAddr({ ...newAddr, full: e.target.value })} rows={2} style={{ marginBottom: 8, resize: "vertical" }} />
                    <input className="inp" placeholder={t.pincode} value={newAddr.pin} onChange={e => setNewAddr({ ...newAddr, pin: e.target.value })} style={{ marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-g" style={{ flex: 1, padding: 10 }} onClick={() => setShowAddAddress(false)}>{t.cancel}</button>
                      <button className="btn btn-p" style={{ flex: 1, padding: 10 }} onClick={handleAddAddress} disabled={isSavingAddr || !newAddr.label || !newAddr.full || !newAddr.pin}>
                        {isSavingAddr ? "..." : t.saveChanges}
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                  {addresses.length === 0 && !showAddAddress && (
                    <div style={{ color: T.textMuted, fontSize: 13, padding: 10 }}>{t.noAddresses}</div>
                  )}
                  {addresses.map(addr => (
                    <div key={addr.id} style={{ border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: 14, background: isDark ? "rgba(255,255,255,0.02)" : "#fff", position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 14 }}>{addr.label.toLowerCase().includes('home') || addr.label.toLowerCase().includes('घर') ? '🏠' : '🏢'}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{addr.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5, marginBottom: 4 }}>
                        {addr.full_address}
                      </div>
                      <div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>
                        {t.pincode}: {addr.pincode}
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: T.btnDangerText, cursor: "pointer", fontSize: 14, opacity: 0.6 }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
                        title={t.delete}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════ WALLET TAB ════════ */}
        {activeTab === "wallet" && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <div className="wallet-card" style={{ marginBottom: 20 }}>
              <div style={{ position: "absolute", top: "50%", right: -10, transform: "translateY(-50%) rotate(-15deg)", fontSize: 80, opacity: 0.05, userSelect: "none" }}>₹</div>
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                  {lang === "hi" ? "उपलब्ध शेष" : "Available Balance"}
                </div>
                <div className="serif" style={{ fontSize: 44, fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: 6, animation: "balancePop 0.5s ease" }}>
                  ₹{user.walletBalance}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  {t.topUpNote}
                </div>
                <button
                  onClick={() => setShowTopUp(!showTopUp)}
                  className="btn"
                  style={{ marginTop: 16, background: "#fff", color: T.navBg, fontWeight: 800 }}
                >
                  + {t.topUp}
                </button>
              </div>
            </div>

            {showTopUp && (
              <div className="card" style={{ marginBottom: 20, animation: "fadeUp 0.25s ease" }}>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, marginBottom: 14 }}>
                    {lang === "hi" ? "राशि चुनें" : "Select Amount"}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {[50, 100, 200, 500].map((amt) => (
                      <button key={amt} className={`topup-preset ${topUpAmount === String(amt) ? "on" : ""}`} onClick={() => setTopUpAmount(String(amt))}>
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value.replace(/\D/g, ""))}
                      placeholder={lang === "hi" ? "कस्टम राशि" : "Custom amount"}
                      className="inp"
                      style={{ flex: 1 }}
                    />
                    <button className="btn btn-s" onClick={handleTopUp} disabled={!topUpAmount || parseFloat(topUpAmount) < 10}>
                      {lang === "hi" ? "भुगतान करें" : "Pay via Razorpay"} →
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>
                    {lang === "hi" ? "UPI / कार्ड / नेट बैंकिंग द्वारा भुगतान" : "Pay via UPI / Card / Net Banking"}
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <SecHdr icon="📋" label={t.history} />
              <div style={{ background: T.subTabHdrBg, borderBottom: `1px solid ${T.divider}`, padding: "10px 16px", display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 8 }}>
                {[lang === "hi" ? "विवरण" : "Description", t.credit, t.debit, t.closing].map((h) => (
                  <div key={h} className="mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, textAlign: h !== (lang === "hi" ? "विवरण" : "Description") ? "right" : "left" }}>{h}</div>
                ))}
              </div>

              {MOCK_WALLET_TXS.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: T.textMuted, fontSize: 13 }}>{t.noTxn}</div>
              ) : (
                MOCK_WALLET_TXS.map((tx) => (
                  <div key={tx.id} className="ledger-row">
                    <div>
                      <div style={{ fontSize: 13, color: T.textPrimary, fontWeight: 500 }}>{lang === "hi" ? tx.descriptionHi : tx.description}</div>
                      <div style={{ fontSize: 11, color: T.textMuted }}>{tx.date}</div>
                    </div>
                    <div className="mono" style={{ fontSize: 13, textAlign: "right", color: tx.type === "credit" ? "#16a34a" : T.textMuted, fontWeight: tx.type === "credit" ? 700 : 400 }}>
                      {tx.type === "credit" ? `₹${tx.amount}` : "—"}
                    </div>
                    <div className="mono" style={{ fontSize: 13, textAlign: "right", color: tx.type === "debit" ? T.docIconColor : T.textMuted, fontWeight: tx.type === "debit" ? 700 : 400 }}>
                      {tx.type === "debit" ? `₹${tx.amount}` : "—"}
                    </div>
                    <div className="mono" style={{ fontSize: 13, textAlign: "right", color: T.textSecondary, fontWeight: 600 }}>₹{tx.balance}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ════════ SETTINGS TAB ════════ */}
        {activeTab === "settings" && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <SecHdr icon="🌐" label={t.langPref} />
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {(["hi", "en"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      className="lang-opt"
                      onClick={() => handleLangChange(l)}
                      style={{
                        borderColor: lang === l ? T.accent : T.cardBorder,
                        background: lang === l ? T.accentLight : "transparent",
                        color: lang === l ? T.accent : T.textSecondary,
                      }}
                    >
                      {l === "hi" ? "🇮🇳 हिंदी" : "🌐 English"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <SecHdr icon="🔐" label={t.passSection} />
              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  [t.currentPass, currentPass, setCurrentPass],
                  [t.newPass, newPass, setNewPass],
                  [t.confirmPass, confirmPass, setConfirmPass],
                ].map(([label, val, setter]) => (
                  <div key={label as string}>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: 5 }}>{label as string}</label>
                    <input
                      type="password"
                      value={val as string}
                      onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                      className="inp"
                      placeholder="••••••"
                    />
                  </div>
                ))}
                {passError && <div style={{ fontSize: 12, color: T.btnDangerText, fontWeight: 600 }}>{passError}</div>}
                {passSuccess && <div style={{ fontSize: 12, color: T.btnSuccessText, fontWeight: 600 }}>✓ {t.passUpdated}</div>}
                <button className="btn btn-p" style={{ alignSelf: "flex-start", marginTop: 4 }} onClick={handleUpdatePassword} disabled={savingPass || !newPass}>
                  {savingPass ? "..." : t.updatePass}
                </button>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <SecHdr icon="🚪" label={lang === "hi" ? "सत्र" : "Session"} />
              <div style={{ padding: "16px 18px" }}>
                <button
                  className="btn btn-g"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                    window.location.href = "/";
                  }}
                >
                  🚪 {t.logout}
                </button>
              </div>
            </div>

            <div className="card" style={{ borderColor: T.btnDangerBorder }}>
              <SecHdr icon="⚠️" label={t.dangerZone} />
              <div style={{ padding: "16px 18px" }}>
                {!showDeleteConfirm ? (
                  <button className="btn btn-d" onClick={() => setShowDeleteConfirm(true)}>{t.deleteAccount}</button>
                ) : (
                  <div style={{ background: T.btnDangerBg, border: `1px solid ${T.btnDangerBorder}`, borderRadius: 8, padding: "14px" }}>
                    <p style={{ fontSize: 13, color: T.btnDangerText, marginBottom: 12 }}>{t.deleteConfirm}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-d">
                        {lang === "hi" ? "हाँ, हटाएं" : "Yes, Delete"}
                      </button>
                      <button className="btn btn-g" onClick={() => setShowDeleteConfirm(false)}>{t.cancel}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}@keyframes slideIn{from{opacity:0;transform:translateX(12px);}to{opacity:1;transform:translateX(0);}}@keyframes balancePop{from{transform:scale(0.92);opacity:0;}to{transform:scale(1);opacity:1;}}`}</style>
    </div>
  );
}