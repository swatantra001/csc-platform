"use client";

import { useAuth } from "./AuthProvider";

export default function RoleGuardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { theme, dark } = useAuth();
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme?.modalOverlay || "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        padding: 16,
      }}
    >
      <div
        style={{
          background: theme?.modalBg || "#ffffff",
          border: `1px solid ${theme?.modalBorder || "#e2e8f0"}`,
          borderRadius: 24,
          padding: "40px 32px",
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          boxShadow: dark
            ? "0 25px 50px -12px rgba(0,0,0,0.5)"
            : "0 25px 50px -12px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: dark
              ? "rgba(239,68,68,0.15)"
              : "rgba(239,68,68,0.08)",
            border: `1.5px solid ${dark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.15)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <span style={{ fontSize: 32 }}>🚫</span>
        </div>

        <h2
          style={{
            color: theme?.textPrimary || "#111",
            margin: "0 0 12px",
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: 800,
          }}
        >
          Access Restricted
        </h2>

        <p
          style={{
            color: theme?.textSecondary || "#475569",
            margin: "0 0 28px",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          This area is reserved for administrators. You don't have permission to
          access this page.
        </p>

        <button
          onClick={onClose}
          style={{
            background: theme?.accent || "#2563eb",
            color: dark ? "#000" : "#fff",
            border: "none",
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 20px ${theme?.btnPrimaryGlow || "rgba(37,99,235,0.35)"}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}