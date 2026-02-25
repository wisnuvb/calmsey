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

const defaultPartners: Partner[] = [
  {
    id: "ledars",
    name: "LEDARS",
    logo: "/assets/partners/ledars-logo.png",
    logoAlt: "LEDARS Logo",
    website: "https://ledars.org",
  },
  {
    id: "university-waterloo",
    name: "University of Waterloo",
    logo: "/assets/partners/university-waterloo-logo.png",
    logoAlt: "University of Waterloo Logo",
    website: "https://uwaterloo.ca",
  },
  {
    id: "southern-fisherfolk",
    name: "Southern Fisherfolk Women Association",
    logo: "/assets/partners/southern-fisherfolk-logo.png",
    logoAlt: "Southern Fisherfolk Women Association Logo",
    website: "https://southernfisherfolk.org",
  },
  {
    id: "solidar",
    name: "SOLIDAR",
    logo: "/assets/partners/solidar-logo.png",
    logoAlt: "SOLIDAR Logo",
    website: "https://solidar.org",
  },
  {
    id: "save-andaman",
    name: "Save Andaman Network",
    logo: "/assets/partners/save-andaman-logo.png",
    logoAlt: "Save Andaman Network Logo",
    website: "https://saveandaman.org",
  },
  {
    id: "iccas",
    name: "ICCAs",
    logo: "/assets/partners/iccas-logo.png",
    logoAlt: "ICCAs Logo",
    website: "https://iccas.org",
  },
  {
    id: "ulab",
    name: "ULAB",
    logo: "/assets/partners/ulab-logo.png",
    logoAlt: "University of Liberal Arts Bangladesh Logo",
    website: "https://ulab.edu.bd",
  },
  {
    id: "jnus",
    name: "JNUS",
    logo: "/assets/partners/jnus-logo.png",
    logoAlt: "Jaringan Nelayan Tradisional Indonesia Logo",
    website: "https://jnus.org",
  },
  {
    id: "mercado-del-mar",
    name: "Mercado del Mar",
    logo: "/assets/partners/mercado-del-mar-logo.png",
    logoAlt: "Mercado del Mar Logo",
    website: "https://mercadodelmar.org",
  },
  {
    id: "larecoturh",
    name: "LARECOTURH",
    logo: "/assets/partners/larecoturh-logo.png",
    logoAlt: "LARECOTURH Logo",
    website: "https://larecoturh.org",
  },
  {
    id: "caopa",
    name: "CAOPA",
    logo: "/assets/partners/caopa-logo.png",
    logoAlt: "CAOPA Logo",
    website: "https://caopa.org",
  },
  {
    id: "brwa",
    name: "BRWA",
    logo: "/assets/partners/brwa-logo.png",
    logoAlt: "BRWA Logo",
    website: "https://brwa.org",
  },
  {
    id: "ykl-konservasi",
    name: "YKL Konservasi Laut Indonesia",
    logo: "/assets/partners/ykl-konservasi-logo.png",
    logoAlt: "YKL Konservasi Laut Indonesia Logo",
    website: "https://ykl.org",
  },
  {
    id: "additional-partner",
    name: "Additional Partner",
    logo: "/assets/partners/additional-partner-logo.png",
    logoAlt: "Additional Partner Logo",
    website: "https://additionalpartner.org",
  },
];

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
  const contextPartners = getContentJSON<Partner[]>("partners.partners", []);
  const partners =
    contextPartners.length > 0
      ? contextPartners
      : propPartners || defaultPartners;
  return (
    <section
      className={`w-full ${backgroundColor || "bg-white"} pb-16 md:pb-24`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-700 text-lg md:text-xl">{description}</p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 justify-items-center items-center gap-8 mb-12">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
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
        </div>

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
