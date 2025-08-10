/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArticlesPage } from "@/components/public/ArticlesPage";
import { PublicAPI, SupportedLanguage } from "@/lib/public-api";

import { Metadata } from "next";

interface ArticlesPageProps {
  params: Promise<{ lang: SupportedLanguage }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}

export async function generateMetadata({
  params,
}: ArticlesPageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === "en" ? "Articles" : "Artikel",
    description:
      lang === "en"
        ? "Read our latest articles and insights"
        : "Baca artikel dan wawasan terbaru kami",
    alternates: {
      canonical: `/${lang}/articles`,
      languages: {
        en: "/en/articles",
        id: "/id/articles",
      },
    },
  };
}

export default async function ArticlesListPage({
  params,
  searchParams,
}: ArticlesPageProps) {
  const { lang } = await params;
  const { page = "1", category } = await searchParams;

  const pageNum = parseInt(page, 10) || 1;

  let articlesData;
  if (category) {
    articlesData = await PublicAPI.getArticlesByCategory(
      category,
      lang,
      pageNum
    );
  } else {
    const articles = await PublicAPI.getRecentArticles(lang, pageNum * 12);
    articlesData = {
      articles: articles.slice((pageNum - 1) * 12, pageNum * 12),
      pagination: {
        page: pageNum,
        limit: 12,
        total: articles.length,
        totalPages: Math.ceil(articles.length / 12),
      },
    };
  }

  return (
    <ArticlesPage
      data={articlesData as any}
      language={lang}
      currentPage={pageNum}
    />
  );
}
