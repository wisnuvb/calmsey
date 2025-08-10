import { Metadata } from "next";
import { PublicArticle, SupportedLanguage } from "./public-api";

interface GenerateMetadataProps {
  title: string;
  description?: string;
  image?: string;
  url: string;
  language: SupportedLanguage;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
}

export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  language,
  type = "website",
  publishedTime,
  author,
}: GenerateMetadataProps): Metadata {
  const siteName = "Turning Tides Facility";
  const defaultDescription =
    language === "en"
      ? "Premier rehabilitation and treatment facility providing comprehensive care and support for recovery and healing."
      : "Fasilitas rehabilitasi dan perawatan premier yang menyediakan perawatan dan dukungan komprehensif untuk pemulihan dan penyembuhan.";

  const metadata: Metadata = {
    title: `${title} | ${siteName}`,
    description: description || defaultDescription,
    openGraph: {
      title,
      description: description || defaultDescription,
      url,
      siteName,
      locale: language === "en" ? "en_US" : "id_ID",
      type,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || defaultDescription,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
      languages: {
        en: url.replace(/^\/[a-z]{2}/, ""),
        id: url.startsWith("/id") ? url : `/id${url}`,
      },
    },
  };

  // Add article-specific metadata
  if (type === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      authors: author ? [author] : undefined,
    };
  }

  return metadata;
}

export function generateArticleMetadata(
  article: PublicArticle,
  language: SupportedLanguage,
  baseUrl: string = "https://turningtidesfacility.org"
): Metadata {
  const url =
    language === "en"
      ? `${baseUrl}/articles/${article.slug}`
      : `${baseUrl}/${language}/articles/${article.slug}`;

  return generateSEOMetadata({
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt || undefined,
    image: article.featuredImage || undefined,
    url,
    language,
    type: "article",
    publishedTime: article.publishedAt.toISOString(),
    author: article.author.name,
  });
}
