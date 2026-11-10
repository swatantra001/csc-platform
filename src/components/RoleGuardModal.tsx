// "use client";

// import { useAuth } from "./AuthProvider";

// export default function RoleGuardModal({
//   open,
//   onClose,
// }: {
//   open: boolean;
//   onClose: () => void;
// }) {
//   const { theme, dark } = useAuth();
//   if (!open) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 2000,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: theme?.modalOverlay || "rgba(0,0,0,0.5)",
//         backdropFilter: "blur(10px)",
//         padding: 16,
//       }}
//     >
//       <div
//         style={{
//           background: theme?.modalBg || "#ffffff",
//           border: `1px solid ${theme?.modalBorder || "#e2e8f0"}`,
//           borderRadius: 24,
//           padding: "40px 32px",
//           maxWidth: 400,
//           width: "100%",
//           textAlign: "center",
//           boxShadow: dark
//             ? "0 25px 50px -12px rgba(0,0,0,0.5)"
//             : "0 25px 50px -12px rgba(0,0,0,0.15)",
//         }}
//       >
//         <div
//           style={{
//             width: 72,
//             height: 72,
//             borderRadius: "50%",
//             background: dark
//               ? "rgba(239,68,68,0.15)"
//               : "rgba(239,68,68,0.08)",
//             border: `1.5px solid ${dark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.15)"}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             margin: "0 auto 20px",
//           }}
//         >
//           <span style={{ fontSize: 32 }}>🚫</span>
//         </div>

//         <h2
//           style={{
//             color: theme?.textPrimary || "#111",
//             margin: "0 0 12px",
//             fontFamily: "var(--font-serif)",
//             fontSize: "1.5rem",
//             fontWeight: 800,
//           }}
//         >
//           Access Restricted
//         </h2>

//         <p
//           style={{
//             color: theme?.textSecondary || "#475569",
//             margin: "0 0 28px",
//             lineHeight: 1.6,
//             fontSize: "0.95rem",
//           }}
//         >
//           This area is reserved for administrators. You don't have permission to
//           access this page.
//         </p>

//         <button
//           onClick={onClose}
//           style={{
//             background: theme?.accent || "#2563eb",
//             color: dark ? "#000" : "#fff",
//             border: "none",
//             width: "100%",
//             padding: "14px",
//             borderRadius: 12,
//             fontWeight: 700,
//             fontSize: "1rem",
//             cursor: "pointer",
//             transition: "transform 0.2s, box-shadow 0.2s",
//           }}
//           onMouseEnter={(e) => {
//             (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
//             (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 20px ${theme?.btnPrimaryGlow || "rgba(37,99,235,0.35)"}`;
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//             (e.currentTarget as HTMLElement).style.boxShadow = "none";
//           }}
//         >
//           Go to Home
//         </button>
//       </div>
//     </div>
//   );
// }














"use client";

/**
 * RoleGuardModal.tsx — REDESIGNED for
 * D:\csc-platform\src\components\RoleGuardModal.tsx
 *
 * Extension is .tsx, so this file is TSX (types kept). Same props as
 * before: RoleGuardModal({ open, onClose }: { open: boolean; onClose: () => void }).
 *
 * DESIGN: a plain alert dialog — a red icon, a title, one sentence,
 * one button. The original was the same shape; only the styling
 * changed (Tailwind classes instead of inline styles, no theme
 * object, no emoji, no serif font variable).
 *
 * KEPT, exactly as supplied: renders nothing when open is false;
 * the copy — "Access Restricted", "This area is reserved for
 * administrators. You don't have permission to access this page.",
 * "Go to Home" — and the button calls onClose (the parent routes
 * home, as before).
 *
 * BUG FIXED: the original read `const { theme, dark } = useAuth()`,
 * but AuthProvider never put `theme` in the context — it was always
 * undefined, so every `theme?.x || fallback` silently used the
 * fallback. The context no longer has a theme field at all, and this
 * file no longer needs the context — it uses Tailwind `dark:` classes
 * for the theme, like every other component.
 *
 * REMOVED: the inline styles, the 🚫 emoji (lucide ShieldAlert now),
 * the fontFamily "var(--font-serif)" (no such variable exists in the
 * project), and the onMouseEnter/onMouseLeave style mutations.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import { ShieldAlert } from "lucide-react";

export default function RoleGuardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Access Restricted"
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-[400px] rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center font-sans shadow-2xl dark:border-slate-700 dark:bg-[#111a2e]">
        <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[1.5px] border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          <ShieldAlert className="h-8 w-8" aria-hidden />
        </div>

        <h2 className="mb-3 text-2xl font-extrabold text-slate-900 dark:text-white">
          Access Restricted
        </h2>

        <p className="mb-7 text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-400">
          This area is reserved for administrators. You don&apos;t have permission to
          access this page.
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-blue-700 px-3.5 py-3.5 text-base font-bold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
