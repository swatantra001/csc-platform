import { Suspense } from "react";
import CreateCourseContent from "./CreateCourseContent";

export const metadata = { title: "Create Course | Admin" };

export default function CreateCoursePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>}>
      <CreateCourseContent />
    </Suspense>
  );
}