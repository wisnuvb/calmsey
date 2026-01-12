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
      <GrantmakingSection
        navigationItems={[
          {
            id: "approach",
            label: "Our approach to Grantmaking",
            content: {
              id: "approach",
              title: "Our approach to Grantmaking",
              imageSrc:
                "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
              imageAlt: "Floating village",
              paragraphs: [
                "Turning Tides implements and advocates for liberatory approaches...",
                "Our practices include multi-year flexible funding...",
              ],
              practicesTitle: "What we practice",
              practices: [
                { id: "1", text: "Shared decision-making..." },
                { id: "2", text: "Partner-centered grantmaking..." },
                // ... more practices
              ],
            },
          },
          {
            id: "tenure",
            label: "What we understand by tenure",
            content: {
              id: "tenure",
              title: "What we understand by tenure",
              paragraphs: ["Tenure refers to the relationship..."],
            },
          },
          {
            id: "framework",
            label: "Our Grantmaking Framework",
            content: {
              id: "framework",
              title: "Our Grantmaking Framework",
              paragraphs: ["Our grantmaking framework is designed..."],
            },
          },
        ]}
      />
      <PartnerStoriesSection
        tag="COMMUNITY ECHOES"
        title="Stories From Our Partners"
        description="Turning Tides engages with a diversity of partners"
        buttonText="All Stories"
        buttonUrl="/stories"
        backgroundColor="blue"
      />
      <StrategyDownloadSection withBorderTop />
    </PageContentProviderWrapper>
  );
};

export default HomePage;
