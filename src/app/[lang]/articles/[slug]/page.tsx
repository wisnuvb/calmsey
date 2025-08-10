import { ArticlePage } from "@/components/public/ArticlePage";
import { PublicAPI, SupportedLanguage } from "@/lib/public-api";

import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ lang: SupportedLanguage; slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await PublicAPI.getArticleBySlug(slug, lang);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
    },
    alternates: {
      canonical: `/${lang}/articles/${slug}`,
      languages: {
        en: `/en/articles/${slug}`,
        id: `/id/articles/${slug}`,
      },
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;
  const article = await PublicAPI.getArticleBySlug(slug, lang);

  if (!article) {
    notFound();
  }

  // Get related articles
  const relatedArticles = await PublicAPI.getRecentArticles(lang, 3);

  return (
    <ArticlePage
      article={article}
      relatedArticles={relatedArticles.filter((a) => a.id !== article.id)}
      language={lang}
    />
  );
}
