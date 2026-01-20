"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface Funder {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
}

interface FundersSectionProps {
  title?: string;
  funders?: Funder[];
  ctaText?: string;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
}

const defaultFunders: Funder[] = [
  {
    id: "ocean-resilience",
    name: "Ocean Resilience & Climate Alliance",
    logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    logoAlt: "Ocean Resilience & Climate Alliance Logo",
  },
  {
    id: "packard",
    name: "The David & Lucile Packard Foundation",
    logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    logoAlt: "The David & Lucile Packard Foundation Logo",
  },
  {
    id: "builders",
    name: "Builders Initiative",
    logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    logoAlt: "Builders Initiative Logo",
  },
  {
    id: "oak",
    name: "AK Foundation",
    logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    logoAlt: "AK Foundation Logo",
  },
  {
    id: "cargill",
    name: "Margaret A. Cargill Philanthropies",
    logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    logoAlt: "Margaret A. Cargill Philanthropies Logo",
  },
];

export function FundersSection({
  title: propTitle,
  funders: propFunders,
  ctaText: propCtaText,
  buttonText: propButtonText,
  buttonLink: propButtonLink,
  className,
}: FundersSectionProps = {}) {
  const { getValue, getContentJSON } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const title = getValue("funders.title", propTitle, "Our Funders");
  const funders = getContentJSON<Funder[]>(
    "funders.funders",
    propFunders || defaultFunders
  );
  const ctaText = getValue(
    "funders.ctaText",
    propCtaText,
    "Interested Working Together With Us to Transforming Coastal Right?"
  );
  const buttonText = getValue(
    "funders.buttonText",
    propButtonText,
    "Become Funder"
  );
  const buttonLink = getValue(
    "funders.buttonLink",
    propButtonLink,
    "/get-involved"
  );
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (funderId: string) => {
    setImageErrors((prev) => ({ ...prev, [funderId]: true }));
  };

  const getImageSrc = (funder: Funder) => {
    if (imageErrors[funder.id]) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        funder.name
      )}&size=120&background=random`;
    }
    // Ensure URL has protocol
    let logoUrl = funder.logo;
    if (logoUrl && !logoUrl.startsWith("http://") && !logoUrl.startsWith("https://")) {
      logoUrl = "https://" + logoUrl;
    }
    return logoUrl;
  };

  const shouldUseUnoptimized = (funder: Funder) => {
    // Use unoptimized for fallback placeholder or external URLs
    return imageErrors[funder.id] || funder.logo.includes("ui-avatars.com");
  };

  return (
    <section
      className={cn("bg-white text-[#010107] py-16 lg:py-24", className)}
      data-section="funders"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-11">
        {/* Title */}
        <h2 className="text-xl sm:text-[38px] text-[#010107] text-center tracking-wider font-nunito-sans font-bold">
          {title}
        </h2>

        {/* Funders Logos */}
        <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8">
          {funders.map((funder) => (
            <div
              key={funder.id}
              className="flex items-center justify-center h-[110px] w-[140px] lg:w-[180px]"
            >
              <Image
                src={getImageSrc(funder)}
                alt={funder.logoAlt}
                width={140}
                height={110}
                className="object-contain max-w-full max-h-full"
                unoptimized={shouldUseUnoptimized(funder)}
                onError={() => handleImageError(funder.id)}
                onLoadingComplete={(result) => {
                  if (result.naturalWidth === 0) {
                    handleImageError(funder.id);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-8">
          <p className="text-[#060726CC] text-base leading-[150%] tracking-normal font-work-sans text-center sm:text-left">
            {ctaText}
          </p>
          <Link
            href={buttonLink}
            className="inline-flex items-center justify-center px-8 py-5 bg-white border border-[#CADBEA] text-[#010107] text-base rounded-[4px] hover:bg-gray-50 transition-colors font-normal font-work-sans whitespace-nowrap"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
