import {
  HeroSection,
  SupportSection,
  TheoryOfChangeSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";

interface OurApproachPageProps {
  params: Promise<{ lang: string }>;
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

      <SupportSection />
      <TheoryOfChangeSection />
    </PageContentProvider>
  );
};

export default OurApproachPage;
