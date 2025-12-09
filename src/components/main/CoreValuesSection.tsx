"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface CoreValue {
  id: string;
  title: string;
  description: string;
}

interface CoreValuesSectionProps {
  title?: string;
  image?: string;
  imageAlt?: string;
  values?: CoreValue[];
  backgroundColor?: string;
}

const ValueItem: React.FC<{
  value: CoreValue;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ value, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className={`w-full text-left p-4 transition-colors duration-200 ${
          isExpanded
            ? "bg-[#3C62ED] text-white"
            : "bg-white text-gray-900 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm leading-tight pr-4">
            {value.title}
          </h3>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 flex-shrink-0" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div
          className={`px-4 pb-4 ${
            isExpanded ? "text-[#06072680]" : "text-gray-700"
          }`}
        >
          <p className="text-sm leading-relaxed">{value.description}</p>
        </div>
      )}
    </div>
  );
};

export const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({
  title = "Our Core Values",
  image = "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
  imageAlt = "Group of five people taking a selfie in an outdoor natural setting",
  values = [
    {
      id: "1",
      title: "Uphold lived experience and diverse knowledge.",
      description:
        "Recognize the deep understanding of root causes and solutions that comes from lived experience and utilize all forms of knowledge. Recognize and support actions respectful of context specificity. Create learning environments that respect and benefit from all forms of knowledge on an equal plane.",
    },
    {
      id: "2",
      title:
        "Center power with partners (i.e., Local communities, small-scale fishers, fish workers, and Indigenous Peoples, and the groups that legitimately serve and support them)",
      description:
        "We prioritize partnerships with local communities, ensuring that decision-making power remains with those most affected by our work.",
    },
    {
      id: "3",
      title: "Base our work on trust, responsiveness and service",
      description:
        "We build relationships based on trust, respond to community needs, and serve as a reliable partner in advancing shared goals.",
    },
    {
      id: "4",
      title: "Prioritize transparency & accountability",
      description:
        "We maintain open communication and hold ourselves accountable to our partners and the communities we serve.",
    },
    {
      id: "5",
      title: "Foster solidarity and protect civic spaces.",
      description:
        "We stand in solidarity with communities and work to protect and strengthen civic spaces for democratic participation.",
    },
    {
      id: "6",
      title: "Prioritize and plan for self-determination and independence",
      description:
        "We support communities in achieving self-determination and independence in their governance and decision-making processes.",
    },
    {
      id: "7",
      title: "Commit to humility and reflexivity",
      description:
        "We approach our work with humility, continuously reflecting on our practices and learning from our partners and communities.",
    },
  ],
  backgroundColor = "bg-white",
}) => {
  const [expandedValue, setExpandedValue] = useState<string>("1");

  const handleToggle = (valueId: string) => {
    setExpandedValue(expandedValue === valueId ? "" : valueId);
  };

  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl font-bold text-black mb-12 text-center">
            {title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Column */}
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={getImageUrl(image)}
                  alt={imageAlt}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Values Column */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {values.map((value) => (
                  <ValueItem
                    key={value.id}
                    value={value}
                    isExpanded={expandedValue === value.id}
                    onToggle={() => handleToggle(value.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
