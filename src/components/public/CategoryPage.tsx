// src/components/public/CategoryPage.tsx
import Link from "next/link";
import { PublicArticle, SupportedLanguage } from "@/lib/public-api";
import { ArticleCard } from "./ArticleCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { Pagination } from "./Pagination";

interface CategoryPageProps {
  data: {
    category: {
      id: string;
      name: string;
      description?: string;
      slug: string;
    };
    articles: PublicArticle[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  language: SupportedLanguage;
  slug: string[];
}

export function CategoryPage({ data, language }: CategoryPageProps) {
  const prefix = language === "en" ? "" : `/${language}`;
  const { category, articles, pagination } = data;

  // Build breadcrumb navigation
  const breadcrumbItems = [
    { label: language === "en" ? "Home" : "Beranda", href: prefix || "/" },
    {
      label: language === "en" ? "Articles" : "Artikel",
      href: `${prefix}/articles`,
    },
    { label: category.name, href: `${prefix}/${category.slug}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {language === "en" ? "Category" : "Kategori"}
              </p>
            </div>
          </div>

          {category.description && (
            <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
              <p className="text-gray-700 leading-relaxed">
                {category.description}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {language === "en"
                ? `Showing ${articles.length} of ${pagination.total} articles`
                : `Menampilkan ${articles.length} dari ${pagination.total} artikel`}
            </div>

            {/* Category Meta Info */}
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a2 2 0 012-2z"
                  />
                </svg>
                /{category.slug}
              </span>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  language={language}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                baseUrl={`${prefix}/${category.slug}`}
                language={language}
              />
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === "en"
                ? "No articles found"
                : "Tidak ada artikel ditemukan"}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === "en"
                ? "This category doesn't have any published articles yet."
                : "Kategori ini belum memiliki artikel yang dipublikasikan."}
            </p>
            <Link
              href={`${prefix}/articles`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {language === "en"
                ? "Browse All Articles"
                : "Jelajahi Semua Artikel"}
            </Link>
          </div>
        )}

        {/* Related Categories or Call to Action */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === "en"
                ? "Explore More Content"
                : "Jelajahi Konten Lainnya"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "Discover more articles and insights across different topics"
                : "Temukan lebih banyak artikel dan wawasan dari berbagai topik"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`${prefix}/articles`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                {language === "en" ? "All Articles" : "Semua Artikel"}
              </Link>
              <Link
                href={`${prefix}`}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {language === "en" ? "Back to Home" : "Kembali ke Beranda"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
