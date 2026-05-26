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
    console.error("🚨 COURSE FETCH FAILED:", courseId, error?.message);
    notFound();
  }

  return <CourseDetailClient course={course as DbCourse} />;
}