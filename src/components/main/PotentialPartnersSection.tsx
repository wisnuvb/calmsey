"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface PotentialPartnersSectionProps {
  title?: string;
  description?: string;
  leftButtonText?: string;
  leftButtonLink?: string;
  rightButtonText?: string;
  rightButtonLink?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  leftText?: string;
  rightText?: string;
  backgroundColor?: string;
}

export const PotentialPartnersSection: React.FC<
  PotentialPartnersSectionProps
> = ({
  title = "POTENTIAL PARTNERS",
  description = "Turning Tides will provide services and resources directly to local communities, small-scale fishers and Indigenous Peoples, and the groups and allies that directly serve them, in their efforts to secure and assert their rights to coastal, marine, shoreline and other aquatic spaces and resources.",
  leftButtonText = "Our Supported Funds",
  leftButtonLink = "/funds",
  rightButtonText = "Our Partners",
  rightButtonLink = "/partners",
  backgroundImage = "/assets/demo/partners.png",
  backgroundImageAlt = "Fishing community at the beach with boats and nets",
  leftText = "We will target funding to those institutions, groups and networks that legitimately represent and work in service to our partners.",
  rightText = "To ensure that our work responds to and prioritizes women's tenure rights and goals of equity, we will collaborate with partners who demonstrate strong commitment to gender equity in their internal and external structures and work.",
  backgroundColor = "bg-white",
}) => {
  return (
    <section className={`w-full ${backgroundColor} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-8 tracking-wider">
            {title}
          </h2>

          <p className="text-gray-900 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-8">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={leftButtonLink}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#3C62ED] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              aria-label={`View ${leftButtonText}`}
            >
              {leftButtonText}
            </a>

            <a
              href={rightButtonLink}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 border-2 border-[#3C62ED] font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
              aria-label={`View ${rightButtonText}`}
            >
              {rightButtonText}
            </a>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="relative w-full h-96 md:h-[500px] mb-12 rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(backgroundImage)}
            alt={backgroundImageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Bottom Text Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Text Block */}
          <div className="text-left">
            <p className="text-gray-900 text-lg leading-relaxed">{leftText}</p>
          </div>

          {/* Right Text Block */}
          <div className="text-left lg:text-right">
            <p className="text-gray-900 text-lg leading-relaxed">{rightText}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
