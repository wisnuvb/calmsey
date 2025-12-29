"use client";

import Image from "next/image";
import { P } from "@/components/ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContent } from "@/contexts/PageContentContext";

interface GenesisSectionProps {
  title?: string;
  introParagraph?: string;
  mainParagraph?: string;
  closingParagraph?: string;
  logoSrc?: string;
  className?: string;
}

export function GenesisSection({
  title: propTitle,
  introParagraph: propIntroParagraph,
  mainParagraph: propMainParagraph,
  closingParagraph: propClosingParagraph,
  logoSrc: propLogoSrc,
  className,
}: GenesisSectionProps = {}) {
  // Try to get content from context, fallback to empty object if not available
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

  // Helper to get value from content
  const getContentValue = (key: string, defaultValue: string = ""): string => {
    return pageContent[key] || defaultValue;
  };

  // Helper function to get value with priority: context > props > default
  const getValue = (
    contentKey: string,
    propValue?: string,
    defaultValue: string = ""
  ): string => {
    const contentValue = getContentValue(contentKey, "");
    if (contentValue && contentValue.trim() !== "") {
      return contentValue;
    }
    if (propValue && propValue.trim() !== "") {
      return propValue;
    }
    return defaultValue;
  };

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
  const logoSrc = getValue("genesis.logoSrc", propLogoSrc, "/assets/Logo.png");
  return (
    <section
      className={cn("bg-[#ECEFFD] py-16 lg:py-[100px]", className)}
      data-section="genesis"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-center text-3xl sm:text-4xl lg:text-[38px] font-bold text-[#3C62ED] font-nunito-sans mb-8">
          {title}
        </h1>

        {/* Intro Paragraph */}
        <div className="max-w-4xl mx-auto mb-12 lg:mb-16">
          <P
            style="p1reg"
            className="text-[#060726CC] text-center leading-relaxed font-work-sans"
          >
            {introParagraph}
          </P>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Main Text */}
          <div className="space-y-6">
            <P
              style="p1reg"
              className="text-[#060726CC] leading-relaxed font-work-sans"
            >
              {mainParagraph}
            </P>
            <div
              className="text-[#060726CC] leading-relaxed font-work-sans text-base font-normal"
              dangerouslySetInnerHTML={{
                __html: closingParagraph.replace(
                  /\*\*(.*?)\*\*/g,
                  "<strong>$1</strong>"
                ),
              }}
            />
          </div>

          {/* Right Column - Blue Block with Logo */}
          <div className="flex items-center justify-center">
            <div className="w-full bg-[#3C62ED] rounded-lg p-12 lg:p-16 flex flex-col items-center justify-center min-h-[368px]">
              {/* Logo */}
              <div className="relative w-32 h-32 mb-6">
                <Image
                  src={getImageUrl(logoSrc)}
                  alt="Turning Tides Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Logo Text */}
              <h2 className="text-white text-2xl lg:text-3xl font-bold uppercase tracking-wider font-nunito-sans">
                TURNING TIDES
              </h2>
            </div>
          </div>
        </div>

        {/* Closing Paragraph */}
        {/* <div className="max-w-4xl">
          <P
            style="p1reg"
            className="text-[#060726CC] leading-relaxed font-work-sans"
          >
            {closingParagraph.split("**").map((part, index) =>
              index % 2 === 1 ? (
                <strong key={index} className="font-bold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </P>
        </div> */}
      </div>
    </section>
  );
}
