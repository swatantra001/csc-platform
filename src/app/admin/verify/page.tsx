// import { unstable_noStore as noStore } from "next/cache";
// import VerifyClient from "./VerifyClient";

// export const metadata = { title: "Verify Admission | Admin" };

// export default function VerifyPage() {
//   noStore();
//   return <VerifyClient />;
// }









// src/app/admin/verify/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\admin\verify\page.tsx. No new file needed.
//
// KEPT (all logic exactly as supplied):
// - noStore(), metadata title "Verify Admission | Admin".
// - Renders <VerifyClient /> and nothing else.
//
// REMOVED:
// - Nothing: this server wrapper has no THEMES object, no buildCss, no emoji
//   and no markup of its own, so there was nothing to restyle. The file is
//   unchanged apart from this header comment.
//
// FLAGS: none.
import { unstable_noStore as noStore } from "next/cache";
import VerifyClient from "./VerifyClient";

export const metadata = { title: "Verify Admission | Admin" };

export default function VerifyPage() {
  noStore();
  return <VerifyClient />;
}
