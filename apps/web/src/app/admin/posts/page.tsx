import { supabaseAdmin } from "@/lib/supabase"; 
import { unstable_noStore as noStore } from "next/cache";
import AdminPostsClient from "./AdminPostsClient";

export const metadata = { title: "Manage Posts | Admin" };

export default async function AdminPostsPage() {
  noStore(); // Always fetch fresh data for admins

  const { data: posts, error } = await supabaseAdmin
    .from("posts")
    .select("id, title, category, theme, total_posts, post_date, is_published, banner_url")
    .order("post_date", { ascending: false });

  if (error) {
    console.error("Admin Posts Fetch Error:", error);
    return <div>Error loading posts.</div>;
  }

  return <AdminPostsClient initialPosts={posts || []} />;
}