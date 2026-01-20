"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { useImageError } from "@/hooks/useImageError";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface Story {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  location: string;
  date: string;
  url: string;
  type: "video" | "article";
}

interface ArticleResponse {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt: string | Date;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

const defaultStories: Story[] = [
  {
    id: "1",
    imageSrc:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
    imageAlt: "Pasibuntuliki - Lines of the Sea",
    title: "Pasibuntuliki - Lines of the Sea",
    location: "Indonesia",
    date: "September, 2025",
    url: "#",
    type: "video",
  },
  {
    id: "2",
    imageSrc:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
    imageAlt: "A new breath for the women of Néma Bah",
    title: "A new breath for the women of Néma Bah",
    location: "India",
    date: "September, 2025",
    url: "#",
    type: "video",
  },
  {
    id: "3",
    imageSrc:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
    imageAlt: "Rakhaine Women Fight for Survival, Tenure, and Identity",
    title: "Rakhaine Women Fight for Survival, Tenure, and Identity",
    location: "India",
    date: "September, 2025",
    url: "#",
    type: "video",
  },
];

interface PartnerStoriesSectionProps {
  tag?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor?: "blue" | "white";
  categorySlug?: string;
  limit?: number;
  className?: string;
}

export function PartnerStoriesSection({
  tag: propTag,
  title: propTitle,
  description: propDescription,
  buttonText: propButtonText,
  buttonUrl: propButtonUrl,
  backgroundColor: propBackgroundColor = "blue",
  categorySlug: propCategorySlug,
  limit: propLimit = 3,
  className,
}: PartnerStoriesSectionProps = {}) {
  // Use global image error handler
  const { hasError, handleError } = useImageError();

  const { getValue } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const tag = getValue("partnerStories.tag", propTag, "");
  const title = getValue("partnerStories.title", propTitle, "");
  const description = getValue(
    "partnerStories.description",
    propDescription,
    ""
  );
  const buttonText = getValue("partnerStories.buttonText", propButtonText, "");
  const buttonUrl = getValue("partnerStories.buttonUrl", propButtonUrl, "");
  const backgroundColor =
    (getValue("partnerStories.backgroundColor", propBackgroundColor, "blue") as
      | "blue"
      | "white") || propBackgroundColor;
  const categorySlug = getValue(
    "partnerStories.categorySlug",
    propCategorySlug,
    ""
  );
  const limitString = getValue(
    "partnerStories.limit",
    propLimit?.toString(),
    "3"
  );
  const limit = parseInt(limitString, 10) || 3;

  const [stories, setStories] = useState<Story[]>(defaultStories);
  const [loading, setLoading] = useState(true);

  // Fetch articles from API
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const language = "en"; // You can get this from context if needed
        const params = new URLSearchParams({
          lang: language,
          limit: limit.toString(),
        });

        if (categorySlug) {
          params.append("category", categorySlug);
        }

        const response = await fetch(`/api/public/articles?${params}`);
        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
          // Transform articles to stories
          const transformedStories: Story[] = data.articles.map(
            (article: ArticleResponse) => {
              // Determine type based on categories or default to article
              const isVideo =
                article.categories?.some((cat) =>
                  cat.slug.toLowerCase().includes("video")
                ) || false;

              // Try to find location from categories (excluding video)
              const locationCategory = article.categories?.find(
                (cat) => !cat.slug.toLowerCase().includes("video")
              );
              const location = locationCategory
                ? locationCategory.name
                : "Indonesia"; // Fallback location if not found

              // Format date
              const dateObj = new Date(article.publishedAt);
              const date = dateObj.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });

              // Build URL from slug
              const articleUrl = `/${language}/stories/${article.slug}`;

              return {
                id: article.id,
                imageSrc: article.featuredImage || "",
                imageAlt: article.title || "Story image",
                title: article.title || "",
                location,
                date,
                url: articleUrl,
                type: isVideo ? "video" : "article",
              };
            }
          );

          setStories(transformedStories);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setStories(defaultStories);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [categorySlug, limit]);

  const isBlueBackground = backgroundColor === "blue";
  const textColor = isBlueBackground ? "text-white" : "text-[#010107]";
  const textColorSecondary = isBlueBackground
    ? "text-white/80"
    : "text-[#060726CC]";
  const borderColor = isBlueBackground ? "border-white/40" : "border-gray-300";
  const buttonBg = isBlueBackground ? "bg-white" : "bg-[#010107]";
  const buttonTextColor = isBlueBackground ? "text-[#010107]" : "text-white";

  return (
    <section
      className={cn(
        "relative overflow-hidden pt-16 pb-8 lg:pt-24 sm:pb-14",
        backgroundColor === "blue" ? "bg-[#3C62ED]" : "bg-white",
        className
      )}
    >
      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4">
        {/* Header Section */}
        {(tag || title || description || buttonText) && (
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            {/* Left Side - Tag, Title and Description */}
            <div className="max-w-2xl">
              {tag && (
                <div className="mb-[19px]">
                  <span
                    className={cn(
                      "px-4 py-1.5 border rounded-full text-xs font-normal uppercase tracking-wider",
                      borderColor,
                      textColor
                    )}
                  >
                    {tag}
                  </span>
                </div>
              )}

              {title && (
                <h2
                  className={cn(
                    "text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight mb-3 font-nunito-sans",
                    textColor
                  )}
                >
                  {title}
                </h2>
              )}

              {description && (
                <p
                  className={cn(
                    "text-base font-normal font-work-sans",
                    textColorSecondary
                  )}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Right Side - Button */}
            {buttonText && (
              <div className="flex-shrink-0">
                <Link
                  href={buttonUrl || "#"}
                  className={cn(
                    "inline-flex items-center justify-center px-8 py-5 rounded-sm text-sm font-medium transition-transform hover:scale-105 active:scale-95 border border-[#CADBEA]",
                    buttonBg,
                    buttonTextColor
                  )}
                >
                  {buttonText}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {loading
            ? // Loading Skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 animate-pulse">
                <div className="w-full aspect-[16/10] bg-white/20 rounded-lg" />
                <div className="h-6 w-3/4 bg-white/20 rounded" />
                <div className="h-4 w-1/2 bg-white/20 rounded" />
              </div>
            ))
            : stories.map((story) => (
              <div key={story.id} className="group flex flex-col gap-4">
                {/* Thumbnail Container */}
                <Link href={story.url} className="block relative w-full">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-gray-200">
                    {!hasError(story.id) ? (
                      <Image
                        src={getImageUrl(story.imageSrc)}
                        alt={story.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => handleError(story.id)}
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <span className="text-gray-500 text-sm">
                          No image
                        </span>
                      </div>
                    )}

                    {/* Video Overlay Elements */}
                    {story.type === "video" && (
                      <>
                        {/* Center Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-6 h-6 text-black fill-black ml-1" />
                          </div>
                        </div>

                        {/* Bottom Left Video Badge */}
                        <div className="absolute bottom-4 left-4 z-10">
                          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-md">
                            <Play className="w-3 h-3 text-black fill-black" />
                            <span className="text-[10px] font-bold text-black uppercase tracking-wider leading-none">
                              Video
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <Link href={story.url}>
                    <h3
                      className={cn(
                        "text-xl sm:text-2xl font-bold leading-tight transition-colors hover:text-white/80 font-nunito-sans",
                        textColor
                      )}
                    >
                      {story.title}
                    </h3>
                  </Link>

                  {/* Meta Info */}
                  <div
                    className={cn(
                      "flex items-center text-sm font-medium tracking-wide uppercase font-work-sans",
                      isBlueBackground ? "text-blue-200" : "text-gray-500"
                    )}
                  >
                    <span>{story.date}</span>
                    <span className="mx-2 opacity-60">|</span>
                    <span>{story.location}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
