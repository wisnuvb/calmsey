import SharedAdminLogin from "@/components/admin/SharedAdminLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Turning Tides Facility",
  robots: "noindex, nofollow",
};

export default async function LangLogin({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SharedAdminLogin language={lang} />;
}
