"use client";

import React from "react";
import Image from "next/image";
import { H5, P } from "../ui/typography";

interface CommunityStoriesSectionProps {
  leftText?: string;
  rightText?: string;
  images?: {
    id: string;
    src: string;
    alt: string;
  }[];
}

export const CommunityStoriesSection: React.FC<
  CommunityStoriesSectionProps
> = ({
  leftText = "In many cases, Turning Tides plays a small part in these much longer stories of struggle, resilience, and transformation that belong to the communities themselves.",
  rightText = "Each story celebrates communities working with allies and the supports they bring—**legal services, advocacy, strategic partnerships.** Together, they are reclaiming how tenure is understood and experienced— not only as short term access and use, but as a suite of enduring rights, responsibilities, and socio-cultural relationships. Working locally, nationally, and with international processes, our partners are at the helm; ensuring that Indigenous and fisher peoples tenure security and rights recognition lead to improved social and environmental change.",
  images = [
    {
      id: "1",
      src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      alt: "Young Asian man on beach holding two large silver fish with wooden cart and motorcycle in background",
    },
    {
      id: "2",
      src: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      alt: "Four women standing together with packaged food products on table in front of them",
    },
    {
      id: "3",
      src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      alt: "Asian man on beach wearing conical hat holding two large marine creatures with colorful boat in background",
    },
  ],
}) => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Image Collage */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 overflow-hidden rounded-lg shadow-lg">
            {images.map((image) => (
              <div key={image.id} className="relative h-80 md:h-96">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}

          <H5 style="h5regular" className="text-[#060726CC] leading-[1.4]">
            {leftText}
          </H5>

          {/* Right Column */}
          <P style="p1reg" className="text-[#060726] leading-[1.5]">
            {rightText.split("**").map((part, index) =>
              index % 2 === 1 ? (
                <strong key={index} className="font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </P>
        </div>
      </div>
    </section>
  );
};
