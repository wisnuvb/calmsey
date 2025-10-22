"use client";

import React from "react";
import Image from "next/image";

interface Funder {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
}

interface OurFundersSectionProps {
  title?: string;
  funders?: Funder[];
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

export const OurFundersSection: React.FC<OurFundersSectionProps> = ({
  title = "Our Funders",
  funders = [
    {
      id: "oceankind",
      name: "Oceankind",
      logo: "/assets/partners/oceankind-logo.png",
      logoAlt: "Oceankind Logo",
    },
    {
      id: "ocean-resilience",
      name: "Ocean Resilience & Climate Alliance",
      logo: "/assets/partners/ocean-resilience-logo.png",
      logoAlt: "Ocean Resilience & Climate Alliance Logo",
    },
    {
      id: "packard",
      name: "The David & Lucile Packard Foundation",
      logo: "/assets/partners/packard-logo.png",
      logoAlt: "The David & Lucile Packard Foundation Logo",
    },
    {
      id: "builders",
      name: "Builders Initiative",
      logo: "/assets/partners/builders-logo.png",
      logoAlt: "Builders Initiative Logo",
    },
    {
      id: "oak",
      name: "Oak Foundation",
      logo: "/assets/partners/oak-logo.png",
      logoAlt: "Oak Foundation Logo",
    },
    {
      id: "cargill",
      name: "Margaret A. Cargill Philanthropies",
      logo: "/assets/partners/cargill-logo.png",
      logoAlt: "Margaret A. Cargill Philanthropies Logo",
    },
  ],
  description = "Interested Working Together With Us to Transforming Coastal Right?",
  buttonText = "Become Funder",
  buttonLink = "/contact",
  backgroundColor = "bg-black",
}) => {
  return (
    <section className={`w-full bg-white py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#010107] mb-8">
            {title}
          </h2>
        </div>

        {/* Funders Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {funders.map((funder) => (
            <div
              key={funder.id}
              className="flex items-center justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <Image
                src={funder.logo}
                alt={funder.logoAlt}
                width={120}
                height={80}
                className="object-contain max-h-16 w-auto"
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-16">
          <p className="text-[#060726CC] text-lg leading-relaxed">
            {description}
          </p>
          <a
            href={buttonLink}
            className="inline-flex items-center px-8 py-4 bg-white text-[#060726] hover:bg-[#CADBEA] transition-colors duration-200 rounded-lg font-semibold text-lg"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};
