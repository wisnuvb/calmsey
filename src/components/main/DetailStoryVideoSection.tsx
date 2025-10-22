"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailStoryVideoSectionProps {
  videoUrl: string;
  posterImage: string;
  title?: string;
  className?: string;
}

export function DetailStoryVideoSection({
  videoUrl,
  posterImage,
  title = "Watch Now",
  className,
}: DetailStoryVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section
      className={cn(
        "relative -mt-20 lg:-mt-32 z-20 max-w-4xl mx-auto px-4",
        className
      )}
    >
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-2xl bg-white">
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all pointer-events-none z-10">
            <button
              onClick={handlePlayVideo}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group cursor-pointer pointer-events-auto"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900 ml-1 group-hover:text-gray-900 fill-current" />
            </button>
          </div>
        )}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          poster={posterImage}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {!isPlaying && (
        <div className="text-center mt-4">
          <p className="text-white font-medium">{title}</p>
        </div>
      )}
    </section>
  );
}
