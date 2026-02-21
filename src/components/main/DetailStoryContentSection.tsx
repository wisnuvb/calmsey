"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Link as LinkIcon,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  Forward,
} from "lucide-react";
import { H2, H3, H4, P } from "../ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import { shareContent } from "@/lib/share-utils";
import Image from "next/image";

interface PartnerOrganization {
  name: string;
  logo: string;
  fullName: string;
}

interface Photo {
  id: string;
  src: string;
  alt: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  url: string;
}

interface DetailStoryContentSectionProps {
  partnerOrganization?: PartnerOrganization | null;
  country?: string;
  description: string;
  photos?: Photo[];
  relatedArticles?: RelatedArticle[];
  className?: string;
  videoUrl?: string;
}

export function DetailStoryContentSection({
  partnerOrganization,
  country,
  description,
  photos,
  relatedArticles,
  className,
}: DetailStoryContentSectionProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  // Default values
  const photosList = photos || [];
  const relatedArticlesList = relatedArticles || [];

  // Share handler
  const handleShare = async () => {
    const success = await shareContent(
      {
        title: document.title,
        text: description.substring(0, 200) + "...",
        url: window.location.href,
      },
      {
        onSuccess: () => {
          setShowCopyNotification(true);
          setTimeout(() => setShowCopyNotification(false), 2000);
        },
        onError: (error) => {
          console.error("Share failed:", error);
        },
      },
    );

    // Show notification even if share was successful via native share
    if (success) {
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    }
  };

  // Handle keyboard navigation in gallery
  useEffect(() => {
    if (!isGalleryOpen || photosList.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsGalleryOpen(false);
      } else if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) =>
          prev > 0 ? prev - 1 : photosList.length - 1,
        );
      } else if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) =>
          prev < photosList.length - 1 ? prev + 1 : 0,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, photosList.length]);

  const openGallery = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const goToPrevious = () => {
    setSelectedPhotoIndex((prev) =>
      prev > 0 ? prev - 1 : photosList.length - 1,
    );
  };

  const goToNext = () => {
    setSelectedPhotoIndex((prev) =>
      prev < photosList.length - 1 ? prev + 1 : 0,
    );
  };

  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Sidebar */}
          {(partnerOrganization || country) && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Partner Organization */}
                {partnerOrganization &&
                  (partnerOrganization.logo ||
                    partnerOrganization.name ||
                    country) && (
                    <div className="bg-gray-50 border border-[#D7E4EF] p-6 sm:p-11 rounded-lg">
                      <div className="space-y-3">
                        <H3
                          style="h5bold"
                          className="text-[#010107] font-semibold text-xs leading-[150%] tracking-normal uppercase"
                        >
                          Partner Organization
                        </H3>
                        {partnerOrganization.logo && (
                          <Image
                            src={getImageUrl(partnerOrganization.logo)}
                            alt={
                              partnerOrganization.name || "Partner Organization"
                            }
                            width={128}
                            height={128}
                            className="rounded"
                          />
                        )}
                        <p className="font-work-sans font-normal text-base text-[#060726CC]">
                          {partnerOrganization.name}
                        </p>
                      </div>

                      {country && (
                        <>
                          <div className="border-b border-[#C3D7E8] my-11" />

                          <H3
                            style="h5bold"
                            className="text-[#010107] mb-3 tracking-wide text-base font-normal font-work-sans"
                          >
                            Country
                          </H3>
                          <div className="flex items-center space-x-2 text-[#010107]">
                            <MapPin className="w-5 h-5" />
                            <span className="font-work-sans text-xl font-bold leading-[1.4]">
                              {country}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                {/* Country only (if no partner organization) */}
                {!partnerOrganization && country && (
                  <div className="bg-gray-50 border border-[#D7E4EF] p-6 sm:p-11 rounded-lg">
                    <H3
                      style="h5bold"
                      className="text-[#010107] mb-3 tracking-wide text-base font-normal font-work-sans"
                    >
                      Country
                    </H3>
                    <div className="flex items-center space-x-2 text-[#010107]">
                      <MapPin className="w-5 h-5" />
                      <span className="font-work-sans text-xl font-bold leading-[1.4]">
                        {country}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3">
                  {/* {!!videoUrl && (
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-5 border border-[#CADBEA] text-[#010107] rounded-lg hover:bg-gray-50 transition-colors">
                      <Play className="w-4 h-4" />
                      <span className="font-work-sans font-medium">
                        Trailer
                      </span>
                    </button>
                  )} */}
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-5 bg-[#3C62ED] text-white rounded-lg hover:bg-gray-800 transition-colors relative"
                  >
                    <span className="font-work-sans font-medium">
                      Share on Social Media
                    </span>
                    <Forward className="w-4 h-4" />
                    {showCopyNotification && (
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                        Link copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Main Content */}
          <div
            className={cn(
              "space-y-12",
              partnerOrganization || country
                ? "lg:col-span-2"
                : "lg:col-span-3",
            )}
          >
            {/* Description */}
            <div>
              <H4
                style="h5bold"
                className="text-[#010107] font-nunito-sans mb-6"
              >
                Description
              </H4>
              <P style="p1reg" className="text-[#060726CC] leading-relaxed">
                {description}
              </P>
            </div>

            {/* Photos */}
            {photosList.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <H2
                    style="h3semibold"
                    className="text-[#010107] flex items-center gap-3"
                  >
                    Photos{" "}
                    <span className="text-[#06072680]">
                      ({photosList.length})
                    </span>
                  </H2>
                  {photosList.length > 4 && (
                    <button
                      onClick={() => openGallery(0)}
                      className="text-[#010107] text-sm font-nunito-sans font-normal border border-[#CADBEA] py-4 px-6 rounded hover:bg-gray-50 transition-colors"
                    >
                      View All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {photosList.slice(0, 4).map((photo, index) => (
                    <div
                      key={photo.id}
                      onClick={() => openGallery(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openGallery(index);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View photo ${index + 1}`}
                      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={getImageUrl(photo.src)}
                        alt={photo.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles */}
            {relatedArticlesList.length > 0 && (
              <div>
                <H4 style="h5bold" className="text-[#010107] mb-6">
                  Related links about this story
                </H4>
                <div className="space-y-4">
                  {relatedArticlesList.map((article) => (
                    <a
                      key={article.id}
                      href={article.url}
                      className="block py-4 px-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group bg-[#F1F5F9]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <LinkIcon className="w-4 h-4 text-[#3C62ED] group-hover:text-blue-600" />
                          <P
                            style="p1reg"
                            className="text-[#060726CC] group-hover:text-blue-600"
                          >
                            {article.title}
                          </P>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#3C62ED] group-hover:text-blue-600" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {isGalleryOpen && photosList.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeGallery}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeGallery();
          }}
          role="button"
          tabIndex={0}
          aria-label="Close gallery modal"
        >
          <div className="relative max-w-7xl max-h-full w-full">
            {/* Close button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {photosList.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Main image */}
            <div onClick={(e) => e.stopPropagation()}>
              <Image
                src={getImageUrl(photosList[selectedPhotoIndex].src)}
                alt={photosList[selectedPhotoIndex].alt}
                width={1200}
                height={800}
                className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
              />
            </div>

            {/* Image counter */}
            {photosList.length > 1 && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedPhotoIndex + 1} / {photosList.length}
              </div>
            )}

            {/* Image alt text */}
            {photosList[selectedPhotoIndex]?.alt && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
                <p className="text-sm font-medium">
                  {photosList[selectedPhotoIndex].alt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
