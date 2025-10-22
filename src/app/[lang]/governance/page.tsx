import { metadata } from "@/app/layout";
import {
  AdvisoryCommitteesSection,
  CoreValuesSection,
  GovernanceValuesSection,
  GuidingPrinciplesSection,
  HeroSection,
  OurFundersSection,
  SteeringCommitteeSection,
  ValuesFoundationSection,
  VoiceMattersHeroSection,
} from "@/components/main";
import React from "react";

const GovernancePage = () => {
  metadata.title = "Governance";
  metadata.description = "Governance";

  return (
    <>
      <HeroSection
        variant="search"
        title="Conservation with Community at the Core"
        subtitle="We are an international conservation facility committed to protecting biodiversity."
      />
      <GovernanceValuesSection />
      <CoreValuesSection />
      <GuidingPrinciplesSection />
      <ValuesFoundationSection />
      <OurFundersSection />
      <SteeringCommitteeSection />
      <AdvisoryCommitteesSection />
      <VoiceMattersHeroSection />
    </>
  );
};

export default GovernancePage;
