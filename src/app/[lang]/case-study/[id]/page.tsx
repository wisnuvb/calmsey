import {
  ArticleMetadataSection,
  HeroSection,
  OtherCaseStudiesSection,
} from "@/components/main";
import React from "react";

const CaseStudyDetailPage = () => {
  return (
    <>
      <HeroSection
        variant="simple"
        title="Establishment of a joint agreement for octopus farming and fishing on the islands of Lankai and Lanjukang, Indonesia"
      />
      <ArticleMetadataSection />
      <>Read article</>
      <OtherCaseStudiesSection />
    </>
  );
};

export default CaseStudyDetailPage;
