"use client";

import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface GrantmakingProcessSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  paragraphs?: string[];
  image?: string;
  imageAlt?: string;
  backgroundColor?: string;
}

export function GrantmakingProcessSection({
  image = "/assets/gov-grantmaking.webp",
  imageAlt = "Grantmaking process meeting with partners",
  backgroundColor = "bg-white",
}: GrantmakingProcessSectionProps) {
  return (
    <section className={cn("py-16 lg:py-0", backgroundColor)}>
      <div className="container mx-auto px-4 sm:px-0 space-y-8">
        <div className="relative w-full aspect-[10/3.7] overflow-hidden rounded-lg">
          <Image
            src={getImageUrl(image)}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex items-center justify-between gap-16">
          <p className="text-[#06072680] text-base italic font-work-sans font-normal leading-[150%] tracking-normal">
            Our values and principles were built from what we were hearing
            through consultation from our potential partners, in discussion with
            the Steering Committee, and from established practices of liberatory
            approaches to grantmaking.
          </p>
          <button className="text-[#11081F] text-base font-nunito-sans font-normal shrink-0 flex items-center gap-4 border border-[#11081F] rounded-sm py-5 px-8">
            Our Grantmaking
            <ArrowUpRight />
          </button>
        </div>
      </div>
    </section>
  );
}
