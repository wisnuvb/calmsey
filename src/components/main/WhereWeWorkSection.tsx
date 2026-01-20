"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useState } from "react";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface WhereWeWorkSectionProps {
  title?: string;
  actionPlansText?: string;
  actionPlansLinkText?: string;
  actionPlansLinkUrl?: string;
  explorationText?: string;
  mapImage?: string;
  partnersText?: string;
  partnersLinkText?: string;
  partnersLinkUrl?: string;
  content?: string;
}

export function WhereWeWorkSection({
  title: propTitle,
  actionPlansText: propActionPlansText,
  actionPlansLinkText: propActionPlansLinkText,
  actionPlansLinkUrl: propActionPlansLinkUrl,
  explorationText: propExplorationText,
  mapImage: propMapImage,
  partnersText: propPartnersText,
  partnersLinkText: propPartnersLinkText,
  partnersLinkUrl: propPartnersLinkUrl,
}: WhereWeWorkSectionProps = {}) {
  const [imageError, setImageError] = useState(false);

  const { getValue } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const title = getValue(
    "whereWeWork.title",
    propTitle,
    "Where Does Turning Tides Work?"
  );

  const actionPlansText = getValue(
    "whereWeWork.actionPlansText",
    propActionPlansText,
    "We have **developed action plans for Latin America and Africa**, and **mobilizing grants** for work in Chile, Honduras, Panama, Costa Rica, Senegal, Uganda."
  );

  const actionPlansLinkText = getValue(
    "whereWeWork.actionPlansLinkText",
    propActionPlansLinkText,
    "See Action Plans"
  );

  const actionPlansLinkUrl = getValue(
    "whereWeWork.actionPlansLinkUrl",
    propActionPlansLinkUrl,
    "#"
  );

  const explorationText = getValue(
    "whereWeWork.explorationText",
    propExplorationText,
    "We are also in **the exploration and engagement phase** – Brazil, India, Indonesia, Sri Lanka, Thailand."
  );

  const mapImage = getValue(
    "whereWeWork.mapImage",
    propMapImage,
    "/assets/world-map.png"
  );

  // Use getImageUrl with validation built-in
  const imageUrl = getImageUrl(mapImage, "/assets/world-map.png");

  const partnersText = getValue(
    "whereWeWork.partnersText",
    propPartnersText,
    'Our **"Partners Piloting"** partners were in Bangladesh, Thailand, Indonesia, Honduras, Senegal.'
  );

  const partnersLinkText = getValue(
    "whereWeWork.partnersLinkText",
    propPartnersLinkText,
    "View Report"
  );

  const partnersLinkUrl = getValue(
    "whereWeWork.partnersLinkUrl",
    propPartnersLinkUrl,
    "#"
  );

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-[38px] font-nunito-sans font-bold text-[#010107]">
            {title}
          </h2>
        </div>

        {/* Legend Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16 max-w-6xl mx-auto">
          {/* Block 1 - Action Plans */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-[#3C62ED] flex-shrink-0 mt-1" />
            <div className="text-base text-gray-900 font-work-sans leading-relaxed">
              <p className="mb-2">
                {actionPlansText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                  // Every odd index is the text inside **
                  if (index % 2 === 1) {
                    return <strong key={index}>{part}</strong>;
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>
              <Link
                href={actionPlansLinkUrl}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span>{actionPlansLinkText}</span>
                <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Block 2 - Exploration Phase */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-[#7db5bb] flex-shrink-0 mt-1" />
            <p className="text-base text-gray-900 font-work-sans leading-relaxed">
              {explorationText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                // Every odd index is the text inside **
                if (index % 2 === 1) {
                  return <strong key={index}>{part}</strong>;
                }
                return <span key={index}>{part}</span>;
              })}
            </p>
          </div>

          {/* Block 3 - Partners Piloting */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-[#C4B5FD] flex-shrink-0 mt-1" />
            <div className="text-base text-gray-900 font-work-sans leading-relaxed">
              <p className="mb-2">
                {partnersText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                  // Every odd index is the text inside **
                  if (index % 2 === 1) {
                    return <strong key={index}>{part}</strong>;
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>
              <Link
                href={partnersLinkUrl}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span>{partnersLinkText}</span>
                <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* World Map */}
        <div className="relative w-full">
          <div className="relative w-full aspect-[16/9] lg:aspect-[2/1]">
            {!imageError ? (
              <Image
                src={getImageUrl(imageUrl)}
                alt="World Map showing Turning Tides work locations"
                fill
                className="object-contain"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <p className="text-sm">Image not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
