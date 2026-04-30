"use client";

import React, { useState } from "react";
import { H2, P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { MemberDetailModal } from "@/components/ui/MemberDetailModal";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import { SteeringCommitteCard } from "./SteeringCommitteCard";
import { MembersCarouselShell } from "./MembersCarouselShell";

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
      "<p>I have been an applied environmental social scientist and <strong>inclusive governance advisor for 25 years</strong>. I have always focused on small-scale fisheries, coastal communities, and women in fisheries – from research, processing, trading and governance. I am an islander – living and working in Australia (Tasmania), Tonga, Fiji, Solomon Islands and Malaysia (Penang).</p><p>Lorem ipsum dolor sit amet consectetur. Nascetur maecenas viverra diam habitant interdum orci in ridiculus sagittis. Vulputate orci ut convallis felis urna consequat et laoreet velit. Amet id molestie a enim vitae senectus in porta et. Quam velit elementum facilisi dui egestas rhoncus ipsum vestibulum. Nec a ut consectetur lorem. Egestas orci fringilla urna ultrices. Condimentum mi et fermentum pulvinar dignissim donec pellentesque congue pharetra. Ac eget porttitor proin sed viverra sit. Quis sit dignissim morbi amet amet. Nisl massa vitae.</p>",
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
  const { getValue, getContentJSON } = usePageContentHelpers();

  // Get all values with priority: context > props > default
  const title = getValue(
    "steeringCommittee.title",
    propTitle,
    "The Steering Committee",
  );
  const description = getValue(
    "steeringCommittee.description",
    propDescription,
    "Turning Tides is governed by a Steering Committee who are responsible for setting strategic direction and values alignment",
  );
  const additionalDescription = getValue(
    "steeringCommittee.additionalDescription",
    propAdditionalDescription,
    "The implementation of our strategy and organizational priorities—composed of small-scale fisher leaders, Indigenous Peoples, and rights experts who bring both deep expertise and accountability to those we serve. The Steering Committee has governed the initiative since the first months of its inception and is critical to the accountability and efficacy",
  );
  const bottomText = getValue(
    "steeringCommittee.bottomText",
    propBottomText,
    "",
  );
  const members = getContentJSON<CommitteeMember[]>(
    "steeringCommittee.members",
    propMembers || defaultMembers,
  );

  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(
    null,
  );

  return (
    <section
      className={cn("w-full pb-16 lg:pb-24", backgroundColor)}
      id="steeringcommittees"
    >
      <div className="container mx-auto px-4">
        {/* Title and Description */}
        <div className="mb-12 lg:mb-16 space-y-10">
          <H2
            style="h2bold"
            className="text-[#010107] text-3xl sm:text-[38px] leading-[120%] tracking-normal text-center font-nunito"
          >
            {title}
          </H2>
          <div className="text-[#3F3F46] text-center max-w-4xl mx-auto space-y-4">
            <P style="p1reg" className="p">
              {description}
            </P>
            <P style="p1reg" className="p">
              {additionalDescription}
            </P>
          </div>
        </div>

        <MembersCarouselShell
          members={members}
          renderCard={(member) => (
            <SteeringCommitteCard
              member={member}
              setSelectedMember={setSelectedMember}
            />
          )}
        />

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
