import { metadata } from "@/app/layout";
import {
  DetailStoryHeroSection,
  DetailStoryVideoSection,
  DetailStoryContentSection,
  LatestStoriesSection,
  FeedbackCalloutSection,
} from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
import React from "react";

interface DetailStoryPageProps {
  params: Promise<{ lang: string }>;
}

const DetailStoryPage = async ({ params }: DetailStoryPageProps) => {
  const { lang } = await params;
  const language = lang || "en";

  const content = await getPageContentServer("DETAIL_STORY", language);

  metadata.title = "Detail Story";
  metadata.description = "";

  // Mock data - dalam implementasi nyata, ini akan datang dari API
  const storyData = {
    title: "Pasibuntuluki - Lines of the Sea",
    date: "Sept 12, 2025 3:42 PM",
    backgroundImage: "/assets/demo/our-vision.png",
    videoUrl: "/assets/demo/video.mp4",
    posterImage: "/assets/demo/partners.png",
    partnerOrganization: {
      name: "Yayasan Konservasi Laut",
      logo: "/assets/demo/16d51a5010efc92e05fa498a2dd962f76c4544ab.png",
      fullName:
        "YKL YAYASAN KONSERVASI LAUT INDONESIA INDONESIA MARINE CONSERVATION FOUNDATION",
    },
    country: "Indonesia",
    description:
      "In the waters of southwestern Sulawesi, traditional ecological knowledge has been passed down through generations, creating a deep understanding of marine ecosystems. However, these communities face increasing vulnerability to exploitation and environmental degradation. Through the Pasibuntuluki Forum, local communities are coming together to secure their rights and amplify their voices in marine governance, ensuring sustainable practices that protect both their livelihoods and the ocean's biodiversity.",
    photos: [
      { id: "1", src: "/assets/demo/photo1.jpg", alt: "Fishing community" },
      { id: "2", src: "/assets/demo/photo2.jpg", alt: "Marine conservation" },
      { id: "3", src: "/assets/demo/photo3.jpg", alt: "Community meeting" },
      { id: "4", src: "/assets/demo/photo4.jpg", alt: "Traditional boat" },
      { id: "5", src: "/assets/demo/photo5.jpg", alt: "Ocean view" },
      { id: "6", src: "/assets/demo/photo6.jpg", alt: "Local community" },
    ],
    relatedArticles: [
      {
        id: "1",
        title: "The Long Road to Protecting the Seas of South Sulawesi",
        url: "/stories/1",
      },
      {
        id: "2",
        title: "Learning from the Pasibuntuluki Forum and the Abundant Octopus",
        url: "/stories/2",
      },
      {
        id: "3",
        title:
          "Sustainable Ecology and a Growing Economy: Spermonde's Inspiring Open-Close Practices",
        url: "/stories/3",
      },
    ],
  };

  return (
    <PageContentProvider
      content={content}
      pageType="DETAIL_STORY"
      language={language}
    >
      <DetailStoryHeroSection
        title={storyData.title}
        date={storyData.date}
        backgroundImage={storyData.backgroundImage}
      />
      <DetailStoryVideoSection
        videoUrl={storyData.videoUrl}
        posterImage={storyData.posterImage}
      />
      <DetailStoryContentSection
        partnerOrganization={storyData.partnerOrganization}
        country={storyData.country}
        description={storyData.description}
        photos={storyData.photos}
        relatedArticles={storyData.relatedArticles}
      />
      <LatestStoriesSection />
      <FeedbackCalloutSection
        title="We value your support"
        description="Connect with us to co-create solutions that protect rights, sustain livelihoods, and centre local voices."
        feedbackText="Get Involved"
      />
    </PageContentProvider>
  );
};

export default DetailStoryPage;
