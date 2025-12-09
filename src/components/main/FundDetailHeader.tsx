"use client";

import Image from "next/image";
import { H2, P } from "../ui/typography";
import type { FundHeader } from "@/types/fund-detail";
import { getImageUrl } from "@/lib/utils";

interface FundDetailHeaderProps {
  header: FundHeader;
}

export function FundDetailHeader({ header }: FundDetailHeaderProps) {
  return (
    <section
      className="bg-white py-8 lg:pb-12 lg:pt-36"
      data-section="fund-detail-header"
    >
      <div className="container mx-auto px-4">
        {/* Small Heading */}
        <div className="text-center mb-6">
          <p className="text-sm uppercase tracking-wider text-[#3C62ED] font-normal font-work-sans">
            {header.smallHeading}
          </p>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <H2
            style="h2bold"
            className="text-[#010107] text-3xl sm:text-4xl lg:text-5xl font-bold font-nunito-sans leading-tight"
          >
            {header.title}
          </H2>
          {header.subtitle && (
            <P
              style="p1reg"
              className="text-[#060726CC] text-lg lg:text-xl mt-4 font-work-sans"
            >
              {header.subtitle}
            </P>
          )}
        </div>

        {/* Hero Image */}
        <div className="w-full">
          <div className="relative aspect-video lg:aspect-[21/9] overflow-hidden rounded-lg">
            <Image
              src={getImageUrl(header.heroImage.src)}
              alt={header.heroImage.alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
