import {
  GrantmakingSection,
  HeroSection,
  OurFourFundsSection,
  OurPartnersSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";

interface OurFundPageProps {
  params: Promise<{ lang: string }>;
}

const OurFundPage = async ({ params }: OurFundPageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("OUR_FUND", language);

  return (
    <PageContentProvider
      content={content}
      pageType="OUR_FUND"
      language={language}
    >
      <HeroSection
        variant="overlay-bottom"
        title="How we fund change"
        backgroundImage="/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
      />
      <GrantmakingSection
        navigationItems={[
          {
            id: "approach",
            label: "Our approach to Grantmaking",
            content: {
              id: "approach",
              title: "Our approach to Grantmaking",
              imageSrc:
                "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
              imageAlt: "Floating village",
              paragraphs: [
                "Turning Tides implements and advocates for liberatory approaches...",
                "Our practices include multi-year flexible funding...",
              ],
              practicesTitle: "What we practice",
              practices: [
                { id: "1", text: "Shared decision-making..." },
                { id: "2", text: "Partner-centered grantmaking..." },
                // ... more practices
              ],
            },
          },
          {
            id: "tenure",
            label: "What we understand by tenure",
            content: {
              id: "tenure",
              title: "What we understand by tenure",
              paragraphs: ["Tenure refers to the relationship..."],
            },
          },
          {
            id: "framework",
            label: "Our Grantmaking Framework",
            content: {
              id: "framework",
              title: "Our Grantmaking Framework",
              paragraphs: ["Our grantmaking framework is designed..."],
            },
          },
        ]}
      />
      <OurFourFundsSection />
      <OurPartnersSection />
    </PageContentProvider>
  );
};

export default OurFundPage;
