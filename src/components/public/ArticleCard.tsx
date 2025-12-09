// src/components/public/ArticleCard.tsx
import Link from "next/link";
import { PublicArticle, SupportedLanguage } from "@/lib/public-api";
import Image from "next/image";
import { formatDate } from "date-fns";
import { getImageUrl } from "@/lib/utils";

interface ArticleCardProps {
  article: PublicArticle;
  language: SupportedLanguage;
  showExcerpt?: boolean;
}

export function ArticleCard({
  article,
  language,
  showExcerpt = true,
}: ArticleCardProps) {
  const prefix = language === "en" ? "" : `/${language}`;
  const articleUrl = `${prefix}/articles/${article.slug}`;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {article.featuredImage && (
        <div className="aspect-w-16 aspect-h-9">
          <Image
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-48 object-cover"
            width={1000}
            height={1000}
          />
        </div>
      )}

      <div className="p-6">
        {/* Categories */}
        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.categories.slice(0, 2).map((category) => (
              <Link
                key={category.id}
                href={`${prefix}/${category.slug}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link href={articleUrl} className="hover:text-blue-600">
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {showExcerpt && article.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{article.author.name}</span>
          <time dateTime={article.publishedAt.toISOString()}>
            {formatDate(article.publishedAt, language)}
          </time>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
