"use client";

import { useState } from "react";
import { Play, Search } from "lucide-react";
import Image from "next/image";
import { H1, P } from "../ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContent } from "@/contexts/PageContentContext";

interface HeroSectionProps {
  variant?: "video" | "simple" | "search" | "overlay-bottom";
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  posterImage?: string;
  backgroundImage?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
  dataSection?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  variant: propVariant = "video",
  title: propTitle,
  subtitle: propSubtitle,
  videoUrl: propVideoUrl,
  posterImage: propPosterImage,
  backgroundImage: propBackgroundImage,
  showSearch: propShowSearch,
  searchPlaceholder: propSearchPlaceholder,
  className,
  dataSection = "hero",
}: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Try to get content from context, fallback to empty object if not available
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

  // Helper to check if URL is valid
  const isValidUrl = (url: string | null | undefined): boolean => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return false;
    }
    try {
      if (
        url.startsWith("/") ||
        url.startsWith("http://") ||
        url.startsWith("https://")
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
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
  const variant =
    (getValue("hero.variant", propVariant) as
      | "video"
      | "simple"
      | "search"
      | "overlay-bottom") || propVariant;

  const title = getValue("hero.title", propTitle, "");
  const subtitle = getValue("hero.subtitle", propSubtitle, "");

  const videoUrlRaw = getValue("hero.videoUrl", propVideoUrl, "");
  const posterImageRaw = getValue("hero.posterImage", propPosterImage, "");
  const backgroundImageRaw = getValue(
    "hero.backgroundImage",
    propBackgroundImage,
    ""
  );

  // Ensure URLs are valid or use defaults
  const videoUrl = isValidUrl(videoUrlRaw) ? videoUrlRaw : "/hero-video.mp4";
  const posterImage = isValidUrl(posterImageRaw)
    ? posterImageRaw
    : "/hero-poster.jpg";
  // const backgroundImage = isValidUrl(backgroundImageRaw)
  //   ? backgroundImageRaw
  //   : "/hero-bg.jpg";

  const showSearch =
    getContentValue("hero.showSearch", "") === "true" ||
    propShowSearch ||
    false;

  const searchPlaceholder = getValue(
    "hero.searchPlaceholder",
    propSearchPlaceholder,
    "Discover articles"
  );

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Overlay Bottom Hero Variant (New)
  if (variant === "overlay-bottom") {
    return (
      <section
        className={cn(
          "relative min-h-[600px] lg:min-h-[800px] flex flex-col",
          className
        )}
        data-section={dataSection}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {backgroundImageRaw ? (
            <Image
              src={getImageUrl(backgroundImageRaw)}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-900" />
          )}
          {/* Thin Overlay for Menu Visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        </div>

        {/* Blue Overlay Section at Bottom */}
        <div className="relative z-10 mt-auto bg-[#3C62ED] py-[44px]">
          <div className="container mx-auto px-4 sm:px-4 space-y-5">
            <H1
              style="h1bold"
              className="text-white text-3xl sm:text-4xl lg:text-5xl leading-tight"
            >
              {title}
            </H1>
            {subtitle && (
              <P
                style="p1reg"
                className="text-white text-base leading-relaxed font-normal font-work-sans"
              >
                {subtitle}
              </P>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Video Hero Variant (Original)
  if (variant === "video") {
    return (
      <section className="relative bg-white pt-36" data-section={dataSection}>
        <div className="container mx-auto px-4">
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
          {backgroundImageRaw ? (
            <Image
              src={getImageUrl(backgroundImageRaw)}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
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
          {backgroundImageRaw ? (
            <Image
              src={getImageUrl(backgroundImageRaw)}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-900" />
          )}
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
