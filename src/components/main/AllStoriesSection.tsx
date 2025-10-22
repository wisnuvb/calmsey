"use client";

import React, { useState } from "react";
import Image from "next/image";
import { H2, H3, H5, P } from "../ui/typography";
import { Play, MapPin, Calendar, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface Story {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  duration: string;
  caption?: string;
  watchFullUrl: string;
  watchTrailerUrl: string;
}

interface AllStoriesSectionProps {
  title?: string;
  stories?: Story[];
  showLoadMore?: boolean;
}

export const AllStoriesSection: React.FC<AllStoriesSectionProps> = ({
  title = "All Stories From Our Partners",
  stories = [
    {
      id: "1",
      title: "Pasibuntuluki - Lines of the Sea",
      location: "Indonesia",
      date: "Sep 4, 2025",
      description:
        "Coastal communities in Sulawesi are pioneering conservation systems that protect marine resources while ensuring sustainable livelihoods for local fishers...",
      thumbnail: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      thumbnailAlt:
        "Group of men gathered around a large piece of paper on a table discussing",
      duration: "13:55",
      caption:
        "What's remarkable is that this forum was born from the people's own initiative",
      watchFullUrl: "#",
      watchTrailerUrl: "#",
    },
    {
      id: "2",
      title: "After Anchoring the Boat",
      location: "Thailand",
      date: "Aug 26, 2025",
      description:
        "Fisherwomen are the backbone of the food system, yet they face significant challenges in gaining legal recognition for their traditional fishing rights...",
      thumbnail: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      thumbnailAlt:
        "Two small colorful boats on water under a rustic wooden structure",
      duration: "08:42",
      caption: "They just deliver the fish and that's it",
      watchFullUrl: "#",
      watchTrailerUrl: "#",
    },
    {
      id: "3",
      title:
        "Towards Tenure Reform for Indigenous Territories and Local Community Mana...",
      location: "Indonesia",
      date: "Jul 16, 2025",
      description:
        "Coastal communities in Indonesia are pioneering marine governance approaches, but they face legal gaps that prevent full recognition of their tenure rights...",
      thumbnail: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      thumbnailAlt:
        "Woman with short dark curly hair wearing light green top holding plant materials",
      duration: "15:30",
      watchFullUrl: "#",
      watchTrailerUrl: "#",
    },
    {
      id: "4",
      title: "A new breath for the women of Néma Bah",
      location: "Senegal",
      date: "Aug 26, 2025",
      description:
        "Women in Senegal face significant barriers to land access and rights, but a new partnership with CAOPA is creating opportunities for change...",
      thumbnail: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      thumbnailAlt:
        "Woman wearing vibrant pink headscarf sitting in small boat with mangrove trees in background",
      duration: "12:18",
      caption: "We initiated two training sessions",
      watchFullUrl: "#",
      watchTrailerUrl: "#",
    },
  ],
  showLoadMore = true,
}) => {
  const router = useRouter();

  const [sortBy, setSortBy] = useState("Latest");
  const [displayedStories, setDisplayedStories] = useState(4);

  const handleLoadMore = () => {
    setDisplayedStories((prev) => prev + 4);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <H3
            style="h3bold"
            className="text-[#010107] mb-4 sm:mb-0 font-[var(--font-nunito)] leading-[1.2]"
          >
            {title}
          </H3>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Stories List */}
        <div className="space-y-8">
          {stories.slice(0, displayedStories).map((story) => (
            <div
              key={story.id}
              className="grid grid-cols-11 gap-8 sm:gap-16 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Video Thumbnail */}
              <div className="col-span-11 sm:col-span-5">
                <div className="relative aspect-[6/4] bg-gray-200 overflow-hidden group">
                  <Image
                    src={story.thumbnail}
                    alt={story.thumbnailAlt}
                    fill
                    className="object-cover"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="w-16 h-16 bg-black bg-opacity-80 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {story.duration}
                  </div>

                  {/* Caption Overlay */}
                  {/* {story.caption && (
                    <div className="absolute bottom-2 right-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                      {story.caption}
                    </div>
                  )} */}
                </div>
              </div>

              {/* Content */}
              <div className="col-span-11 sm:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-8">
                <H3
                  style="h3bold"
                  className="text-[#010107] mb-3 font-[var(--font-nunito)] leading-[1.2]"
                >
                  {story.title}
                </H3>

                <div className="space-y-4">
                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-base text-[#010107]">
                    <div className="flex items-center gap-[6px]">
                      <MapPin className="w-4 h-4" />
                      <span>{story.location}</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <Calendar className="w-4 h-4" />
                      <span>{story.date}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <P
                    style="p1reg"
                    className="text-[#06072680] leading-[150%] tracking-[0%] text-base"
                  >
                    {story.description}
                  </P>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 text-base font-normal">
                  <button
                    onClick={() => router.push(`/stories/${story.id}`)}
                    className="inline-flex items-center justify-center px-8 py-5 bg-[#06020C] text-white rounded-md hover:bg-[#08070a] transition-colors duration-300 font-medium"
                  >
                    Watch Full Story
                  </button>
                  <button className="inline-flex items-center justify-center px-8 py-5 border border-[#CADBEA] text-[#060726] rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && displayedStories < stories.length && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 border border-gray-300 text-black rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
