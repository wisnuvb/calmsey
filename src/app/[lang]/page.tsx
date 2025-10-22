import React from "react";
import {
  HeroSection,
  OngoingProjectsSection,
  WhereWeWorkSection,
  WhyTurningTidesSection,
  PartnerStoriesSection,
  LatestArticlesSection,
  StrategyDownloadSection,
} from "@/components/main";

const HomePage = () => {
  return (
    <>
      <HeroSection
        variant="video"
        posterImage="/assets/demo/bg-video.png"
        videoUrl="/assets/video/8248432-hd_1280_720_30fps.mp4"
        dataSection="hero"
      />
      <WhyTurningTidesSection />
      <PartnerStoriesSection />
      <WhereWeWorkSection />
      <OngoingProjectsSection />
      <LatestArticlesSection />
      <StrategyDownloadSection />
    </>
  );
};

export default HomePage;
