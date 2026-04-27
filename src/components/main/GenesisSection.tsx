"use client";

import Image from "next/image";
import { P } from "@/components/ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface GenesisSectionProps {
  title?: string;
  introParagraph?: string;
  mainParagraph?: string;
  closingParagraph?: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  className?: string;
}

export function GenesisSection({
  title: propTitle,
  introParagraph: propIntroParagraph,
  mainParagraph: propMainParagraph,
  closingParagraph: propClosingParagraph,
  heroImageSrc: propHeroImageSrc,
  heroImageAlt: propHeroImageAlt,
  className,
}: GenesisSectionProps = {}) {
  const { getValue } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const title = getValue(
    "genesis.title",
    propTitle,
    "The Genesis of Turning Tides"
  );
  const introParagraph = getValue(
    "genesis.introParagraph",
    propIntroParagraph,
    "Turning Tides emerged from the Marine Tenure Initiative (2022-2024) designed to understand how philanthropy could better support Indigenous Peoples, small-scale fishers, and coastal communities seeking tenure security and rights recognition."
  );
  const mainParagraph = getValue(
    "genesis.mainParagraph",
    propMainParagraph,
    "Governed by a Steering Committee with deep expertise in human rights and coastal tenure, the Initiative undertook comprehensive scoping research, over 100 hours of consultations across five regions, and a piloting phase with seven local organizations. This deliberate process revealed the substantial capacity and readiness of grassroots groups historically overlooked by traditional funding mechanisms, alongside the urgent need for approaches that genuinely center rights-holders in decision-making. These steps informed our values around trust-based partnerships, flexible processes, and support beyond financial grants."
  );
  const closingParagraph = getValue(
    "genesis.closingParagraph",
    propClosingParagraph,
    "With **$33 million** committed from six aligned funders, **Turning Tides** launched in June 2024 as an institution purpose-built to support the recognition of rights and tenure security that unlocks community agency for more effective and self-determined climate action, environmental stewardship, and development."
  );
  const heroImageSrc = getValue(
    "genesis.heroImageSrc",
    propHeroImageSrc,
    ""
  ).trim();
  const heroImageAlt = getValue(
    "genesis.heroImageAlt",
    propHeroImageAlt,
    "Genesis — Turning Tides"
  );
  const hasHeroImage = Boolean(heroImageSrc);
  return (
    <section
      className={cn("bg-[#ECEFFD] py-16 lg:py-[100px]", className)}
      data-section="genesis"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-center text-3xl sm:text-4xl lg:text-[38px] font-bold text-[#3C62ED] font-nunito mb-8">
          {title}
        </h2>

        {/* Intro Paragraph */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16 px-1">
          <P
            style="p1reg"
            className="text-[#060726CC] text-center font-work-sans"
          >
            {introParagraph}
          </P>
        </div>

        {/* Text + optional image from CMS */}
        <div
          className={cn(
            "grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 mb-12",
            hasHeroImage && "lg:grid-cols-2"
          )}
        >
          {/* Left Column - Main Text */}
          <div className="space-y-5 sm:space-y-6 px-1 lg:px-0">
            <P
              style="p1reg"
              className="text-[#060726CC] font-work-sans"
            >
              {mainParagraph}
            </P>
            <div
              className="text-[#060726CC] font-work-sans text-base font-normal leading-[27px]"
              dangerouslySetInnerHTML={{
                __html: closingParagraph.replace(
                  /\*\*(.*?)\*\*/g,
                  "<strong>$1</strong>"
                ),
              }}
            />
          </div>

          {hasHeroImage ? (
            <div className="flex items-center justify-center px-1 lg:px-0">
              <div className="relative w-full aspect-[4/3] max-h-[min(100%,420px)] rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={getImageUrl(heroImageSrc)}
                  alt={heroImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
