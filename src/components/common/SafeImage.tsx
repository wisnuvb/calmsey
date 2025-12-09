"use client";

import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  ...props
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${
          className || ""
        }`}
        style={fill ? { width: "100%", height: "100%" } : { width, height }}
      >
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  const imageProps = fill
    ? {
        fill: true,
        className,
        ...props,
      }
    : {
        width,
        height,
        className,
        ...props,
      };

  return (
    <Image
      src={getImageUrl(src)}
      alt={alt}
      {...imageProps}
      onError={() => setImageError(true)}
      unoptimized
    />
  );
}
