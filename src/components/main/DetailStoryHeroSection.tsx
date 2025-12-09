"use client";

import Image from "next/image";
import { H1, P } from "../ui/typography";
import { cn, getImageUrl } from "@/lib/utils";

interface DetailStoryHeroSectionProps {
  title: string;
  date: string;
  backgroundImage: string;
  className?: string;
}

export function DetailStoryHeroSection({
  title,
  date,
  backgroundImage,
  className,
}: DetailStoryHeroSectionProps) {
  return (
    <section
      className={cn(
        "relative min-h-[400px] lg:min-h-[500px] flex items-center bg-black",
        className
      )}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {backgroundImage && (
          <Image
            src={getImageUrl(backgroundImage)}
            alt="Article background"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
        <P style="p1reg" className="text-white/80 mb-6">
          {date}
        </P>
        <H1 style="h1bold" className="text-white max-w-4xl mx-auto">
          {title}
        </H1>
      </div>
    </section>
  );
}
