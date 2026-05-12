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
  className?: string;
}

/** Urutan masonry per id — tidak bergantung urutan array CMS. */
const VALUE_IDS_BY_COLUMN: string[][] = [
  ["center-power", "self-determination"],
  ["foster-solidarity", "transparency", "base-trust"],
  ["uphold-lived-experience", "humility"],
];

const TALL_CARD_IDS = new Set(["center-power", "humility"]);

const DEFAULT_TALL_CLASS =
  "min-h-[280px] h-[min(72vh,440px)] sm:h-[460px] lg:h-[500px]";
const DEFAULT_SHORT_CLASS =
  "min-h-[220px] h-[250px] sm:h-[300px] lg:h-[320px]";

/** h-full di dalam flex kolom tanpa tinggi induk → kolaps; buang dari CMS. */
function sanitizeCardLayoutClasses(input?: string): string {
  if (!input?.trim()) return "";
  return input
    .trim()
    .split(/\s+/)
    .filter(
      (c) =>
        c &&
        !/^h-full$/.test(c) &&
        !/^sm:h-full$/.test(c) &&
        !/^md:h-full$/.test(c) &&
        !/^lg:h-full$/.test(c) &&
        !/^xl:h-full$/.test(c) &&
        !/^min-h-0$/.test(c),
    )
    .join(" ");
}

function hasExplicitHeightClass(classString: string): boolean {
  return /\b(min-)?h-(\[|\d)/.test(classString);
}

function partitionValuesById(values: ValueItem[]): [
  ValueItem[],
  ValueItem[],
  ValueItem[],
] {
  const byId = new Map(values.map((v) => [v.id, v]));
  const cols: ValueItem[][] = [[], [], []];
  const used = new Set<string>();

  VALUE_IDS_BY_COLUMN.forEach((ids, colIndex) => {
    for (const id of ids) {
      const item = byId.get(id);
      if (item) {
        cols[colIndex].push(item);
        used.add(id);
      }
    }
  });

  for (const v of values) {
    if (!used.has(v.id)) {
      cols[1].push(v);
    }
  }

  return [cols[0], cols[1], cols[2]];
}

const defaultValues: ValueItem[] = [
  {
    id: "center-power",
    title:
      "Center power with partners (i.e., Local communities, small-scale fishers, fish workers, and Indigenous Peoples, and the groups that legitimately serve and support them)",
    imageSrc: "/assets/partner1.webp",
    className: DEFAULT_TALL_CLASS,
  },
  {
    id: "uphold-lived-experience",
    title: "Uphold lived experience and diverse knowledge.",
    imageSrc: "/assets/our-view.webp",
    className: DEFAULT_SHORT_CLASS,
  },
  {
    id: "base-trust",
    title: "Base our work on trust, responsiveness and service.",
    imageSrc: "/assets/slider-1.webp",
    className: DEFAULT_SHORT_CLASS,
  },
  {
    id: "transparency",
    title: "Prioritize transparency & accountability.",
    imageSrc: "/assets/slider-2.webp",
    className: DEFAULT_SHORT_CLASS,
  },
  {
    id: "foster-solidarity",
    title: "Foster solidarity and protect civic spaces.",
    imageSrc: "/assets/slider-3.webp",
    className: DEFAULT_SHORT_CLASS,
  },
  {
    id: "self-determination",
    title: "Prioritize and plan for self-determination and independence.",
    imageSrc: "/assets/achieve-1.webp",
    className: DEFAULT_SHORT_CLASS,
  },
  {
    id: "humility",
    title: "Commit to humility and reflexivity.",
    imageSrc: "/assets/gov-hero.webp",
    className: DEFAULT_TALL_CLASS,
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
  const { getValue, getContentJSON } = usePageContentHelpers();

  const title = getValue("values.title", propTitle, "Our Values");
  const description = getValue(
    "values.description",
    propDescription,
    "Our values and principles were built through consultation with partners, discussion with the Steering Committee, and established practices of liberatory grantmaking. They guide our decisions, interactions, and approach to our work—they are foundational to who we are as an organization.",
  );
  const fromCms = getContentJSON<ValueItem[]>("values.items", []);
  const values =
    Array.isArray(fromCms) && fromCms.length > 0
      ? fromCms
      : propValues || defaultValues;

  const [col1, col2, col3] = partitionValuesById(values);

  return (
    <section className="bg-white py-16 lg:pb-24" id="values">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 max-w-4xl lg:mb-14">
          <div className="mb-4 flex items-start gap-4">
            <div className="flex-shrink-0 rounded-lg bg-[#3C62ED] p-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M17.2968 6.94195L13.3593 2.44195C13.3067 2.38182 13.2418 2.3336 13.1691 2.3005C13.0963 2.26741 13.0174 2.25019 12.9375 2.25H5.06245C4.98253 2.25019 4.90357 2.26741 4.83083 2.3005C4.75808 2.3336 4.69323 2.38182 4.64058 2.44195L0.703079 6.94195C0.611221 7.04683 0.561583 7.18208 0.563791 7.32148C0.566 7.46088 0.619897 7.59449 0.715032 7.69641L8.59003 16.1339C8.64266 16.1903 8.70634 16.2353 8.7771 16.2661C8.84787 16.2968 8.9242 16.3127 9.00136 16.3127C9.07852 16.3127 9.15485 16.2968 9.22562 16.2661C9.29638 16.2353 9.36006 16.1903 9.41269 16.1339L17.2877 7.69641C17.3824 7.59414 17.4358 7.46034 17.4375 7.32094C17.4392 7.18154 17.3891 7.04648 17.2968 6.94195ZM15.6353 6.75H12.6562L10.125 3.375H12.6822L15.6353 6.75ZM5.24386 7.875L7.36238 13.1716L2.41941 7.875H5.24386ZM11.5439 7.875L8.99995 14.2355L6.45605 7.875H11.5439ZM6.74995 6.75L8.99995 3.74977L11.25 6.75H6.74995ZM12.756 7.875H15.5805L10.6375 13.1716L12.756 7.875ZM5.31769 3.375H7.87495L5.3437 6.75H2.36456L5.31769 3.375Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="min-w-0 pt-0.5">
              <H2 style="h2bold" className="text-[#010107]">
                {title}
              </H2>
            </div>
          </div>
          <P className="text-[#060726CC]">{description}</P>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:items-start lg:grid-cols-3 lg:items-stretch lg:gap-5">
          <div className="flex min-h-0 flex-col gap-4 sm:gap-5">
            {col1.map((item, i) => (
              <ValueCard
                key={item.id}
                item={item}
                fillVertical={i === 0 ? "grow" : "fixed"}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:gap-5">
            {col2.map((item) => (
              <ValueCard key={item.id} item={item} fillVertical="fixed" />
            ))}
          </div>
          <div className="flex min-h-0 flex-col gap-4 sm:gap-5 md:col-span-2 lg:col-span-1">
            {col3.map((item, i) => (
              <ValueCard
                key={item.id}
                item={item}
                fillVertical={
                  i === col3.length - 1 && col3.length > 0 ? "grow" : "fixed"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ValueCard: React.FC<{
  item: ValueItem;
  fillVertical?: "grow" | "fixed";
}> = ({ item, fillVertical = "fixed" }) => {
  const cleaned = sanitizeCardLayoutClasses(item.className);
  const fallback = TALL_CARD_IDS.has(item.id)
    ? DEFAULT_TALL_CLASS
    : DEFAULT_SHORT_CLASS;
  const sizeClasses = hasExplicitHeightClass(cleaned)
    ? cleaned
    : cn(fallback, cleaned);

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden bg-neutral-900 shadow-sm",
        sizeClasses,
        fillVertical === "grow" &&
          "lg:min-h-[280px] lg:h-auto lg:flex-1 lg:basis-0",
        fillVertical === "fixed" && "shrink-0",
      )}
    >
      <Image
        src={getImageUrl(item.imageSrc)}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
        aria-hidden
      />
      <div className="absolute bottom-0 left-0 right-0 z-[1] bg-black/60 px-4 py-3 sm:px-5 sm:py-3.5">
        <p className="text-left font-work-sans text-sm font-medium leading-snug text-white sm:text-[15px] sm:leading-6">
          {item.title}
        </p>
      </div>
    </div>
  );
};
