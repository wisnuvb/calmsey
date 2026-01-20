"use client";

import Image from "next/image";
import Link from "next/link";
import { H5, P } from "../ui/typography";
import { getImageUrl } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

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
  title?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function WhyTurningTidesSection({
  title: propTitle,
  content: propContent,
  ctaText: propCtaText,
  ctaLink: propCtaLink,
}: WhyTurningTidesSectionProps = {}) {
  const { getValue, getContentJSON } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const missionTitle = getValue(
    "whyUs.missionTitle",
    propTitle,
    "Turning Tides is an international, value-led, facility dedicated to supporting the tenure and rights of local communities, fisher peoples, and Indigenous Peoples."
  );

  const missionDescription = getValue(
    "whyUs.missionDescription",
    propContent,
    "When tenure is secure and surrounding human rights are recognized, communities thrive, environments are protected, and economies are inclusive and strong."
  );

  const fundersLabel = getValue(
    "whyUs.fundersLabel",
    propContent,
    "Together with the Funders Transforming Coastal Right"
  );

  const funders =
    propContent || getContentJSON<Funder[]>("whyUs.funders", defaultFunders);

  const whyContent = getValue(
    "whyUs.whyContent",
    propContent,
    "Turning Tides provides fiscal and other supports that lead local communities, fisher peoples and Indigenous peoples to fully experience their tenure and associated rights."
  );

  const ctaText = getValue("whyUs.ctaText", propCtaText, "Our Funds");
  const ctaLink = getValue("whyUs.ctaLink", propCtaLink, "/our-fund");

  return (
    <section className="py-16 lg:py-16 bg-white">
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
                {Array.isArray(funders) &&
                  funders.map((funder: Funder, index: number) => (
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
            {/* <H5 style="h5bold" className="text-[#3C62ED] mb-6">
              {whyTitle}
            </H5> */}

            <P style="p1reg" className="text-[#060726CC] text-base">
              {whyContent}
            </P>

            <div className="mt-8 sm:mt-14">
              <Link
                href={ctaLink}
                className="inline-flex items-center justify-between gap-4 px-8 py-5 border border-[#3C62ED] text-[#3C62ED] rounded-lg hover:bg-[#3C62ED] hover:text-white transition-colors font-medium"
              >
                {ctaText}
                <ArrowUpRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
