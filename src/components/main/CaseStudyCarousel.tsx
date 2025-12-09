"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface CaseStudy {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
  readMoreUrl?: string;
}

interface CaseStudyCarouselProps {
  title?: string;
  caseStudies?: CaseStudy[];
  showNavigation?: boolean;
}

export const CaseStudyCarousel: React.FC<CaseStudyCarouselProps> = ({
  title = "Story From The Fields",
  caseStudies = [
    {
      id: "1",
      title: "Octopus Farming Agreement",
      location: "Langkai island, Indonesia",
      date: "JUNE, 2024",
      description:
        "Establishment of a joint agreement for octopus farming and fishing on the island",
      image: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      readMoreUrl: "/case-studies/langkai-island",
    },
    {
      id: "2",
      title: "Marine Spatial Planning",
      location: "Rawai Park, Thailand",
      date: "JUNE, 2024",
      description:
        "Project Averting Marginalization by building inclusive marine spatial planning",
      image: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      readMoreUrl: "/case-studies/rawai-park",
    },
    {
      id: "3",
      title: "Mangrove Cultivation",
      location: "Caopa, Senegal",
      date: "MAY, 2024",
      description:
        "Utilization of cultivated products from mangroves and oysters in Senegal",
      image: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      readMoreUrl: "/case-studies/caopa-senegal",
    },
    {
      id: "4",
      title: "Community Recognition",
      location: "Rawai Park, Thailand",
      date: "APRIL, 2024",
      description:
        "Support to recognition of community rights in coastal areas",
      image: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      readMoreUrl: "/case-studies/rawai-beach",
    },
  ],
  showNavigation = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // const scroll = useCallback((direction: "left" | "right") => {
  //   if (scrollContainerRef.current) {
  //     const scrollAmount = 320; // Width of one card + gap
  //     const newScrollLeft =
  //       scrollContainerRef.current.scrollLeft +
  //       (direction === "left" ? -scrollAmount : scrollAmount);

  //     scrollContainerRef.current.scrollTo({
  //       left: newScrollLeft,
  //       behavior: "smooth",
  //     });
  //   }
  // }, []);

  // const checkScrollButtons = useCallback(() => {
  //   if (scrollContainerRef.current) {
  //     const { scrollLeft, scrollWidth, clientWidth } =
  //       scrollContainerRef.current;

  //     const newCanScrollLeft = scrollLeft > 0;
  //     const newCanScrollRight = scrollLeft < scrollWidth - clientWidth - 1;

  //     setCanScrollLeft((prev) =>
  //       prev !== newCanScrollLeft ? newCanScrollLeft : prev
  //     );
  //     setCanScrollRight((prev) =>
  //       prev !== newCanScrollRight ? newCanScrollRight : prev
  //     );
  //   }
  // }, []);

  // const debouncedCheckScrollButtons = useCallback(() => {
  //   const timeoutId = setTimeout(checkScrollButtons, 100);
  //   return () => clearTimeout(timeoutId);
  // }, [checkScrollButtons]);

  // React.useEffect(() => {
  //   const container = scrollContainerRef.current;
  //   if (container) {
  //     container.addEventListener("scroll", debouncedCheckScrollButtons);
  //     checkScrollButtons(); // Initial check
  //     return () => {
  //       container.removeEventListener("scroll", debouncedCheckScrollButtons);
  //     };
  //   }
  // }, [debouncedCheckScrollButtons, checkScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Update button states setelah scroll
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } =
            scrollContainerRef.current;
          setCanScrollLeft(scrollLeft > 0);
          setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
      }, 300);
    }
  };

  return (
    <div className="bg-[#F7FAFC] py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>

          {showNavigation && (
            <div className="flex space-x-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  canScrollLeft
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  canScrollRight
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Case Studies Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {caseStudies.map((caseStudy) => (
            <div
              key={caseStudy.id}
              className="flex-shrink-0 w-80 bg-white border border-[#CADBEA] rounded-lg hover:shadow-sm transition-shadow duration-300 relative"
            >
              {/* Image */}
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                <Image
                  src={getImageUrl(caseStudy.image)}
                  alt={caseStudy.title}
                  fill
                  className="object-cover"
                  priority={false}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=320&h=192&fit=crop&crop=center`;
                  }}
                />
              </div>

              {/* Location Badge */}
              <div className="flex items-center justify-start w-full bg-[#3C62ED] text-xs font-semibold text-white py-3 px-6">
                {caseStudy.location} | {caseStudy.date}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                  {caseStudy.description}
                </p>

                {/* Read More Button */}
                <a
                  href={caseStudy.readMoreUrl || "#"}
                  className="inline-block w-full text-center py-5 px-4 bg-white border border-[#CADBEA] text-[#010107] rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
