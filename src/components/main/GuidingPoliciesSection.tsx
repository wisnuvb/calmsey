"use client";

import React, { useState } from "react";
import { Handshake, ChevronDown, ChevronUp } from "lucide-react";
import { usePageContent } from "@/contexts/PageContentContext";

interface Policy {
  id: string;
  number?: string;
  title: string;
  content: string;
  linkText?: string;
  linkHref?: string;
}

interface GuidingPoliciesSectionProps {
  title?: string;
  lastUpdate?: string;
  description?: string;
  policies?: Policy[];
  backgroundColor?: string;
}

const defaultPolicies: Policy[] = [
  {
    id: "our-strategy",
    title: "Our Strategy",
    content:
      "Our strategy lays our vision, goal, values and principles. As we learn with partners, we may update our Strategy from time to time. When changes are made, we will update the date listed on the documents. Please review this page periodically for any updates.",
    linkText: "Our strategy",
    linkHref: "/strategy",
  },
  {
    id: "fiscal-sponsorship",
    title: "Fiscal Sponsorship Agreement",
    content:
      "This agreement outlines the terms and conditions for fiscal sponsorship partnerships with Turning Tides.",
  },
  {
    id: "social-contract",
    title: "Social Contract",
    content:
      "Our social contract defines the mutual commitments and expectations between Turning Tides and our partners.",
  },
  {
    id: "conflict-of-interest",
    title: "Conflict of Interest",
    content:
      "This policy addresses potential conflicts of interest and ensures transparency in all our partnerships.",
  },
  {
    id: "funding-acceptance",
    title: "Funding Acceptance",
    content:
      "Guidelines for accepting and managing funding from various sources while maintaining our values.",
  },
  {
    id: "grievance-mechanism",
    title: "Grievance Mechanism",
    content:
      "Procedures for addressing concerns and grievances in a fair and transparent manner.",
  },
  {
    id: "non-discrimination",
    title: "Non-Discrimination Policy",
    content:
      "Our commitment to non-discrimination and equal treatment for all partners and stakeholders.",
  },
  {
    id: "steering-committee",
    title: "Turning Tides' Steering Committee",
    content:
      "Information about our steering committee structure, roles, and responsibilities.",
  },
  {
    id: "other-policies",
    title: "Policies not listed here",
    content:
      "Additional policies and guidelines that may apply to specific partnerships or situations.",
  },
  {
    id: "amendments",
    title: "Amendments to Policies",
    content:
      "Process for updating and amending our policies to ensure they remain relevant and effective.",
  },
  {
    id: "contact-info",
    title: "Contact Information",
    content:
      "How to reach us for questions about our policies or to provide feedback.",
  },
];

export const GuidingPoliciesSection: React.FC<GuidingPoliciesSectionProps> = ({
  title: propTitle,
  lastUpdate: propLastUpdate,
  description: propDescription,
  policies: propPolicies,
  backgroundColor = "bg-white",
}) => {
  // Try to get content from context, fallback to empty object if not available
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

  const getContentValue = (key: string, defaultValue: string = ""): string => {
    return pageContent[key] || defaultValue;
  };

  const getContentJSON = <T,>(key: string, defaultValue: T): T => {
    const value = pageContent[key];
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  };

  const getValue = (
    contentKey: string,
    propValue?: string,
    defaultValue: string = ""
  ): string => {
    const contentValue = getContentValue(contentKey, "");
    if (contentValue && contentValue.trim() !== "") {
      return contentValue;
    }
    if (propValue && propValue.trim() !== "") {
      return propValue;
    }
    return defaultValue;
  };

  // Get values from context > props > defaults
  const title = getValue(
    "guidingPolicies.title",
    propTitle,
    "Our Guiding Policies"
  );

  const lastUpdate = getValue(
    "guidingPolicies.lastUpdate",
    propLastUpdate,
    "15 January 2025"
  );

  const description = getValue(
    "guidingPolicies.description",
    propDescription,
    "Our guiding policies support collaboration, transparency, and flexibility, ensuring that each of our funds are tailored to foster responsiveness and adaptability."
  );

  const policies = getContentJSON<Policy[]>(
    "guidingPolicies.policies",
    propPolicies || defaultPolicies
  );

  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(
    policies.length > 0 ? policies[0].id : null
  );

  const togglePolicy = (policyId: string) => {
    setExpandedPolicy(expandedPolicy === policyId ? null : policyId);
  };

  return (
    <section className={`w-full ${backgroundColor} py-16 md:py-24`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#3C62ED] rounded-lg flex items-center justify-center">
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
        <div className="space-y-3">
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
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
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
                  {policy.linkHref && policy.linkText && (
                    <a
                      href={policy.linkHref}
                      className="inline-block mt-3 text-[#3C62ED] font-medium hover:underline"
                    >
                      {policy.linkText}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
