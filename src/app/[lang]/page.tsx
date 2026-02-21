import React from "react";
import {
  VideoHeroSection,
  WhyTurningTidesSection,
  PartnerStoriesSection,
  StrategyDownloadSection,
  GrantmakingSection,
} from "@/components/main";
import { getPageContentServer } from "@/lib/page-content-server";
import { PageContentProviderWrapper } from "@/components/providers/PageContentProviderWrapper";
import { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Turning Tides Facility",
    description:
      "Turning Tides Facility - Supporting rights holders working to secure tenure over their territories.",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        id: "/id",
      },
    },
  };
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
      {/* Note: gambar disini */}
      <VideoHeroSection />
      {/* <HeroSection
        variant="video"
        posterImage="/assets/demo/bg-video.png"
        videoUrl="/assets/video/8248432-hd_1280_720_30fps.mp4"
      /> */}
      <WhyTurningTidesSection />
      {/* <WhereWeWorkSection /> */}
      {/* <OngoingProjectsSection /> */}
      {/* <LatestArticlesSection /> */}
      {/* <OurWorkSection /> */}
      <GrantmakingSection />
      <PartnerStoriesSection
        tag="COMMUNITY ECHOES"
        title="Stories From Our Partners"
        description="Turning Tides engages with a diversity of partners"
        buttonText="Partner Stories"
        buttonUrl="/stories"
        backgroundColor="blue"
      />
      <StrategyDownloadSection withBorderTop />
    </PageContentProviderWrapper>
  );
};

export default HomePage;
