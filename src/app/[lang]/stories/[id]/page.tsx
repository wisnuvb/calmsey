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
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { metadata } from "@/app/layout";

interface DetailStoryPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: DetailStoryPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const language = lang || "en";

  const article = await prisma.article.findUnique({
    where: {
      slug: id,
      status: "PUBLISHED",
    },
    include: {
      translations: {
        where: {
          languageId: language,
        },
        take: 1,
      },
    },
  });

  if (!article) {
    return {
      title: "Story Not Found",
    };
  }

  const translation = article.translations?.[0];
  const title = translation?.title || article.title;
  const description = translation?.excerpt || article.excerpt || "";

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `/${lang}/stories/${id}`,
      languages: {
        en: `/en/stories/${id}`,
        id: `/id/stories/${id}`,
      },
    },
  };
}

async function getShareUrl(lang: string, id: string): Promise<string> {
  try {
    const headersList = await headers();
    const host =
      headersList.get("x-forwarded-host") ||
      headersList.get("host") ||
      "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") || "https";
    const base = `${proto}://${host}`;
    const path = `/${lang}/stories/${id}`.replace(/\/+/g, "/");
    return `${base}${path}`;
  } catch {
    return "";
  }
}

const DetailStoryPage = async ({ params }: DetailStoryPageProps) => {
  const { lang, id } = await params;
  const language = lang || "en";
  const shareUrl = await getShareUrl(lang, id);

  // Use STORIES page type or pass empty content if not needed
  const content = await getPageContentServer("STORIES", language).catch(
    () => ({}),
  );

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

  // Format date in WIB so it matches admin input timezone
  const date = article.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Jakarta",
      }).format(new Date(article.publishedAt))
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
  let storedRelatedArticles: Array<{ id: string; title: string; url: string }> =
    [];
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
    bodyContent: article.content || "",
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
        backgroundImage="/assets/cover-stories.webp" //{storyData.backgroundImage}
      />
      <DetailStoryVideoSection
        videoUrl={storyData.videoUrl}
        posterImage={storyData.posterImage}
      />
      <DetailStoryContentSection
        partnerOrganization={storyData.partnerOrganization}
        country={storyData.country}
        description={storyData.description}
        bodyContent={storyData.bodyContent}
        photos={storyData.photos}
        relatedArticles={storyData.relatedArticles}
        videoUrl={storyData.videoUrl}
        shareUrl={shareUrl}
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
