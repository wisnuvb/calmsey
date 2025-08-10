/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/ImageSection.tsx
"use client";

import React, { useState } from "react";
import { SectionWrapper } from "../SectionRenderer";
import Image from "next/image";

interface ImageSectionProps {
  section: any;
  translation: any;
  layoutSettings: any;
  styleSettings: any;
  contentSettings: any;
  customSettings: any;
  animationSettings: any;
  viewMode: "desktop" | "tablet" | "mobile";
  isEditing: boolean;
  onClick?: () => void;
}

export default function ImageSection({
  section,
  translation,
  layoutSettings,
  styleSettings,
  contentSettings,
  customSettings,
  animationSettings,
  viewMode,
  isEditing,
  onClick,
}: ImageSectionProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageSettings = contentSettings.image || {};
  const generalSettings = contentSettings.general || {};

  // Get image URL from metadata or translation
  const imageUrl =
    translation?.metadata?.imageUrl ||
    section.featuredImage ||
    "/images/placeholder.jpg";
  const imageAlt = translation?.altText || translation?.title || "Image";
  const imageCaption = translation?.caption || "";

  const getAspectRatioClass = () => {
    if (!imageSettings.aspectRatio || imageSettings.aspectRatio === "auto") {
      return "";
    }

    const ratioMap = {
      "1:1": "aspect-square",
      "4:3": "aspect-[4/3]",
      "16:9": "aspect-video",
      "21:9": "aspect-[21/9]",
      custom: imageSettings.customAspectRatio
        ? `aspect-[${imageSettings.customAspectRatio.width}/${imageSettings.customAspectRatio.height}]`
        : "",
    };

    return ratioMap[imageSettings.aspectRatio as keyof typeof ratioMap] || "";
  };

  const getObjectFitClass = () => {
    const fit = imageSettings.objectFit || "cover";
    const fitMap = {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      "scale-down": "object-scale-down",
      none: "object-none",
    };
    return fitMap[fit as keyof typeof fitMap] || "object-cover";
  };

  const handleImageClick = () => {
    if (imageSettings.enableLightbox && !isEditing) {
      setIsLightboxOpen(true);
    } else if (isEditing) {
      onClick?.();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <SectionWrapper
      layoutSettings={layoutSettings}
      styleSettings={styleSettings}
      animationSettings={animationSettings}
      customSettings={customSettings}
      isEditing={isEditing}
      onClick={onClick}
      className="image-section"
    >
      <div className="mx-auto">
        {/* Section Title */}
        {generalSettings.showTitle && translation?.title && (
          <h2
            className={`font-bold mb-6 ${
              viewMode === "mobile"
                ? "text-2xl"
                : viewMode === "tablet"
                ? "text-3xl"
                : "text-4xl"
            }`}
            style={{
              color: styleSettings.textColor,
              textAlign: layoutSettings.alignment || "center",
            }}
          >
            {translation.title}
          </h2>
        )}

        {/* Section Subtitle */}
        {generalSettings.showSubtitle && translation?.subtitle && (
          <p
            className={`mb-6 ${viewMode === "mobile" ? "text-lg" : "text-xl"}`}
            style={{
              color: styleSettings.textColor,
              opacity: 0.8,
              textAlign: layoutSettings.alignment || "center",
            }}
          >
            {translation.subtitle}
          </p>
        )}

        {/* Image Container */}
        <div
          className={`relative ${getAspectRatioClass()} ${
            imageSettings.enableLightbox ? "cursor-pointer" : ""
          } ${isEditing ? "cursor-pointer" : ""} group`}
          onClick={handleImageClick}
        >
          {!imageError && imageUrl && imageUrl !== "/images/placeholder.jpg" ? (
            <>
              {/* Main Image */}
              <img
                src={imageUrl}
                alt={imageAlt}
                className={`w-full h-full ${getObjectFitClass()} rounded-lg transition-transform duration-300 ${
                  imageSettings.enableZoom ? "group-hover:scale-105" : ""
                } ${imageSettings.enableLazyLoading ? "" : ""}`}
                loading={imageSettings.enableLazyLoading ? "lazy" : "eager"}
                onError={handleImageError}
              />

              {/* Hover Overlay for Lightbox */}
              {imageSettings.enableLightbox && !isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                    <p className="text-sm">Click to enlarge</p>
                  </div>
                </div>
              )}

              {/* Editing Overlay */}
              {isEditing && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-10 transition-colors rounded-lg flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Placeholder or Error State */
            <div
              className={`w-full ${
                getAspectRatioClass() || "h-64"
              } bg-gray-200 rounded-lg flex items-center justify-center`}
            >
              <div className="text-center text-gray-500">
                {imageError ? (
                  <>
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p className="text-sm">Failed to load image</p>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm">
                      {isEditing ? "Click to add image" : "No image"}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Image Caption */}
        {imageSettings.showCaption && imageCaption && (
          <div
            className={`mt-4 ${
              imageSettings.captionPosition === "center"
                ? "text-center"
                : imageSettings.captionPosition === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            <p
              className="text-sm text-gray-600 italic"
              style={{ color: styleSettings.textColor, opacity: 0.7 }}
            >
              {imageCaption}
            </p>
          </div>
        )}

        {/* Description */}
        {generalSettings.showDescription && translation?.content && (
          <div
            className={`mt-6 ${
              layoutSettings.alignment === "center"
                ? "text-center"
                : layoutSettings.alignment === "right"
                ? "text-right"
                : "text-left"
            }`}
            style={{ color: styleSettings.textColor }}
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        )}

        {/* Call to Action Button */}
        {generalSettings.showButton && generalSettings.buttonText && (
          <div
            className={`mt-8 ${
              layoutSettings.alignment === "center"
                ? "text-center"
                : layoutSettings.alignment === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            <a
              href={generalSettings.buttonUrl || "#"}
              className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-md transition-colors ${
                generalSettings.buttonStyle?.variant === "primary"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : generalSettings.buttonStyle?.variant === "secondary"
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  : generalSettings.buttonStyle?.variant === "outline"
                  ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {generalSettings.buttonText}
            </a>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && imageUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Lightbox Image */}
            <Image
              src={imageUrl}
              alt={imageAlt}
              className="max-w-full max-h-full object-contain"
              onClick={() => setIsLightboxOpen(false)}
              width={1000}
              height={1000}
            />

            {/* Lightbox Caption */}
            {imageCaption && (
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-sm bg-black bg-opacity-50 rounded px-4 py-2">
                  {imageCaption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
