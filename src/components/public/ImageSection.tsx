/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React from "react";

interface ImageSectionProps {
  section: any;
  translation: any;
  style?: React.CSSProperties;
}

export default function ImageSection({
  section,
  translation,
  style,
}: ImageSectionProps) {
  const metadata = translation?.metadata || {};
  const layout = section.layoutSettings || {};

  const getImageSize = () => {
    switch (metadata.size || "medium") {
      case "small":
        return "max-w-sm";
      case "medium":
        return "max-w-2xl";
      case "large":
        return "max-w-4xl";
      case "full":
        return "w-full";
      default:
        return "max-w-2xl";
    }
  };

  const getAlignment = () => {
    switch (metadata.alignment || layout.alignment || "center") {
      case "left":
        return "mx-0";
      case "right":
        return "ml-auto mr-0";
      case "center":
        return "mx-auto";
      default:
        return "mx-auto";
    }
  };

  return (
    <section className="py-8" style={style}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {metadata.imageUrl ? (
          <div className={`${getImageSize()} ${getAlignment()}`}>
            <Image
              src={metadata.imageUrl}
              alt={metadata.alt || translation?.title || "Image"}
              className="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
              width={1000}
              height={1000}
            />

            {(translation?.title || metadata.caption) && (
              <div className="text-center mt-6">
                {translation?.title && (
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {translation.title}
                  </h3>
                )}
                {metadata.caption && (
                  <p className="text-gray-600">{metadata.caption}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <p>No image selected</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
