"use client";

import React from "react";
import {
  Users,
  Target,
  Shield,
  Scale,
  UserCheck,
  Settings,
} from "lucide-react";
import { H2, H5, P } from "../ui/typography";

interface Principle {
  id: string;
  icon: React.ReactNode;
  title: string;
}

interface GrantmakingApproachSectionProps {
  header?: string;
  title?: string;
  principles?: Principle[];
  liberatoryText?: string;
  description?: string;
}

export const GrantmakingApproachSection: React.FC<
  GrantmakingApproachSectionProps
> = ({
  header = "The Liberatory Practices We Are Working Towards",
  title = "Our Approach to Grantmaking",
  principles = [
    {
      id: "shared-decision-making",
      icon: <Users className="w-[18px] h-[18px] text-black" />,
      title: "Shared decision-making",
    },
    {
      id: "power-sharing",
      icon: <Target className="w-[18px] h-[18px] text-black" />,
      title: "Power-sharing in strategy and grant-making",
    },
    {
      id: "trust-based",
      icon: <Shield className="w-[18px] h-[18px] text-black" />,
      title:
        "Trust-based, equitable approaches to grantmaking and partnerships",
    },
    {
      id: "transparency",
      icon: <Scale className="w-[18px] h-[18px] text-black" />,
      title: "Commitment to transparency, mutuality, and ethical engagement",
    },
    {
      id: "inclusivity",
      icon: <UserCheck className="w-[18px] h-[18px] text-black" />,
      title:
        "Emphasis on inclusivity, including free, prior, and informed consent",
    },
    {
      id: "internal-culture",
      icon: <Settings className="w-[18px] h-[18px] text-black" />,
      title:
        "Internal culture focused on critical reflexivity, collaboration, learning, and service",
    },
  ],
  liberatoryText = "We embrace a liberatory approach rooted in social justice and liberation",
  description = "Turning Tides implements and advocates for liberatory approaches to partnership and grant-making – empowering and centering local communities, small-scale fishers and fish workers, and Indigenous Peoples and their supporting groups. Our practices include multi-year flexible funding, streamlined processes, and comprehensive support beyond the financial contribution.",
}) => {
  return (
    <div className="bg-[#3C62ED] py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-white/80 font-normal text-sm  leading-[1.5] tracking-normal mb-6">
            {header}
          </p>
          <H2
            style="h2bold"
            className="text-white w-[406px] mx-auto leading-[1.2]"
          >
            {title}
          </H2>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {principles.map((principle) => (
            <div
              key={principle.id}
              className="flex items-start justify-start gap-8"
            >
              {/* Icon Container */}
              <div className="w-[42px] h-[42px] bg-white rounded-lg flex items-center justify-center mb-4 shrink-0">
                {principle.icon}
              </div>

              {/* Title */}
              <P style="p1reg" className="text-white">
                {principle.title}
              </P>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-blue-300 mb-[60px]"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Left Side - Liberatory Text */}
          <H5
            style="h5regular"
            className="text-white mb-4 w-full sm:w-[286px] shrink-0"
          >
            {liberatoryText}
          </H5>

          {/* Right Side - Description */}
          <P
            style="p1reg"
            className="text-white/80 leading-[150%] tracking-normal"
          >
            {description}
          </P>
        </div>
      </div>
    </div>
  );
};
