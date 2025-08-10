import { redirect } from "next/navigation";
import { DEFAULT_LANGUAGE } from "@/lib/public-api";

export default function HomePage() {
  // Redirect to default language homepage
  redirect(`/${DEFAULT_LANGUAGE}`);
}
