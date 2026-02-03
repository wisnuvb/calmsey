import {
  HeroSection,
  OurVisionSection,
  OurGoalSection,
  TeamSection,
  GenesisSection,
  FundersSection,
  OurValuesSection,
  WhereWeWorkSection,
  FeedbackCalloutSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";
import { Metadata } from "next";

interface AboutUsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: AboutUsPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "id"
        ? "Tentang Kami - Turning Tides Facility"
        : "About Us - Turning Tides Facility",
    description:
      lang === "id"
        ? "Tentang Turning Tides Facility"
        : "About Turning Tides Facility",
    alternates: {
      canonical: `/${lang}/about-us`,
      languages: {
        en: "/en/about-us",
        id: "/id/about-us",
      },
    },
  };
}

const AboutUsPage = async ({ params }: AboutUsPageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("ABOUT_US", language);

  return (
    <PageContentProvider
      content={content}
      pageType="ABOUT_US"
      language={language}
    >
      <HeroSection
        variant="simple"
        title="Securing tenure and recognizing rights"
        subtitle="We are a young organization built through wide-ranging consultation and by listening to the demands and priorities that Indigenous Peoples, small-scale fishers, and coastal communities have been articulating for years. We exist to support rights holders working to secure tenure over their territories—because territorial control is foundational to community agency and self-determination"
        backgroundImage="/assets/hero-about-us.webp"
        dataSection="about-us"
        className="h-[590px] !min-h-[590px]"
      />
      {/* <QuoteSection /> */}

      <OurVisionSection />
      <OurValuesSection />
      {/* <WhatWeWannaAchieveSection /> */}
      <OurGoalSection />
      {/* <TheoryOfChangeSection /> */}
      <WhereWeWorkSection />
      <TeamSection />
      <FundersSection />
      <GenesisSection />
      {/* <TriptychGallerySection /> */}
      {/* <OurWorkSection title="Discover Our Latest Activites and Publications" /> */}
      {/* <AboutUsHeroSection /> */}
      {/* <SupportSection /> */}
      {/* <DownloadFramework /> */}
      {/* <ImageCarousel /> */}
      {/* <TenureFacilitySection /> */}
      {/* <ValueSupportSection /> */}
      <FeedbackCalloutSection
        title="We value your support"
        description="Connect with us to co-create solutions that protect rights, sustain livelihoods, and centre local voices."
        feedbackText="Get Involved"
      />
    </PageContentProvider>
  );
};

export default AboutUsPage;
