"use client";

import Image from "next/image";
import Masonry from "react-masonry-css";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface RelationshipsImage {
  id: string;
  src: string;
  alt: string;
}

interface RelationshipsSectionProps {
  titleLines?: string[];
  description?: string;
  images?: RelationshipsImage[];
  className?: string;
}

const defaultTitleLines = [
  "Building relationships.",
  "Staying connected.",
  "Supporting partners.",
];

const defaultDescription =
  "Our team works to build and maintain strong relationships with local communities, small-scale fishers and fish workers, Indigenous Peoples and their supporting organizations. We stay connected, listen actively, and respond to what partners need—not just with funding, but with the full range of support that makes their work possible.";

const defaultImages: RelationshipsImage[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    alt: "Four individuals engaged in conversation indoors",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    alt: "Person casting fishing net from boat at sunset",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    alt: "Person smiling while holding string of dried fish",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    alt: "Aerial view of coastal area with palm trees and boats",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    alt: "Group of five diverse people smiling outdoors",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    alt: "Sunset over water with fishing boats and person holding fish",
  },
];

export function RelationshipsSection({
  titleLines: propTitleLines,
  description: propDescription,
  images: propImages,
  className,
}: RelationshipsSectionProps = {}) {
  const { getValue, getContentJSON } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const contextTitleLines = getContentJSON<string[]>(
    "relationships.titleLines",
    []
  );
  const titleLines =
    contextTitleLines.length > 0
      ? contextTitleLines
      : propTitleLines || defaultTitleLines;

  const description = getValue(
    "relationships.description",
    propDescription,
    defaultDescription
  );

  const contextImages = getContentJSON<RelationshipsImage[]>(
    "relationships.images",
    []
  );
  const images =
    contextImages.length > 0 ? contextImages : propImages || defaultImages;
  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    640: 2,
    500: 1,
  };

  return (
    <section
      className={cn("bg-white py-16 lg:py-24", className)}
      aria-labelledby="relationships-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Text Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Left Column - Title Lines */}
          <div className="space-y-2">
            {titleLines.map((line, index) => (
              <h2
                key={index}
                id={index === 0 ? "relationships-heading" : undefined}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#010107] font-nunito-sans leading-tight"
              >
                {line}
              </h2>
            ))}
          </div>

          {/* Right Column - Description */}
          <div className="flex items-start">
            <p className="text-base text-[#060726CC] leading-relaxed font-work-sans">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom Section - Masonry Grid with Square Images */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
        // columnClassName="pl-4"
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden group"
            >
              <Image
                src={getImageUrl(image.src)}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop";
                }}
              />
            </div>
          ))}
        </Masonry>
      </div>
    </section>
  );
}
