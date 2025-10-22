"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { H3, P } from "../ui/typography";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface VideoStory {
  id: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  videoUrl: string;
  isLarge?: boolean;
}

interface StoriesSectionProps {
  title?: string;
  stories?: VideoStory[];
}

const VideoCard: React.FC<VideoStory> = ({
  imageSrc,
  imageAlt,
  description,
  videoUrl,
  isLarge = false,
}) => {
  return (
    <div
      className={`relative group overflow-hidden rounded-lg ${
        isLarge ? "col-span-full lg:col-span-1" : "col-span-full"
      }`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={isLarge ? 700 : 350}
        height={isLarge ? 400 : 200}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110"
          aria-label="Play video"
        >
          <Play className="w-8 h-8 text-black fill-current" />
        </a>
      </div>
      <div
        className={cn("absolute bottom-0 left-0 right-0 p-4", {
          "bg-[#060726CC] flex items-center gap-6": isLarge,
          "bg-black bg-opacity-60": !isLarge,
        })}
      >
        <P style="p1reg" className="text-white">
          {description}
        </P>
        {isLarge && (
          <div className="shrink-0">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 border border-white text-white text-sm font-semibold rounded-md hover:bg-white hover:text-black transition-colors duration-300"
            >
              Watch Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export const StoriesSection: React.FC<StoriesSectionProps> = ({
  title = "Amazing Stories From The Fields and Our Partners",
  stories = [
    {
      id: "1",
      imageSrc: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      imageAlt: "Hands holding various fruits from Pulau Sangihe",
      description:
        "Supporting rights and tenure pilot project in Pulau Sangihe with Jaring Nusa (Partner of BRWA), Indonesia",
      videoUrl: "#",
      isLarge: true,
    },
    {
      id: "2",
      imageSrc: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      imageAlt: "Person in conical hat rowing a boat",
      description: "Supporting rights and tenure pilot project in Vietnam",
      videoUrl: "#",
      isLarge: false,
    },
    {
      id: "3",
      imageSrc: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      imageAlt: "Fisherman holding a large fish on a boat",
      description:
        "Traditional marine tenure: A basis for artisanal fishing communities",
      videoUrl: "#",
      isLarge: false,
    },
  ],
}) => {
  const router = useRouter();

  const largeStory = stories.find((story) => story.isLarge) || stories[0];
  const smallStories = stories.filter((story) => !story.isLarge);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <H3 style="h3bold" className="text-center text-[#010107] mb-11">
          {title}
        </H3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Large Video Card */}
          {largeStory && (
            <div className="col-span-12 lg:col-span-8">
              <VideoCard key={largeStory.id} {...largeStory} />
            </div>
          )}

          {/* Small Video Cards */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-5">
            {smallStories.map((story) => (
              <VideoCard key={story.id} {...story} />
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/stories")}
          className="mt-11 mx-auto py-5 px-8 text-[#010107] text-base font-normal block border border-[#CADBEA] rounded"
        >
          All Stories
        </button>
      </div>
    </section>
  );
};
