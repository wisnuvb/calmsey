"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { cn, getImageUrl } from "@/lib/utils";
import { MemberDetailModal } from "@/components/ui/MemberDetailModal";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  linkedinUrl?: string;
  biography?: string;
}

interface TeamSectionProps {
  title?: string;
  description?: string;
  members?: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  {
    id: "1",
    name: "Philippa Cohen",
    role: "Co-Director",
    location: "Tasmania, Australia",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    biography:
      "Philippa is an applied environmental social scientist and inclusive governance advisor for 25 years. Her work has focused on small-scale fisheries, coastal communities, and women in fisheries. She is an islander – living and working in Australia (Tasmania), Tonga, Fiji, Solomon Islands and Malaysia (Penang).\n\nPhilippa completed her PhD on equitable oceans and has worked extensively with communities, governments, and organizations to support inclusive and sustainable coastal resource management.",
    linkedinUrl: "https://linkedin.com/in/philippa-cohen",
  },
  {
    id: "2",
    name: "Kama Dean Fitz",
    role: "Co-Director",
    location: "Denver, CO, USA",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/kama-dean-fitz",
  },
  {
    id: "3",
    name: "Jamie Chen",
    role: "Head of Operations",
    location: "California, USA",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/jamie-chen",
  },
  {
    id: "4",
    name: "Trini Pratiwi",
    role: "Asia Partner Liaison",
    location: "Malang, Indonesia",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/trini-pratiwi",
  },
  {
    id: "5",
    name: "John Doe",
    role: "Asia Partner Liaison",
    location: "Malang, Indonesia",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/john-doe",
  },
];

export const TeamSection: React.FC<TeamSectionProps> = ({
  title: propTitle,
  description: propDescription,
  members: propMembers,
}) => {
  const { getValue, getContentJSON } = usePageContentHelpers()

  // Get all values with priority: context > props > default
  const title = getValue("team.title", propTitle, "The Turning Tides' Team");
  const description = getValue(
    "team.description",
    propDescription,
    "Meet the Turning Tides' team - people from across the globe with combined experiences in progressive philanthropy, human rights, gender equity, community organizing, Indigenous affairs, equity law, and environmental justice."
  );
  const members = getContentJSON<TeamMember[]>(
    "team.members",
    propMembers || defaultMembers
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const currentMembers = members.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? (totalPages - 1) * itemsPerPage : prev - itemsPerPage
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev >= (totalPages - 1) * itemsPerPage ? 0 : prev + itemsPerPage
    );
  };

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-bold text-[#010107] mb-6 font-nunito-sans">
            {title}
          </h2>
          <p className="text-base text-[#060726CC] max-w-4xl mx-auto leading-[150%] tracking-normal font-work-sans">
            {description}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {currentMembers.map((member) => (
            <div
              key={member.id}
              className="text-left cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedMember(member)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedMember(member);
                }
              }}
            >
              {/* Photo with LinkedIn Icon */}
              <div className="relative inline-block mb-4 w-full max-w-[250px] mx-auto">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={getImageUrl(member.image)}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&size=250&background=random`;
                    }}
                  />
                </div>
                {/* LinkedIn Icon Overlay */}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 left-2 w-8 h-8 bg-[#0077B5] rounded flex items-center justify-center hover:bg-[#005885] transition-colors shadow-md"
                  >
                    <FaLinkedin className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>

              {/* Member Info */}
              <h3 className="text-xl font-bold text-[#010107] mb-3 font-nunito-sans leading-[140%] tracking-normal">
                {member.name}
              </h3>
              <p className="text-base text-[#3C62ED] mb-[2px] font-work-sans font-normal leading-[150%] tracking-normal">
                {member.role}
              </p>
              <p className="text-base text-[#3C62ED] font-work-sans font-normal leading-[150%] tracking-normal">
                {member.location}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={goToPrevious}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              )}
              aria-label="Previous team members"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              )}
              aria-label="Next team members"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Team Member Modal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
};
