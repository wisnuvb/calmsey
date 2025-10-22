import {
  AboutUsHeroSection,
  HeroSection,
  OurVisionSection,
  WhatWeWannaAchieveSection,
  OurGoalSection,
  SupportSection,
  TeamSection,
  TenureFacilitySection,
} from "@/components/main";
import React from "react";

const AboutUsPage = () => {
  return (
    <>
      <HeroSection
        variant="simple"
        title="Ocean Protection & Climate Action with Communities"
        subtitle="We are a young organisation that emerges from deep consultation. We are designed to respond to the growing and urgent need to empower with Indigenous and fisher peoples with funding, agency and rights."
        backgroundImage="/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
        dataSection="about-us"
      />
      <AboutUsHeroSection />
      <OurVisionSection />
      <WhatWeWannaAchieveSection />
      <OurGoalSection />
      <SupportSection />
      {/* <DownloadFramework /> */}
      <TeamSection />
      {/* <ImageCarousel /> */}
      <TenureFacilitySection />
    </>
  );
};

export default AboutUsPage;
