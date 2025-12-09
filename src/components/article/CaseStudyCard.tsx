"use client";

import React from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";

interface CaseStudyCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  link?: string;
  className?: string;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  image,
  imageAlt,
  title,
  description,
  link,
  className = "",
}) => {
  const CardContent = (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden flex gap-8",
        className
      )}
    >
      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src={getImageUrl(image)}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        className="block hover:shadow-lg transition-shadow duration-300"
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
};
