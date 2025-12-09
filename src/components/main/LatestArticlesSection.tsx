"use client";

import Link from "next/link";
import { ArticleCard } from "../article";
import { H2 } from "../ui/typography";
import { ArrowRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  image: string;
  date: string;
  category: string;
  slug: string;
}

const articles: Article[] = [
  {
    id: "1",
    title:
      "Supporting rights and tenure of local communities, small-scale fishers, fish workers",
    image: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
    date: "Jul 21, 2025",
    category: "Community",
    slug: "supporting-rights-tenure-communities",
  },
  {
    id: "2",
    title:
      "Supporting rights and tenure of local communities, small-scale fishers, fish workers",
    image: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
    date: "Jul 21, 2025",
    category: "Community",
    slug: "supporting-rights-tenure-fishers",
  },
  {
    id: "3",
    title:
      "Supporting rights and tenure of local communities, small-scale fishers, fish workers",
    image: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
    date: "Jul 21, 2025",
    category: "Community",
    slug: "supporting-rights-tenure-workers",
  },
];

interface LatestArticlesSectionProps {
  title?: string;
  limit?: number;
}

export function LatestArticlesSection({
  title = "Recent Updates",
  limit = 6,
}: LatestArticlesSectionProps = {}) {
  return (
    <section className="py-16 lg:py-24 bg-[#F7FAFC]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 lg:mb-14 gap-4">
          <H2 style="h2reg" className="text-3xl sm:text-[38px] text-[#010107]">
            {title}
          </H2>
          <Link
            href="/articles"
            className="inline-flex items-center justify-center gap-4 px-6 py-3 border border-[#CADBEA] text-[#010107] rounded-lg hover:bg-[#010107] hover:text-white transition-colors font-medium text-sm sm:text-base whitespace-nowrap w-fit"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, limit).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
