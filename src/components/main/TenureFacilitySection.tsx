"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface TenureFacilitySectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  fiscalAgreementUrl?: string;
  socialContractUrl?: string;
  showLogo?: boolean;
}

export const TenureFacilitySection: React.FC<TenureFacilitySectionProps> = ({
  description = "Turning Tides is legally and fiscally hosted by the **Tenure Facility Fund**, which is a US 501(C)3 non-profit subsidiary of the International Land and Forest Tenure Facility. We recognize the potential value addition that can be achieved through this collaboration when we get it right and we respect each other's distinct approaches and partners.",
  fiscalAgreementUrl = "#",
  socialContractUrl = "#",
  showLogo = true,
}) => {
  return (
    <div className="bg-[#C4DF99] py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side - Logo and Title */}
          <div className="flex justify-center items-center col-span-4">
            {showLogo && (
              <div className="mb-8">
                {/* Logo Circle with Icons */}
                <Image
                  src="/assets/tenure-logo.png"
                  alt="Tenure Facility Logo"
                  width={224}
                  height={129}
                />
              </div>
            )}
          </div>

          {/* Right Side - Content and Buttons */}
          <div className="space-y-6 col-span-8">
            {/* Description Text */}
            <div className="prose prose-green-800 max-w-none">
              <p className="text-green-800 leading-relaxed">
                {description.split("**").map((part, index) =>
                  index % 2 === 1 ? (
                    <strong key={index} className="font-bold">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={fiscalAgreementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-800 text-green-800 font-medium rounded-lg hover:bg-green-800 hover:text-white transition-colors duration-200 group"
              >
                <span>The fiscal sponsorship agreement</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
              </a>

              <a
                href={socialContractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-800 text-green-800 font-medium rounded-lg hover:bg-green-800 hover:text-white transition-colors duration-200 group"
              >
                <span>Social Contract</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
