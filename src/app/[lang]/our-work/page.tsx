import {
  HeroSection,
  LatestActivitySection,
  PartnerStoriesSection,
  RelationshipsSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";
import { Metadata } from "next";

interface OurWorkPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: OurWorkPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "id"
        ? "Pekerjaan Kami - Turning Tides Facility"
        : "Our Work - Turning Tides Facility",
    description:
      lang === "id"
        ? "Pekerjaan Turning Tides Facility"
        : "Our Work - Turning Tides Facility",
    alternates: {
      canonical: `/${lang}/our-work`,
      languages: {
        en: "/en/our-work",
        id: "/id/our-work",
      },
    },
  };
}

const OurWorkPage = async ({ params }: OurWorkPageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("OUR_WORK", language);

  return (
    <PageContentProvider
      content={content}
      pageType="OUR_WORK"
      language={language}
    >
      <HeroSection
        variant="overlay-bottom"
        title="Discover Our Work"
        subtitle="Turning Tides works in close partnership with grassroots groups, NGO allies, and dedicated funders. We connect regularly, in person and virtually, to exchange knowledge, provide supports, and create new opportunities for change."
        backgroundImage="/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
        className="h-[100vh-250px]"
      />
      <RelationshipsSection />
      <LatestActivitySection />
      <PartnerStoriesSection
        title="Stories from our partners"
        backgroundColor="white"
      />
      {/* 
      <CaseStudyCarousel />
      <TenureUnderstandingSection />
      <GrantmakingApproachSection />
      <DownloadFramework />
      <StoriesSection />
      <CommunityEmpowermentSection />
      <CollectiveActionSection
        text="Together—values, principles, committees, and funders - ignite meaningful change for people, communities, and the planet."
        backgroundColor="bg-[#ECEFFD]"
      /> */}
    </PageContentProvider>
  );
};

export default OurWorkPage;
