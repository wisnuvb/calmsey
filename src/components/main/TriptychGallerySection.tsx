"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageContent } from "@/contexts/PageContentContext";

interface TriptychImage {
  id: string;
  src: string;
  alt: string;
  width?: "narrow" | "medium" | "wide";
}

interface TriptychGallerySectionProps {
  images?: TriptychImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  className?: string;
}

const defaultImages: TriptychImage[] = [
  {
    id: "1",
    src: "/assets/slider-2.webp",
    alt: "Coastal fishing village with colorful boats and local people",
    width: "narrow",
  },
  {
    id: "2",
    src: "/assets/slider-1.webp",
    alt: "Underwater scene with school of fish swimming in deep blue water",
    width: "wide",
  },
  {
    id: "3",
    src: "/assets/slider-3.webp",
    alt: "View from inside a boat looking out towards open sea and sky",
    width: "narrow",
  },
];

export function TriptychGallerySection({
  images: propImages,
  autoPlay: propAutoPlay,
  autoPlayInterval: propAutoPlayInterval,
  showNavigation: propShowNavigation,
  className,
}: TriptychGallerySectionProps = {}) {
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

  // Helper to get JSON value from content
  const getContentJSON = <T,>(key: string, defaultValue: T): T => {
    const value = pageContent[key];
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  };

  // Helper to get boolean value from content
  const getContentBoolean = (
    key: string,
    propValue?: boolean,
    defaultValue: boolean = false
  ): boolean => {
    const contentValue = getContentValue(key, "");
    if (contentValue !== "") {
      return contentValue.toLowerCase() === "true";
    }
    if (propValue !== undefined) {
      return propValue;
    }
    return defaultValue;
  };

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
  const images = getContentJSON<TriptychImage[]>(
    "triptych.images",
    propImages || defaultImages
  );
  const autoPlay = getContentBoolean("triptych.autoPlay", propAutoPlay, false);
  const autoPlayInterval = getContentNumber(
    "triptych.autoPlayInterval",
    propAutoPlayInterval,
    5000
  );
  const showNavigation = getContentBoolean(
    "triptych.showNavigation",
    propShowNavigation,
    true
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate how many sets of 3 images we have
  const totalSets = Math.ceil(images.length / 3);
  const currentSet = Math.floor(currentIndex / 3);
  const startIndex = currentSet * 3;
  const visibleImages = images.slice(startIndex, startIndex + 3);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && totalSets > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 3) % images.length);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, images.length, totalSets]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 3;
      return newIndex < 0 ? (totalSets - 1) * 3 : newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 3;
      return newIndex >= images.length ? 0 : newIndex;
    });
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  const getImageSrc = (image: TriptychImage) => {
    if (imageErrors[image.id]) {
      return "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop";
    }
    return image.src;
  };

  const getWidthClass = (width?: "narrow" | "medium" | "wide") => {
    switch (width) {
      case "narrow":
        return "flex-[0_0_14%]";
      case "wide":
        return "flex-[0_0_71%]";
      case "medium":
      default:
        return "flex-[0_0_33.333%]";
    }
  };

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-white max-h-[490px]",
        className
      )}
      aria-label="Triptych image gallery"
    >
      {/* Gallery Container */}
      <div className="relative w-full">
        {/* Images Flex Container */}
        <div className="flex flex-col md:flex-row h-auto md:h-[600px] lg:h-[700px]">
          {visibleImages.map((image, index) => (
            <div
              key={`${image.id}-${currentSet}`}
              className={cn(
                "relative overflow-hidden transition-all duration-500",
                getWidthClass(image.width),
                "h-[400px] md:h-full"
              )}
            >
              <Image
                src={getImageSrc(image)}
                alt={image.alt}
                fill
                className="object-cover transition-opacity duration-500"
                priority={index === 0}
                onError={() => handleImageError(image.id)}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showNavigation && totalSets > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10"
              aria-label="Previous images"
            >
              <ChevronLeft
                className="w-6 h-6 text-gray-900"
                aria-hidden="true"
              />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10"
              aria-label="Next images"
            >
              <ChevronRight
                className="w-6 h-6 text-gray-900"
                aria-hidden="true"
              />
            </button>
          </>
        )}

        {/* Progress Indicator (optional, minimal) */}
        {totalSets > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: totalSets }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 3)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentSet
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to set ${index + 1} of ${totalSets}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
