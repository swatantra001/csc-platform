// import { Suspense } from "react";
// import CreateCourseContent from "./CreateCourseContent";

// export const metadata = { title: "Create Course | Admin" };

// export default function CreateCoursePage() {
//   return (
//     <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>}>
//       <CreateCourseContent />
//     </Suspense>
//   );
// }










// src/app/admin/courses/create/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\admin\courses\create\page.tsx.
// No new file needed.
//
// KEPT (all logic exactly as supplied):
// - metadata = { title: "Create Course | Admin" }.
// - <Suspense> around CreateCourseContent (required for useSearchParams).
//
// CHANGED:
// - Only the Suspense fallback: the inline-styled <div> is now a plain
//   Tailwind loading note (slate text on the page background, both themes).
// ─────────────────────────────────────────────────────────────────────────────
import { Suspense } from "react";
import CreateCourseContent from "./CreateCourseContent";

export const metadata = { title: "Create Course | Admin" };

export default function CreateCoursePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          Loading...
        </div>
      }
    >
      <CreateCourseContent />
    </Suspense>
  );
}
