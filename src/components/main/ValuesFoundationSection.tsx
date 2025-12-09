"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface ValuesFoundationSectionProps {
  title?: string;
  image?: string;
  imageAlt?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

export const ValuesFoundationSection: React.FC<
  ValuesFoundationSectionProps
> = ({
  image = "/assets/demo/our-vision.png", // Placeholder image path
  imageAlt = "Our team representing our values and principles",
  text = "Our values and principles were built from what we were hearing through consultation from our potential partners, in discussion with the Steering Committee, and from established practices of liberatory approaches to grantmaking.",
  buttonText = "Funds We Support",
  buttonLink = "/fund",
}) => {
  return (
    <section className="w-full relative mt-28">
      <div className="bg-[#548F93] h-[282px] relative">
        <Image
          src={getImageUrl(image)}
          alt={imageAlt}
          width={1000}
          height={500}
          className="object-cover w-full h-[420px] container mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2"
          priority
        />
      </div>
      <div className="bg-[#548F93] px-6 pt-11 pb-20 md:px-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Text Content */}
            <div className="flex-1">
              <p className="text-gray-100 text-lg leading-relaxed max-w-3xl">
                {text}
              </p>
            </div>

            {/* Button */}
            <div className="flex-shrink-0">
              <a
                href={buttonLink}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-100 hover:bg-white hover:text-teal-600 transition-colors duration-200 rounded-md font-medium"
              >
                {buttonText}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
