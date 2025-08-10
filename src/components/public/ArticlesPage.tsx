// src/components/public/ArticlesPage.tsx
import { PublicArticle, SupportedLanguage } from "@/lib/public-api";
import { ArticleCard } from "./ArticleCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { Pagination } from "./Pagination";

interface ArticlesPageProps {
  data: {
    articles: PublicArticle[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    category?: {
      id: string;
      name: string;
      description?: string;
      slug: string;
    };
  } | null;
  language: SupportedLanguage;
  currentPage: number;
}

export function ArticlesPage({
  data,
  language,
  currentPage,
}: ArticlesPageProps) {
  const prefix = language === "en" ? "" : `/${language}`;

  // Handle error state
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "en"
              ? "Articles not found"
              : "Artikel tidak ditemukan"}
          </h1>
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? "The articles you are looking for could not be found."
              : "Artikel yang Anda cari tidak dapat ditemukan."}
          </p>
          <a
            href={prefix || "/"}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {language === "en" ? "Back to Home" : "Kembali ke Beranda"}
          </a>
        </div>
      </div>
    );
  }

  const { articles, pagination, category } = data;

  // Build breadcrumb navigation
  const breadcrumbItems = [
    { label: language === "en" ? "Home" : "Beranda", href: prefix || "/" },
    {
      label: language === "en" ? "Articles" : "Artikel",
      href: `${prefix}/articles`,
    },
  ];

  if (category) {
    breadcrumbItems.push({
      label: category.name,
      href: `${prefix}/${category.slug}`,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
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
                {category
                  ? category.name
                  : language === "en"
                  ? "Articles"
                  : "Artikel"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {category
                  ? language === "en"
                    ? "Category"
                    : "Kategori"
                  : language === "en"
                  ? "All articles"
                  : "Semua artikel"}
              </p>
            </div>
          </div>

          {category?.description && (
            <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
              <p className="text-gray-700 leading-relaxed">
                {category.description}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              {language === "en"
                ? `Showing ${articles.length} of ${pagination.total} articles`
                : `Menampilkan ${articles.length} dari ${pagination.total} artikel`}
              {currentPage > 1 && (
                <span className="ml-2">
                  • {language === "en" ? "Page" : "Halaman"} {currentPage}
                </span>
              )}
            </div>

            {/* Sort/Filter Options (Future Enhancement) */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {language === "en" ? "Latest first" : "Terbaru dahulu"}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  baseUrl={
                    category
                      ? `${prefix}/${category.slug}`
                      : `${prefix}/articles`
                  }
                  language={language}
                />
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              {language === "en"
                ? "No articles found"
                : "Tidak ada artikel ditemukan"}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {category
                ? language === "en"
                  ? "This category doesn't have any published articles yet. Check back later!"
                  : "Kategori ini belum memiliki artikel yang dipublikasikan. Silakan cek kembali nanti!"
                : language === "en"
                ? "There are no articles to display at this time. Please check back later!"
                : "Tidak ada artikel untuk ditampilkan saat ini. Silakan cek kembali nanti!"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={prefix || "/"}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
              </a>

              {category && (
                <a
                  href={`${prefix}/articles`}
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  {language === "en"
                    ? "Browse All Articles"
                    : "Jelajahi Semua Artikel"}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        {articles.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === "en" ? "Stay Updated" : "Tetap Update"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {language === "en"
                ? "Get the latest insights and updates from Turning Tides Facility delivered to your inbox."
                : "Dapatkan wawasan dan pembaruan terbaru dari Turning Tides Facility langsung ke kotak masuk Anda."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`${prefix}/contact`}
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {language === "en" ? "Contact Us" : "Hubungi Kami"}
              </a>
              <a
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {language === "en" ? "Learn More" : "Pelajari Lebih Lanjut"}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
