import { unstable_noStore as noStore } from "next/cache";
import VerifyClient from "./VerifyClient";

export const metadata = { title: "Verify Admission | Admin" };

export default function VerifyPage() {
  noStore();
  return <VerifyClient />;
}