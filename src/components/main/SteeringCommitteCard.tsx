import { useImageDominantColor } from "@/hooks/useImageDominantColor";
import { getImageUrl } from "@/lib/utils";
import { Linkedin } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CommitteeMember {
  id: string;
  name: string;
  country: string;
  image: string;
  imageAlt?: string;
  linkedinUrl?: string;
  biography?: string;
}

export const SteeringCommitteCard = ({
  member,
  setSelectedMember,
}: {
  member: CommitteeMember;
  setSelectedMember: React.Dispatch<
    React.SetStateAction<CommitteeMember | null>
  >;
}) => {
  const imageUrl = getImageUrl(member.image);
  const { color: bgColor } = useImageDominantColor(imageUrl);

  return (
    <div key={member.id} className="flex flex-col">
      <div className="relative mb-4">
        <div
          className="relative w-full aspect-[3/4] overflow-hidden rounded cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => setSelectedMember(member)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedMember(member);
            }
          }}
          aria-label={`View details for ${member.name}`}
          style={{ backgroundColor: bgColor }}
        >
          <Image
            src={getImageUrl(member.image)}
            alt={member.imageAlt || member.name}
            fill
            className="object-cover"
          />
        </div>
        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:shadow-lg transition-shadow duration-200 z-10"
            aria-label={`${member.name}'s LinkedIn profile (opens in a new tab)`}
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin className="w-4 h-4 text-[#3C62ED]" />
          </a>
        )}
      </div>

      {/* Member Info - also clickable to open modal */}
      <div
        className="space-y-1 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setSelectedMember(member)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedMember(member);
          }
        }}
        aria-label={`View details for ${member.name}`}
      >
        <h3 className="text-xl font-bold text-[#010107] font-nunito-sans">
          {member.name}
        </h3>
        <p className="text-base text-[#3C62ED] font-work-sans">
          {member.country}
        </p>
      </div>
    </div>
  );
};
