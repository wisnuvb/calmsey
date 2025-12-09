"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { H2 } from "@/components/ui/typography";
import { usePageContent } from "@/contexts/PageContentContext";
import { getImageUrl } from "@/lib/utils";

interface OurVisionSectionProps {
  title?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
}

export function OurVisionSection({
  title: propTitle,
  content: propContent,
  image: propImage,
  imageAlt: propImageAlt,
}: OurVisionSectionProps = {}) {
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
  const title = getValue("vision.title", propTitle, "Our Vision");
  const content = getValue(
    "vision.content",
    propContent,
    "Local communities, small-scale fishers and fish workers, and Indigenous Peoples fully experience their tenure, and associated rights and agency in the allocation, use, conservation, management and development of coastal lands, shorelines, oceans, lakes, rivers, and associated resources – toward better environmental and societal outcomes."
  );
  const image = getValue(
    "vision.image",
    propImage,
    "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png"
  );
  const imageAlt = getValue(
    "vision.imageAlt",
    propImageAlt,
    "Woman holding dried fish in outdoor setting"
  );

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Heading with Icon */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#3C62ED] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <H2 style="h2bold" className="text-[#010107]">
                  {title}
                </H2>
              </div>
            </div>

            {/* Vision Description */}
            <div
              className="text-[#060726CC] leading-relaxed text-base font-normal font-nunito-sans"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative w-full aspect-[5/4] lg:aspect-[6/4] overflow-hidden">
              <Image
                src={getImageUrl(image)}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
