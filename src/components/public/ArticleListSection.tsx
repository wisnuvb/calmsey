/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import { SupportedLanguage } from "@/lib/public-api";

interface ArticleListSectionProps {
  translation: any;
  language: SupportedLanguage;
  style?: React.CSSProperties;
}

export default function ArticleListSection({
  translation,
  language,
  style,
}: ArticleListSectionProps) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const metadata = translation?.metadata || {};
  const limit = metadata.limit || 6;
  const showExcerpt = metadata.showExcerpt !== false;
  const showDate = metadata.showDate !== false;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `/api/public/articles?lang=${language}&limit=${limit}`
        );
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [language, limit]);

  if (loading) {
    return (
      <section className="py-12" style={style}>
        <div className="container mx-auto px-4">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" style={style}>
      <div className="container mx-auto px-4">
        {translation?.title && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {translation.title}
          </h2>
        )}

        {translation?.subtitle && (
          <p className="text-lg text-gray-600 text-center mb-12">
            {translation.subtitle}
          </p>
        )}

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <ArticleCard
                key={article.id}
                article={article}
                language={language}
                showExcerpt={showExcerpt}
                // showDate={showDate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No articles available</p>
          </div>
        )}

        {metadata.showViewAllButton && (
          <div className="text-center mt-12">
            <Link
              href={`${language === "en" ? "" : `/${language}`}/articles`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              {metadata.viewAllButtonText || "View All Articles"}
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
