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
    return <div style={{ padding: 40, textAlign: "center" }}>Error loading courses. Please try again later.</div>;
  }

  return <CoursesListClient courses={(courses || []) as CourseSummary[]} />;
}