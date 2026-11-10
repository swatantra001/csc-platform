// import { supabaseAdmin } from "@/lib/supabase";
// import { unstable_noStore as noStore } from "next/cache";
// import AdminCoursesClient from "./AdminCoursesClient";

// export const metadata = { title: "Manage Courses | Admin" };

// export default async function AdminCoursesPage() {
//   noStore();
//   const { data: courses, error } = await supabaseAdmin
//     .from("courses")
//     .select("id, title, category, theme, duration, fee, prebook_amount, max_seats, filled_seats, start_date, is_published, banner_url")
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error("Admin Courses Fetch Error:", error);
//     return <div>Error loading courses.</div>;
//   }

//   return <AdminCoursesClient initialCourses={courses || []} />;
// }











// src/app/admin/courses/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\admin\courses\page.tsx.
// No new file needed.
//
// KEPT (all logic exactly as supplied):
// - noStore(); supabaseAdmin courses query (12 columns, created_at desc).
// - metadata = { title: "Manage Courses | Admin" }.
// - Error branch: console.error("Admin Courses Fetch Error:", error) and
//   returns <div>Error loading courses.</div>.
// - Otherwise renders <AdminCoursesClient initialCourses={courses || []} />.
//
// CHANGED:
// - Only the error fallback: the bare <div> is now a plain Tailwind error
//   note (red text on the page background, both themes). No logic changed.
// ─────────────────────────────────────────────────────────────────────────────
import { supabaseAdmin } from "@/lib/supabase";
import { unstable_noStore as noStore } from "next/cache";
import AdminCoursesClient from "./AdminCoursesClient";

export const metadata = { title: "Manage Courses | Admin" };

export default async function AdminCoursesPage() {
  noStore();
  const { data: courses, error } = await supabaseAdmin
    .from("courses")
    .select("id, title, category, theme, duration, fee, prebook_amount, max_seats, filled_seats, start_date, is_published, banner_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin Courses Fetch Error:", error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center text-sm font-semibold text-red-700 dark:bg-slate-950 dark:text-red-400">
        Error loading courses.
      </div>
    );
  }

  return <AdminCoursesClient initialCourses={courses || []} />;
}
