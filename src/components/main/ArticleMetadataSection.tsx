"use client";

import React from "react";
import { MapPin, Calendar, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleMetadataSectionProps {
  location?: string;
  publishedDate?: string;
  onShare?: () => void;
  backgroundColor?: string;
}

export const ArticleMetadataSection: React.FC<ArticleMetadataSectionProps> = ({
  location = "Langkai island, Indonesia",
  publishedDate = "June 14, 2024",
  onShare,
  backgroundColor = "bg-gray-50",
}) => {
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    }
  };

  return (
    <section className={cn(backgroundColor)}>
      <div className="container py-6 mx-auto px-4 bg-[#F1F5F9] -mt-10 z-50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Location */}
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Location
                </p>
                <p className="text-base font-medium text-gray-800">
                  {location}
                </p>
              </div>
            </div>

            {/* Published Date */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Published on
                </p>
                <p className="text-base font-medium text-gray-800">
                  {publishedDate}
                </p>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 group"
            >
              <span>Share</span>
              <Share2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
