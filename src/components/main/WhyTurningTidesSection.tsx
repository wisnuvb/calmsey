"use client";

import Image from "next/image";
import Link from "next/link";
import { H5, P } from "../ui/typography";
import { usePageContent } from "@/contexts/PageContentContext";
import { getImageUrl } from "@/lib/utils";

interface Funder {
  name: string;
  logo: string;
}

const defaultFunders: Funder[] = [
  { name: "Oceankind", logo: "/funders/oceankind.svg" },
  { name: "Ocean Resilience Climate Alliance", logo: "/funders/orca.svg" },
  { name: "David and Lucile Packard Foundation", logo: "/funders/packard.svg" },
  { name: "Waitt Institute", logo: "/funders/waitt.svg" },
  { name: "Oak Foundation", logo: "/funders/oak.svg" },
  { name: "Margaret A Cargill Philanthropies", logo: "/funders/cargill.svg" },
];

interface WhyTurningTidesSectionProps {
  missionTitle?: string;
  missionDescription?: string;
  fundersLabel?: string;
  funders?: Funder[];
  whyTitle?: string;
  whyContent?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function WhyTurningTidesSection({
  missionTitle: propMissionTitle,
  missionDescription: propMissionDescription,
  fundersLabel: propFundersLabel,
  funders: propFunders,
  whyTitle: propWhyTitle,
  whyContent: propWhyContent,
  ctaText: propCtaText,
  ctaLink: propCtaLink,
}: WhyTurningTidesSectionProps = {}) {
  // Try to get content from context, fallback to empty object if not available
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

  // Helper to get value from content
  const getContentValue = (key: string, defaultValue: string = ""): string => {
    return pageContent[key] || defaultValue;
  };

  // Helper to get JSON value from content
  const getContentJSON = <T,>(key: string, defaultValue: T): T => {
    const value = pageContent[key];
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  };

  // Helper function to get value with priority: context > props > default
  const getValue = (
    contentKey: string,
    propValue?: string,
    defaultValue: string = ""
  ): string => {
    const contentValue = getContentValue(contentKey, "");
    if (contentValue && contentValue.trim() !== "") {
      return contentValue;
    }
    if (propValue && propValue.trim() !== "") {
      return propValue;
    }
    return defaultValue;
  };

  // Get all values with priority: context > props > default
  const missionTitle = getValue(
    "whyUs.missionTitle",
    propMissionTitle,
    "Turning Tides is an international, value-led, facility dedicated to supporting the tenure and rights of local communities, fisher peoples, and Indigenous Peoples."
  );

  const missionDescription = getValue(
    "whyUs.missionDescription",
    propMissionDescription,
    "When tenure is secure and surrounding human rights are recognized, communities thrive, environments are protected, and economies are inclusive and strong."
  );

  const fundersLabel = getValue(
    "whyUs.fundersLabel",
    propFundersLabel,
    "Together with the Funders Transforming Coastal Right"
  );

  const funders =
    propFunders || getContentJSON<Funder[]>("whyUs.funders", defaultFunders);

  const whyTitle = getValue(
    "whyUs.whyTitle",
    propWhyTitle,
    "So Why Are We Turning Tides?"
  );

  const whyContent = getValue(
    "whyUs.whyContent",
    propWhyContent,
    "Because collective rights are still being eroded by weak commitments, powerful interests, narrow views of tenure, and tokenistic efforts toward participation."
  );

  const ctaText = getValue("whyUs.ctaText", propCtaText, "More About Us");
  const ctaLink = getValue("whyUs.ctaLink", propCtaLink, "/about");

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left Column - Mission Statement */}
          <div className="space-y-6">
            <H5
              style="h5regular"
              className="text-[#010107] tracking-tight text-2xl"
            >
              {missionTitle}
            </H5>

            <P style="p1reg" className="text-[#060726CC] text-base">
              {missionDescription}
            </P>

            {/* Funders Section */}
            <div className="pt-12 space-y-8">
              <P style="p1reg" className="text-[#060726CC] text-base">
                {fundersLabel}
              </P>

              {/* Funders Logo Row */}
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-8 lg:gap-12">
                {funders.map((funder, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100"
                    title={funder.name}
                  >
                    <div className="relative w-12 h-12">
                      <Image
                        src={getImageUrl(funder.logo)}
                        alt={funder.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Why Box */}
          <div className="lg:pl-8">
            <H5 style="h5bold" className="text-[#3C62ED] mb-6">
              {whyTitle}
            </H5>

            <P style="p1reg" className="text-[#060726CC] text-base">
              {whyContent}
            </P>

            <div className="mt-8 sm:mt-14">
              <Link
                href={ctaLink}
                className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors font-medium"
              >
                {ctaText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
