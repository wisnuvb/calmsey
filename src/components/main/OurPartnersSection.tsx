"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface Partner {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
  website?: string;
}

interface OurPartnersSectionProps {
  title?: string;
  description?: string;
  partners?: Partner[];
  callToActionText?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

const defaultPartners: Partner[] = [];

export const OurPartnersSection: React.FC<OurPartnersSectionProps> = ({
  title: propTitle,
  description: propDescription,
  partners: propPartners,
  // callToActionText: propCallToActionText,
  // buttonText: propButtonText,
  // buttonLink: propButtonLink,
  backgroundColor: propBackgroundColor,
}) => {
  const { getValue, getContentJSON } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const title = getValue("partners.title", propTitle, "Our Partners");
  const description = getValue(
    "partners.description",
    propDescription,
    "Turning Tides engages with a diversity of partners – across multiple levels"
  );
  // const callToActionText = getValue(
  //   "partners.callToActionText",
  //   propCallToActionText,
  //   "Interested Working Together With Us to Transforming Coastal Right?"
  // );
  // const buttonText = getValue(
  //   "partners.buttonText",
  //   propButtonText,
  //   "Get Involved"
  // );
  // const buttonLink = getValue(
  //   "partners.buttonLink",
  //   propButtonLink,
  //   "/get-involved"
  // );
  const backgroundColor = getValue(
    "partners.backgroundColor",
    propBackgroundColor,
    "bg-white"
  );

  // Get partners with priority: context > props > default
  // const contextPartners = getContentJSON<Partner[]>("partners.partners", []);
  // const partners =
  //   contextPartners.length > 0
  //     ? contextPartners
  //     : propPartners || defaultPartners;
  // const validPartners = partners.filter(
  //   (partner) => typeof partner.logo === "string" && partner.logo.trim() !== ""
  // );

  // if (validPartners.length === 0) {
  //   return null;
  // }
  return (
    <section
      className={`w-full ${backgroundColor || "bg-white"} pb-16 md:pb-8`}
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#010107] mb-6">
            {title}
          </h2>
          <p className="text-[#060726CC] p">{description}</p>
        </div>

        {/* Partners: flex so baris terakhir tetap rata tengah jika item tidak penuh */}
        {/* <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-12">
          {validPartners.map((partner) => (
            <div
              key={partner.id}
              className="flex h-auto w-[140px] shrink-0 items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 sm:w-[152px] md:w-[148px]"
            >
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-20 flex items-center justify-center"
                aria-label={`Visit ${partner.name} website (opens in a new tab)`}
              >
                <Image
                  src={getImageUrl(partner.logo)}
                  alt={partner.logoAlt}
                  width={120}
                  height={80}
                  className="object-contain max-h-16 w-auto"
                />
              </a>
            </div>
          ))}
        </div> */}

        {/* Call to Action */}
        {/* <div className="text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <p className="text-gray-900 text-lg md:text-xl font-medium">
              {callToActionText}
            </p>

            <a
              href={buttonLink}
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              {buttonText}
            </a>
          </div>
        </div> */}
      </div>
    </section>
  );
};
