"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";

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
}

interface AllStoriesListSectionProps {
  title?: string;
  stories?: Story[];
  showLoadMore?: boolean;
  sortOptions?: string[];
  onStoryClick?: (storyId: string) => void;
  className?: string;
}

export const AllStoriesListSection: React.FC<AllStoriesListSectionProps> = ({
  title = "All Stories From Our Partners",
  stories = [
    {
      id: "1",
      title: "Pasibuntuluki - Lines of the Sea",
      location: "Indonesia",
      date: "Sep 4, 2025",
      description:
        "In the waters of southwestern Sulawesi, coastal communities across Langkai and Lanjukang Islands have pioneered thriving conservation systems that demonstrate the power of traditional ecological knowledge. I communities across Langkai and Lanjukang Islands have pioneered thriving",
      thumbnail: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      thumbnailAlt: "Two men in a small boat on calm water",
      type: "video",
      url: "/stories/1",
    },
    {
      id: "2",
      title: "After Anchoring the Boat",
      location: "Thailand",
      date: "Aug 26, 2025",
      description:
        "In Thailand's coastal communities, fisherwomen are the backbone of an entire food system. They process catches, repair nets, manage equipment, and sell at markets, yet Thai law refuses to recognize them as 'fishers.' That legal definition belongs only to those who physically catch aquatic animals—a narrow classification that ex...",
      thumbnail: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      thumbnailAlt: "Traditional boats on water",
      type: "video",
      url: "/stories/2",
    },
    {
      id: "3",
      title:
        "Towards Tenure Reform for Indigenous Territories and Local Community Managed Areas in Eastern Indonesia",
      location: "Indonesia",
      date: "Jul 16, 2025",
      description:
        "Across Indonesia's archipelago, coastal communities have pioneered sophisticated marine governance rooted in traditional ecological knowledge, yet their proven stewardship faces significant legal gaps, lacks enforcement capacity, and confronts mounting external threats. In the Padaido Islands, the Padaidori people manage la...",
      thumbnail: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      thumbnailAlt: "Man in yellow shirt holding a stick",
      type: "video",
      url: "/stories/3",
    },
    {
      id: "4",
      title: "A new breath for the women of Néma Bah",
      location: "Senegal",
      date: "Aug 26, 2025",
      description:
        "Women in Senegal – as in many countries around the world – face significant barriers to land access and rights. Through a longstanding partnership with CAOPA, the women of Néma Bah have secured a title and deed to the land and waters on which they work. With this security, investing in better tools, skills and infrastructu...",
      thumbnail: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      thumbnailAlt: "Woman with pink headscarf in boat",
      type: "video",
      url: "/stories/4",
    },
  ],
  showLoadMore = true,
  sortOptions = ["Latest", "Oldest", "A-Z", "Z-A"],
  onStoryClick,
  className,
}) => {
  const [sortBy, setSortBy] = useState("Latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [displayedStories, setDisplayedStories] = useState(4);

  const handleLoadMore = () => {
    setDisplayedStories((prev) => prev + 4);
  };

  const handleStoryClick = (storyId: string) => {
    if (onStoryClick) {
      onStoryClick(storyId);
    }
  };

  return (
    <section className={cn("py-20 bg-white", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
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
                  setShowFilterDropdown(false);
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
                setShowFilterDropdown(!showFilterDropdown);
                setShowSortDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Stories List */}
        <div className="space-y-8">
          {stories.slice(0, displayedStories).map((story) => (
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
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && displayedStories < stories.length && (
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
