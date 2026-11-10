// import { supabaseAdmin } from "@/lib/supabase"; 
// import { unstable_noStore as noStore } from "next/cache";
// import AdminPostsClient from "./AdminPostsClient";

// export const metadata = { title: "Manage Posts | Admin" };

// export default async function AdminPostsPage() {
//   noStore(); // Always fetch fresh data for admins

//   const { data: posts, error } = await supabaseAdmin
//     .from("posts")
//     .select("id, title, category, theme, total_posts, post_date, is_published, banner_url")
//     .order("post_date", { ascending: false });

//   if (error) {
//     console.error("Admin Posts Fetch Error:", error);
//     return <div>Error loading posts.</div>;
//   }

//   return <AdminPostsClient initialPosts={posts || []} />;
// }








// src/app/admin/posts/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN per the Jan Seva Kendra standing brief (~/workspace/jan-seva-kendra/CONTEXT.md).
// Drop-in replacement for D:\csc-platform\src\app\admin\posts\page.tsx. No new file needed.
//
// KEPT (all logic exactly as supplied):
// - noStore() so admins always see fresh data.
// - Supabase query: posts, columns id, title, category, theme, total_posts,
//   post_date, is_published, banner_url, ordered post_date descending.
// - metadata title "Manage Posts | Admin".
// - Error branch: console.error("Admin Posts Fetch Error:", error).
// - <AdminPostsClient initialPosts={posts || []} />.
//
// REMOVED:
// - Nothing of substance: this is a server component with no THEMES object,
//   no buildCss, no emoji and no styling of its own. Only the error fallback
//   changed, from a bare <div> to a plain Tailwind note.
//
// FLAGS: none.
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
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-slate-500">
        Error loading posts.
      </div>
    );
  }

  return <AdminPostsClient initialPosts={posts || []} />;
}
