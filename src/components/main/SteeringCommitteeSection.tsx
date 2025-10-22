"use client";

import React from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";

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
  description = "Governance is spearheaded by the Steering Committee, who are responsible for setting the strategic direction.",
  additionalDescription = "The Steering Committee has governed the initiative since the first months of its inception and is critical to the legitimacy and efficacy of the Facility, serving as one key governance attribute. The technical team remains responsive and accountable to the Steering Committee, which provides guidance to strategy and decision making.",
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
    <section className={`w-full ${backgroundColor} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title and Description */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-1/3">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                {title}
              </h2>
            </div>
            <div className="lg:w-2/3 space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed">
                {description}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {additionalDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Committee Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {members.map((member) => (
            <div key={member.id} className="text-center">
              <div className="relative mb-4">
                <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    className="object-cover"
                  />
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 left-2 w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.country}</p>
            </div>
          ))}
        </div>

        {/* Pagination Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <div className="w-8 h-1 bg-blue-600 rounded"></div>
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
            {bottomText}
          </p>
        </div>
      </div>
    </section>
  );
};
