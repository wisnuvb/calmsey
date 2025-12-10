import React from "react";
import {
  HeroSection,
  WhereWeWorkSection,
  WhyTurningTidesSection,
  PartnerStoriesSection,
  StrategyDownloadSection,
  OurWorkSection,
} from "@/components/main";
import { getPageContentServer } from "@/lib/page-content-server";
import { PageContentProviderWrapper } from "@/components/providers/PageContentProviderWrapper";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

const HomePage = async ({ params }: HomePageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("HOME", language);

  return (
    <PageContentProviderWrapper
      content={content}
      pageType="HOME"
      language={language}
    >
      <HeroSection
        variant="video"
        posterImage="/assets/demo/bg-video.png"
        videoUrl="/assets/video/8248432-hd_1280_720_30fps.mp4"
      />
      <WhyTurningTidesSection />
      <PartnerStoriesSection
        tag="COMMUNITY ECHOES"
        title="Stories From Our Partners"
        description="Turning Tides engages with a diversity of partners"
        buttonText="All Stories"
        buttonUrl="/stories"
        backgroundColor="blue"
      />
      <WhereWeWorkSection />
      {/* <OngoingProjectsSection /> */}
      {/* <LatestArticlesSection /> */}
      <OurWorkSection />
      <StrategyDownloadSection />
    </PageContentProviderWrapper>
  );
};

export default HomePage;
