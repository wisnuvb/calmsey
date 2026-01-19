"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { getImageUrl } from "@/lib/utils";

interface MemberData {
  name: string;
  role?: string;
  location?: string;
  country?: string;
  image: string;
  linkedinUrl?: string;
  biography?: string;
}

interface MemberDetailModalProps {
  member: MemberData | null;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
}) => {
  if (!member) return null;

  // Use either location (for team) or country (for steering committee)
  const locationText = member.location || member.country || "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Section - Image */}
        <div className="w-full lg:w-1/2 relative h-64 lg:h-auto">
          <Image
            src={getImageUrl(member.image)}
            alt={member.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                member.name
              )}&size=400&background=random`;
            }}
          />
        </div>

        {/* Right Section - Content */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col">
          {/* Title/Role */}
          {member.role && (
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-work-sans">
              {member.role.toUpperCase()}
            </p>
          )}

          {/* Name */}
          <h3 className="text-3xl sm:text-4xl font-bold text-[#010107] mb-2 font-nunito-sans">
            {member.name}
          </h3>

          {/* Location */}
          {locationText && (
            <p className="text-base text-gray-400 mb-6 font-work-sans">
              {locationText}
            </p>
          )}

          {/* Biography - Scrollable */}
          {member.biography ? (
            <div className="flex-1 mb-6 overflow-y-auto pr-2 min-h-0">
              <div
                className="text-base text-gray-700 leading-relaxed font-work-sans prose prose-sm max-w-none prose-a:text-[#3C62ED] prose-a:font-medium prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{
                  __html: member.biography,
                }}
              />
            </div>
          ) : (
            <div className="flex-1 mb-6">
              <div className="text-base text-gray-500 italic font-work-sans">
                Biography not available.
              </div>
            </div>
          )}

          {/* LinkedIn Button */}
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 border-2 border-[#0077B5] bg-white text-[#0077B5] rounded-lg hover:bg-[#0077B5] hover:text-white transition-colors font-semibold font-work-sans mt-auto"
            >
              <div className="w-6 h-6 bg-[#0077B5] rounded flex items-center justify-center">
                <FaLinkedin className="w-4 h-4 text-white" />
              </div>
              <span>Linkedin Profile</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
