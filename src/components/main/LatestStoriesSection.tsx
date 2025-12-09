"use client";

import React from "react";
import Image from "next/image";
import { H3, H5, P } from "@/components/ui/typography";
import { Play, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

interface Story {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  caption?: string;
}

interface LatestStoriesSectionProps {
  title?: string;
  stories?: Story[];
  showViewAll?: boolean;
  className?: string;
}

export const LatestStoriesSection: React.FC<LatestStoriesSectionProps> = ({
  title = "Latest Stories",
  stories = [
    {
      id: "1",
      title: "After Anchoring the Boat",
      location: "Thailand",
      date: "Aug 26, 2025",
      description:
        "In Thailand's coastal communities, fisherwomen are the backbone of an entire food system. They process catches, repair nets, manage eq...",
      thumbnail: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      thumbnailAlt: "Two small boats on water with wooden structures",
      caption: "They just deliver the fish and that's it.",
    },
    {
      id: "2",
      title: "From the forest to the sea: uniting for tenure rights",
      location: "Indonesia",
      date: "Jul 16, 2025",
      description:
        "Tenure Facility is excited to announce its partnership with Turning Tides, a newly established initiative dedicated to protecting...",
      thumbnail: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      thumbnailAlt: "Woman with curly hair holding plant materials",
    },
    {
      id: "3",
      title: "A new breath for the women of Néma Bah",
      location: "Senegal",
      date: "Aug 26, 2025",
      description:
        "Women in Senegal - as in many countries around the world - face significant barriers to land access and rights. Through a longstandin...",
      thumbnail: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      thumbnailAlt: "Woman in pink headscarf in boat with mangrove background",
      caption: "We initiated two training sessions",
    },
  ],
  showViewAll = true,
  className,
}) => {
  const router = useRouter();

  const handleStoryClick = (storyId: string) => {
    router.push(`/stories/${storyId}`);
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
              onClick={() => router.push("/stories")}
            >
              View All
            </button>
          )}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group"
              onClick={() => handleStoryClick(story.id)}
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
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-gray-900 fill-current ml-1" />
                  </div>
                </div>

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
                  className="text-[#06072680] mb-4 leading-relaxed"
                >
                  {story.description}
                </P>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-[#06072680]">
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
      </div>
    </section>
  );
};
