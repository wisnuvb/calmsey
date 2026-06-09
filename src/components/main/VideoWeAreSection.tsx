"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import { getVideoEmbedInfo } from "@/lib/video-embed";

interface VideoWeAreSectionProps {
  videoUrl?: string;
  posterImage?: string;
  titleLine1?: string;
  titleLine2?: string;
  className?: string;
}

export function VideoWeAreSection({
  videoUrl: propVideoUrl,
  posterImage: propPosterImage,
  titleLine1: propTitleLine1,
  titleLine2: propTitleLine2,
  className,
}: VideoWeAreSectionProps) {
  const { getValue } = usePageContentHelpers();

  const videoUrl = getValue(
    "weAreVideo.videoUrl",
    propVideoUrl,
    "",
  ).trim();

  const posterImage = getValue(
    "weAreVideo.posterImage",
    propPosterImage,
    "",
  ).trim();

  const titleLine1 = getValue(
    "weAreVideo.titleLine1",
    propTitleLine1,
    "",
  );

  const titleLine2 = getValue(
    "weAreVideo.titleLine2",
    propTitleLine2,
    "",
  );

  /** Autoplay di browser memerlukan mute untuk YouTube/Vimeo/file langsung. */
  const videoInfo = useMemo(
    () => getVideoEmbedInfo(videoUrl, { mutedAutoplay: true }),
    [videoUrl],
  );

  if (!videoUrl && !posterImage) {
    return null;
  }

  const hasVideo = Boolean(videoUrl);

  const posterOverlayTitles = (
    <>
      {titleLine1 ? (
        <p className="mb-2 text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-md sm:text-4xl md:text-5xl">
          {titleLine1}
        </p>
      ) : null}
      {titleLine2 ? (
        <p className="mb-8 text-4xl font-extrabold uppercase tracking-wide text-[#2dd4bf] drop-shadow-md sm:text-5xl md:text-6xl">
          {titleLine2}
        </p>
      ) : null}
    </>
  );

  return (
    <section
      className={cn(
        "container mx-auto px-4 mb-[80px]",
        className,
      )}
    >
      <div className="relative aspect-[16/9] min-h-[280px] w-full overflow-hidden rounded bg-slate-900 shadow-xl md:min-h-[360px]">
        {hasVideo ? (
          <>
            <div className="absolute inset-0 z-0 bg-black">
              {videoInfo.type === "youtube" && videoInfo.embedUrl ? (
                <iframe
                  src={videoInfo.embedUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  title={titleLine2 || titleLine1 || "Video"}
                />
              ) : null}

              {videoInfo.type === "vimeo" && videoInfo.embedUrl ? (
                <iframe
                  src={videoInfo.embedUrl}
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={titleLine2 || titleLine1 || "Video"}
                />
              ) : null}

              {videoInfo.type === "direct" ? (
                <video
                  muted
                  autoPlay
                  playsInline
                  controls
                  className="h-full w-full object-cover"
                  poster={posterImage ? getImageUrl(posterImage) : undefined}
                >
                  <source src={videoUrl} />
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </div>
          </>
        ) : (
          <>
            {posterImage ? (
              <div className="absolute inset-0 z-0">
                <Image
                  src={getImageUrl(posterImage)}
                  alt={titleLine2 || "Video poster"}
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>
            ) : (
              <div className="absolute inset-0 z-0 bg-slate-900" />
            )}

            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-black/25 to-black/35" />

            <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center">
              {posterOverlayTitles}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
