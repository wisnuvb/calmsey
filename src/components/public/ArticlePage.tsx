// src/components/public/ArticlePage.tsx
import { PublicArticle, SupportedLanguage } from "@/lib/public-api";
import { ArticleCard } from "./ArticleCard";
import { formatDateWithLanguage } from "@/lib/date-utils";
import Image from "next/image";
import { ShareButtons } from "./ShareButtons";
import { getImageUrl } from "@/lib/utils";

interface ArticlePageProps {
  article: PublicArticle;
  relatedArticles: PublicArticle[];
  language: SupportedLanguage;
}

export function ArticlePage({
  article,
  relatedArticles,
  language,
}: ArticlePageProps) {
  const prefix = language === "en" ? "" : `/${language}`;

  const publishedDate =
    article.publishedAt instanceof Date
      ? article.publishedAt
      : new Date(article.publishedAt);

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header with Featured Image */}
      {article.featuredImage && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image
            src={getImageUrl(article.featuredImage || "/assets/slider-3.webp")}
            alt={article.title}
            className="w-full h-full object-cover"
            width={1000}
            height={1000}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="mx-auto max-w-4xl">
              <div className="text-white">
                {/* Categories */}
                {article.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.categories.map((category) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header (if no featured image) */}
        {!article.featuredImage && (
          <header className="mb-8">
            {/* Categories */}
            {article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.categories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </header>
        )}

        {/* Article Meta */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {article.author.name}
                </p>
                <p className="text-sm text-gray-500">
                  {language === "en" ? "Author" : "Penulis"}
                </p>
              </div>
            </div>

            {article.location && (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {article.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === "en" ? "Location" : "Lokasi"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-right">
            <time
              dateTime={publishedDate.toISOString()}
              className="text-sm text-gray-500"
            >
              {formatDateWithLanguage(publishedDate, language)}
            </time>
            <p className="text-xs text-gray-400 mt-1">
              {language === "en" ? "Published" : "Dipublikasikan"}
            </p>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mb-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === "en" ? "Tags" : "Tag"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-default"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Share */}
        <div className="mb-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === "en" ? "Share this article" : "Bagikan artikel ini"}
          </h3>
          <ShareButtons
            title={article.title}
            excerpt={article.excerpt}
            slug={article.slug}
            language={language}
          />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              {language === "en" ? "Related Articles" : "Artikel Terkait"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                  language={language}
                  showExcerpt={false}
                />
              ))}
            </div>

            {relatedArticles.length > 3 && (
              <div className="text-center mt-8">
                <a
                  href={`${prefix}/articles`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  {language === "en"
                    ? "View More Articles"
                    : "Lihat Artikel Lainnya"}
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
                </a>
              </div>
            )}
          </section>
        )}

        {/* Back to Articles */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href={`${prefix}/articles`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {language === "en" ? "Back to Articles" : "Kembali ke Artikel"}
          </a>
        </div>
      </div>
    </div>
  );
}
