"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface Activity {
  id: string;
  image: string;
  imageAlt: string;
  date: string;
  location?: string;
  description: string;
  showIcon?: boolean;
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

interface LatestActivitySectionProps {
  title?: string;
  categorySlug?: string;
  filterOptions?: string[];
  itemsPerPage?: number;
  className?: string;
}

export function LatestActivitySection({
  title: propTitle,
  categorySlug: propCategorySlug,
  filterOptions: propFilterOptions,
  itemsPerPage = 9,
  className,
}: LatestActivitySectionProps = {}) {
  const { getValue, getContentValue } = usePageContentHelpers()

  // Helper to get number value from content
  const getContentNumber = (
    key: string,
    propValue?: number,
    defaultValue: number = 0
  ): number => {
    const contentValue = getContentValue(key, "");
    if (contentValue !== "") {
      const parsed = parseInt(contentValue, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    if (propValue !== undefined) {
      return propValue;
    }
    return defaultValue;
  };

  // Get all values with priority: context > props > default
  const title = getValue("latestActivity.title", propTitle, "Latest Activity");
  const categorySlug = getValue(
    "latestActivity.categorySlug",
    propCategorySlug,
    ""
  );
  const filterOptionsString = getValue(
    "latestActivity.filterOptions",
    propFilterOptions?.join(","),
    "Latest,All,2025,2024"
  );
  const filterOptions = filterOptionsString.split(",").map((f) => f.trim());
  const itemsPerPageFromContent = getContentNumber(
    "latestActivity.itemsPerPage",
    itemsPerPage,
    9
  );

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalActivities, setTotalActivities] = useState(0);
  const [currentPageState, setCurrentPageState] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Use itemsPerPage from content or props
  const effectiveItemsPerPage = itemsPerPageFromContent;

  // Fetch articles from API
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const language = "en"; // You can get this from context if needed
        // Fetch more articles to support pagination
        const fetchLimit = effectiveItemsPerPage * 10; // Fetch enough for multiple pages
        const params = new URLSearchParams({
          lang: language,
          limit: fetchLimit.toString(),
        });

        if (categorySlug) {
          params.append("category", categorySlug);
        }

        const response = await fetch(`/api/public/articles?${params}`);
        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
          // Calculate pagination
          const startIndex = (currentPageState - 1) * effectiveItemsPerPage;
          const endIndex = startIndex + effectiveItemsPerPage;
          const paginatedArticles = data.articles.slice(startIndex, endIndex);

          // Transform articles to activities
          const transformedActivities: Activity[] = paginatedArticles.map(
            (article: ArticleResponse) => {
              // Format date
              const publishedDate = article.publishedAt
                ? new Date(article.publishedAt)
                : new Date();
              const formattedDate = publishedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });

              // Get location from categories if available
              const location =
                article.categories && article.categories.length > 0
                  ? article.categories[0].name
                  : undefined;

              return {
                id: article.id,
                image: article.featuredImage || "",
                imageAlt: article.title || "Activity image",
                date: formattedDate,
                location,
                description: article.excerpt || article.title || "",
                showIcon: true,
              };
            }
          );

          setActivities(transformedActivities);
          setTotalActivities(data.articles.length);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [categorySlug, currentPageState, effectiveItemsPerPage]);

  const totalPages = Math.ceil(totalActivities / effectiveItemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPageState(page);
    }
  };

  const handlePrevious = () => {
    if (currentPageState > 1) {
      setCurrentPageState(currentPageState - 1);
    }
  };

  const handleNext = () => {
    if (currentPageState < totalPages) {
      setCurrentPageState(currentPageState + 1);
    }
  };

  return (
    <section
      className={cn("bg-gray-50 py-16 lg:py-24", className)}
      aria-labelledby="latest-activity-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <h2
            id="latest-activity-heading"
            className="text-3xl sm:text-4xl font-bold text-[#010107] font-nunito-sans"
          >
            {title}
          </h2>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Filter activities"
              aria-expanded={showFilterDropdown}
            >
              <span className="text-sm font-medium text-gray-900">
                {selectedFilter}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-500 transition-transform",
                  showFilterDropdown && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Menu */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setShowFilterDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                      selectedFilter === option && "bg-gray-50 font-medium"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: effectiveItemsPerPage }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No activities found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Image with Icon Overlay */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={getImageUrl(activity.image)}
                    alt={activity.imageAlt}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop";
                    }}
                  />
                  {/* Icon Overlay */}
                  {activity.showIcon && (
                    <div className="absolute top-4 right-4 w-10 h-10 bg-[#3C62ED] rounded flex items-center justify-center shadow-lg">
                      <ArrowUpRight
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date and Location */}
                  <div className="text-sm text-gray-600 mb-3 font-work-sans">
                    {activity.date}
                    {activity.location && (
                      <span className="before:content-['|'] before:mx-2">
                        {activity.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-base text-[#060726CC] leading-relaxed font-work-sans">
                    {activity.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Activity Counter */}
          <div className="text-sm text-gray-600 font-work-sans">
            {activities.length} of {totalActivities} Activities
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPageState === 1}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                currentPageState === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPageState <= 3) {
                pageNum = i + 1;
              } else if (currentPageState >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPageState - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    currentPageState === pageNum
                      ? "bg-[#3C62ED] text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  )}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={
                    currentPageState === pageNum ? "page" : undefined
                  }
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={handleNext}
              disabled={currentPageState === totalPages}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                currentPageState === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              )}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
