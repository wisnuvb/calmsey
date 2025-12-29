"use client";

import React from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { H2, P } from "@/components/ui/typography";
import { cn, getImageUrl } from "@/lib/utils";

interface CommitteeMember {
  id: string;
  name: string;
  country: string;
  image: string;
  imageAlt: string;
  linkedinUrl?: string;
}

interface SteeringCommitteeSectionProps {
  title?: string;
  description?: string;
  additionalDescription?: string;
  members?: CommitteeMember[];
  bottomText?: string;
  backgroundColor?: string;
}

export const SteeringCommitteeSection: React.FC<
  SteeringCommitteeSectionProps
> = ({
  title = "The Steering Committee",
  description = "Turning Tides is governed by a Steering Committee who are responsible for setting strategic direction and values alignment",
  additionalDescription = "The implementation of our strategy and organizational priorities—composed of small-scale fisher leaders, Indigenous Peoples, and rights experts who bring both deep expertise and accountability to those we serve. The Steering Committee has governed the initiative since the first months of its inception and is critical to the accountability and efficacy",
  members = [
    {
      id: "myrna-cunningham",
      name: "Myrna Cunningham Kain",
      country: "Nicaragua",
      image:
        "https://s7d1.scene7.com/is/image/wbcollab/Myrna-Cunningham-2?qlt=75&resMode=sharp2",
      imageAlt: "Myrna Cunningham Kain",
      linkedinUrl: "https://linkedin.com/in/myrna-cunningham",
    },
    {
      id: "vivienne-solis",
      name: "Vivienne Solis Rivera",
      country: "Costa Rica",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7YGBwVSD-KJDpMbdJJQ8r7OdC5Rv4keEyNA&s",
      imageAlt: "Vivienne Solis Rivera",
      linkedinUrl: "https://linkedin.com/in/vivienne-solis",
    },
    {
      id: "hugh-govan",
      name: "Hugh Govan",
      country: "Spain",
      image:
        "https://www.unigib.edu.gi/wp-content/uploads/2024/11/Untitled-design-3-2.png",
      imageAlt: "Hugh Govan",
      linkedinUrl: "https://linkedin.com/in/hugh-govan",
    },
    {
      id: "aarthi-sridhar",
      name: "Aarthi Sridhar",
      country: "India",
      image:
        "https://dakshin.org/wp-content/uploads/2019/02/IMG_20200919_113143-479x525.jpg",
      imageAlt: "Aarthi Sridhar",
      linkedinUrl: "https://linkedin.com/in/aarthi-sridhar",
    },
  ],
  bottomText,
  backgroundColor = "bg-white",
}) => {
  return (
    <section className={cn("w-full pb-16 lg:pb-24", backgroundColor)}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Title and Description */}
        <div className="mb-12 lg:mb-16 space-y-10">
          <H2
            style="h2bold"
            className="text-[#010107] text-3xl sm:text-[38px] leading-[120%] tracking-normal"
          >
            {title}
          </H2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <P
              style="p1reg"
              className="text-[#060726CC] text-2xl font-normal leading-[140%]"
            >
              {description}
            </P>
            <P
              style="p1reg"
              className="text-[#06072680] text-base leading-[150%]"
            >
              {additionalDescription}
            </P>
          </div>
        </div>

        {/* Committee Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {members.map((member) => (
            <div key={member.id} className="flex flex-col">
              <div className="relative mb-4">
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded">
                  <Image
                    src={getImageUrl(member.image)}
                    alt={member.imageAlt}
                    fill
                    className="object-cover"
                  />
                  {/* LinkedIn Badge */}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:shadow-lg transition-shadow duration-200"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <Linkedin className="w-4 h-4 text-[#3C62ED]" />
                    </a>
                  )}
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#010107] font-nunito-sans">
                  {member.name}
                </h3>
                <p className="text-base text-[#3C62ED] font-work-sans">
                  {member.country}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-3">
            <div className="w-12 h-1.5 bg-[#3C62ED] rounded-full"></div>
            <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full"></div>
            <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full opacity-80"></div>
            <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Bottom Text */}
        {bottomText && (
          <div className="max-w-4xl mx-auto text-center">
            <P style="p1reg" className="text-[#06072680] leading-relaxed">
              {bottomText}
            </P>
          </div>
        )}
      </div>
    </section>
  );
};
