import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Article {
  id: string;
  title: string;
  image: string;
  date: string;
  category: string;
  slug: string;
}

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link
      key={article.id}
      href={`/articles/${article.slug}`}
      className="group bg-white rounded-sm overflow-hidden transition-all duration-300"
    >
      {/* Article Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Article Content */}
      <div className="p-6 lg:p-8">
        {/* Title */}
        <h3 className="text-lg lg:text-xl font-normal text-[#010107] mb-4 leading-snug group-hover:text-[#1f2a49] transition-colors">
          {article.title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <time dateTime={article.date}>{article.date}</time>
          <span>•</span>
          <span>{article.category}</span>
        </div>
      </div>
    </Link>
  );
};
