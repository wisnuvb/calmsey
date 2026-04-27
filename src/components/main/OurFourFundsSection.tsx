"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Waves, Globe, Zap, Lightbulb } from "lucide-react";
import { H2, P } from "../ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

/** Raw item from fundDetails.funds (admin Fund Details) - used so listing order matches admin */
interface FundDetailsFundItem {
  slug?: string;
  id?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerHeroImageSrc?: string;
  headerHeroImageAlt?: string;
  intro?: string;
}

interface FundData {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: string; // Icon name: "Waves", "Globe", "Zap", "Lightbulb"
  learnMoreLink: string;
  imagePosition: "left" | "right"; // Determines if image is on left or right
}

interface Fund extends Omit<FundData, "icon"> {
  icon: React.ReactNode;
}

interface OurFourFundsSectionProps {
  title?: string;
  description?: string;
  funds?: Fund[];
  className?: string;
}

const defaultFundsData: FundData[] = [
  {
    id: "grassroot-fund",
    title: "Grassroot Fund",
    description:
      "Turning Tides deploys the majority of its resources through the Grassroots Fund supporting actions at regional, national, and local levels.",
    imageSrc: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
    imageAlt: "People drying fish on racks",
    icon: "Waves",
    learnMoreLink: "/our-fund/grassroot",
    imagePosition: "left",
  },
  {
    id: "civic-space-capacity-fund",
    title: "Civic Space and Capacity Fund",
    description:
      "We deploy funding to support the self-identified capacity needs of our partners and to, more broadly, protect civic space. Our team will work in close collaboration with partners to identify needs and craft appropriate responses.",
    imageSrc: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
    imageAlt: "Aerial view of coastal community",
    icon: "Globe",
    learnMoreLink: "/our-fund/civic-space",
    imagePosition: "right",
  },
  {
    id: "rapid-response-fund",
    title: "Rapid Response Fund",
    description:
      "The Rapid Response Fund addresses urgent needs, supporting partners and organizations facing threats that require timely financial intervention, particularly in contexts of shrinking civic space, political repression, and sudden crises.",
    imageSrc: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
    imageAlt: "Traditional boats in calm water",
    icon: "Zap",
    learnMoreLink: "/our-fund/rapid-response",
    imagePosition: "left",
  },
  {
    id: "knowledge-action-fund",
    title: "Knowledge Action Fund",
    description:
      "The Knowledge Action Fund is designed to challenge and change dominant narratives, elevate rights holder voices and perspectives, and influence global, regional, and national systems, creating the necessary enabling environment to support secure tenure globally.",
    imageSrc: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
    imageAlt: "Person arranging fish on drying rack",
    icon: "Lightbulb",
    learnMoreLink: "/our-fund/knowledge-action",
    imagePosition: "right",
  },
];

// Helper function to convert icon string to React component
const getIconComponent = (iconName: string): React.ReactNode => {
  const iconProps = { className: "w-6 h-6 text-white" };
  switch (iconName) {
    case "Waves":
      return <Waves {...iconProps} />;
    case "Globe":
      return <Globe {...iconProps} />;
    case "Zap":
      return <Zap {...iconProps} />;
    case "Lightbulb":
      return <Lightbulb {...iconProps} />;
    default:
      return <Waves {...iconProps} />;
  }
};

// Convert FundData to Fund
const convertFundDataToFund = (fundData: FundData): Fund => ({
  ...fundData,
  icon: getIconComponent(fundData.icon),
});

const ICON_ORDER = ["Waves", "Globe", "Zap", "Lightbulb"] as const;

/** Map fundDetails.funds item (admin order) to FundData for listing */
function mapFundDetailsToFundData(
  item: FundDetailsFundItem,
  index: number,
  language: string,
): FundData {
  const slug = item.slug || "";
  const firstParagraph = item.intro
    ? item.intro
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)[0] || ""
    : "";
  return {
    id: item.id || slug || `fund-${index}`,
    title: item.headerTitle || "",
    description: item.headerSubtitle || firstParagraph,
    imageSrc: item.headerHeroImageSrc || "",
    imageAlt: item.headerHeroImageAlt || "",
    icon: ICON_ORDER[index % ICON_ORDER.length],
    learnMoreLink: `/${language}/our-fund/${slug}`,
    imagePosition: index % 2 === 0 ? "left" : "right",
  };
}

export const OurFourFundsSection: React.FC<OurFourFundsSectionProps> = ({
  title: propTitle,
  description: propDescription,
  funds: propFunds,
  className,
}) => {
  const { getValue, getContentJSON, language } = usePageContentHelpers();

  // Get all values with priority: context > props > default
  const title = getValue("fourFunds.title", propTitle, "Our Four Funds");
  const description = getValue(
    "fourFunds.description",
    propDescription,
    "Turning Tides supports partners through four interacting funds, each of which supports different pathways toward change. Each fund is governed separately to increase responsiveness to partners' expressed needs and opportunities to create change.",
  );
  const annualReportUrl = getValue("hero.annualReportUrl", "", "");
  const annualReportLabel = getValue(
    "hero.annualReportLabel",
    "",
    "Download our Annual Report",
  );

  // Prefer fundDetails.funds (same as admin Fund Details) so order and list match the admin
  const fundDetailsList = getContentJSON<FundDetailsFundItem[]>(
    "fundDetails.funds",
    [],
  );
  const fourFundsList = getContentJSON<FundData[]>("fourFunds.funds", []);

  let funds: Fund[];
  const fromFundDetails =
    Array.isArray(fundDetailsList) &&
    fundDetailsList.length > 0 &&
    fundDetailsList.some((f) => f?.headerTitle && f?.slug);
  if (fromFundDetails) {
    const mapped = fundDetailsList
      .filter((f) => f?.slug)
      .map((f, i) => mapFundDetailsToFundData(f, i, language))
      .filter((f) => f.title && f.imageSrc);
    funds =
      mapped.length > 0
        ? mapped.map(convertFundDataToFund)
        : fourFundsList.length > 0
          ? fourFundsList.map(convertFundDataToFund)
          : defaultFundsData.map(convertFundDataToFund);
  } else if (fourFundsList.length > 0) {
    funds = fourFundsList.map(convertFundDataToFund);
  } else if (propFunds && propFunds.length > 0) {
    funds = propFunds;
  } else {
    funds = defaultFundsData.map(convertFundDataToFund);
  }

  return (
    <section className={cn("bg-white py-16 lg:py-24", className)}>
      <div className="container mx-auto px-4">
        {annualReportUrl.trim() !== "" && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 sm:mb-14">
            <a
              href={annualReportUrl}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#3C62ED] text-white rounded-lg font-work-sans font-medium hover:bg-[#2d4fd6] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-5 h-5 flex-shrink-0" aria-hidden />
              {annualReportLabel}
            </a>
          </div>
        )}
        {/* Header Section - Centered */}
        <div className="max-w-4xl mx-auto text-center mb-14 space-y-8 hidden">
          <H2
            style="h2bold"
            className="text-[#010107] text-2xl sm:text-[38px] leading-[120%] tracking-normal font-bold font-nunito"
          >
            {title}
          </H2>
          <P style="p1reg" className="text-[#060726CC] p">
            {description}
          </P>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:gap-16">
          {funds.map((fund) => (
            <div
              key={fund.id}
              className={cn(
                "flex flex-col items-start gap-6 sm:gap-16",
                fund.imagePosition === "left"
                  ? "lg:flex-row"
                  : "lg:flex-row-reverse",
              )}
            >
              {/* Image */}
              <div className="lg:w-2/5 flex-shrink-0">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={getImageUrl(fund.imageSrc)}
                    alt={fund.imageAlt}
                    fill
                    className="object-cover"
                  />
                  {/* Blue Square Overlay with Icon */}
                  <div className="absolute bottom-3 left-3 w-12 h-12 bg-[#3C62ED] rounded flex items-center justify-center shadow-lg">
                    {fund.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-3/5 flex flex-col justify-center space-y-8 sm:space-y-14">
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-[32px] leading-[120%] tracking-normal font-bold font-nunito text-[#3C62ED]">
                    {fund.title}
                  </h3>
                  <p
                    className="text-[#060726CC] p font-normal leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: fund.description }}
                  />
                </div>
                <Link
                  href={fund.learnMoreLink}
                  className="inline-flex items-center gap-2 px-8 py-5 bg-white border border-gray-300 text-[#3C62ED] rounded-md hover:bg-gray-50 transition-colors duration-300 font-normal w-fit mt-2 text-base"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
