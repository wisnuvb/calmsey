import {
  FeedbackCalloutSection,
  GrantmakingSection,
  HeroSection,
  TheoryOfChangeSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";
import { Metadata } from "next";

interface OurApproachPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: OurApproachPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "id"
        ? "Pendekatan Kami - Turning Tides Facility"
        : "Our Approach - Turning Tides Facility",
    description:
      lang === "id"
        ? "Pendekatan Turning Tides Facility"
        : "Our Approach - Turning Tides Facility",
    alternates: {
      canonical: `/${lang}/our-approach`,
      languages: {
        en: "/en/our-approach",
        id: "/id/our-approach",
      },
    },
  };
}

const OurApproachPage = async ({ params }: OurApproachPageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("OUR_APPROACH", language);
  return (
    <PageContentProvider
      content={content}
      pageType="OUR_APPROACH"
      language={language}
    >
      <HeroSection
        variant="simple"
        title="How we fund change"
        subtitle="Lorem ipsum dolor sit amet consectetur. Sed vel vitae vel mauris sit tempor et. Nibh bibendum amet ridiculus elementum praesent tempor nec. Nulla et enim consectetur dictum nulla laoreet neque. Risus tempor convallis hendrerit proin."
        backgroundImage="/assets/hero-about-us.webp"
        dataSection="our-approach"
        className="h-[590px] !min-h-[590px]"
      />

      {/* <SupportSection /> */}
      <GrantmakingSection contentKey="support.navigationItems" />
      <TheoryOfChangeSection />
      <FeedbackCalloutSection
        title="We value your support"
        description="Connect with us to co-create solutions that protect rights, sustain livelihoods, and centre local voices."
      />
    </PageContentProvider>
  );
};

export default OurApproachPage;
