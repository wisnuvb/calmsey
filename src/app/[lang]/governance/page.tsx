import {
  FundingAcceptancePolicySection,
  GovernanceMeaningSection,
  GuidingPoliciesSection,
  FeedbackCalloutSection,
  HeroSection,
  SteeringCommitteeSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";
import { Metadata } from "next";

interface GovernancePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: GovernancePageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "id"
        ? "Tata Kelola - Turning Tides Facility"
        : "Governance - Turning Tides Facility",
    description:
      lang === "id"
        ? "Tata Kelola Turning Tides Facility"
        : "Governance of Turning Tides Facility",
    alternates: {
      canonical: `/${lang}/governance`,
      languages: {
        en: "/en/governance",
        id: "/id/governance",
      },
    },
  };
}

const GovernancePage = async ({ params }: GovernancePageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("GOVERNANCE", language);

  return (
    <PageContentProvider
      content={content}
      pageType="GOVERNANCE"
      language={language}
    >
      <HeroSection
        variant="simple"
        title="The Governance of Turning Tides"
        subtitle="Turning Tides's conservation efforts - from protecting oceans and endangered species to supporting small-scale fishers, biodiversity conservation, and sustainable communities."
        backgroundImage="/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
        dataSection="governance"
        className="h-[590px] !min-h-[590px]"
      />
      <GovernanceMeaningSection />
      <SteeringCommitteeSection />
      <FundingAcceptancePolicySection />
      <GuidingPoliciesSection />
      {/* <OurValuesPrinciplesSection /> */}
      {/* <GrantmakingProcessSection /> */}
      {/* <ConsultativeProcessSection /> */}
      {/* <GovernanceValuesSection /> */}
      {/* <CoreValuesSection /> */}
      {/* <GuidingPrinciplesSection /> */}
      {/* <ValuesFoundationSection /> */}
      {/* <OurFundersSection /> */}
      {/* <AdvisoryCommitteesSection /> */}
      {/* <VoiceMattersHeroSection /> */}
      <FeedbackCalloutSection />
    </PageContentProvider>
  );
};

export default GovernancePage;
