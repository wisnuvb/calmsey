"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { H3, P } from "../ui/typography";
import {
  Play,
  MapPin,
  Calendar,
  ChevronDown,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface Story {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  type: "video" | "article";
  url: string;
  categorySlug?: string;
}

interface AllStoriesListSectionProps {
  title?: string;
  stories?: Story[];
  showLoadMore?: boolean;
  sortOptions?: string[];
  onStoryClick?: (storyId: string) => void;
  className?: string;
  categories?: { slug: string; name: string }[];
  defaultCategory?: string;
}

export const AllStoriesListSection: React.FC<AllStoriesListSectionProps> = ({
  title: propTitle,
  stories: propStories = [],
  showLoadMore: propShowLoadMore,
  sortOptions: propSortOptions,
  onStoryClick,
  className,
  // categories: propCategories = [], // Not used - we filter by year instead
  // defaultCategory: propDefaultCategory, // Not used - we filter by year instead
}) => {
  const { getValue, getContentValue } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const title = getValue(
    "allStories.title",
    propTitle,
    "All Stories From Our Partners"
  );

  const showLoadMore = (() => {
    const contentValue = getContentValue("allStories.showLoadMore", "");
    if (contentValue !== "") {
      return contentValue === "true";
    }
    if (propShowLoadMore !== undefined) {
      return propShowLoadMore;
    }
    return true;
  })();

  const sortOptions = (() => {
    // Sort options are typically static, but we can allow override via props
    if (propSortOptions && propSortOptions.length > 0) {
      return propSortOptions;
    }
    return ["Latest", "Oldest", "A-Z", "Z-A"];
  })();

  // Note: Categories are no longer used for filtering, we use year filter instead
  // Keeping the code commented for potential future use
  // const defaultCategory = getValue(
  //   "allStories.defaultCategory",
  //   propDefaultCategory,
  //   ""
  // );

  // const categories = (() => {
  //   if (propCategories && propCategories.length > 0) {
  //     return propCategories;
  //   }
  //   const filterCategories = getContentJSON<Array<{ categorySlug: string }>>(
  //     "allStories.filterCategories",
  //     []
  //   );
  //   if (filterCategories.length > 0) {
  //     return filterCategories.map((item) => ({
  //       slug: item.categorySlug,
  //       name: item.categorySlug,
  //     }));
  //   }
  //   return [];
  // })();

  // Use stories from props (fetched from database)
  const stories = useMemo(() => propStories || [], [propStories]);
  // Get default sort order from content
  const defaultSortOrder = getValue(
    "allStories.sortOrder",
    undefined,
    "Latest"
  );
  const [sortBy, setSortBy] = useState(defaultSortOrder);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [displayedStories, setDisplayedStories] = useState(4);

  // Extract available years from stories
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    stories.forEach((story) => {
      const date = new Date(story.date);
      if (!isNaN(date.getTime())) {
        years.add(date.getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending (newest first)
  }, [stories]);

  // Filter and sort stories
  const processedStories = useMemo(() => {
    let filtered = [...stories];

    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter((story) => {
        const date = new Date(story.date);
        if (isNaN(date.getTime())) return false;
        return date.getFullYear() === selectedYear;
      });
    }

    // Sort stories
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Latest":
          // Sort by date descending (newest first)
          // Parse date string (format: "MMM dd, yyyy" like "Jan 23, 2024")
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          // If parsing fails, fallback to 0
          const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
          const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
          return timeB - timeA;
        case "Oldest":
          // Sort by date ascending (oldest first)
          const dateAOld = new Date(a.date);
          const dateBOld = new Date(b.date);
          const timeAOld = isNaN(dateAOld.getTime()) ? 0 : dateAOld.getTime();
          const timeBOld = isNaN(dateBOld.getTime()) ? 0 : dateBOld.getTime();
          return timeAOld - timeBOld;
        case "A-Z":
          // Sort by title ascending
          return a.title.localeCompare(b.title);
        case "Z-A":
          // Sort by title descending
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [stories, sortBy, selectedYear]);

  const handleLoadMore = () => {
    setDisplayedStories((prev) => prev + 4);
  };

  const handleStoryClick = (storyId: string) => {
    if (onStoryClick) {
      onStoryClick(storyId);
    }
  };

  const handleYearFilter = (year: number | null) => {
    setSelectedYear(year);
    setShowFilterModal(false);
    setDisplayedStories(4); // Reset displayed stories when filter changes
  };

  const clearFilter = () => {
    setSelectedYear(null);
    setDisplayedStories(4);
  };

  return (
    <section className={cn("py-20 bg-white", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-[#C3D7E8] pb-8">
          <H3
            style="h3bold"
            className="text-[#010107] font-[var(--font-nunito)] leading-[1.2]"
          >
            {title}
          </H3>

          {/* Sort and Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowFilterModal(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <span>{sortBy}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform",
                    showSortDropdown && "rotate-180"
                  )}
                />
              </button>

              {showSortDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                          sortBy === option
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => {
                setShowFilterModal(true);
                setShowSortDropdown(false);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 bg-white border rounded-md hover:bg-gray-50 transition-colors text-sm font-medium",
                selectedYear
                  ? "border-blue-500 text-blue-600"
                  : "border-gray-300 text-gray-700"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>
                {selectedYear ? `Year: ${selectedYear}` : "Filter by Year"}
              </span>
              {selectedYear && (
                <X
                  className="w-3 h-3 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilter();
                  }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setShowFilterModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Filter by Year
                </h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Select a year to filter stories:
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <button
                  onClick={() => handleYearFilter(null)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg border-2 transition-colors",
                    !selectedYear
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <span className="font-medium">All Years</span>
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearFilter(year)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border-2 transition-colors",
                      selectedYear === year
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    <span className="font-medium">{year}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stories List */}
        <div className="space-y-8">
          {processedStories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No stories found{selectedYear ? ` in ${selectedYear}` : ""}.
              </p>
            </div>
          ) : (
            processedStories.slice(0, displayedStories).map((story) => (
              <div
                key={story.id}
                className="flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
              >
                {/* Video/Image Thumbnail */}
                <div className="sm:w-[40%] flex-shrink-0">
                  <div className="relative aspect-video bg-gray-200 overflow-hidden group">
                    <Image
                      src={getImageUrl(story.thumbnail)}
                      alt={story.thumbnailAlt}
                      fill
                      className="object-cover"
                    />

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                    {/* Video Badge - Only for Video Type */}
                    {story.type === "video" && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Video</span>
                      </div>
                    )}

                    {/* Play Button Overlay - Only for Video */}
                    {story.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-black bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer">
                          <Play className="w-6 h-6 text-white fill-current ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center space-y-4 py-4">
                  {/* Title */}
                  <H3
                    style="h3bold"
                    className="text-[#010107] font-[var(--font-nunito)] leading-[1.2]"
                  >
                    {story.title}
                  </H3>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-[#010107]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{story.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{story.date}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <P
                    style="p1reg"
                    className="text-[#06072680] leading-[150%] tracking-[0%] text-base line-clamp-3"
                  >
                    {story.description}
                  </P>

                  {/* See Story Button */}
                  <Link
                    href={story.url}
                    onClick={() => handleStoryClick(story.id)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#3C62ED] text-white rounded-md hover:bg-[#2d4fd6] transition-colors duration-300 font-medium w-fit"
                  >
                    <span>See Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {showLoadMore && displayedStories < processedStories.length && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-300 font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
