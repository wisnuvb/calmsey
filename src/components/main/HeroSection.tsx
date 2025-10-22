"use client";

import { useState } from "react";
import { Play, Search } from "lucide-react";
import Image from "next/image";
import { H1, P } from "../ui/typography";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  variant?: "video" | "simple" | "search";
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  posterImage?: string;
  backgroundImage?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
  dataSection?: string;
}

export function HeroSection({
  variant = "video",
  title = "Protecting Oceans, Biodiversity & Tackling Climate Change",
  subtitle = "We want to make a world where local communities, fishers and indigenous peoples can lead in manage, conserve, develop, and adaptation of their environments and resources.",
  videoUrl = "/hero-video.mp4",
  posterImage = "/hero-poster.jpg",
  backgroundImage = "/hero-bg.jpg",
  showSearch = false,
  searchPlaceholder = "Discover articles",
  className,
  dataSection = "hero",
}: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
  };

  // Video Hero Variant (Original)
  if (variant === "video") {
    return (
      <section className="relative bg-white pt-36" data-section={dataSection}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-[748px] w-full mx-auto mb-12 lg:mb-16">
            <H1
              style="h1bold"
              className="text-[#010107] text-[32px] sm:text-[48px] leading-[120%] tracking-[0%] mb-6 mx-auto"
            >
              {title}
            </H1>
            <P style="p1reg" className="text-[#060726CC] max-w-4xl mx-auto">
              {subtitle}
            </P>
          </div>

          <div className="relative w-full">
            <div className="relative aspect-[10/4] rounded-sm overflow-hidden shadow-2xl">
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all pointer-events-none z-10">
                  <button
                    onClick={handlePlayVideo}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group cursor-pointer pointer-events-auto"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#010107] ml-1 group-hover:text-[#010107] fill-current" />
                  </button>
                </div>
              )}
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                poster={posterImage}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Simple Hero with Background Image
  if (variant === "simple") {
    return (
      <section
        className={cn(
          "relative min-h-[400px] lg:min-h-[716px] flex items-center pt-20 bg-black",
          className
        )}
        data-section={dataSection}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <H1 style="h1bold" className="text-white mb-6 max-w-[674px] mx-auto">
            {title}
          </H1>
          <P style="p1reg" className="text-white/90 max-w-4xl mx-auto">
            {subtitle}
          </P>
        </div>
      </section>
    );
  }

  // Search Hero Variant
  if (variant === "search") {
    return (
      <section
        className="relative min-h-[500px] lg:min-h-[600px] flex items-center pt-20"
        data-section={dataSection}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center w-full">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-10">
            {subtitle}
          </p>

          {/* Search Bar */}
          {showSearch && (
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-0 shadow-2xl rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="flex-1 px-6 py-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Search
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    );
  }

  return null;
}
