"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Linkedin, ChevronLeft, ChevronRight } from "lucide-react";
import { H2, P } from "@/components/ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import { MemberDetailModal } from "@/components/ui/MemberDetailModal";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface CommitteeMember {
  id: string;
  name: string;
  country: string;
  image: string;
  imageAlt?: string;
  linkedinUrl?: string;
  biography?: string;
}

interface SteeringCommitteeSectionProps {
  title?: string;
  description?: string;
  additionalDescription?: string;
  members?: CommitteeMember[];
  bottomText?: string;
  backgroundColor?: string;
}

const defaultMembers: CommitteeMember[] = [
  {
    id: "myrna-cunningham",
    name: "Myrna Cunningham Kain",
    country: "Nicaragua",
    image:
      "https://s7d1.scene7.com/is/image/wbcollab/Myrna-Cunningham-2?qlt=75&resMode=sharp2",
    imageAlt: "Myrna Cunningham Kain",
    linkedinUrl: "https://linkedin.com/in/myrna-cunningham",
    biography:
      '<p>I have been an applied environmental social scientist and <strong>inclusive governance advisor for 25 years</strong>. I have always focused on small-scale fisheries, coastal communities, and women in fisheries – from research, processing, trading and governance. I am an islander – living and working in Australia (Tasmania), Tonga, Fiji, Solomon Islands and Malaysia (Penang).</p><p>Lorem ipsum dolor sit amet consectetur. Nascetur maecenas viverra diam habitant interdum orci in ridiculus sagittis. Vulputate orci ut convallis felis urna consequat et laoreet velit. Amet id molestie a enim vitae senectus in porta et. Quam velit elementum facilisi dui egestas rhoncus ipsum vestibulum. Nec a ut consectetur lorem. Egestas orci fringilla urna ultrices. Condimentum mi et fermentum pulvinar dignissim donec pellentesque congue pharetra. Ac eget porttitor proin sed viverra sit. Quis sit dignissim morbi amet amet. Nisl massa vitae.</p>',
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
];

export const SteeringCommitteeSection: React.FC<
  SteeringCommitteeSectionProps
> = ({
  title: propTitle,
  description: propDescription,
  additionalDescription: propAdditionalDescription,
  members: propMembers,
  bottomText: propBottomText,
  backgroundColor = "bg-white",
}) => {
    const { getValue, getContentJSON } = usePageContentHelpers()

    // Get all values with priority: context > props > default
    const title = getValue(
      "steeringCommittee.title",
      propTitle,
      "The Steering Committee"
    );
    const description = getValue(
      "steeringCommittee.description",
      propDescription,
      "Turning Tides is governed by a Steering Committee who are responsible for setting strategic direction and values alignment"
    );
    const additionalDescription = getValue(
      "steeringCommittee.additionalDescription",
      propAdditionalDescription,
      "The implementation of our strategy and organizational priorities—composed of small-scale fisher leaders, Indigenous Peoples, and rights experts who bring both deep expertise and accountability to those we serve. The Steering Committee has governed the initiative since the first months of its inception and is critical to the accountability and efficacy"
    );
    const bottomText = getValue(
      "steeringCommittee.bottomText",
      propBottomText,
      ""
    );
    const members = getContentJSON<CommitteeMember[]>(
      "steeringCommittee.members",
      propMembers || defaultMembers
    );

    const [currentPage, setCurrentPage] = useState(0);
    const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(
      null
    );
    const membersPerPage = 4;
    const totalPages = Math.ceil(members.length / membersPerPage);

    const startIndex = currentPage * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    const currentMembers = members.slice(startIndex, endIndex);

    const handlePrevPage = () => {
      setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNextPage = () => {
      setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    const handlePageClick = (pageIndex: number) => {
      setCurrentPage(pageIndex);
    };

    return (
      <section className={cn("w-full pb-16 lg:pb-24", backgroundColor)}>
        <div className="container mx-auto px-4">
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
          <div className="relative">
            {/* Navigation Buttons */}
            {totalPages > 1 && (
              <>
                <button
                  onClick={handlePrevPage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 text-[#3C62ED]" />
                </button>
                <button
                  onClick={handleNextPage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5 text-[#3C62ED]" />
                </button>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {currentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col cursor-pointer"
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
                  <div className="relative mb-4">
                    <div className="relative w-full aspect-[3/4] overflow-hidden rounded">
                      <Image
                        src={getImageUrl(member.image)}
                        alt={member.imageAlt || member.name}
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
                          onClick={(e) => e.stopPropagation()}
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
          </div>

          {/* Pagination Indicator */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-12">
              <div className="flex gap-3">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClick(index)}
                    className={cn(
                      "w-12 h-1.5 rounded-full transition-all duration-300",
                      currentPage === index
                        ? "bg-[#3C62ED]"
                        : "bg-[#E5E7EB] hover:bg-[#D1D5DB]"
                    )}
                    aria-label={`Go to page ${index + 1}`}
                    aria-current={currentPage === index ? "true" : "false"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Text */}
          {bottomText && (
            <div className="max-w-4xl mx-auto text-center">
              <P style="p1reg" className="text-[#06072680] leading-relaxed">
                {bottomText}
              </P>
            </div>
          )}
        </div>

        {/* Member Detail Modal */}
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      </section>
    );
  };
