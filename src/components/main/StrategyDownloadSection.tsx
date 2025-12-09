"use client";

import { Download } from "lucide-react";
import { H5 } from "../ui/typography";
import { usePageContent } from "@/contexts/PageContentContext";

interface StrategyDownloadSectionProps {
  description?: string;
  downloadUrl?: string;
  downloadButtonText?: string;
  learnMoreButtonText?: string;
  learnMoreButtonUrl?: string;
}

export function StrategyDownloadSection({
  description: propDescription,
  downloadUrl: propDownloadUrl,
  downloadButtonText: propDownloadButtonText,
  learnMoreButtonText: propLearnMoreButtonText,
  learnMoreButtonUrl: propLearnMoreButtonUrl,
}: StrategyDownloadSectionProps = {}) {
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
  const description = getValue(
    "strategy.description",
    propDescription,
    "Our approach, values, risk mitigation, milestones and budget estimates are in our Strategy to 2030."
  );

  const downloadUrl = getValue(
    "strategy.downloadUrl",
    propDownloadUrl,
    "/downloads/strategy-2030.pdf"
  );

  const downloadButtonText = getValue(
    "strategy.buttonText",
    propDownloadButtonText,
    "Download Our Strategy 2030"
  );

  const learnMoreButtonText = getValue(
    "strategy.learnMoreButtonText",
    propLearnMoreButtonText,
    "Learn Our Funds"
  );

  const learnMoreButtonUrl = getValue(
    "strategy.learnMoreButtonUrl",
    propLearnMoreButtonUrl,
    "/our-fund"
  );

  return (
    <section className="py-8 lg:py-11 bg-gradient-to-r from-[#3C62ED] to-[#2f55e1]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left - Text Content */}
          <H5
            style="h5regular"
            className="text-white leading-relaxed max-w-[466px]"
          >
            {description}
          </H5>

          {/* Right - CTA Buttons */}
          <div className="flex flex-col items-center justify-center shrink-0 font-normal font-nunito-sans text-base gap-3">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-3 px-8 py-5 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl w-full sm:w-[310px]"
            >
              <Download className="w-5 h-5" />
              {downloadButtonText}
            </a>
            <a
              href={learnMoreButtonUrl}
              className="py-5 px-8 border border-white rounded w-full sm:w-[310px] text-white hover:bg-white/10 transition-colors text-center"
            >
              {learnMoreButtonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
