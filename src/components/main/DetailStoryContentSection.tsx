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
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { H2, H3, P } from "../ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "../ui/toast";
import { RichText } from "../ui/RichText";

/**
 * Fallback copy ke clipboard via execCommand.
 * Now use navigator.clipboard not available (HTTP, old Safari, iframe).
 */
function fallbackCopyToClipboard(text: string): boolean {
  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    document.body.removeChild(textarea);
    return false;
  }
}

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
  bodyContent?: string;
  photos?: Photo[];
  relatedArticles?: RelatedArticle[];
  className?: string;
  videoUrl?: string;
  /** URL untuk share - dari server agar valid saat SSR/deploy */
  shareUrl?: string;
}

export function DetailStoryContentSection({
  partnerOrganization,
  country,
  description,
  bodyContent,
  photos,
  relatedArticles,
  className,
  shareUrl: shareUrlProp,
}: DetailStoryContentSectionProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [clientUrl, setClientUrl] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") setClientUrl(window.location.href);
  }, []);

  // Default values
  const photosList = photos || [];
  const relatedArticlesList = relatedArticles || [];

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  // Prioritas: URL dari client (setelah hydration) > URL dari server (SSR/deploy)
  const currentUrl = clientUrl || shareUrlProp || "";
  const plainBody = (bodyContent || "").replace(/<[^>]*>/g, " ").trim();
  const shareSource = description || plainBody;
  const shareText = encodeURIComponent(shareSource.substring(0, 100) + "...");
  const encodedUrl = encodeURIComponent(currentUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    // Read URL directly when clicked to always be valid (not dependent on state/SSR)
    const urlToCopy =
      typeof window !== "undefined" ? window.location.href : currentUrl;
    if (!urlToCopy) {
      addToast({
        type: "error",
        title: "Copy Failed",
        description: "No URL available to copy.",
        duration: 4000,
      });
      return;
    }

    try {
      // Main: Clipboard API (HTTPS, modern browser)
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        // Fallback: execCommand for old browser / non-secure context (HTTP)
        const success = fallbackCopyToClipboard(urlToCopy);
        if (!success) throw new Error("execCommand fallback failed");
      }
      setIsShareMenuOpen(false);
      addToast({
        type: "success",
        title: "Link Copied",
        description: "Link has been copied to clipboard.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Copy failed", error);
      addToast({
        type: "error",
        title: "Copy Failed",
        description:
          "Failed to copy link. Try selecting and copying the URL manually.",
        duration: 4000,
      });
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
                        <H2
                          style="h5bold"
                          className="text-[#010107] font-semibold text-xs leading-[150%] tracking-normal uppercase"
                        >
                          Partner Organization
                        </H2>
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
                  <div className="relative w-full">
                    <button
                      onClick={toggleShareMenu}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-5 bg-[#3C62ED] text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <span className="font-work-sans font-medium">
                        Share on Social Media
                      </span>
                      <Forward className="w-4 h-4" />
                    </button>

                    {isShareMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsShareMenuOpen(false)}
                        />
                        <div className="absolute right-0 left-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden text-sm font-work-sans p-1">
                          <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#1877F2] transition-colors rounded-md"
                          >
                            <Facebook className="w-5 h-5" />
                            <span>Facebook</span>
                          </a>
                          <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors rounded-md"
                          >
                            <Twitter className="w-5 h-5" />
                            <span>X (Twitter)</span>
                          </a>
                          <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#0A66C2] transition-colors rounded-md"
                          >
                            <Linkedin className="w-5 h-5" />
                            <span>LinkedIn</span>
                          </a>
                          <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#25D366] transition-colors rounded-md"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span>WhatsApp</span>
                          </a>
                          <button
                            onClick={handleCopyLink}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-md"
                          >
                            <LinkIcon className="w-5 h-5" />
                            <span>Copy Link</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Main Content */}
          <div
            className={cn(
              "space-y-8",
              partnerOrganization || country
                ? "lg:col-span-2"
                : "lg:col-span-3",
            )}
          >
            {/* Description */}
            <div>
              <H2 style="h5bold" className="text-[#010107] font-nunito mb-6">
                Description
              </H2>
              <P style="p1reg" className="text-[#060726CC] p">
                {description}
              </P>
            </div>

            {bodyContent?.trim() && (
              <RichText
                content={bodyContent}
                className="text-[#060726CC] p space-y-4 [&_a]:text-[#3C62ED] [&_a]:underline [&_a:hover]:text-[#2d4fd6]"
              />
            )}

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
                <H2 style="h5bold" className="text-[#010107] mb-6">
                  Related links about this story
                </H2>
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
                            className="text-[#060726CC] group-hover:text-blue-600 p"
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
