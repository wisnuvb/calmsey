import { PublicAPI, SupportedLanguage } from "@/lib/public-api";
import { HomePage } from "@/components/public/HomePage";
import { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ lang: SupportedLanguage }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const siteSettings = await PublicAPI.getSiteSettings();

  return {
    title: siteSettings?.siteName || "Turning Tides Facility",
    description:
      siteSettings?.siteDescription ||
      "Premier rehabilitation and treatment facility",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        id: "/id",
      },
    },
  };
}

export default async function LanguageHomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const homepageData = await PublicAPI.getHomepageData(lang);

  return <HomePage data={homepageData} language={lang} />;
}
