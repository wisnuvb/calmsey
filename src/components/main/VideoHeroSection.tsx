"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { H1, P } from "../ui/typography";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface VideoHeroSectionProps {
  videoUrl?: string;
  posterImage?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function VideoHeroSection({
  videoUrl: propVideoUrl,
  posterImage: propPosterImage,
  title: propTitle,
  subtitle: propSubtitle,
  className,
}: VideoHeroSectionProps) {
  const { getContentValue } = usePageContentHelpers()

  const title =
    propTitle ||
    getContentValue(
      "hero.title",
      "Supporting rights recognition and secure tenure of coastal and shoreline communities"
    );

  const subtitle =
    propSubtitle ||
    getContentValue(
      "hero.subtitle",
      "We contribute to a world where local communities, fisher peoples and Indigenous Peoples experience agency and voice in the management, conservation, development, and adaptation of their environments and resources."
    );

  const videoUrl =
    propVideoUrl ||
    getContentValue(
      "hero.videoUrl",
      "/assets/video/8248432-hd_1280_720_30fps.mp4"
    );

  const posterImage =
    propPosterImage ||
    getContentValue("hero.posterImage", "/assets/demo/bg-video.png");

  return (
    <section
      className={cn(
        "relative h-[534px] w-full overflow-hidden flex items-center justify-center mb-[80px]",
        className
      )}
      style={{ top: "80px" }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-blue-900/60 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster={posterImage}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <H1
          className="text-white mb-11 max-w-5xl mx-auto font-bold leading-tight drop-shadow-lg "
          style="h1bold"
        >
          {title}
        </H1>
        <P
          className="text-white/90 max-w-4xl mx-auto text-sm md:text-xl font-medium leading-relaxed drop-shadow-md"
          style="p1reg"
        >
          {subtitle}
        </P>
      </div>
    </section>
  );
}
