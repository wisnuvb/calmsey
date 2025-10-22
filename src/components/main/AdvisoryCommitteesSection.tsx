"use client";

import React from "react";
import Image from "next/image";
import { Globe, Handshake } from "lucide-react";

interface AdvisoryCommitteesSectionProps {
  image?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  backgroundColor?: string;
}

export const AdvisoryCommitteesSection: React.FC<
  AdvisoryCommitteesSectionProps
> = ({
  image = "/assets/meeting/meeting-presentation.jpg",
  imageAlt = "Meeting presentation with committee members",
  title = "Turning Tides will look to create regional, national or even local advisory committees or panels",
  description = "that are responsible for guiding the co-creation of grassroots strategies and making grantmaking and service provision decisions.",
  backgroundColor = "bg-white",
}) => {
  return (
    <section
      className={`w-full ${backgroundColor} py-16 md:py-24 relative overflow-hidden`}
    >
      {/* Background World Map Pattern */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
        <div className="w-full h-full bg-gradient-to-t from-blue-100 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              {/* Icons */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300 border-dashed border-t-2"></div>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {title}
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
