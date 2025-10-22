"use client";

import React from "react";
import {
  Heart,
  Brain,
  Hand,
  CheckCircle,
  Globe,
  Sprout,
  Calendar,
  Users,
  FileCheck,
} from "lucide-react";

interface Principle {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface GuidingPrinciplesSectionProps {
  title?: string;
  principles?: Principle[];
  backgroundColor?: string;
}

const PrincipleCard: React.FC<Principle> = ({ title, description, icon }) => {
  return (
    <div className="flex gap-4 p-6">
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
          <div className="text-white">{icon}</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const GuidingPrinciplesSection: React.FC<
  GuidingPrinciplesSectionProps
> = ({
  title = "The Guiding Principles",
  principles = [
    {
      id: "1",
      title: "Make giving more proximate",
      description:
        "We establish culturally sensitive governance structures and center power with our partners.",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: "2",
      title: "Embrace co-design and decision-making",
      description:
        "Our grantmaking is rooted in partners' lived experiences, co-developing strategies and allowing partner input in grant decisions.",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: "3",
      title: "Consider a diversity of end recipients",
      description:
        "We support a variety of entities, including nonprofits, cooperatives, and grassroots movements, adjusting grants to meet their needs.",
      icon: <Hand className="w-6 h-6" />,
    },
    {
      id: "4",
      title: "Provide services beyond the check",
      description:
        "We can swiftly connect partners to service providers with shared values and providers that they prefer.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      id: "5",
      title: "Holistic grantmaking",
      description:
        "We approach our work within the full spectrum of approaches and diverse actions to support partners' well-being and agency.",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      id: "6",
      title: "Focus end support on partners",
      description:
        "We will always work to directly fund organizations and intermediaries that legitimately represent our partners.",
      icon: <Sprout className="w-6 h-6" />,
    },
    {
      id: "7",
      title: "Embrace equitable grantmaking principles",
      description:
        "We trust partners with flexible, multi-year grants, minimal administrative burden, and communication and reporting in partner-preferred ways.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      id: "8",
      title: "Recognize diversity within groups",
      description:
        "We recognize between and within group differences in experience and perspectives, and we prioritize gender and social inclusion in culturally appropriate ways.",
      icon: <Users className="w-6 h-6" />,
    },
  ],
  backgroundColor = "bg-white",
}) => {
  // Split principles into two columns
  const leftColumnPrinciples = principles.slice(0, 4);
  const rightColumnPrinciples = principles.slice(4, 8);

  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="w-24 h-1 bg-gray-300"></div>
          </div>

          {/* Principles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-0">
              {leftColumnPrinciples.map((principle) => (
                <div
                  key={principle.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <PrincipleCard {...principle} />
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-0">
              {rightColumnPrinciples.map((principle) => (
                <div
                  key={principle.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <PrincipleCard {...principle} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
