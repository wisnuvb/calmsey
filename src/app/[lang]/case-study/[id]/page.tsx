import {
  ArticleMetadataSection,
  HeroSection,
  OtherCaseStudiesSection,
} from "@/components/main";
import React from "react";
import { Metadata } from "next";

interface CaseStudyPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  return {
    title: "Case Study - Turning Tides Facility",
    description: "Case Study Detail",
    alternates: {
      canonical: `/${lang}/case-study/${id}`,
      languages: {
        en: `/en/case-study/${id}`,
        id: `/id/case-study/${id}`,
      },
    },
  };
}

const CaseStudyDetailPage = async ({ params }: CaseStudyPageProps) => {
  await params;
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
