"use client";

import React, { useState } from "react";
import { Handshake, ChevronDown, ChevronUp } from "lucide-react";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface Policy {
  id: string;
  number?: string;
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

const defaultPolicies: Policy[] = [
  {
    id: "our-strategy",
    title: "Our Strategy",
    content:
      '<p><a href="https://turningtidesfacility.org/strategy" aria-label="Read more about Our strategy">Our strategy</a> lays our vision, goal, values and principles. As we learn with partners, we may update our Strategy from time to time. When changes are made, we will update the date listed on the documents. Please review this page periodically for any updates.</p>',
  },
  {
    id: "fiscal-sponsorship",
    title: "Fiscal Sponsorship Agreement",
    content:
      '<p>Turning Tides operated under the <a href="https://turningtidesfacility.org/fiscal-sponsorship" aria-label="Read more about Fiscal Sponsorship Agreement">fiscal sponsorship</a> of The Tenure Facility Fund, a US 501(c)3 not for profit subsidiary of the International Land and Forest Tenure Facility.</p>',
  },
  {
    id: "social-contract",
    title: "Social Contract",
    content:
      '<p>Over and above legal and financial good governance, the partnership with The Tenure Facility Fund, and the International Land and Forest Tenure Facility has been established to improve our services to partners. The spirit of this collaboration, and ties to partners, This partnership, are laid out in the <a href="https://turningtidesfacility.org/social-contract" aria-label="Read more about Social Contract">Social Contract</a>.</p>',
  },
  {
    id: "conflict-of-interest",
    title: "Conflict of Interest",
    content:
      '<p>The <a href="https://turningtidesfacility.org/conflict-of-interest" aria-label="conflict">Conflict of Interest</a> policy protects the interests and values of Turning Tides when it is contemplating entering a transaction or grantmaking process that might benefit the private interest of staff/contractors/consultants, Steering Committee members and any advisory committee/ council members of Turning Tides or might result in a possible excess benefit transaction. This policy is intended to supplement but not replace any applicable local and federal laws governing conflict of interest applicable to nonprofit and charitable organizations.</p>',
  },
  {
    id: "funding-acceptance",
    title: "Funding Acceptance",
    content:
      '<p>At Turning Tides, we prioritize upholding high standards of ethics, integrity, and transparency in all aspects of our operations. <a href="https://turningtidesfacility.org/funding-acceptance" aria-label="tides">Our Funding Acceptance</a> Policy serves as a safeguard, helping Turning Tides make informed decisions regarding external funding acceptance - allowing us to increase funds accessible to local communities, small-scale fisheries, fisher workers and Indigenous Peoples, while maintaining our commitment to ethical conduct, financial prudence, and mission alignment</p>',
  },
  {
    id: "grievance-mechanism",
    title: "Grievance Mechanism",
    content:
      '<p>We recognize that disputes or concerns may arise during the course of our work. We are committed to resolving any issues in a fair, transparent, and timely manner. Grievances: If you believe you have been treated unfairly, or if you have concerns regarding the handling of a grant decision or partnership with Turning Tides, please contact us at <a href="mailto:turningtides@tenureFacility.org" aria-label="recognize">turningtides@tenureFacility.org</a>. We will acknowledge receipt within 10 business days and aim to resolve the issue within 60 business days or less. Appeals: If you are unsatisfied with the outcome of your grievance, you may appeal the decision by submitting a formal request to our Steering Committee at <a href="mailto:SteeringCommittee@TurningTidesFacility.org">SteeringCommittee@TurningTidesFacility.org</a></p>',
  },
  {
    id: "non-discrimination",
    title: "Non-Discrimination Policy",
    content:
      '<p>Turning Tides is committed to ensuring that all individuals and organizations, regardless of race, gender, sexual orientation, age, disability, religion, or any other characteristic, have equal access to our programs and services. We value diversity and inclusivity in all our operations, and our decision-making processes are designed to uphold the principles of justice and fairness. <a href="https://turningtidesfacility.org/non-discrimination" aria-label="Read more about Non-Discrimination Policy">Non-Discrimination Policy</a></p>',
  },
  {
    id: "steering-committee",
    title: "Turning Tides' Steering Committee",
    content:
      '<p>Turning Tides is guided by a <a href="https://turningtidesfacility.org/steering-committee" aria-label="Read more about Steering Committee Policy">Steering Committee</a> who play a pivotal role in setting strategic direction and providing oversight. These Terms of Reference outline the roles, responsibilities, composition, and functioning of the Steering Committee of Turning Tides, ensuring alignment with the organization\'s vision, goals, values and principles.</p>',
  },
  {
    id: "other-policies",
    title: "Policies not listed here",
    content:
      '<p>Where Turning Tides policies are not listed here, they may be in development. We are governed by the legal and financial obligations of our 501(c)3 fiscal sponsor – The Tenure Facility Fund, and/or we defer to the operational and procedural policies of the International Land and Forest Tenure Facility.</p>',
  },
  {
    id: "amendments",
    title: "Amendments to Policies",
    content:
      '<p>We may update our policies from time to time to reflect changes in our practices, legal requirements, or organizational needs. When changes are made, we will update the "Last Revised" date at the top of this page. Please review this page periodically for any updates.</p>',
  },
  {
    id: "grievance-redress",
    title: "Grievance and Redress Policy",
    content:
      '<p>Turning Tides\' Grievance and Redress Policy provides a clear, transparent process for raising concerns and resolving complaints, strengthening trust and accountability with an <a href="https://turningtidesfacility.org/grievance-redress" aria-label="Read more about Grievance and Redress Policy">established</a>, <a href="https://turningtidesfacility.org/feedback" aria-label="Give feedback">Give feedback</a></p>',
  },
  {
    id: "consent-rights",
    title: "Consent and Rights Policy",
    content:
      '<p>TurningTides is committed to transparency and trust through a clear <a href="https://turningtidesfacility.org/consent-rights" aria-label="Read more about Consent and Rights Policy">Consent and Rights Policy</a>.</p>',
  },
  {
    id: "contact-info",
    title: "Contact Information",
    content:
      '<p>If you have any questions about our policies or need further clarification, please reach out to us:</p><ul><li>Email: <a href="mailto:info@turningTidesFacility.org" aria-label="Send email to info@turningTidesFacility.org">info@turningTidesFacility.org</a></li><li>Phone: +62 838 329 80063 (also available for whatsapp contact)</li><li>Mailing Address: 190 Varick Street, FL2, New York, NY 10002 USA</li></ul>',
  },
];

export const GuidingPoliciesSection: React.FC<GuidingPoliciesSectionProps> = ({
  title: propTitle,
  lastUpdate: propLastUpdate,
  description: propDescription,
  policies: propPolicies,
  backgroundColor = "bg-white",
}) => {
  const { getContentJSON, getValue } = usePageContentHelpers();

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
      <div className="container mx-auto px-4">
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
                className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-200 ${expandedPolicy === policy.id
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
                  <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none prose-a:text-[#3C62ED] prose-a:font-medium prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: policy.content }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
