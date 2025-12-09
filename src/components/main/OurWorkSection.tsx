"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePageContent } from "@/contexts/PageContentContext";
import { getImageUrl } from "@/lib/utils";

interface ImageItem {
  src: string;
  alt: string;
}

const defaultImages: ImageItem[] = [
  {
    src: "/assets/demo/16d51a5010efc92e05fa498a2dd962f76c4544ab.png",
    alt: "Person holding fish on boat at sunset",
  },
  {
    src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
    alt: "Group of diverse people smiling outdoors",
  },
  {
    src: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
    alt: "Person holding dried fish",
  },
  {
    src: "/assets/demo/achive.png",
    alt: "People gathered around table looking at map",
  },
];

interface OurWorkSectionProps {
  heading?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  images?: ImageItem[];
}

export function OurWorkSection({
  heading: propHeading,
  title: propTitle,
  description: propDescription,
  buttonText: propButtonText,
  buttonUrl: propButtonUrl,
  images: propImages,
}: OurWorkSectionProps = {}) {
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

  // Helper to get JSON value from content
  const getContentJSON = <T,>(key: string, defaultValue: T): T => {
    const value = pageContent[key];
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
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
  const heading = getValue("ourWork.heading", propHeading, "OUR WORK");
  const title = getValue(
    "ourWork.title",
    propTitle,
    "Discover Our Latest Activities"
  );
  const description = getValue(
    "ourWork.description",
    propDescription,
    "Turning Tides works in close partnership with grassroots groups, NGO allies, and dedicated funders. We connect regularly in person and virtually to exchange knowledge, provide supports and create new opportunities for change."
  );
  const buttonText = getValue(
    "ourWork.buttonText",
    propButtonText,
    "See Our Work"
  );
  const buttonUrl = getValue("ourWork.buttonUrl", propButtonUrl, "/our-work");

  // Get images with priority: context > props > default
  const contextImages = getContentJSON<ImageItem[]>("ourWork.images", []);
  const images =
    contextImages.length > 0 ? contextImages : propImages || defaultImages;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            {/* Heading */}
            <div>
              <span className="text-xs uppercase tracking-wider text-[#3C62ED] font-normal font-work-sans">
                {heading}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-[38px] font-nunito-sans font-bold text-[#010107] leading-tight">
              {title}
            </h2>

            {/* Description */}
            <p className="text-base text-[#060726CC] leading-relaxed font-work-sans font-normal">
              {description}
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href={buttonUrl}
                className="inline-flex items-center gap-3 px-8 py-5 bg-[#3C62ED] text-white text-base rounded-[4px] hover:bg-[#2f55e1] transition-colors duration-200 font-medium group"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden group"
              >
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
