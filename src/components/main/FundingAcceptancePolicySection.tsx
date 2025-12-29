"use client";

import { ArrowRight } from "lucide-react";
import { H2, P } from "@/components/ui/typography";
import { usePageContent } from "@/contexts/PageContentContext";
import { cn } from "@/lib/utils";

interface FundingAcceptancePolicySectionProps {
  title?: string;
  paragraphs?: string[];
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

export function FundingAcceptancePolicySection({
  title: propTitle,
  paragraphs: propParagraphs,
  buttonText: propButtonText,
  buttonLink: propButtonLink,
  backgroundColor = "bg-[#1E0F39]",
}: FundingAcceptancePolicySectionProps = {}) {
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {}

  const getContentValue = (key: string, defaultValue: string = ""): string => {
    return pageContent[key] || defaultValue;
  };

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

  const title = getValue(
    "fundingAcceptancePolicy.title",
    propTitle,
    "Turning Tides External Funding Acceptance Policy"
  );

  const buttonText = getValue(
    "fundingAcceptancePolicy.buttonText",
    propButtonText,
    "Our Funding Acceptance Policy"
  );

  const buttonLink = getValue(
    "fundingAcceptancePolicy.buttonLink",
    propButtonLink,
    "/governance/funding-policy"
  );

  const defaultParagraphs = [
    "We prioritize upholding high standards of ethics, integrity, and transparency in all aspects of our operations. To this end, we have established a policy to guide our decision-making regarding the acceptance of external funding.",
    "This document serves as a safeguard, helping Turning Tides make informed decisions regarding external funding acceptance – allowing us to increase funds accessible to local communities, small-scale fishers, fisher workers and Indigenous Peoples, while maintaining our commitment to ethical conduct, financial prudence, and mission alignment.",
  ];

  const paragraphKeys = [
    "fundingAcceptancePolicy.paragraph1",
    "fundingAcceptancePolicy.paragraph2",
  ];

  const paragraphs = (
    propParagraphs && propParagraphs.length > 0
      ? propParagraphs
      : defaultParagraphs.map((fallback, idx) =>
          getValue(paragraphKeys[idx], undefined, fallback)
        )
  ).filter((paragraph) => paragraph && paragraph.trim() !== "");

  return (
    <section className={cn("py-20 lg:py-24", backgroundColor)}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Title */}
          <H2
            style="h2bold"
            className="text-white text-2xl sm:text-[32px] leading-[120%] tracking-normal font-bold"
          >
            {title}
          </H2>

          {/* Right Column - Content and Button */}
          <div className="space-y-8">
            {/* Paragraphs */}
            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <P
                  key={index}
                  style="p1reg"
                  className="!text-white text-base font-normal font-work-sans leading-[150%] tracking-normal"
                >
                  {paragraph}
                </P>
              ))}
            </div>

            {/* Button */}
            <a
              href={buttonLink}
              className="inline-flex items-center gap-3 px-8 py-5 bg-white text-[#010107] rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
