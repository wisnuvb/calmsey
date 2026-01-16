"use client";

import { useState, useMemo } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DetailStoryVideoSectionProps {
  videoUrl?: string;
  posterImage?: string;
  title?: string;
  className?: string;
}

type VideoType = "youtube" | "vimeo" | "direct";

// Helper function to detect video type and extract ID
function getVideoInfo(url: string): {
  type: VideoType;
  embedUrl?: string;
  videoId?: string;
} {
  if (!url) {
    return { type: "direct" };
  }

  // YouTube detection
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      type: "youtube",
      videoId: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo detection
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Direct video (MP4, WebM, etc.)
  return { type: "direct" };
}

export function DetailStoryVideoSection({
  videoUrl,
  posterImage,
  title = "Watch Now",
  className,
}: DetailStoryVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoInfo = useMemo(() => getVideoInfo(videoUrl || ""), [videoUrl]);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  // If no video URL but has poster image, show as regular image
  const isImageOnly = !videoUrl && !!posterImage;

  return (
    <section
      className={cn(
        "relative -mt-20 lg:-mt-32 z-20 max-w-4xl mx-auto px-4",
        className
      )}
    >
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-2xl bg-white">
        {isImageOnly ? (
          // Show as regular image if no video URL
          <div className="absolute inset-0 z-0">
            <Image
              src={posterImage!}
              alt={title || "Image"}
              fill
              className="object-cover"
            />
          </div>
        ) : !isPlaying && videoUrl ? (
          <>
            {/* Poster Image or Thumbnail */}
            {posterImage ? (
              <div className="absolute inset-0 z-0">
                <Image
                  src={posterImage}
                  alt={title || "Video thumbnail"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="absolute inset-0 z-0 bg-gray-900" />
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all pointer-events-none z-10">
              <button
                onClick={handlePlayVideo}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group cursor-pointer pointer-events-auto"
                aria-label="Play video"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900 ml-1 group-hover:text-gray-900 fill-current" />
              </button>
            </div>
          </>
        ) : isPlaying && videoUrl ? (
          // Video Player
          <div className="absolute inset-0 z-0">
            {videoInfo.type === "youtube" && videoInfo.embedUrl && (
              <iframe
                src={videoInfo.embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title || "YouTube video player"}
              />
            )}

            {videoInfo.type === "vimeo" && videoInfo.embedUrl && (
              <iframe
                src={videoInfo.embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={title || "Vimeo video player"}
              />
            )}

            {videoInfo.type === "direct" && (
              <video
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
                poster={posterImage}
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ) : null}
      </div>

      {!isPlaying && !isImageOnly && (
        <div className="text-center mt-4">
          <p className="text-white font-medium">{title}</p>
        </div>
      )}
    </section>
  );
}
