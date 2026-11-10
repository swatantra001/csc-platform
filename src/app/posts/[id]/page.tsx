
// import { notFound } from "next/navigation";
// import { supabaseAdmin } from "@/lib/supabase"; 
// import PostClient from "./PostClient";
// import type { DbPost } from "./PostClient";

// // ─── DYNAMIC SEO METADATA ───
// export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }) {
//   // Await params to support Next.js 15+ perfectly
//   const resolvedParams = await params;
//   const postId = resolvedParams.id;

//   const { data: post, error } = await supabaseAdmin
//     .from("posts")
//     .select("title, short_desc, banner_url")
//     .eq("id", postId)
//     .single();

//   if (error || !post) {
//     return { title: "Post Not Found | CSC Shambhuganj" };
//   }

//   return {
//     title: `${post.title} | CSC Shambhuganj`,
//     description: post.short_desc,
//     openGraph: {
//       title: post.title,
//       description: post.short_desc,
//       images: post.banner_url ? [post.banner_url] : [],
//     }
//   };
// }

// // ─── SERVER COMPONENT DATA FETCH ───
// export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  
//   const resolvedParams = await params;
//   const postId = resolvedParams.id;

//   // 1. Fetch the data directly from the Supabase database
//   const { data: post, error } = await supabaseAdmin
//     .from("posts")
//     .select("*")
//     .eq("id", postId) 
//     .single();

//   // 2. If the ID is wrong or blocked, log the exact error to your terminal
//   if (error || !post) {
//     console.error("🚨 POST FETCH FAILED FOR ID:", postId);
//     console.error("🚨 SUPABASE ERROR:", error?.message || "No data returned");
//     notFound(); 
//   }

//   // 3. Pass the fetched database row into your beautiful Client Component
//   return <PostClient post={post as DbPost} />;
// }











// src/app/posts/[id]/page.tsx
//
// REDESIGNED (2026-11-09) under the standing Jan Seva Kendra brief in
// ~/workspace/jan-seva-kendra/CONTEXT.md — same file, same behaviour.
// Server component: fetches the post row from Supabase and hands it to
// PostClient. No UI lives in this file.
//
// KEPT, exactly as supplied:
// - generateMetadata: title/short_desc/banner_url for metadata + openGraph;
//   "Post Not Found | CSC Shambhuganj" when the row is missing.
// - PostDetailPage: full row select by id, notFound() when error || !post.
// - The Next.js 15+ params handling (await params, works with a plain
//   object too).
//
// CHANGED, one small thing:
// - The two console.error log lines no longer start with a 🚨 emoji.
//
// No new file needed. PostClient.tsx is the companion client file.

import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import PostClient from "./PostClient";
import type { DbPost } from "./PostClient";

// ─── DYNAMIC SEO METADATA ───
export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Await params to support Next.js 15+ perfectly
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  const { data: post, error } = await supabaseAdmin
    .from("posts")
    .select("title, short_desc, banner_url")
    .eq("id", postId)
    .single();

  if (error || !post) {
    return { title: "Post Not Found | CSC Shambhuganj" };
  }

  return {
    title: `${post.title} | CSC Shambhuganj`,
    description: post.short_desc,
    openGraph: {
      title: post.title,
      description: post.short_desc,
      images: post.banner_url ? [post.banner_url] : [],
    },
  };
}

// ─── SERVER COMPONENT DATA FETCH ───
export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  // 1. Fetch the data directly from the Supabase database
  const { data: post, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  // 2. If the ID is wrong or blocked, log the exact error to your terminal
  if (error || !post) {
    console.error("POST FETCH FAILED FOR ID:", postId);
    console.error("SUPABASE ERROR:", error?.message || "No data returned");
    notFound();
  }

  // 3. Pass the fetched database row into the Client Component
  return <PostClient post={post as DbPost} />;
}
