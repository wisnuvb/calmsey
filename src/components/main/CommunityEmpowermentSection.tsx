"use client";

import React, { useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { H2 } from "@/components/ui/typography";
import { SearchIcon } from "lucide-react";
import { Lightbox } from "../common";

interface CommunityImage {
  id: string;
  src: string;
  alt: string;
  description?: string;
}

interface CommunityEmpowermentSectionProps {
  title?: string;
  description?: string;
  images?: CommunityImage[];
}

export const CommunityEmpowermentSection: React.FC<
  CommunityEmpowermentSectionProps
> = ({
  title = "Empowering Communities Isn't Just An End Goal",
  description = "Turning Tides implements and advocates for liberatory approaches to partnership and grant-making - empowering and centering local communities, small-scale fishers and fish workers, and Indigenous Peoples and their supporting groups. Our practices include multi-year flexible funding, streamlined processes, and comprehensive support beyond the financial contribution.",
  images = [
    {
      id: "1",
      src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      alt: "Community meeting with diverse group of people",
      description: "Community engagement and collaboration",
    },
    {
      id: "2",
      src: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      alt: "Fisherman casting net at sunset",
      description: "Traditional fishing practices",
    },
    {
      id: "3",
      src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      alt: "Woman drying fish on bamboo pole",
      description: "Local food preservation methods",
    },
    {
      id: "4",
      src: "/assets/demo/achive.png",
      alt: "Aerial view of coastal community",
      description: "Coastal community development",
    },
    {
      id: "5",
      src: "/assets/demo/our-vision.png",
      alt: "Group photo with community members",
      description: "Community partnerships",
    },
    {
      id: "6",
      src: "/assets/demo/strategy.png",
      alt: "Cultural face painting ceremony",
      description: "Cultural preservation and traditions",
    },
    {
      id: "7",
      src: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      alt: "Fisherman with catch at sunset",
      description: "Sustainable fishing practices",
    },
    {
      id: "8",
      src: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      alt: "Community gathering outdoors",
      description: "Community organizing",
    },
    {
      id: "9",
      src: "/assets/demo/achive.png",
      alt: "Fishing boats at sunset",
      description: "Marine resource management",
    },
  ],
}) => {
  const [selectedImage, setSelectedImage] = useState<CommunityImage | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const openLightbox = (image: CommunityImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Content */}
        <div className="text-center mb-16">
          <H2 style="h2reg" className="text-center text-[#010107] mb-6">
            {title}
          </H2>
          <p className="text-base text-[#06072680] mx-auto leading-[1.5] tracking-normal">
            {description}
          </p>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto"
          columnClassName=""
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border cursor-pointer"
              onClick={() => openLightbox(image, index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={0}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ height: "auto" }}
              />
              {image.description && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{image.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Masonry>

        {selectedImage && (
          <Lightbox
            selectedImage={selectedImage}
            currentIndex={currentIndex}
            images={images}
            closeLightbox={closeLightbox}
            handleKeyDown={handleKeyDown}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
          />
        )}
      </div>
    </section>
  );
};
