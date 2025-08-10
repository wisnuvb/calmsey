import SharedAdminLogin from "@/components/admin/SharedAdminLogin";

export default async function LangLogin({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SharedAdminLogin language={lang} />;
}
