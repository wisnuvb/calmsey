"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { H2, P } from "@/components/ui/typography";
import { getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface OurValuesPrinciplesSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  imageAlt?: string;
}

export function OurValuesPrinciplesSection({
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  buttonText: propButtonText,
  buttonLink: propButtonLink,
  image: propImage,
  imageAlt: propImageAlt,
}: OurValuesPrinciplesSectionProps = {}) {
  const { getValue } = usePageContentHelpers()

  const title = getValue(
    "valuesPrinciples.title",
    propTitle,
    "Our Values & Principles"
  );
  const subtitle = getValue(
    "valuesPrinciples.subtitle",
    propSubtitle,
    "Built with partners, attentive to power and accountability in all we do"
  );
  const description = getValue(
    "valuesPrinciples.description",
    propDescription,
    "Our values and principles were built through consultation with partners, discussion with the Steering Committee, and established practices of liberatory grantmaking. They guide our decisions, interactions, and approach to our work—they are foundational to who we are as an organization."
  );
  const buttonText = getValue(
    "valuesPrinciples.buttonText",
    propButtonText,
    "Learn More About Our Strategy"
  );
  const buttonLink = getValue(
    "valuesPrinciples.buttonLink",
    propButtonLink,
    "/strategy"
  );
  const image = getValue(
    "valuesPrinciples.image",
    propImage,
    "/assets/principles.webp"
  );
  const imageAlt = getValue(
    "valuesPrinciples.imageAlt",
    propImageAlt,
    "Our Values & Principles"
  );
  return (
    <section className="py-16 lg:py-0 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Title */}
            <H2 style="h2bold" className="text-[#010107]">
              {title}
            </H2>

            {/* Subtitle - Blue colored */}
            <P style="p1reg" className="text-[#3C62ED] font-medium">
              {subtitle}
            </P>

            {/* Description */}
            <P style="p1reg" className="text-[#060726CC] leading-relaxed">
              {description}
            </P>

            {/* Button */}
            <div className="pt-4">
              <a
                href={buttonLink}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-[#010107] hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                {buttonText}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative w-full aspect-square p-8 lg:aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src={getImageUrl(image)}
                alt={imageAlt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
