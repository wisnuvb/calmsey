import {
  HeroSection,
  OurVisionSection,
  WhatWeWannaAchieveSection,
  OurGoalSection,
  TeamSection,
  QuoteSection,
  TheoryOfChangeSection,
  GenesisSection,
  FundersSection,
  TriptychGallerySection,
  OurWorkSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";

interface AboutUsPageProps {
  params: Promise<{ lang: string }>;
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
        variant="overlay-bottom"
        title="Securing tenure and recognizing rights"
        subtitle="We are a young organization built through wide-ranging consultation and by listening to the demands and priorities that Indigenous Peoples, small-scale fishers, and coastal communities have been articulating for years. We exist to support rights holders working to secure tenure over their territories—because territorial control is foundational to community agency and self-determination"
        backgroundImage="/assets/hero-about-us.webp"
        dataSection="about-us"
      />
      <QuoteSection />
      <OurVisionSection />
      <WhatWeWannaAchieveSection />
      <OurGoalSection />
      <TheoryOfChangeSection />
      <TeamSection />
      <GenesisSection />
      <FundersSection />
      <TriptychGallerySection />
      <OurWorkSection title="Discover Our Latest Activites and Publications" />
      {/* <AboutUsHeroSection /> */}
      {/* <SupportSection /> */}
      {/* <DownloadFramework /> */}
      {/* <ImageCarousel /> */}
      {/* <TenureFacilitySection /> */}
    </PageContentProvider>
  );
};

export default AboutUsPage;
