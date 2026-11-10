// import { notFound } from "next/navigation";
// import { supabaseAdmin } from "@/lib/supabase";
// import CourseDetailClient, { DbCourse } from "./CourseDetailClient";

// export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }) {
//   const resolvedParams = await params;
//   const courseId = resolvedParams.id;

//   const { data: course, error } = await supabaseAdmin
//     .from("courses")
//     .select("title, short_desc, banner_url")
//     .eq("id", courseId)
//     .single();

//   if (error || !course) {
//     return { title: "Course Not Found | CSC Shambhuganj" };
//   }

//   return {
//     title: `${course.title} | CSC Shambhuganj`,
//     description: course.short_desc,
//     openGraph: {
//       title: course.title,
//       description: course.short_desc,
//       images: course.banner_url ? [course.banner_url] : [],
//     }
//   };
// }

// export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
//   const resolvedParams = await params;
//   const courseId = resolvedParams.id;

//   const { data: course, error } = await supabaseAdmin
//     .from("courses")
//     .select("*")
//     .eq("id", courseId)
//     .eq("is_published", true)
//     .single();

//   if (error || !course) {
//     console.error("🚨 COURSE FETCH FAILED:", courseId, error?.message);
//     notFound();
//   }

//   return <CourseDetailClient course={course as DbCourse} />;
// }











/**
 * courses/[id]/page.tsx — REDESIGNED for
 * D:\csc-platform\src\app\courses\[id]\page.tsx
 *
 * This is a server component (no "use client"). Same fetch, same
 * metadata, same behaviour — the only change is the error log line,
 * which had a 🚨 emoji in it. There is no visible UI in this file
 * (it hands off to CourseDetailClient), so there was nothing else
 * to restyle.
 *
 * KEPT, exactly as supplied:
 * - generateMetadata: resolves params (works whether params is a
 *   promise or a plain object), fetches title / short_desc /
 *   banner_url for the course, returns "Course Not Found | CSC
 *   Shambhuganj" when missing, otherwise the course title, the
 *   description, and the openGraph block (title, description, banner
 *   image when there is one).
 * - CourseDetailPage: same params handling, fetches the full course
 *   row where id matches and is_published is true, calls notFound()
 *   when the fetch fails or there is no course, and hands the course
 *   to CourseDetailClient cast to DbCourse.
 *
 * No new file is needed.
 */

import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import CourseDetailClient, { DbCourse } from "./CourseDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  const { data: course, error } = await supabaseAdmin
    .from("courses")
    .select("title, short_desc, banner_url")
    .eq("id", courseId)
    .single();

  if (error || !course) {
    return { title: "Course Not Found | CSC Shambhuganj" };
  }

  return {
    title: `${course.title} | CSC Shambhuganj`,
    description: course.short_desc,
    openGraph: {
      title: course.title,
      description: course.short_desc,
      images: course.banner_url ? [course.banner_url] : [],
    }
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  const { data: course, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("is_published", true)
    .single();

  if (error || !course) {
    console.error("COURSE FETCH FAILED:", courseId, error?.message);
    notFound();
  }

  return <CourseDetailClient course={course as DbCourse} />;
}
