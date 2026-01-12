"use client";

import { Download } from "lucide-react";
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
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Our Goal Content */}
          <div className="space-y-8">
            {/* Icon and Heading */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {/* <div className="w-12 h-12 bg-[#6BB7BC] rounded-[12px] flex items-center justify-center"> */}
                <div className="bg-[#3C62ED] p-3 rounded-lg">
                  {/* <Target className="w-6 h-6 text-white" /> */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.6002 5.84722C16.3808 7.47974 16.5289 9.34353 16.0161 11.0789C15.5033 12.8142 14.3659 14.2981 12.8234 15.2441C11.2808 16.1902 9.44255 16.5313 7.6633 16.2017C5.88405 15.872 4.28997 14.895 3.18872 13.4592C2.08746 12.0233 1.5571 10.2305 1.69999 8.42659C1.84289 6.62271 2.6489 4.93571 3.96249 3.69116C5.27607 2.44662 7.00409 1.73276 8.81305 1.68736C10.622 1.64197 12.3837 2.26826 13.758 3.44535L15.352 1.85066C15.4575 1.74511 15.6007 1.68582 15.75 1.68582C15.8992 1.68582 16.0424 1.74511 16.1479 1.85066C16.2535 1.95621 16.3128 2.09936 16.3128 2.24863C16.3128 2.3979 16.2535 2.54105 16.1479 2.6466L9.39793 9.3966C9.29238 9.50215 9.14923 9.56144 8.99996 9.56144C8.85069 9.56144 8.70754 9.50215 8.60199 9.3966C8.49644 9.29105 8.43715 9.1479 8.43715 8.99863C8.43715 8.84936 8.49644 8.70621 8.60199 8.60066L10.5511 6.6516C10.0228 6.30225 9.39217 6.14141 8.76116 6.19509C8.13015 6.24878 7.53572 6.51386 7.07411 6.94742C6.6125 7.38098 6.31072 7.95764 6.21763 8.58405C6.12455 9.21047 6.24559 9.84996 6.56118 10.399C6.87677 10.9481 7.36843 11.3746 7.95656 11.6094C8.54469 11.8443 9.19488 11.8738 9.80186 11.6931C10.4088 11.5125 10.9371 11.1323 11.3011 10.614C11.6651 10.0958 11.8435 9.46988 11.8075 8.83761C11.8034 8.76375 11.8138 8.68978 11.8382 8.61995C11.8627 8.55011 11.9006 8.48577 11.9499 8.4306C11.9992 8.37543 12.0589 8.33051 12.1255 8.2984C12.1922 8.26629 12.2645 8.24763 12.3384 8.24347C12.4876 8.23508 12.634 8.2863 12.7454 8.38585C12.8006 8.43515 12.8455 8.49483 12.8776 8.56148C12.9097 8.62814 12.9284 8.70046 12.9325 8.77433C12.9838 9.66926 12.7282 10.5549 12.208 11.2849C11.6877 12.0148 10.934 12.5454 10.0713 12.789C9.20861 13.0325 8.28866 12.9744 7.46348 12.6243C6.6383 12.2742 5.95729 11.6529 5.533 10.8633C5.10871 10.0737 4.96655 9.16296 5.13 8.2816C5.29346 7.40024 5.75275 6.60103 6.43196 6.01606C7.11118 5.4311 7.96966 5.0954 8.86551 5.06444C9.76137 5.03349 10.641 5.30913 11.3589 5.84582L12.9586 4.24621C11.7863 3.27294 10.2958 2.76709 8.77331 2.82581C7.25082 2.88453 5.80371 3.50368 4.7099 4.56435C3.6161 5.62501 2.95274 7.0524 2.84722 8.57237C2.74171 10.0923 3.20149 11.5977 4.13824 12.7993C5.075 14.0009 6.42269 14.8141 7.92246 15.0826C9.42223 15.3511 10.9683 15.0561 12.2638 14.2541C13.5593 13.4522 14.5128 12.1998 14.9412 10.7377C15.3696 9.27555 15.2427 7.70666 14.5849 6.33238C14.5205 6.19774 14.5123 6.04306 14.562 5.90236C14.6118 5.76167 14.7153 5.64648 14.85 5.58215C14.9846 5.51781 15.1393 5.50959 15.28 5.55931C15.4207 5.60902 15.5359 5.71258 15.6002 5.84722Z"
                      fill="white"
                    />
                  </svg>
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
            <div className="p-6 border border-[#CADBEA] bg-white w-full rounded items-center justify-between grid grid-cols-2 gap-6">
              <Image
                src={getImageUrl(strategyImage)}
                alt={strategyImageAlt}
                className="object-cover object-left-bottom w-full h-[266px]"
                width={500}
                height={313}
                priority
              />

              <div className="space-y-3">
                <H6 style="h6bold" className="text-[#3C62ED]">
                  {strategyTitle}
                </H6>

                <P style="p1reg" className="text-[#06072680] leading-[150%]">
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
      </div>
    </section>
  );
}
