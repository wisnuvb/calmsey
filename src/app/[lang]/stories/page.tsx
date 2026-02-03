import React from "react";
import {
  AllStoriesListSection,
  CommunityStoriesSection,
  FeedbackCalloutSection,
  HeroSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import { getStories, getStoriesCategories } from "@/lib/stories";
import { Metadata } from "next";

interface StoriesPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: StoriesPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "id"
        ? "Cerita - Turning Tides Facility"
        : "Stories - Turning Tides Facility",
    description:
      lang === "id" ? "Cerita dari Mitra Kami" : "Stories From Our Partners",
    alternates: {
      canonical: `/${lang}/stories`,
      languages: {
        en: "/en/stories",
        id: "/id/stories",
      },
    },
  };
}

const StoriesPage = async ({ params }: StoriesPageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("STORIES", language);

  // Get configuration from content
  const maxStories = parseInt(content["allStories.maxStories"] || "12");
  const sortOrder = (content["allStories.sortOrder"] || "Latest") as
    | "Latest"
    | "Oldest"
    | "A-Z"
    | "Z-A";
  const defaultCategory = content["allStories.defaultCategory"] || "";

  // Parse filter categories
  let filterCategories: string[] = [];
  try {
    const filterCategoriesRaw = content["allStories.filterCategories"];
    if (filterCategoriesRaw) {
      const parsed = JSON.parse(filterCategoriesRaw);
      filterCategories = Array.isArray(parsed)
        ? parsed.map((item) =>
            typeof item === "string" ? item : item.categorySlug
          )
        : [];
    }
  } catch (error) {
    console.error("Error parsing filterCategories:", error);
  }

  // Fetch stories from database
  const stories = await getStories({
    maxStories,
    sortOrder,
    filterCategories:
      filterCategories.length > 0 ? filterCategories : undefined,
    defaultCategory: defaultCategory || undefined,
    language,
  });

  // Fetch available categories for filtering
  const categories = await getStoriesCategories(language);

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
      <AllStoriesListSection
        stories={stories}
        categories={categories}
        defaultCategory={defaultCategory}
      />
      <FeedbackCalloutSection
        title="We value your support"
        description="Connect with us to co-create solutions that protect rights, sustain livelihoods, and centre local voices."
        feedbackText="Get Involved"
      />
    </PageContentProvider>
  );
};

export default StoriesPage;
