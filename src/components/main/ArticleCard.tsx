"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface ArticleCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  link?: string;
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  image,
  imageAlt,
  title,
  description,
  link,
  className = "",
}) => {
  const CardContent = (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={getImageUrl(image)}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
};
