/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicAPI, SupportedLanguage } from "@/lib/public-api";
import { Metadata } from "next";
import { getPageByTemplate, getSiteSetupStatus } from "@/lib/site-setup";
import SiteSetupHandler from "@/components/setup/SiteSetupHandler";
import { DynamicPageRenderer } from "@/components/public/DynamicPageRenderer";
import LandingPageMissing from "@/components/setup/LandingPageMissing";
import { HomePage } from "@/components/public/HomePage";

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
  const setupStatus = await getSiteSetupStatus();

  // 1. Check if site setup is complete
  if (!setupStatus.isSetupComplete) {
    return <SiteSetupHandler setupStatus={setupStatus} language={lang} />;
  }

  // 2. Check if landing page exists
  if (!setupStatus.landingPageExists) {
    return <LandingPageMissing language={lang} />;
  }

  // 3. Get dynamic page from page builder
  const landingPage = await getPageByTemplate("LANDING", lang);
  if (landingPage) {
    // Transform the data to match expected type
    const transformedPage = {
      ...landingPage,
      translations: landingPage.translations.map((trans) => ({
        title: trans.title,
        content: trans.content,
        excerpt: trans.excerpt || undefined,
        seoTitle: trans.seoTitle || undefined,
        seoDescription: trans.seoDescription || undefined,
      })),
    };
    return (
      <DynamicPageRenderer page={transformedPage as any} language={lang} />
    );
  }

  const homepageData = await PublicAPI.getHomepageData(lang);
  return <HomePage data={homepageData} language={lang} />;
}
