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
  additionalDescription = "The implementation of our strategy and organizational priorities—composed of small-scale fisher leaders, Indigenous Peoples, and rights experts who bring both deep expertise and accountability to those we serve.The Steering Committee has governed the initiative since the first months of its inception and is critical to the accountability and efficacy",
  members = [
    {
      id: "myrna-cunningham",
      name: "Myrna Cunningham Kain",
      country: "Nicaragua",
      image: "/assets/team/myrna-cunningham.jpg",
      imageAlt: "Myrna Cunningham Kain",
      linkedinUrl: "https://linkedin.com/in/myrna-cunningham",
    },
    {
      id: "vivienne-solis",
      name: "Vivienne Solis Rivera",
      country: "Costa Rica",
      image: "/assets/team/vivienne-solis.jpg",
      imageAlt: "Vivienne Solis Rivera",
      linkedinUrl: "https://linkedin.com/in/vivienne-solis",
    },
    {
      id: "hugh-govan",
      name: "Hugh Govan",
      country: "Spain",
      image: "/assets/team/hugh-govan.jpg",
      imageAlt: "Hugh Govan",
      linkedinUrl: "https://linkedin.com/in/hugh-govan",
    },
    {
      id: "aarthi-sridhar",
      name: "Aarthi Sridhar",
      country: "India",
      image: "/assets/team/aarthi-sridhar.jpg",
      imageAlt: "Aarthi Sridhar",
      linkedinUrl: "https://linkedin.com/in/aarthi-sridhar",
    },
  ],
  bottomText = "The Steering Committee are also responsible for nominating and approving grants at the global level and from the Rapid Response and Knowledge and Learning Funds or creating proxy structures.",
  backgroundColor = "bg-white",
}) => {
  return (
    <section className={cn("w-full py-16 lg:py-24", backgroundColor)}>
      <div className="container mx-auto px-4">
        {/* Title and Description */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Title */}
            <div>
              <H2 style="h2bold" className="text-[#010107]">
                {title}
              </H2>
            </div>

            {/* Right Column - Descriptions */}
            <div className="space-y-6">
              <P style="p1reg" className="text-[#010107] leading-relaxed">
                {description}
              </P>
              <P style="p1reg" className="text-[#06072680] leading-relaxed">
                {additionalDescription}
              </P>
            </div>
          </div>
        </div>

        {/* Committee Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {members.map((member) => (
            <div key={member.id} className="flex flex-col">
              <div className="relative mb-4">
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
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
                      className="absolute bottom-3 left-3 w-8 h-8 bg-[#3C62ED] rounded flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 shadow-md"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <Linkedin className="w-4 h-4 text-white" />
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
          <div className="flex gap-2">
            <div className="w-12 h-1 bg-[#3C62ED] rounded-full"></div>
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
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
