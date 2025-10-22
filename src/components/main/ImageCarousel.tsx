"use client";

import React from "react";
import Image from "next/image";

interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageCarouselProps {
  images?: CarouselImage[];
  showTitles?: boolean;
  showDescriptions?: boolean;
  aspectRatio?: "square" | "landscape" | "portrait";
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [
    {
      id: "1",
      src: "/assets/carousel/coastal-activity.jpg",
      alt: "Coastal community activities with fishing boats and local people",
      title: "Community Engagement",
      description: "Local communities working together in coastal areas",
    },
    {
      id: "2",
      src: "/assets/carousel/underwater-reef.jpg",
      alt: "Underwater coral reef with schools of fish",
      title: "Marine Conservation",
      description: "Thriving coral reef ecosystem with diverse marine life",
    },
    {
      id: "3",
      src: "/assets/carousel/boat-perspective.jpg",
      alt: "View from fishing boat showing ocean horizon",
      title: "Ocean Perspective",
      description: "Sustainable fishing practices from boat perspective",
    },
  ],
  showTitles = false,
  showDescriptions = false,
  aspectRatio = "landscape",
}) => {
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "portrait":
        return "aspect-[3/4]";
      case "landscape":
      default:
        return "aspect-[4/3]";
    }
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              {/* Image Container */}
              <div
                className={`relative overflow-hidden rounded-lg bg-gray-200 ${getAspectRatioClass()}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center`;
                  }}
                />

                {/* Overlay for hover effect */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>

              {/* Optional Title and Description */}
              {(showTitles || showDescriptions) && (
                <div className="mt-4 text-center">
                  {showTitles && image.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {image.title}
                    </h3>
                  )}
                  {showDescriptions && image.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {image.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
