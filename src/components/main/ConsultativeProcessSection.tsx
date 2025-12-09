"use client";

import Image from "next/image";
import { Globe, Handshake } from "lucide-react";
import { H2, P } from "@/components/ui/typography";
import { cn, getImageUrl } from "@/lib/utils";

interface ConsultativeProcessSectionProps {
  image?: string;
  imageAlt?: string;
  topText?: string;
  mainTitle?: string;
  backgroundColor?: string;
  className?: string;
}

export function ConsultativeProcessSection({
  image = "/assets/ConsultativeProcess.webp",
  imageAlt = "Consultative meeting with diverse participants",
  topText = "We have used a suite of consultative processes to shape our grassroots strategies and grant decisions to date.",
  mainTitle = "Turning Tides is exploring new ways to increase inclusion and share power in decision making and strategy setting in the nations and regions where we work.",
  backgroundColor = "bg-white",
  className,
}: ConsultativeProcessSectionProps) {
  return (
    <section
      className={cn(
        "w-full py-16 lg:py-24 relative overflow-hidden",
        backgroundColor,
        className
      )}
    >
      {/* Background World Map Pattern */}
      <div className="absolute bottom-0 left-0 w-full h-40 opacity-20 pointer-events-none">
        <Image
          src="/assets/world-map.webp"
          alt="World map background"
          fill
          className="object-cover object-bottom"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Section - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] rounded overflow-hidden shadow-lg">
              <Image
                src={getImageUrl(image)}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="order-1 lg:order-2">
            <div className="flex flex-col items-center justify-center text-center gap-6">
              {/* Icons */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                  <Globe className="w-8 h-8 text-[#3C62ED]" />
                </div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                  <Handshake className="w-8 h-8 text-[#3C62ED]" />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-6">
                {/* Top Text */}
                <P
                  style="p1reg"
                  className="text-[#06072680 text-base font-work-sans font-normal leading-[150%] tracking-normal"
                >
                  {topText}
                </P>

                {/* Main Title */}
                <H2
                  style="h2bold"
                  className="text-[#010107] text-xl sm:text-[26px] leading-[140%] tracking-normal font-nunito-sans font-normal"
                >
                  {mainTitle}
                </H2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
