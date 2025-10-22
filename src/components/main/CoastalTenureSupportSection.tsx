"use client";

import React from "react";

interface CoastalTenureSupportSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

export const CoastalTenureSupportSection: React.FC<
  CoastalTenureSupportSectionProps
> = ({
  title = "Are you a community or ally seeking support for coastal tenure?",
  description = "We're here to stand with you. Turning Tides provides services, resources, and partnerships to help safeguard your access to marine, shoreline, and aquatic spaces.",
  buttonText = "Get Involved",
  buttonLink = "/get-involved",
  backgroundColor = "bg-white",
}) => {
  return (
    <section className={`w-full ${backgroundColor} py-16 md:py-24`}>
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h2>

        <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
          {description}
        </p>

        <a
          href={buttonLink}
          className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
};
