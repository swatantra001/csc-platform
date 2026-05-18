
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";

// ── Types ──────────────────────────────────────────────────────────────────
export type UserRole = "user" | "co_admin" | "main_admin";
export type Lang     = "hi" | "en";

export interface AuthUser {
  id:             string;
  mobile:         string | null;
  email:          string | null;
  name:           string | null;
  role:           UserRole;
  wallet_balance: number;
  preferred_lang: Lang;
  position_label: string | null;
  created_at:    string;
}

interface AuthContextType {
  user:          AuthUser | null;
  loading:       boolean;
  isLoggedIn:    boolean;
  isAdmin:       boolean;
  isMainAdmin:   boolean;
  lang:          Lang;
  dark:          boolean;
  setLang:       (l: Lang) => void;
  setDark:       (d: boolean) => void;
  openLogin:     () => void;
  closeLogin:    () => void;
  logout:        () => Promise<void>;
  refreshUser:   () => Promise<void>;
  loginOpen:     boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ════════════════════════════════════════════════════════════════════════════════
// DUAL THEME TOKENS — Mutable type
// ════════════════════════════════════════════════════════════════════════════════
interface ThemeTokens {
  pageBg: string;
  navBg: string;
  navBottomBorder: string;
  navText: string;
  navTextHover: string;
  navBrand: string;
  navBrandAccent: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  sectionGrad: string;
  sectionGradText: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  accentBorder: string;
  inputBg: string;
  inputBorder: string;
  inputFocusBorder: string;
  inputText: string;
  inputPlaceholder: string;
  divider: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  pillActiveBg: string;
  pillActiveBorder: string;
  pillActiveText: string;
  btnPrimary: string;
  btnPrimaryText: string;
  btnPrimaryGlow: string;
  btnGhostBg: string;
  btnGhostBorder: string;
  btnGhostText: string;
  btnGhostHoverBg: string;
  btnGhostHoverText: string;
  btnDangerBg: string;
  btnDangerBorder: string;
  btnDangerText: string;
  btnSuccessBg: string;
  btnSuccessText: string;
  modalOverlay: string;
  modalBg: string;
  modalBorder: string;
  scrollThumb: string;
  toggleIcon: string;
  toggleLabel: string;
}

const THEMES: Record<"light" | "dark", ThemeTokens> = {
  light: {
    pageBg:            "#f1f5f9",
    navBg:             "#1e3a8a",
    navBottomBorder:   "#3b82f6",
    navText:           "rgba(255,255,255,0.65)",
    navTextHover:      "#ffffff",
    navBrand:          "#ffffff",
    navBrandAccent:    "#93c5fd",
    cardBg:            "#ffffff",
    cardBorder:        "#e2e8f0",
    cardShadow:        "0 1px 4px rgba(0,0,0,0.07)",
    sectionGrad:       "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",
    sectionGradText:   "#ffffff",
    textPrimary:       "#1e293b",
    textSecondary:     "#475569",
    textMuted:         "#94a3b8",
    accent:            "#2563eb",
    accentHover:       "#1d4ed8",
    accentLight:       "#eff6ff",
    accentBorder:      "#bfdbfe",
    inputBg:           "#f8fafc",
    inputBorder:       "#e2e8f0",
    inputFocusBorder:  "#3b82f6",
    inputText:         "#1e293b",
    inputPlaceholder:  "#94a3b8",
    divider:           "#e2e8f0",
    pillBg:            "#f1f5f9",
    pillBorder:        "#e2e8f0",
    pillText:          "#64748b",
    pillActiveBg:      "#dbeafe",
    pillActiveBorder:  "#93c5fd",
    pillActiveText:    "#1d4ed8",
    btnPrimary:        "linear-gradient(135deg,#2563eb,#1d4ed8)",
    btnPrimaryText:    "#ffffff",
    btnPrimaryGlow:    "rgba(37,99,235,0.35)",
    btnGhostBg:        "#f1f5f9",
    btnGhostBorder:    "#e2e8f0",
    btnGhostText:      "#475569",
    btnGhostHoverBg:   "#eff6ff",
    btnGhostHoverText: "#2563eb",
    btnDangerBg:       "#fef2f2",
    btnDangerBorder:   "#fecaca",
    btnDangerText:     "#dc2626",
    btnSuccessBg:      "linear-gradient(135deg,#15803d,#16a34a)",
    btnSuccessText:    "#ffffff",
    modalOverlay:      "rgba(15,23,42,0.55)",
    modalBg:           "#ffffff",
    modalBorder:       "#e2e8f0",
    scrollThumb:       "#bfdbfe",
    toggleIcon:        "🌙",
    toggleLabel:       "Dark",
  },
  dark: {
    pageBg:            "#060b14",
    navBg:             "rgba(6,11,20,0.98)",
    navBottomBorder:   "#f59e0b",
    navText:           "rgba(255,255,255,0.45)",
    navTextHover:      "#ffffff",
    navBrand:          "#ffffff",
    navBrandAccent:    "#f59e0b",
    cardBg:            "rgba(255,255,255,0.03)",
    cardBorder:        "rgba(255,255,255,0.08)",
    cardShadow:        "0 1px 4px rgba(0,0,0,0.3)",
    sectionGrad:       "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
    sectionGradText:   "#000000",
    textPrimary:       "#f1f5f9",
    textSecondary:     "rgba(255,255,255,0.55)",
    textMuted:         "rgba(255,255,255,0.28)",
    accent:            "#f59e0b",
    accentHover:       "#d97706",
    accentLight:       "rgba(245,158,11,0.08)",
    accentBorder:      "rgba(245,158,11,0.25)",
    inputBg:           "rgba(255,255,255,0.05)",
    inputBorder:       "rgba(255,255,255,0.08)",
    inputFocusBorder:  "rgba(245,158,11,0.5)",
    inputText:         "#f1f5f9",
    inputPlaceholder:  "rgba(255,255,255,0.25)",
    divider:           "rgba(255,255,255,0.06)",
    pillBg:            "rgba(255,255,255,0.03)",
    pillBorder:        "rgba(255,255,255,0.08)",
    pillText:          "rgba(255,255,255,0.4)",
    pillActiveBg:      "rgba(245,158,11,0.15)",
    pillActiveBorder:  "rgba(245,158,11,0.4)",
    pillActiveText:    "#f59e0b",
    btnPrimary:        "linear-gradient(135deg,#f59e0b,#d97706)",
    btnPrimaryText:    "#000000",
    btnPrimaryGlow:    "rgba(245,158,11,0.35)",
    btnGhostBg:        "rgba(255,255,255,0.05)",
    btnGhostBorder:    "rgba(255,255,255,0.1)",
    btnGhostText:      "rgba(255,255,255,0.7)",
    btnGhostHoverBg:   "rgba(245,158,11,0.1)",
    btnGhostHoverText: "#f59e0b",
    btnDangerBg:       "rgba(239,68,68,0.1)",
    btnDangerBorder:   "rgba(239,68,68,0.25)",
    btnDangerText:     "#f87171",
    btnSuccessBg:      "linear-gradient(135deg,#10b981,#059669)",
    btnSuccessText:    "#ffffff",
    modalOverlay:      "rgba(0,0,0,0.85)",
    modalBg:           "#0f172a",
    modalBorder:       "rgba(255,255,255,0.1)",
    scrollThumb:       "rgba(245,158,11,0.3)",
    toggleIcon:        "☀️",
    toggleLabel:       "Light",
  },
};

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<AuthUser | null>(null);
  const [loading, setLoading]     = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [lang, setLangState]      = useState<Lang>("en");
  const [dark, setDarkState]      = useState(false);
  const router = useRouter();

  // ── Read theme + lang from cookies / system on mount ──────────────────
  useEffect(() => {
    // Dark mode — system preference first, then cookie override
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const cookieTheme = document.cookie.match(/csc_theme=([^;]+)/)?.[1];
    const isDark = cookieTheme ? cookieTheme === "dark" : sysDark;
    setDarkState(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

    // Lang — cookie first, then "en" default
    const cookieLang = document.cookie.match(/csc_lang=([^;]+)/)?.[1] as Lang | undefined;
    if (cookieLang === "hi" || cookieLang === "en") setLangState(cookieLang);

    // Listen for system dark mode changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      // Only follow system if user hasn't set a manual preference
      if (!document.cookie.match(/csc_theme=/)) {
        setDarkState(e.matches);
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Check URL for login trigger (e.g. /?login=1 from redirects) ───────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") {
      setLoginOpen(true);
      // Remove the param from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState({}, "", url.toString());
    }
    // Show error from Google OAuth failure
    const error = params.get("error");
    if (error) {
      console.warn("[Auth] OAuth error:", error);
      setLoginOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // ── Fetch current user from JWT cookie ────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const u = data.user ?? null;
        setUser(u);
        if (u?.preferred_lang) setLangState(u.preferred_lang as Lang);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ── Setters ───────────────────────────────────────────────────────────
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    // Persist in cookie (365 days)
    document.cookie = `csc_lang=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    // Persist in DB for logged-in users
    fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferred_lang: l }),
      credentials: "include",
    }).catch(() => {});
  }, []);

  const setDark = useCallback((d: boolean) => {
    setDarkState(d);
    document.documentElement.setAttribute("data-theme", d ? "dark" : "light");
    document.cookie = `csc_theme=${d ? "dark" : "light"};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/");
  }, [router]);

  const openLogin  = useCallback(() => setLoginOpen(true),  []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const value: AuthContextType = {
    user,
    loading,
    isLoggedIn:   !!user,
    isAdmin:      user?.role === "co_admin" || user?.role === "main_admin",
    isMainAdmin:  user?.role === "main_admin",
    lang,
    dark,
    setLang,
    setDark,
    openLogin,
    closeLogin,
    logout,
    refreshUser,
    loginOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {loginOpen && (
        <LoginModal
          lang={lang}
          dark={dark}
          onClose={closeLogin}
          onSuccess={refreshUser}
        />
      )}
    </AuthContext.Provider>
  );
}