"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Story {
  quote: string;
  organization: string;
  logo: string;
  bgImage: string;
}

const stories: Story[] = [
  {
    quote:
      "Turning Tides' support makes it possible to safeguard the community's rights to manage their own territory",
    organization: "Indonesian Marine Conservation Foundation",
    logo: "/logos/imcf.svg",
    bgImage: "/stories/indonesia-fisher.jpg",
  },
  {
    quote:
      "Their partnership approach empowers local communities to take control of their coastal resources",
    organization: "Honduras Coastal Alliance",
    logo: "/logos/hca.svg",
    bgImage: "/stories/honduras-community.jpg",
  },
  {
    quote:
      "Working with Turning Tides has transformed how we engage with fishing communities",
    organization: "Senegal Ocean Guardians",
    logo: "/logos/sog.svg",
    bgImage: "/stories/senegal-fishers.jpg",
  },
  {
    quote:
      "The collaborative model ensures sustainable management while respecting indigenous rights",
    organization: "Bangladesh Fisheries Network",
    logo: "/logos/bfn.svg",
    bgImage: "/stories/bangladesh-mangrove.jpg",
  },
  {
    quote:
      "Together we're creating lasting change in marine conservation and community empowerment",
    organization: "Gambia Coastal Protection",
    logo: "/logos/gcp.svg",
    bgImage: "/stories/gambia-beach.jpg",
  },
];

export function PartnerStoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[currentIndex];

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/assets/partner1.webp"
          alt="Community partner"
          fill
          className="object-cover transition-opacity duration-700"
          priority
        />
        {/* Dark overlay - tambahkan z-index */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black0/70 to-black/10 z-10" />
      </div>

      {/* Content Container - ubah z-index menjadi lebih tinggi */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full items-center">
          {/* Left Side - Title and Description */}
          <div className="text-white space-y-8">
            {/* Tag */}
            <div className="inline-block">
              <span className="px-4 py-2 border border-white/40 rounded-full text-sm font-medium uppercase tracking-wider">
                COMMUNITY ECHOES
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Stories From Our Partners
            </h2>

            {/* Description */}
            <p className="text-lg lg:text-xl text-white/90 max-w-lg">
              Turning Tides engages with a diversity of partners – across
              multiple levels
            </p>

            {/* All Partners Button */}
            <div className="pt-4">
              <Link
                href="/partners"
                className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium"
              >
                All Partners
              </Link>
            </div>
          </div>

          {/* Right Side - Testimonial Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-2xl">
              {/* Quote */}
              <blockquote className="mb-8">
                <p className="text-xl lg:text-2xl text-gray-900 leading-relaxed">
                  &quot;{currentStory.quote}&quot;
                </p>
              </blockquote>

              {/* Organization Info */}
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={currentStory.logo}
                    alt={currentStory.organization}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Organization Name */}
                <div>
                  <p className="text-sm lg:text-base font-medium text-gray-900">
                    {currentStory.organization}
                  </p>
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-between mt-6">
              {/* Counter */}
              <div className="text-white font-medium">
                {currentIndex + 1} of {stories.length}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={prevStory}
                  className={cn(
                    "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
                    currentIndex !== 0
                      ? "bg-white border-white hover:bg-gray-100 text-gray-900"
                      : "opacity-50 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900"
                  )}
                  aria-label="Previous story"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextStory}
                  className={cn(
                    "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
                    currentIndex !== stories.length - 1
                      ? "bg-white border-white hover:bg-gray-100 text-gray-900"
                      : "opacity-50 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900"
                  )}
                  aria-label="Next story"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
