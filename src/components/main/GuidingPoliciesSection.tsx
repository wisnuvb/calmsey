"use client";

import React, { useState } from "react";
import { Handshake, ChevronDown, ChevronUp } from "lucide-react";

interface Policy {
  id: string;
  number: string;
  title: string;
  content: string;
}

interface GuidingPoliciesSectionProps {
  title?: string;
  lastUpdate?: string;
  description?: string;
  policies?: Policy[];
  backgroundColor?: string;
}

export const GuidingPoliciesSection: React.FC<GuidingPoliciesSectionProps> = ({
  title = "Guiding Policies for Partners & Stakeholders",
  lastUpdate = "15 January 2025",
  description = "Turning Tides is dedicated to empowering our partners through principles of liberatory grantmaking. We believe in creating equitable pathways for change by prioritizing the voices and needs of those we serve. Our guiding policies support collaboration, transparency, and flexibility, ensuring that each of our five funds is tailored to foster responsiveness and adaptability.",
  policies = [
    {
      id: "our-strategy",
      number: "01",
      title: "Our Strategy",
      content:
        "Our strategy lays our vision, goal, values and principles. As we learn with partners, we may update our Strategy from time to time. When changes are made, we will update the date listed on the documents. Please review this page periodically for any updates.",
    },
    {
      id: "fiscal-sponsorship",
      number: "02",
      title: "Fiscal Sponsorship Agreement",
      content:
        "This agreement outlines the terms and conditions for fiscal sponsorship partnerships with Turning Tides.",
    },
    {
      id: "social-contract",
      number: "03",
      title: "Social Contract",
      content:
        "Our social contract defines the mutual commitments and expectations between Turning Tides and our partners.",
    },
    {
      id: "conflict-of-interest",
      number: "04",
      title: "Conflict of Interest",
      content:
        "This policy addresses potential conflicts of interest and ensures transparency in all our partnerships.",
    },
    {
      id: "funding-acceptance",
      number: "05",
      title: "Funding Acceptance",
      content:
        "Guidelines for accepting and managing funding from various sources while maintaining our values.",
    },
    {
      id: "grievance-mechanism",
      number: "06",
      title: "Grievance Mechanism",
      content:
        "Procedures for addressing concerns and grievances in a fair and transparent manner.",
    },
    {
      id: "non-discrimination",
      number: "07",
      title: "Non-Discrimination Policy",
      content:
        "Our commitment to non-discrimination and equal treatment for all partners and stakeholders.",
    },
    {
      id: "steering-committee",
      number: "08",
      title: "Turning Tides' Steering Committee",
      content:
        "Information about our steering committee structure, roles, and responsibilities.",
    },
    {
      id: "other-policies",
      number: "09",
      title: "Policies not listed here",
      content:
        "Additional policies and guidelines that may apply to specific partnerships or situations.",
    },
    {
      id: "amendments",
      number: "10",
      title: "Amendments to Policies",
      content:
        "Process for updating and amending our policies to ensure they remain relevant and effective.",
    },
    {
      id: "contact-info",
      number: "11",
      title: "Contact Information",
      content:
        "How to reach us for questions about our policies or to provide feedback.",
    },
  ],
  backgroundColor = "bg-white",
}) => {
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(
    "our-strategy"
  );

  const togglePolicy = (policyId: string) => {
    setExpandedPolicy(expandedPolicy === policyId ? null : policyId);
  };

  return (
    <section className={`w-full ${backgroundColor} py-16 md:py-24`}>
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <Handshake className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="text-left">
              <p className="text-gray-600 text-sm font-medium mb-2">
                Last Update
              </p>
              <p className="text-gray-900 font-semibold">{lastUpdate}</p>
            </div>

            <div className="text-left">
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          </div>
        </div>

        {/* Policies Accordion */}
        <div className="space-y-4">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => togglePolicy(policy.id)}
                className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-200 ${
                  expandedPolicy === policy.id
                    ? "bg-blue-50 text-blue-900"
                    : "bg-white text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400">
                    {policy.number}
                  </span>
                  <span className="text-lg font-semibold">{policy.title}</span>
                </div>

                {expandedPolicy === policy.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {expandedPolicy === policy.id && (
                <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                  <p className="text-gray-700 leading-relaxed">
                    {policy.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
