"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { H5 } from "../ui/typography";
import Link from "next/link";

interface CollectiveActionSectionProps {
  text?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor?: string;
}

export const CollectiveActionSection: React.FC<
  CollectiveActionSectionProps
> = ({
  text = "Together—values, principles, committees, and funders - ignite meaningful change for people, communities, and the planet.",
  buttonText = "See Our Governance",
  buttonUrl = "/governance",
  backgroundColor = "bg-blue-50",
}) => {
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-56">
            {/* Text Content */}
            <div className="flex-1">
              <H5
                style="h5regular"
                className="text-[#010107] leading-[1.4] tracking-normal"
              >
                {text}
              </H5>
            </div>

            {/* Call to Action Button */}
            <div className="flex-shrink-0">
              <Link
                href={buttonUrl}
                className="inline-flex items-center gap-4 px-8 py-5 border border-[#11081F] text-[#11081F] text-base font-normal rounded hover:bg-[#11081F] hover:text-white transition-all duration-300 group"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
