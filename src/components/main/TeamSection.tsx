"use client";

import React from "react";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  linkedinUrl?: string;
}

interface TeamSectionProps {
  title?: string;
  description?: string;
  members?: TeamMember[];
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  title = "Turning Tides's Team",
  description = "Meet the team leading Turning Tides, champions of community rights and marine conservation.",
  members = [
    {
      id: "1",
      name: "Philippa Cohen",
      role: "Co-Director",
      location: "Tasmania, Australia",
      image:
        "https://media.licdn.com/dms/image/v2/C5103AQG12GBGaxQpDw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1579418574783?e=1762387200&v=beta&t=_5EAWLWZq0yRx9WBzcceMR0GnHx4CAnnMOdbUrBD6oM",
      linkedinUrl: "https://linkedin.com/in/philippa-cohen",
    },
    {
      id: "2",
      name: "Kama Dean Fitz",
      role: "Co-Director",
      location: "Denver, CO, USA",
      image:
        "https://media.licdn.com/dms/image/v2/C5103AQG12GBGaxQpDw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1579418574783?e=1762387200&v=beta&t=_5EAWLWZq0yRx9WBzcceMR0GnHx4CAnnMOdbUrBD6oM",
      linkedinUrl: "https://linkedin.com/in/kama-dean-fitz",
    },
    {
      id: "3",
      name: "Jamie Chen",
      role: "Head of Operations",
      location: "California, USA",
      image:
        "https://media.licdn.com/dms/image/v2/C5103AQG12GBGaxQpDw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1579418574783?e=1762387200&v=beta&t=_5EAWLWZq0yRx9WBzcceMR0GnHx4CAnnMOdbUrBD6oM",
      linkedinUrl: "https://linkedin.com/in/jamie-chen",
    },
    {
      id: "4",
      name: "Trini Pratiwi",
      role: "Asia Partner Liaison",
      location: "Malang, Indonesia",
      image:
        "https://media.licdn.com/dms/image/v2/C5103AQG12GBGaxQpDw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1579418574783?e=1762387200&v=beta&t=_5EAWLWZq0yRx9WBzcceMR0GnHx4CAnnMOdbUrBD6oM",
      linkedinUrl: "https://linkedin.com/in/trini-pratiwi",
    },
  ],
  showPagination = true,
  currentPage = 1,
  totalPages = 3,
}) => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {members.map((member) => (
            <div key={member.id} className="text-center">
              {/* Photo with LinkedIn Icon */}
              <div className="relative inline-block mb-4 w-full">
                <div className="mx-auto rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    width={192}
                    height={350}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&size=192&background=random`;
                    }}
                  />
                </div>
                {/* LinkedIn Icon */}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 left-2 w-8 h-8 bg-white rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <FaLinkedin className="w-4 h-4 text-[#3C62ED]" />
                  </a>
                )}
              </div>

              {/* Member Info */}
              <h3 className="text-xl font-bold text-black mb-1">
                {member.name}
              </h3>
              <p className="text-gray-600 mb-1">{member.role}</p>
              <p className="text-sm text-gray-500">{member.location}</p>
            </div>
          ))}
        </div>

        {/* Pagination Indicators */}
        {showPagination && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                className={`w-[56px] h-[6px] rounded-full ${
                  index + 1 === currentPage ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
