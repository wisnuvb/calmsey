"use client";

import React, { useState } from "react";
import {
  Ship,
  Droplets,
  Settings,
  Scale,
  FileSearch,
  CheckCircle2,
} from "lucide-react";
import { H2, H5, H6, P } from "../ui/typography";

interface NavigationItem {
  id: string;
  title: string;
  content: {
    title: string;
    description: string[];
    titleItem?: string;
    items: {
      icon: React.ReactNode;
      text: string;
    }[];
  };
}

export const SupportSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState("what-we-support");

  const navigationItems: NavigationItem[] = [
    {
      id: "what-we-support",
      title: "Our approach to Grantmaking​",
      content: {
        title: "Our approach to Grantmaking​",
        description: [
          "Turning Tides implements and advocates for liberatory approaches to partnership and grant-making. This means working together with Indigenous Peoples, local communities, small-scale fishers and fish workers through reciprocal transformation where both we and our partners work to change the systems and power structures that create barriers to tenure security.",
          "Our practices include multi-year flexible funding, streamlined processes, and partnership support that extends beyond financial contributions.",
        ],
        titleItem: "What we practice",
        items: [
          {
            icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
            text: "Empowering local communities, small-scale fishers and fish workers, and Indigenous peoples to experience security of tenure, certainty of livelihoods and leadership in environmental stewardship.",
          },
          {
            icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
            text: "Promoting awareness and action on rights and tenure in aquatic environments.",
          },
          {
            icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
            text: "Advocating for diverse knowledge systems and inclusive decision-making.",
          },
          {
            icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
            text: "Challenging inequitable policies, practices and processes influencing aquatic governance.",
          },
          {
            icon: <CheckCircle2 className="w-6 h-6 text-[#5ABF87]" />,
            text: "Enhancing services for negotiation, conflict resolution, and accountability.",
          },
        ],
      },
    },
    {
      id: "tenure-rights",
      title: "What we understand by tenure",
      content: {
        title: "What we understand by tenure",
        description: [
          "Tenure rights refer to the bundle of rights that people and communities have to access, use, and manage natural resources, particularly aquatic environments.",
          "These rights are fundamental to ensuring sustainable livelihoods and environmental stewardship.",
        ],
        items: [
          {
            icon: <Ship className="w-6 h-6" />,
            text: "Access rights to fishing grounds and marine resources",
          },
          {
            icon: <Droplets className="w-6 h-6" />,
            text: "Use rights for sustainable resource extraction",
          },
          {
            icon: <Settings className="w-6 h-6" />,
            text: "Management rights for community-based governance",
          },
          {
            icon: <Scale className="w-6 h-6" />,
            text: "Exclusion rights to protect traditional territories",
          },
          {
            icon: <FileSearch className="w-6 h-6" />,
            text: "Alienation rights for resource transfer and inheritance",
          },
        ],
      },
    },
    {
      id: "tenure-security",
      title: "Our Grantmaking",
      content: {
        title: "Framework​",
        description: [
          "Tenure security provides the foundation for sustainable development and environmental conservation.",
          "When communities have secure tenure rights, they are more likely to invest in long-term resource management and conservation practices.",
        ],
        items: [
          {
            icon: <Ship className="w-6 h-6" />,
            text: "Enables long-term planning and investment in sustainable practices",
          },
          {
            icon: <Droplets className="w-6 h-6" />,
            text: "Reduces conflicts over resource access and use",
          },
          {
            icon: <Settings className="w-6 h-6" />,
            text: "Strengthens community governance and decision-making",
          },
          {
            icon: <Scale className="w-6 h-6" />,
            text: "Protects traditional knowledge and cultural practices",
          },
          {
            icon: <FileSearch className="w-6 h-6" />,
            text: "Enhances food security and livelihood stability",
          },
        ],
      },
    },
  ];

  const activeContent = navigationItems.find(
    (item) => item.id === activeSection
  )?.content;

  return (
    <div className="bg-white text-[#010107] min-h-screen py-8 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-16">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {navigationItems.map((item, index) => (
                <div key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left p-4 transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-[#3C62ED] text-white rounded-sm shadow-md"
                        : "text-[#010107]"
                    }`}
                  >
                    <H6 style="h6bold" className="font-medium text-lg">
                      {item.title}
                    </H6>
                  </button>
                  {index < navigationItems.length - 1 && (
                    <div className="border-t border-[#CADBEA] my-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {activeContent && (
              <div className="text-[#010107]">
                <H2 style="h2bold" className="mb-11">
                  {activeContent.title}
                </H2>

                <div className="space-y-6 mb-8">
                  {activeContent.description.map((paragraph, index) => (
                    <P
                      style="p1reg"
                      key={index}
                      className="text-[#060726CC] leading-[150%]"
                    >
                      {paragraph}
                    </P>
                  ))}
                </div>

                <H5 style="h5bold" className="mb-6 text-[#010107]">
                  {activeContent.titleItem}
                </H5>

                <div className="space-y-4">
                  {activeContent.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      {/* <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                        <div className="text-black">{item.icon}</div>
                      </div> */}
                      {item.icon}
                      <div className="flex-1">
                        <P
                          style="p1reg"
                          className="text-[#060726CC] leading-[150%]"
                        >
                          {item.text}
                        </P>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
