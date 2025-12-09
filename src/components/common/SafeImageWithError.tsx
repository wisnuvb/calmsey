"use client";

import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/lib/utils";

interface SafeImageWithErrorProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  imageId?: string; // Unique ID for tracking errors
  placeholder?: React.ReactNode;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
}

export function SafeImageWithError({
  src,
  alt,
  width,
  height,
  fill,
  className,
  imageId,
  placeholder,
  objectFit = "cover",
  priority,
}: SafeImageWithErrorProps) {
  const [imageError, setImageError] = useState(false);
  const uniqueId = imageId || src;

  if (imageError || !src) {
    return (
      <>
        {placeholder || (
          <div
            className={`bg-gray-200 flex items-center justify-center ${
              className || ""
            }`}
            style={fill ? { width: "100%", height: "100%" } : { width, height }}
          >
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </>
    );
  }

  const imageProps = fill
    ? {
        fill: true,
        className: `${className || ""} object-${objectFit}`,
      }
    : {
        width,
        height,
        className: `${className || ""} object-${objectFit}`,
      };

  return (
    <Image
      src={getImageUrl(src)}
      alt={alt}
      {...imageProps}
      onError={() => setImageError(true)}
      unoptimized
      priority={priority}
    />
  );
}
