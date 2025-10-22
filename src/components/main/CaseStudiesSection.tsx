"use client";

import React from "react";
import Image from "next/image";
import { CaseStudyCard } from "./CaseStudyCard";

interface MainCaseStudy {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  link?: string;
}

interface SubCaseStudy {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  link?: string;
}

interface CaseStudiesSectionProps {
  mainCaseStudy?: MainCaseStudy;
  subCaseStudies?: SubCaseStudy[];
  backgroundColor?: string;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  mainCaseStudy = {
    image: "/assets/case-studies/indonesia-coast.jpg",
    imageAlt: "Coastal landscape in Indonesia with mangroves and water",
    title:
      "Going into hak: Pathways for revitalizing marine tenure rights in Indonesia",
    description:
      "The Indonesian archipelago stretches over 3000 miles including the heart of the Coral Triangle, an area known as the center of global marine biodiversity (Allen and Werner, 2002). Millions of Indonesians depend on the sea for livelihoods, culture, and food security. However, these vital marine resources are increasingly threatened by overexploitation, pollution, and climate change. This case study explores the traditional 'hak' system of marine tenure in Indonesia and its potential for revitalization to empower local communities and ensure sustainable resource management.",
    link: "/case-studies/indonesia-marine-tenure",
  },
  subCaseStudies = [
    {
      image: "/assets/case-studies/fishing-boats.jpg",
      imageAlt: "Colorful fishing boats in a harbor",
      title:
        "Common Property Models of Sea Tenure: A Case Study from the Pacific Region",
      description:
        "In recent decades, Pacific Region indigenous sea tenure regimes have received considerable attention from social scientists and policymakers. These models often emphasize collective ownership and traditional management practices, offering valuable lessons for contemporary marine conservation and resource governance.",
      link: "/case-studies/pacific-sea-tenure",
    },
    {
      image: "/assets/case-studies/traditional-sailing.jpg",
      imageAlt: "Traditional sailboats in shallow turquoise water",
      title:
        "Traditional marine tenure: A basis for artisanal fisheries management",
      description:
        "There has been increasing interest in using traditional forms of marine resource ownership as models for fisheries management. These systems, often deeply rooted in local cultures and ecological knowledge, can provide effective frameworks for sustainable artisanal fisheries, promoting equity and community resilience.",
      link: "/case-studies/traditional-marine-tenure",
    },
    {
      image: "/assets/case-studies/mangrove-boats.jpg",
      imageAlt: "Traditional boats in mangrove forest",
      title: "From the forest to the sea: uniting for tenure rights",
      description:
        "Tenure Facility is excited to announce its partnership with Turning Tides, a newly established initiative dedicated to protecting and strengthening the land and resource rights of Indigenous Peoples and local communities. This collaboration aims to bridge the gap between terrestrial and marine tenure, recognizing their interconnectedness.",
      link: "/case-studies/forest-to-sea-tenure",
    },
  ],
  backgroundColor = "bg-gray-50",
}) => {
  return (
    <section className={`w-full ${backgroundColor} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Main Case Study */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative w-full h-64 md:h-96 overflow-hidden">
              <Image
                src={mainCaseStudy.image}
                alt={mainCaseStudy.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight">
                {mainCaseStudy.title}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {mainCaseStudy.description}
              </p>
              {mainCaseStudy.link && (
                <a
                  href={mainCaseStudy.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                >
                  Read More
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Sub Case Studies */}
          <div className="space-y-6">
            {subCaseStudies.map((study, index) => (
              <CaseStudyCard
                key={index}
                image={study.image}
                imageAlt={study.imageAlt}
                title={study.title}
                description={study.description}
                link={study.link}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
