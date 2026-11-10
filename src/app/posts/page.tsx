// import { supabaseAdmin } from "@/lib/supabase"; // Use your standard supabase client export
// import PostsListClient from "./PostsListClient";
// import type { PostSummary } from "./PostsListClient";
// import { unstable_noStore as noStore } from "next/cache";

// // ─── DYNAMIC SEO METADATA ───
// export const metadata = {
//   title: "Latest Jobs & Admissions | CSC Shambhuganj",
//   description: "Browse all the latest government jobs, scholarship forms, and admission updates verified by Srilal Jan Seva Kendra.",
// };

// export default async function PostsListPage() {
//   // Prevent Next.js from aggressively caching the listing page so new jobs appear instantly
//   noStore();

//   // Fetch all published posts. We only select the specific columns needed for the cards to save bandwidth.
//   const { data: posts, error } = await supabaseAdmin
//     .from("posts")
//     .select("id, title, title_hi, short_desc, category, theme, total_posts, post_date, banner_url, slug")
//     .eq("is_published", true)
//     .order("post_date", { ascending: false });

//   if (error) {
//     console.error("Failed to fetch posts for listing:", error);
//     // You can return a fallback UI here if the database goes down
//     return <div style={{ padding: 40, textAlign: "center" }}>Error loading posts. Please try again later.</div>;
//   }

//   // Pass the data to our beautiful client component
//   return <PostsListClient posts={(posts || []) as PostSummary[]} />;
// }










/**
 * posts/page.tsx — REDESIGNED for
 * D:\csc-platform\src\app\posts\page.tsx
 *
 * This is a server component (no "use client"). Same query, same
 * metadata, same behaviour — the only change is the error state,
 * which was an inline-styled div and is now Tailwind classes.
 *
 * KEPT, exactly as supplied: the metadata (title and description),
 * noStore(), the Supabase query on the "posts" table (published
 * only, newest post_date first, the same 10 columns), the error
 * log + error message, and the handoff to PostsListClient with
 * the posts cast to PostSummary[].
 *
 * No new file is needed.
 */

import { supabaseAdmin } from "@/lib/supabase"; // Use your standard supabase client export
import { unstable_noStore as noStore } from "next/cache";
import PostsListClient, { PostSummary } from "./PostsListClient";

// ─── DYNAMIC SEO METADATA ───
export const metadata = {
  title: "Latest Jobs & Admissions | CSC Shambhuganj",
  description: "Browse all the latest government jobs, scholarship forms, and admission updates verified by Srilal Jan Seva Kendra.",
};

export default async function PostsListPage() {
  // Prevent Next.js from aggressively caching the listing page so new jobs appear instantly
  noStore();

  // Fetch all published posts. We only select the specific columns needed for the cards to save bandwidth.
  const { data: posts, error } = await supabaseAdmin
    .from("posts")
    .select("id, title, title_hi, short_desc, category, theme, total_posts, post_date, banner_url, slug")
    .eq("is_published", true)
    .order("post_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch posts for listing:", error);
    // You can return a fallback UI here if the database goes down
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 font-sans dark:bg-[#0b1220]">
        <p className="text-center text-slate-600 dark:text-slate-400">
          Error loading posts. Please try again later.
        </p>
      </div>
    );
  }

  // Pass the data to our beautiful client component
  return <PostsListClient posts={(posts || []) as PostSummary[]} />;
}
