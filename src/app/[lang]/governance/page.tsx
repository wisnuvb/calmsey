import { metadata } from "@/app/layout";
import {
  AdvisoryCommitteesSection,
  ConsultativeProcessSection,
  CoreValuesSection,
  GovernanceValuesSection,
  GrantmakingProcessSection,
  GuidingPrinciplesSection,
  HeroSection,
  OurFundersSection,
  OurValuesPrinciplesSection,
  SteeringCommitteeSection,
  ValuesFoundationSection,
  VoiceMattersHeroSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";

interface GovernancePageProps {
  params: Promise<{ lang: string }>;
}

const GovernancePage = async ({ params }: GovernancePageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("GOVERNANCE", language);

  metadata.title = "Governance";
  metadata.description = "Governance";

  return (
    <PageContentProvider
      content={content}
      pageType="GOVERNANCE"
      language={language}
    >
      <HeroSection
        variant="overlay-bottom"
        title="The Governance of Turning Tides"
        subtitle="Turning Tides's conservation efforts - from protecting oceans and endangered species to supporting small-scale fishers, biodiversity conservation, and sustainable communities."
        backgroundImage="/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
        dataSection="governance"
      />
      <OurValuesPrinciplesSection />
      <GrantmakingProcessSection />
      <SteeringCommitteeSection />
      <ConsultativeProcessSection />
      <GovernanceValuesSection />
      <CoreValuesSection />
      <GuidingPrinciplesSection />
      <ValuesFoundationSection />
      <OurFundersSection />
      <AdvisoryCommitteesSection />
      <VoiceMattersHeroSection />
    </PageContentProvider>
  );
};

export default GovernancePage;
