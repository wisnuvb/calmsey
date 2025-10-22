"use client";

import React from "react";
import Image from "next/image";

interface GovernanceValuesSectionProps {
  title?: string;
  paragraphs?: string[];
  image?: string;
  imageAlt?: string;
  backgroundColor?: string;
}

export const GovernanceValuesSection: React.FC<
  GovernanceValuesSectionProps
> = ({
  title,
  paragraphs = [
    "Putting our values and principles into action is logistically challenging, presenting legal, fiscal and management challenges.",
    "If we design robust and representative governance structures, we will not solve these challenges, but it will create the foundational piece through which we live our values. Governance structures will be created to ensure the power for decision-making is as close to our end partners as possible.",
  ],
  image = "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
  imageAlt = "Group of people in a meeting or workshop setting with laptops and collaborative discussion",
  backgroundColor = "bg-white",
}) => {
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              {title && (
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                  {title}
                </h2>
              )}

              <div className="space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg text-gray-700 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Image Content */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={image}
                  alt={imageAlt}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
