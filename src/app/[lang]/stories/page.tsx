import React from "react";
import {
  AllStoriesListSection,
  CommunityStoriesSection,
  FeedbackCalloutSection,
  HeroSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";

interface StoriesPageProps {
  params: Promise<{ lang: string }>;
}

const StoriesPage = async ({ params }: StoriesPageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("STORIES", language);

  return (
    <PageContentProvider
      content={content}
      pageType="STORIES"
      language={language}
    >
      <HeroSection
        variant="simple"
        title="Stories From Our Partners"
        subtitle="These stories showcase the experiences, leadership, and voices of communities, fisher peoples, and Indigenous Peoples as they work to secure and strengthen their rights to land, water, and resources. We invite our partners to share glimpses into their journeys: experiences of struggle and tenure insecurity, and also the courage, knowledge, and actions it takes to achieve tenure security and rights recognition. "
        backgroundImage="/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
        dataSection="stories"
        className="h-[590px] !min-h-[590px]"
      />
      <CommunityStoriesSection />
      {/* <AllStoriesSection /> */}
      <AllStoriesListSection />
      <FeedbackCalloutSection
        title="We value your support"
        description="Connect with us to co-create solutions that protect rights, sustain livelihoods, and centre local voices."
        feedbackText="Get Involved"
      />
    </PageContentProvider>
  );
};

export default StoriesPage;
