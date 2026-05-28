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
    return <div>Error loading courses.</div>;
  }

  return <AdminCoursesClient initialCourses={courses || []} />;
}