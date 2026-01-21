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
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import React from "react";

interface DetailStoryPageProps {
  params: Promise<{ lang: string; id: string }>;
}

const DetailStoryPage = async ({ params }: DetailStoryPageProps) => {
  const { lang, id } = await params;
  const language = lang || "en";

  // Use STORIES page type or pass empty content if not needed
  const content = await getPageContentServer("STORIES", language).catch(() => ({}));

  // Fetch article by slug
  const article = await prisma.article.findUnique({
    where: {
      slug: id,
      status: "PUBLISHED",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      translations: {
        where: {
          languageId: language,
        },
        take: 1,
      },
      categories: {
        include: {
          category: true,
        },
        take: 1,
      },
    },
  });

  if (!article) {
    notFound();
  }

  // Get translation if available
  const translation = article.translations?.[0];
  const title = translation?.title || article.title;
  const excerpt = translation?.excerpt || article.excerpt || "";

  // Format date
  const date = article.publishedAt
    ? format(new Date(article.publishedAt), "MMM dd, yyyy h:mm a")
    : "";

  // Parse JSON fields
  let partnerOrganization: {
    name: string;
    logo: string;
    fullName: string;
  } | null = null;

  type ArticleWithJson = typeof article & {
    partnerOrganization?: {
      name: string;
      logo: string;
      fullName: string;
    } | null;
    photos?: Array<{ id: string; src: string; alt: string }> | null;
    videoUrl?: string | null;
    posterImage?: string | null;
  };

  const articleWithJson = article as ArticleWithJson;

  if (articleWithJson.partnerOrganization) {
    try {
      partnerOrganization =
        typeof articleWithJson.partnerOrganization === "string"
          ? JSON.parse(articleWithJson.partnerOrganization)
          : articleWithJson.partnerOrganization;
    } catch (e) {
      console.error("Error parsing partnerOrganization:", e);
    }
  }

  let photos: Array<{ id: string; src: string; alt: string }> = [];
  if (articleWithJson.photos) {
    try {
      photos =
        typeof articleWithJson.photos === "string"
          ? JSON.parse(articleWithJson.photos)
          : articleWithJson.photos;
    } catch (e) {
      console.error("Error parsing photos:", e);
    }
  }

  // Get stored related articles from the database field
  let storedRelatedArticles: Array<{ id: string; title: string; url: string }> = [];
  if (articleWithJson.relatedArticles) {
    try {
      storedRelatedArticles =
        typeof articleWithJson.relatedArticles === "string"
          ? JSON.parse(articleWithJson.relatedArticles)
          : articleWithJson.relatedArticles;
    } catch (e) {
      console.error("Error parsing relatedArticles:", e);
    }
  }

  // Use stored related articles if available, otherwise fallback to same-category articles
  let relatedArticles = storedRelatedArticles;

  // If no stored related articles, get related articles by same category
  if (relatedArticles.length === 0) {
    const primaryCategory = article.categories?.[0]?.category;
    const relatedArticlesData = primaryCategory
      ? await prisma.article.findMany({
          where: {
            status: "PUBLISHED",
            publishedAt: { not: null },
            id: { not: article.id },
            categories: {
              some: {
                categoryId: primaryCategory.id,
              },
            },
          },
          include: {
            translations: {
              where: {
                languageId: language,
              },
              take: 1,
            },
          },
          orderBy: {
            publishedAt: "desc",
          },
          take: 3,
        })
      : [];

    relatedArticles = relatedArticlesData.map((related) => {
      const relatedTranslation = related.translations?.[0];
      const relatedTitle = relatedTranslation?.title || related.title;
      const relatedSlug = relatedTranslation?.slug || related.slug;
      return {
        id: related.id,
        title: relatedTitle,
        url: `/${language}/stories/${relatedSlug}`,
      };
    });
  }

  metadata.title = title;
  metadata.description = excerpt;

  const storyData = {
    title,
    date,
    backgroundImage: article.featuredImage || "",
    videoUrl: articleWithJson.videoUrl || "",
    posterImage: articleWithJson.posterImage || article.featuredImage || "",
    partnerOrganization: partnerOrganization || {
      name: "",
      logo: "",
      fullName: "",
    },
    country: article.location || "",
    description: excerpt || article.content.substring(0, 500),
    photos,
    relatedArticles,
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
      <LatestStoriesSection language={language} />
      <FeedbackCalloutSection
        title="We value your support"
        description="Connect with us to co-create solutions that protect rights, sustain livelihoods, and centre local voices."
        feedbackText="Get Involved"
      />
    </PageContentProvider>
  );
};

export default DetailStoryPage;
