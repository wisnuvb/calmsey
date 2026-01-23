"use client";

import React from "react";
import { Building, Scale, Zap, Lightbulb, ArrowRight } from "lucide-react";

interface Fund {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  learnMoreLink: string;
}

interface FourFundsSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  funds?: Fund[];
  backgroundColor?: string;
}

export const FourFundsSection: React.FC<FourFundsSectionProps> = ({
  title = "Turning Tides Supports Partners Through 4 Interacting Funds",
  subtitle = "Each of which supports different pathways toward change.",
  description = "Each fund is governed separately to increase responsiveness to partners' expressed needs and opportunities to create change. By 2027, total grantmaking across these will grow to 75% of our total annual budget. Currently, we do not have an open call for proposals.",
  funds = [
    {
      id: "grassroot-funds",
      title: "Grassroot Funds",
      description:
        "Turning Tides deploys the majority of its resources through its Grassroots Fund at regional, national, and local levels.",
      icon: <Building className="w-8 h-8 text-white" />,
      learnMoreLink: "/funds/grassroot",
    },
    {
      id: "civic-space-funds",
      title: "Civic Space & Capacity Strengthening Funds",
      description:
        "We deploy funding to support the self-identified capacity needs of our partners and to, more broadly, protect civic space. Our team will work in close collaboration with partners to identify needs and craft appropriate responses.",
      icon: <Scale className="w-8 h-8 text-white" />,
      learnMoreLink: "/funds/civic-space",
    },
    {
      id: "rapid-response-funds",
      title: "Rapid Response Funds",
      description:
        "Addresses urgent needs, supporting partners and organizations facing threats that require timely financial intervention, particularly in contexts of shrinking civic space, political repression, and sudden crises.",
      icon: <Zap className="w-8 h-8 text-white" />,
      learnMoreLink: "/funds/rapid-response",
    },
    {
      id: "knowledge-learning-funds",
      title: "Knowledge and Learning Funds",
      description:
        "The Knowledge Action Fund amplifies rights holder voices, challenges narratives, and shapes systems for global tenure security.",
      icon: <Lightbulb className="w-8 h-8 text-white" />,
      learnMoreLink: "/funds/knowledge-learning",
    },
  ],
  backgroundColor = "bg-[#3C62ED]",
}) => {
  return (
    <section className={`w-full ${backgroundColor} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {title}
              </h2>
              <p className="text-gray-200 text-lg">{subtitle}</p>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <p className="text-gray-200 text-lg leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Fund Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {funds.map((fund) => (
            <div
              key={fund.id}
              className="bg-[#3759D8] p-8 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <div className="space-y-6">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-blue-700 rounded-lg">
                  {fund.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">{fund.title}</h3>

                  <p className="text-gray-200 leading-relaxed">
                    {fund.description}
                  </p>

                  {/* Learn More Button */}
                  <a
                    href={fund.learnMoreLink}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    aria-label={`Learn more about ${fund.title}`}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
