"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContent } from "@/contexts/PageContentContext";
import { useImageError } from "@/hooks/useImageError";

interface Story {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description?: string;
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
    description:
      "What's remarkable is that this forum was born from the people's own initiative",
    url: "#",
    type: "video",
  },
  {
    id: "2",
    imageSrc:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
    imageAlt: "After Anchoring the Boat",
    title: "After Anchoring the Boat",
    description: "They just deliver the fish and that's it.",
    url: "#",
    type: "video",
  },
  {
    id: "3",
    imageSrc:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
    imageAlt: "Towards Tenure Reform for Indigenous Te...",
    title: "Towards Tenure Reform for Indigenous Te...",
    description: "",
    url: "#",
    type: "article",
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

  // Try to get content from context
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

  // Helper to get value from content
  const getContentValue = (key: string, defaultValue: string = ""): string => {
    return pageContent[key] || defaultValue;
  };

  // Helper function to get value with priority: context > props > default
  const getValue = (
    contentKey: string,
    propValue?: string,
    defaultValue: string = ""
  ): string => {
    const contentValue = getContentValue(contentKey, "");
    if (contentValue && contentValue.trim() !== "") {
      return contentValue;
    }
    if (propValue && propValue.trim() !== "") {
      return propValue;
    }
    return defaultValue;
  };

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

              // Build URL from slug
              const articleUrl = `/${language}/articles/${article.slug}`;

              return {
                id: article.id,
                imageSrc: article.featuredImage || "",
                imageAlt: article.title || "Story image",
                title: article.title || "",
                description: article.excerpt || "",
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

  const mainStory = stories[0];
  const sideStories = stories.slice(1);

  const isBlueBackground = backgroundColor === "blue";
  const textColor = isBlueBackground ? "text-white" : "text-[#010107]";
  const textColorSecondary = isBlueBackground
    ? "text-white/90"
    : "text-[#060726CC]";
  const borderColor = isBlueBackground ? "border-white/40" : "border-gray-300";
  const buttonBg = isBlueBackground
    ? "bg-white"
    : "bg-white border border-gray-900";
  const buttonTextColor = isBlueBackground ? "text-gray-900" : "text-gray-900";

  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 lg:py-24",
        backgroundColor === "blue" ? "bg-[#3C62ED]" : "bg-white",
        className
      )}
    >
      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Only show if any header content exists */}
        {(tag || title || description || buttonText) && (
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
            {/* Left Side - Tag, Title and Description */}
            {(tag || title || description) && (
              <div className={cn("space-y-[15px]", textColor)}>
                {/* Tag */}
                {tag && (
                  <div className="inline-block">
                    <span
                      className={cn(
                        "px-4 py-2 border rounded-full text-sm font-medium uppercase tracking-wider",
                        borderColor,
                        textColor
                      )}
                    >
                      {tag}
                    </span>
                  </div>
                )}

                {/* Title */}
                {title && (
                  <h2
                    className={cn(
                      "text-3xl sm:text-[38px] font-nunito-sans font-bold leading-tight",
                      textColor
                    )}
                  >
                    {title}
                  </h2>
                )}

                {/* Description */}
                {description && (
                  <p
                    className={cn(
                      "text-lg lg:text-xl max-w-lg",
                      textColorSecondary
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Right Side - All Stories Button */}
            {buttonText && (
              <div className="flex items-start lg:pt-[60px]">
                <Link
                  href={buttonUrl || "#"}
                  className={cn(
                    "inline-block px-6 py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium",
                    buttonBg,
                    buttonTextColor,
                    isBlueBackground
                      ? "hover:bg-gray-100 focus:ring-white"
                      : "border border-gray-900 hover:bg-gray-50 focus:ring-gray-900"
                  )}
                >
                  {buttonText}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Stories Gallery Section */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Loading skeleton for main story */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-lg h-[400px] lg:h-[500px] bg-gray-200 animate-pulse" />
            {/* Loading skeleton for side stories */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-[400px] lg:h-[500px]">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-lg flex-1 min-h-0 bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No stories found
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large Story Thumbnail - Left */}
            {mainStory && (
              <div className="lg:col-span-2 relative group overflow-hidden rounded-lg h-[400px] lg:h-[500px]">
                {!hasError(mainStory.id) ? (
                  <Image
                    src={getImageUrl(mainStory.imageSrc)}
                    alt={mainStory.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleError(mainStory.id)}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}

                {/* Play Button Overlay - Only for Video */}
                {mainStory.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 pointer-events-none z-10">
                    <button
                      className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 cursor-pointer pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`Play video: ${mainStory.title}`}
                    >
                      <Play
                        className="w-8 h-8 text-gray-900 fill-current ml-1"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}

                {/* Dark Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent p-6 lg:p-8 z-20">
                  {mainStory.title && (
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 font-nunito-sans">
                      {mainStory.title}
                    </h3>
                  )}
                  {mainStory.description && (
                    <p className="text-base lg:text-lg text-white/90 mb-4 font-work-sans">
                      {mainStory.description}
                    </p>
                  )}
                  <Link
                    href={mainStory.url}
                    className="inline-block px-6 py-2 border border-white text-white text-sm font-semibold rounded-md hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors duration-300"
                    aria-label={`${
                      mainStory.type === "video" ? "Watch" : "Read"
                    }: ${mainStory.title}`}
                  >
                    {mainStory.type === "video" ? "Watch Now" : "Read More"}
                  </Link>
                </div>
              </div>
            )}

            {/* Small Story Thumbnails - Right */}
            {sideStories.length > 0 && (
              <div
                className="lg:col-span-1 flex flex-col gap-6 h-[400px] lg:h-[500px]"
                role="list"
                aria-label="Additional partner stories"
              >
                {sideStories.map((story) => (
                  <div
                    key={story.id}
                    className="relative group overflow-hidden rounded-lg flex-1 min-h-0"
                    role="listitem"
                  >
                    {!hasError(story.id) ? (
                      <Image
                        src={getImageUrl(story.imageSrc)}
                        alt={story.imageAlt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => handleError(story.id)}
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}

                    {/* Play Button Overlay - Only for Video */}
                    {story.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 pointer-events-none z-10">
                        <button
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 cursor-pointer pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                          aria-label={`Play video: ${story.title}`}
                        >
                          <Play
                            className="w-5 h-5 text-gray-900 fill-current ml-0.5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    )}

                    {/* Dark Overlay at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent p-4 lg:p-5 z-20">
                      {story.title && (
                        <h3 className="text-base lg:text-lg font-bold text-white mb-1 font-nunito-sans">
                          {story.title}
                        </h3>
                      )}
                      {story.description && (
                        <p className="text-sm lg:text-base text-white/90 font-work-sans">
                          {story.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
