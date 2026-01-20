"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl, cn } from "@/lib/utils";
import { H2, P } from "@/components/ui/typography";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface ValueItem {
  id: string;
  title: string;
  imageSrc: string;
  className?: string; // For custom grid spanning
}

const defaultValues: ValueItem[] = [
  {
    id: "center-power",
    title:
      "Center power with partners (i.e., Local communities, small-scale fishers, fish workers, and Indigenous Peoples, and the groups that legitimately serve and support them)",
    imageSrc: "/assets/partner1.webp",
    className: "h-[400px] md:h-full", // Tall item
  },
  {
    id: "uphold-lived-experience",
    title: "Uphold lived experience and diverse knowledge.",
    imageSrc: "/assets/our-view.webp",
    className: "h-[250px]",
  },
  {
    id: "base-trust",
    title: "Base our work on trust, responsiveness and service.",
    imageSrc: "/assets/slider-1.webp",
    className: "h-[250px]",
  },
  {
    id: "transparency",
    title: "Prioritize transparency & accountability.",
    imageSrc: "/assets/slider-2.webp",
    className: "h-[250px]",
  },
  {
    id: "foster-solidarity",
    title: "Foster solidarity and protect civic spaces.",
    imageSrc: "/assets/slider-3.webp",
    className: "h-[250px]",
  },
  {
    id: "self-determination",
    title: "Prioritize and plan for self-determination and independence.",
    imageSrc: "/assets/achieve-1.webp",
    className: "h-[250px]",
  },
  {
    id: "humility",
    title: "Commit to humility and reflexivity.",
    imageSrc: "/assets/gov-hero.webp",
    className: "h-[400px] md:h-full", // Tall item
  },
];

interface OurValuesSectionProps {
  title?: string;
  description?: string;
  values?: ValueItem[];
}

export const OurValuesSection: React.FC<OurValuesSectionProps> = ({
  title: propTitle,
  description: propDescription,
  values: propValues,
}) => {
  const { getValue, getContentJSON } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const title = getValue("values.title", propTitle, "Our Values");
  const description = getValue(
    "values.description",
    propDescription,
    "Our values and principles were built through consultation with partners, discussion with the Steering Committee, and established practices of liberatory grantmaking. They guide our decisions, interactions, and approach to our work—they are foundational to who we are as an organization."
  );
  const values = getContentJSON<ValueItem[]>(
    "values.items",
    propValues || defaultValues
  );

  // Split values into columns for the masonry layout
  // Column 1: Center power (Tall), Foster solidarity
  const col1 = [values[0], values[4]];

  // Column 2: Uphold lived experience, Prioritize transparency, Prioritize self-determination
  const col2 = [values[1], values[3], values[5]];

  // Column 3: Base our work on trust, Commit to humility (Tall)
  const col3 = [values[2], values[6]];

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#3C62ED] p-3 rounded-lg">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.2968 6.94195L13.3593 2.44195C13.3067 2.38182 13.2418 2.3336 13.1691 2.3005C13.0963 2.26741 13.0174 2.25019 12.9375 2.25H5.06245C4.98253 2.25019 4.90357 2.26741 4.83083 2.3005C4.75808 2.3336 4.69323 2.38182 4.64058 2.44195L0.703079 6.94195C0.611221 7.04683 0.561583 7.18208 0.563791 7.32148C0.566 7.46088 0.619897 7.59449 0.715032 7.69641L8.59003 16.1339C8.64266 16.1903 8.70634 16.2353 8.7771 16.2661C8.84787 16.2968 8.9242 16.3127 9.00136 16.3127C9.07852 16.3127 9.15485 16.2968 9.22562 16.2661C9.29638 16.2353 9.36006 16.1903 9.41269 16.1339L17.2877 7.69641C17.3824 7.59414 17.4358 7.46034 17.4375 7.32094C17.4392 7.18154 17.3891 7.04648 17.2968 6.94195ZM15.6353 6.75H12.6562L10.125 3.375H12.6822L15.6353 6.75ZM5.24386 7.875L7.36238 13.1716L2.41941 7.875H5.24386ZM11.5439 7.875L8.99995 14.2355L6.45605 7.875H11.5439ZM6.74995 6.75L8.99995 3.74977L11.25 6.75H6.74995ZM12.756 7.875H15.5805L10.6375 13.1716L12.756 7.875ZM5.31769 3.375H7.87495L5.3437 6.75H2.36456L5.31769 3.375Z"
                  fill="white"
                />
              </svg>
            </div>
            <H2 style="h2bold" className="text-black">
              {title}
            </H2>
          </div>
          <P style="p1reg" className="text-[#060726CC]">
            {description}
          </P>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {col1.map((item) => (
              <ValueCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            {col2.map((item) => (
              <ValueCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            {col3.map((item) => (
              <ValueCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ValueCard: React.FC<{ item: ValueItem }> = ({ item }) => {
  return (
    <div
      className={cn(
        "relative w-full rounded-sm overflow-hidden group",
        item.className
      )}
    >
      {/* Background Image */}
      <Image
        src={getImageUrl(item.imageSrc)}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-white font-bold text-lg leading-tight">
          {item.title}
        </p>
      </div>
    </div>
  );
};
