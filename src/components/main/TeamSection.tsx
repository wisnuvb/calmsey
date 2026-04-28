"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { H2, P } from "@/components/ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import { useImageDominantColor } from "@/hooks/useImageDominantColor";
import { MemberDetailModal } from "@/components/ui/MemberDetailModal";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import { MembersCarouselShell } from "./MembersCarouselShell";

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
  /** Second column on large screens when non-empty */
  additionalDescription?: string;
  members?: TeamMember[];
  backgroundColor?: string;
}

function TeamMemberCard({
  member,
  onSelect,
}: {
  member: TeamMember;
  onSelect: () => void;
}) {
  const imageUrl = getImageUrl(member.image);
  const { color: bgColor } = useImageDominantColor(imageUrl);

  return (
    <div className="flex flex-col text-left">
      {/* Same image pattern as SteeringCommitteCard: full cell width, 3:4 aspect */}
      <div className="relative mb-4">
        <div
          className="relative w-full aspect-[3/4] overflow-hidden rounded cursor-pointer"
          style={{ backgroundColor: bgColor }}
          role="button"
          tabIndex={0}
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect();
            }
          }}
          aria-label={`View details for ${member.name}`}
        >
          <Image
            src={getImageUrl(member.image)}
            alt={member.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                member.name,
              )}&size=250&background=random`;
            }}
          />
        </div>
        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center hover:shadow-lg transition-shadow duration-200 z-10"
            aria-label={`View LinkedIn profile of ${member.name} (opens in a new tab)`}
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin className="w-4 h-4 text-[#3C62ED]" />
          </a>
        )}
      </div>

      <div
        className="space-y-1 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        aria-label={`View details for ${member.name}`}
      >
        <h3 className="text-xl font-bold text-[#010107] font-nunito">
          {member.name}
        </h3>
        <p className="text-base text-[#3C62ED] font-work-sans">{member.role}</p>
        <p className="text-base text-[#3C62ED] font-work-sans">{member.location}</p>
      </div>
    </div>
  );
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
  additionalDescription: propAdditionalDescription,
  members: propMembers,
  backgroundColor,
}) => {
  const { getValue, getContentJSON } = usePageContentHelpers();

  const title = getValue(
    "team.title",
    propTitle,
    "The Turning Tides' Team",
  );
  const description = getValue(
    "team.description",
    propDescription,
    "Meet the Turning Tides' team - people from across the globe with combined experiences in progressive philanthropy, human rights, gender equity, community organizing, Indigenous affairs, equity law, and environmental justice.",
  );
  const additionalDescription = getValue(
    "team.additionalDescription",
    propAdditionalDescription ?? "",
    "",
  );
  const members = getContentJSON<TeamMember[]>(
    "team.members",
    propMembers || defaultMembers,
  );
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const hasSecondColumn =
    typeof additionalDescription === "string" &&
    additionalDescription.trim().length > 0;

  return (
    <section
      className={cn("w-full pb-16 lg:pb-24", backgroundColor ?? "bg-white")}
      id="ourteam"
    >
      <div className="container mx-auto px-4">
        <div className="mb-12 lg:mb-16 space-y-10">
          <H2
            style="h2bold"
            className="text-[#010107] text-3xl sm:text-[38px] leading-[120%] tracking-normal text-center font-nunito"
          >
            {title}
          </H2>
          <div
            className={cn(
              "grid grid-cols-1 gap-10 lg:gap-14 items-start",
              hasSecondColumn ? "lg:grid-cols-2" : "",
            )}
          >
            <P
              style="p1reg"
              className="text-[#060726CC] text-2xl font-normal leading-[140%] font-nunito-sans"
            >
              {description}
            </P>
            {hasSecondColumn ? (
              <P
                style="p1reg"
                className="text-[#06072680] p"
              >
                {additionalDescription}
              </P>
            ) : null}
          </div>
        </div>

        <MembersCarouselShell
          members={members}
          renderCard={(member) => (
            <TeamMemberCard
              member={member}
              onSelect={() => setSelectedMember(member)}
            />
          )}
        />
      </div>

      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
};
