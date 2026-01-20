"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface TheoryOfChangeSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showMoreText?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export function TheoryOfChangeSection({
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  // showMoreText: propShowMoreText,
  imageSrc: propImageSrc,
  imageAlt: propImageAlt,
  className,
}: TheoryOfChangeSectionProps = {}) {
  const { getValue } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const title = getValue("theoryOfChange.title", propTitle, "THEORY OF CHANGE");
  const subtitle = getValue(
    "theoryOfChange.subtitle",
    propSubtitle,
    "How We View Change to Happen?"
  );
  const description = getValue(
    "theoryOfChange.description",
    propDescription,
    `Self-determination, meaningful participation and locally led action become possible diverse rights of local communities, small-scale fishers, fish workers, and Indigenous Peoples are recognized. To move toward secure tenure and recognized rights it is these peoples that must be centered in resourcing and actions – with direct funding and greater control in fund distribution. We engage with a diversity of partners – across multiple levels – who are affecting governance of oceans, coasts, rivers, lakes, climate responses, conservation and food systems.\n
We collaborate most closely with local communities, small-scale fishers, fish workers, Indigenous Peoples, and their representative groups and allies. Throughout these partnerships we pay particular attention to strategies that promote social inclusion and gender equity. We employ and support targeted strategies with women, non-elite and economically disadvantaged peoples. We collaborate with partners who support different social groups and peoples to improve their experiences, agency and power within established legal, economic and social systems. The work we support will lead to greater quality and accessibility of services for facilitation, negotiation, documentation, registration, conflict resolution, and remedy.\n
We support ongoing efforts to build accountability, respect and awareness amongst governments, NGOs, funders and the private sector, ensuring rights recognition and tenure sensitivity in the policies and processes they employ. We support work that evaluates and diversifies the values and knowledge systems that are influencing these decision makers. We support work that changes and/or challenges (including via strategic litigation) inequitable or unjust legal, economic and social conditions, processes or policies that are undermining tenure security and rights in the governance of oceans, coasts, lakes, shorelines, and other aquatic systems.`
  );
  const imageSrc = getValue(
    "theoryOfChange.image",
    propImageSrc,
    "/assets/our-view.webp"
  );
  const imageAlt = getValue(
    "theoryOfChange.imageAlt",
    propImageAlt,
    "Theory of Change diagram showing how change happens"
  );

  const [isExpanded] = useState(true);

  return (
    <section
      className={cn("bg-white py-16 lg:py-24", className)}
      data-section="theory-of-change"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#3C62ED] mb-3 font-work-sans font-normal">
            {title}
          </p>
          <h2 className="text-3xl sm:text-[38px] leading-[120%] font-bold text-[#010107] font-nunito-sans max-w-[382px] mx-auto">
            {subtitle}
          </h2>
        </div>

        {/* Diagram Image */}
        <div className="mb-12 lg:mb-16">
          <div className="relative w-full aspect-[16/10] lg:aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={getImageUrl(imageSrc)}
              alt={imageAlt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Description Text */}
        <div className="max-w-4xl mx-auto">
          <p
            className={cn(
              "text-base text-[#060726CC] leading-relaxed font-work-sans",
              !isExpanded && "line-clamp-4"
            )}
          >
            {description.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < description.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>

          {/* Show More Button */}
          {/* <div className="mt-6 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium font-work-sans"
            >
              <span>{showMoreText}</span>
              {isExpanded ? (
                <ChevronsDown className="w-4 h-4" />
              ) : (
                <ChevronsRight className="w-4 h-4" />
              )}
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
}
