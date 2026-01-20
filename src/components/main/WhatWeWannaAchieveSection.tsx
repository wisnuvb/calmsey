"use client";

import Image from "next/image";
import { H3, P } from "@/components/ui/typography";
import { getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface WhatWeWannaAchieveSectionProps {
  tag?: string;
  quote?: string;
  image?: string;
  imageAlt?: string;
}

export function WhatWeWannaAchieveSection({
  tag: propTag,
  quote: propQuote,
  image: propImage,
  imageAlt: propImageAlt,
}: WhatWeWannaAchieveSectionProps = {}) {
  const { getValue } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const tag = getValue("achieve.tag", propTag, "WHAT WE WANNA ACHIEVE");
  const quote = getValue(
    "achieve.quote",
    propQuote,
    "A world where local communities, fishers and Indigenous Peoples can lead in managing, conserving, developing and adapting their lands, waters and resoruces"
  );
  const image = getValue("achieve.image", propImage, "/assets/achieve-1.webp");
  const imageAlt = getValue(
    "achieve.imageAlt",
    propImageAlt,
    "Bustling floating market with boats carrying goods, showcasing local communities managing their resources"
  );

  return (
    <section className="py-16 lg:py-[100px] bg-[#F1FAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Small Heading */}
        <P
          style="p2reg"
          className="text-[#548F93] uppercase mb-3 text-sm leading-[150%] font-normal"
        >
          {tag}
        </P>

        {/* Main Quote */}
        <H3
          style="h3reg"
          className="text-[#010107] font-normal max-w-4xl mx-auto mb-[70px]"
        >
          &ldquo;{quote}&rdquo;
        </H3>

        {/* Full Width Image */}
        <div className="relative w-full h-64 sm:h-80 lg:h-96 xl:h-[380px] rounded-sm overflow-hidden ">
          <Image
            src={getImageUrl(image)}
            alt={imageAlt}
            width={1000}
            height={400}
            className="w-full object-cover -mt-40"
            priority
          />
        </div>
      </div>
    </section>
  );
}
