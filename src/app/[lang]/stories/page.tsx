import React from "react";
import {
  AllStoriesSection,
  CommunityStoriesSection,
  HeroSection,
} from "@/components/main";

const StoriesPage = () => {
  return (
    <>
      <HeroSection
        variant="simple"
        title="Stories From Our Partners"
        subtitle="These stories showcase the experiences, leadership, and voices of communities, fisher peoples, and Indigenous Peoples as they work to secure and strengthen their rights to land, water, and resources. We invite our partners to share glimpses into their journeys: experiences of struggle and tenure insecurity, and also the courage, knowledge, and actions it takes to achieve tenure security and rights recognition."
        backgroundImage="/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
        dataSection="about-us"
      />
      <CommunityStoriesSection />
      <AllStoriesSection />
    </>
  );
};

export default StoriesPage;
