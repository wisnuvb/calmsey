"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";

interface NavigationItem {
  id: string;
  title: string;
  content: {
    header?: string;
    title: string;
    description: string[];
    image: string;
    imageAlt: string;
  };
}

interface TenureUnderstandingSectionProps {
  navigationItems?: NavigationItem[];
  reportTitle?: string;
  reportUrl?: string;
}

export const TenureUnderstandingSection: React.FC<
  TenureUnderstandingSectionProps
> = ({
  navigationItems = [
    {
      id: "how-we-view-tenure",
      title: "How we view tenure?",
      content: {
        header: "Harmony in Diversity",
        title: "Our Understanding of Tenure",
        description: [
          "Tenure refers to the way in which legal and social systems regulate relationships and rights related to land, oceans, coasts, waterways, and resources. It encompasses the bundle of rights, responsibilities, and relationships that people and communities have with their environment.",
          "Our understanding of tenure goes beyond Western economic concepts of property ownership. We recognize that local and indigenous perspectives often view tenure as a complex bundle of rights, responsibilities, and relationships with nature that consider past, present, and future generations. This holistic approach is explored further in our Marine, Coastal and Shoreline Tenure report.",
        ],
        image: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
        imageAlt: "Floating market with boats and traders",
      },
    },
    {
      id: "outgoing-learning",
      title: "Outgoing Learning",
      content: {
        header: "Knowledge Exchange",
        title: "Learning from Communities",
        description: [
          "We believe in the power of knowledge exchange and mutual learning. Our approach involves working closely with local communities to understand their traditional knowledge systems and governance structures.",
          "Through ongoing dialogue and collaboration, we learn from communities' experiences and adapt our approaches to better support their tenure security and environmental stewardship goals.",
        ],
        image: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
        imageAlt: "Community members sharing knowledge",
      },
    },
    {
      id: "how-change-happens",
      title: "How we view change to happen?",
      content: {
        header: "Transformative Change",
        title: "Our Approach to Change",
        description: [
          "We believe that meaningful change happens through collaborative processes that respect local knowledge and governance systems. Change is most effective when it emerges from within communities rather than being imposed from outside.",
          "Our approach focuses on supporting communities to strengthen their existing governance structures, build capacity, and develop sustainable solutions that work for their specific contexts and needs.",
        ],
        image: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
        imageAlt: "Community meeting and discussion",
      },
    },
  ],
  reportTitle = "Our publication scoping report about Marine, Coastal and Shoreline Tenure 2024",
  reportUrl = "/reports/marine-coastal-shoreline-tenure-2024",
}) => {
  const [activeSection, setActiveSection] = useState("how-we-view-tenure");

  const activeContent = navigationItems.find(
    (item) => item.id === activeSection
  )?.content;

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-4 transition-all duration-200 ${
                    activeSection === item.id
                      ? "text-black font-bold border-l-4 border-gray-400 bg-gray-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeContent && (
              <div className="space-y-8">
                <div className="space-y-3">
                  {/* Header */}
                  {activeContent.header && (
                    <p className="text-[18px] font-normal leading-[1.4] text-[#3C62ED] tracking-normal">
                      {activeContent.header}
                    </p>
                  )}

                  {activeContent.title && (
                    <h2 className="text-[32px] font-normal leading-[120%] text-[#010107] tracking-normal">
                      {activeContent.title}
                    </h2>
                  )}
                </div>

                {/* Main Image */}
                {activeContent.image && (
                  <div className="relative h-80 sm:h-96 rounded-lg overflow-hidden">
                    <Image
                      src={activeContent.image}
                      alt={activeContent.imageAlt}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=320&fit=crop&crop=center`;
                      }}
                    />
                  </div>
                )}

                {/* Description */}
                {activeContent.description &&
                  activeContent.description.length > 0 && (
                    <div className="space-y-4">
                      {activeContent.description.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-[#06072680] text-base leading-[150%] tracking-normal"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                {/* Report Section */}
                {activeSection === "how-we-view-tenure" && (
                  <div className="bg-[#F7FAFC] px-6 py-[28px] rounded-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-black font-medium">
                            {reportTitle}
                          </p>
                        </div>
                      </div>
                      <a
                        href={reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        <span>View Report</span>
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
