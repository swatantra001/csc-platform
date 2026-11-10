// import { supabaseAdmin } from "@/lib/supabase";
// import { unstable_noStore as noStore } from "next/cache";
// import CoursesListClient, { CourseSummary } from "./CoursesListClient";

// export const metadata = {
//   title: "Computer Courses & Training | CSC Shambhuganj",
//   description: "Enroll in professional computer courses, diploma programs, and certification training at Srilal Jan Seva Kendra, Shambhuganj, Jaunpur.",
// };

// export default async function CoursesListPage() {
//   noStore();

//   const { data: courses, error } = await supabaseAdmin
//     .from("courses")
//     .select("id, title, title_hi, short_desc, category, theme, banner_url, duration, duration_hi, fee, prebook_amount, max_seats, filled_seats, start_date, tags, certification")
//     .eq("is_published", true)
//     .eq("is_active", true)
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error("Failed to fetch courses:", error);
//     return <div style={{ padding: 40, textAlign: "center" }}>Error loading courses. Please try again later.</div>;
//   }

//   return <CoursesListClient courses={(courses || []) as CourseSummary[]} />;
// }













/**
 * courses/page.tsx — REDESIGNED for
 * D:\csc-platform\src\app\courses\page.tsx
 *
 * This is a server component (no "use client"). Same query, same
 * metadata, same behaviour — the only change is the error state,
 * which was an inline-styled div and is now Tailwind classes.
 *
 * KEPT, exactly as supplied: the metadata (title and description),
 * noStore(), the Supabase query on the "courses" table (published
 * and active only, newest first, the same 16 columns), the error
 * log + error message, and the handoff to CoursesListClient with
 * the courses cast to CourseSummary[].
 *
 * No new file is needed.
 */

import { supabaseAdmin } from "@/lib/supabase";
import { unstable_noStore as noStore } from "next/cache";
import CoursesListClient, { CourseSummary } from "./CoursesListClient";

export const metadata = {
  title: "Computer Courses & Training | CSC Shambhuganj",
  description: "Enroll in professional computer courses, diploma programs, and certification training at Srilal Jan Seva Kendra, Shambhuganj, Jaunpur.",
};

export default async function CoursesListPage() {
  noStore();

  const { data: courses, error } = await supabaseAdmin
    .from("courses")
    .select("id, title, title_hi, short_desc, category, theme, banner_url, duration, duration_hi, fee, prebook_amount, max_seats, filled_seats, start_date, tags, certification")
    .eq("is_published", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch courses:", error);
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 font-sans dark:bg-[#0b1220]">
        <p className="text-center text-slate-600 dark:text-slate-400">
          Error loading courses. Please try again later.
        </p>
      </div>
    );
  }

  return <CoursesListClient courses={(courses || []) as CourseSummary[]} />;
}
