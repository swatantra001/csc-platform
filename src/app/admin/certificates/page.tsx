// src/app/admin/certificates/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// NEW PAGE per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Create at D:\csc-platform\src\app\admin\certificates\page.tsx, alongside
// CertificatesClient.tsx in the same folder. No other file is changed by this page.
//
// WHAT IT IS:
// - Server wrapper only (same pattern as admin/verify/page.tsx): metadata and
//   <CertificatesClient />. The list itself is loaded on the client by
//   getAllCertificatesAction (see admin-certificates-action-snippet.ts — that
//   function must be added to src/app/actions/certificates.ts first, or the
//   page will fail to build: the import would not resolve).
// - Admin-only access is enforced by <AuthGuard allowedRoles={["co_admin",
//   "main_admin"]}> inside CertificatesClient (same guard as the main admin
//   panel), and again server-side by getAllCertificatesAction, which throws
//   "Unauthorized" for role "user" or no login.
//
// FLAGS / NOTES (need Swatantra's word):
// 1. The page is view-only: there is no delete-certificate action in the
//    supplied certificates.ts, so the cards have no Delete button. Issuing
//    stays where it already lives — the admin panel's CertificateGenerator
//    (single PDF) and BulkCertificateGenerator (Excel upload).
// 2. Excel-backed certificates have no PDF file anywhere in the supplied
//    code (verifyCertificateAction maps them to file_url: null), so their
//    title links to /verify/<roll_no> in a new tab instead of a PDF. See
//    CertificatesClient.tsx for the full note.
import { unstable_noStore as noStore } from "next/cache";
import CertificatesClient from "./CertificatesClient";

export const metadata = { title: "Certificates | Admin" };

export default function AdminCertificatesPage() {
  noStore();
  return <CertificatesClient />;
}
