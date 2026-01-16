"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { H3, H5, P } from "@/components/ui/typography";
import { Play, MapPin, Calendar } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface Story {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  videoUrl?: string;
  caption?: string;
}

interface ArticleResponse {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  location?: string;
  publishedAt: Date | string;
  videoUrl?: string;
  posterImage?: string;
  partnerOrganization?: {
    name: string;
    logo: string;
    fullName: string;
  };
  photos?: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  categories?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface LatestStoriesSectionProps {
  title?: string;
  limit?: number;
  showViewAll?: boolean;
  className?: string;
  language?: string;
}

export const LatestStoriesSection: React.FC<LatestStoriesSectionProps> = ({
  title = "Latest Stories",
  limit = 3,
  showViewAll = true,
  className,
  language: propLanguage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Get language from pathname or props
  const getLanguage = () => {
    if (propLanguage) return propLanguage;
    // Extract language from pathname (e.g., /en/stories/... or /id/stories/...)
    const pathParts = pathname.split("/").filter(Boolean);
    const possibleLang = pathParts[0];
    // Check if it's a valid language code (2-3 characters)
    if (possibleLang && possibleLang.length >= 2 && possibleLang.length <= 3) {
      return possibleLang;
    }
    return "en"; // Default fallback
  };

  const language = getLanguage();

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lang: language,
          limit: limit.toString(),
        });

        const response = await fetch(`/api/public/articles?${params}`);
        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
          // Transform articles to stories
          const transformedStories: Story[] = data.articles.map(
            (article: ArticleResponse) => {
              // Get location from article location field or first category
              const location =
                article.location || article.categories?.[0]?.name || "Unknown";

              // Format date
              const dateObj = new Date(article.publishedAt);
              const date = format(dateObj, "MMM dd, yyyy", { locale: enUS });

              // Get description from excerpt or generate from title
              const description =
                article.excerpt ||
                `${article.title.substring(0, 100)}...` ||
                "";

              return {
                id: article.id,
                slug: article.slug,
                title: article.title || "Untitled",
                location,
                date,
                description,
                thumbnail: article.featuredImage || "",
                thumbnailAlt: article.title || "Story image",
                videoUrl: article.videoUrl,
                caption: undefined, // Can be set from photos or other sources if needed
              };
            }
          );

          setStories(transformedStories);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [limit, language]);

  const handleStoryClick = (slug: string) => {
    router.push(`/${language}/stories/${slug}`);
  };

  return (
    <section className={`py-16 bg-white ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <H3 style="h3bold" className="text-[#010107]">
            {title}
          </H3>
          {showViewAll && (
            <button
              className="text-[#010107] text-sm font-nunito-sans font-normal border border-[#CADBEA] py-4 px-6 rounded"
              onClick={() => router.push(`/${language}/stories`)}
            >
              View All
            </button>
          )}
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-gray-200 mb-8" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No stories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group"
                onClick={() => handleStoryClick(story.slug)}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden mb-8">
                  <Image
                    src={getImageUrl(story.thumbnail)}
                    alt={story.thumbnailAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Play Button Overlay */}
                  {story.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-gray-900 fill-current ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Caption Overlay */}
                  {story.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-sm font-work-sans">
                        {story.caption}
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <H5
                    style="h5bold"
                    className="text-[#010107] mb-4 font-nunito-sans leading-tight"
                  >
                    {story.title}
                  </H5>

                  {/* Description */}
                  <P
                    style="p1reg"
                    className="text-[#06072680] mb-4 leading-relaxed line-clamp-3"
                  >
                    {story.description}
                  </P>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-base text-[#010107] font-normal">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-work-sans">{story.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-work-sans">{story.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
