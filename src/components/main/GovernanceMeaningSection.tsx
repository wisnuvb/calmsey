"use client";

import Image from "next/image";
import { H2, P } from "@/components/ui/typography";
import { usePageContent } from "@/contexts/PageContentContext";
import { getImageUrl } from "@/lib/utils";

interface GovernanceMeaningSectionProps {
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  paragraphs?: string[];
}

export function GovernanceMeaningSection({
  title: propTitle,
  subtitle: propSubtitle,
  image: propImage,
  imageAlt: propImageAlt,
  paragraphs: propParagraphs,
}: GovernanceMeaningSectionProps = {}) {
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
    "governanceMeaning.title",
    propTitle,
    "What governance means to Turning Tides and why it’s foundational"
  );

  const subtitle = getValue(
    "governanceMeaning.subtitle",
    propSubtitle,
    "(power, agency, connection to theory of change)."
  );

  const image = getValue(
    "governanceMeaning.image",
    propImage,
    "/assets/achieve-1.webp"
  );

  const imageAlt = getValue(
    "governanceMeaning.imageAlt",
    propImageAlt,
    "Boats near a riverside community"
  );

  const getContentJSON = <T,>(key: string, defaultValue: T): T => {
    const value = pageContent[key];
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  };

  const defaultParagraphs = [
    "Lorem ipsum dolor sit amet consectetur. Purus sed massa pharetra maecenas eu eleifend turpis. Arcu tellus fermentum quis tempor faucibus et eros arcu. Eget non nullam senectus sit risus ut felis. Malesuada placerat suspendisse nulla proin faucibus. Eros sem quam magna et volutpat pellentesque. Arcu molestie ac tellus pellentesque placerat in suspendisse. Senectus nisl quis tincidunt mauris nibh ac ac eget.",
    "Justo tortor nam dictumst dui pretium nec. Sapien dignissim diam nulla arcu magnis mauris scelerisque id sollicitudin. Eu vestibulum in eu felis sit amet pellentesque sagittis suspendisse. Tristique fames neque semper nisl purus pretium sem ornare nisl. Non aliquam dolor amet odio. Est scelerisque semper euismod mauris. Egestas varius enim tortor commodo elementum curabitur faucibus cras.",
    "Turpis at pellentesque dui quis accumsan at pellentesque ultricies. Rutrum sed leo ut dolor morbi eget. Eget semper malesuada tempus sit malesuada imperdiet malesuada dignissim bibendum. Duis viverra tempus elementum sit velit at in. Gravida nunc diam risus pharetra nibh nullam. Blandit et eget viverra nisl vitae",
  ];

  // Get paragraphs from content (can be array of strings or array of objects with paragraph property)
  const rawParagraphs = getContentJSON<string[] | { paragraph: string }[]>(
    "governanceMeaning.paragraphs",
    propParagraphs || defaultParagraphs
  );

  // Normalize to array of strings
  const paragraphs = rawParagraphs
    .map((p) => (typeof p === "string" ? p : p.paragraph))
    .filter((paragraph) => paragraph && paragraph.trim() !== "");

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-6">
            <H2
              style="h1bold"
              className="text-[#010107] font-nunito-sans text-2xl sm:text-[38px] leading-[120%] tracking-normal"
            >
              {title}
            </H2>
            <P
              style="p1reg"
              className="text-[#060726CC] text-xl font-normal leading-[140%] tracking-normal"
            >
              {subtitle}
            </P>
          </div>

          <div className="space-y-8">
            <div className="relative w-full aspect-[10/4.7] overflow-hidden rounded shadow-sm">
              <Image
                src={getImageUrl(image)}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 640px, (min-width: 1024px) 560px, 100vw"
                priority
              />
            </div>

            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <P
                  key={index}
                  style="p1reg"
                  className="text-[#3F3F46] leading-[170%]"
                >
                  {paragraph}
                </P>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
