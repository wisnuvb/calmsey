import {
  CaseStudyCarousel,
  CollectiveActionSection,
  CommunityEmpowermentSection,
  DownloadFramework,
  GrantmakingApproachSection,
  HeroSection,
  StoriesSection,
  TenureUnderstandingSection,
} from "@/components/main";
import React from "react";

const OurWorkPage = () => {
  return (
    <>
      <HeroSection
        variant="simple"
        title="Discover Our Work & Efforts"
        subtitle="Turning Tides’s conservation efforts – from protecting oceans and endangered species to supporting small-scale fishers, biodiversity conservation, and sustainable communities."
        backgroundImage="/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
        className="h-[100vh-250px]"
      />
      <CaseStudyCarousel />
      <TenureUnderstandingSection />
      <GrantmakingApproachSection />
      <DownloadFramework />
      <StoriesSection />
      <CommunityEmpowermentSection />
      <CollectiveActionSection
        text="Together—values, principles, committees, and funders - ignite meaningful change for people, communities, and the planet."
        backgroundColor="bg-[#ECEFFD]"
      />
    </>
  );
};

export default OurWorkPage;
