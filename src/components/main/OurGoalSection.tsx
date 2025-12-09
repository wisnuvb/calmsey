"use client";

import { Download, Target } from "lucide-react";
import Image from "next/image";
import { H2, H6, P } from "../ui/typography";
import { usePageContent } from "@/contexts/PageContentContext";
import { getImageUrl } from "@/lib/utils";

interface OurGoalSectionProps {
  title?: string;
  description1?: string;
  description2?: string;
  strategyTitle?: string;
  strategyDescription?: string;
  strategyImage?: string;
  strategyImageAlt?: string;
  strategyDownloadUrl?: string;
  strategyDownloadText?: string;
}

export function OurGoalSection({
  title: propTitle,
  description1: propDescription1,
  description2: propDescription2,
  strategyTitle: propStrategyTitle,
  strategyDescription: propStrategyDescription,
  strategyImage: propStrategyImage,
  strategyImageAlt: propStrategyImageAlt,
  strategyDownloadUrl: propStrategyDownloadUrl,
  strategyDownloadText: propStrategyDownloadText,
}: OurGoalSectionProps = {}) {
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
  const title = getValue("goal.title", propTitle, "Our Goal");
  const description1 = getValue(
    "goal.description1",
    propDescription1,
    "Implement and champion new approaches to funding that center power with, and provide resources directly to, local communities, small scale fishers and fish workers, and Indigenous Peoples, and the groups that legitimately serve them."
  );
  const description2 = getValue(
    "goal.description2",
    propDescription2,
    "With more appropriate and equitable resourcing, actors - across scales - can build rights recognition and conditions that ensure tenure security."
  );
  const strategyTitle = getValue(
    "goal.strategyTitle",
    propStrategyTitle,
    "The Strategy to 2030"
  );
  const strategyDescription = getValue(
    "goal.strategyDescription",
    propStrategyDescription,
    "See our multi-scale & geographic approach, how we identify the challenges, create risk mitigation, milestones and estimate budget until 2030 ahead."
  );
  const strategyImage = getValue(
    "goal.strategyImage",
    propStrategyImage,
    "/assets/demo/strategy.png"
  );
  const strategyImageAlt = getValue(
    "goal.strategyImageAlt",
    propStrategyImageAlt,
    "Strategy to 2030"
  );
  const strategyDownloadUrl = getValue(
    "goal.strategyDownloadUrl",
    propStrategyDownloadUrl,
    "/downloads/strategy-2030.pdf"
  );
  const strategyDownloadText = getValue(
    "goal.strategyDownloadText",
    propStrategyDownloadText,
    "Download"
  );

  return (
    <section className="py-8 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Our Goal Content */}
          <div className="space-y-8">
            {/* Icon and Heading */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#6BB7BC] rounded-[12px] flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <H2 style="h2bold" className="text-[#010107]">
                  {title}
                </H2>
              </div>
            </div>

            {/* Goal Description */}
            <div className="space-y-6">
              <div
                className="text-[#060726CC] text-base font-normal font-work-sans leading-[150%]"
                dangerouslySetInnerHTML={{ __html: description1 }}
              />
              <div
                className="text-[#060726CC] text-base font-normal font-work-sans leading-[150%]"
                dangerouslySetInnerHTML={{ __html: description2 }}
              />
            </div>
          </div>

          {/* Right Column - Strategy Card */}
          <div className="space-y-8 relative">
            {/* Strategy Description */}
            <div className="p-6 mt-0 sm:-mt-36 border border-[#CADBEA] bg-white w-full sm:w-[456px] rounded">
              <Image
                src={getImageUrl(strategyImage)}
                alt={strategyImageAlt}
                className="object-cover object-left-bottom w-full h-[313px] mb-6"
                width={500}
                height={313}
                priority
              />
              <H6 style="h6bold" className="text-[#3C62ED] mb-3 ">
                {strategyTitle}
              </H6>

              <P style="p1reg" className="text-[#06072680] mb-3 leading-[150%]">
                {strategyDescription}
              </P>

              <a
                href={strategyDownloadUrl}
                download
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-base text-[#010107] font-normal border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {strategyDownloadText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
