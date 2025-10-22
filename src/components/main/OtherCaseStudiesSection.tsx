"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface CaseStudy {
  id: string;
  image: string;
  imageAlt: string;
  location: string;
  date: string;
  title: string;
  slug: string;
}

interface OtherCaseStudiesSectionProps {
  title?: string;
  caseStudies?: CaseStudy[];
}

const CaseStudyCard: React.FC<CaseStudy> = ({
  image,
  imageAlt,
  location,
  date,
  title,
  slug,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative">
        <Image
          src={image}
          alt={imageAlt}
          width={400}
          height={250}
          className="w-full h-64 object-cover"
        />
        {/* Location Tag */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Metadata */}
        <div className="text-sm text-gray-500 mb-3">
          CASE STUDY | {date.toUpperCase()}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4 line-clamp-2">
          {title}
        </h3>

        {/* Read More Button */}
        <a
          href={`/case-study/${slug}`}
          className="block w-full text-center py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export const OtherCaseStudiesSection: React.FC<
  OtherCaseStudiesSectionProps
> = ({
  title = "Other Case Studies",
  caseStudies = [
    {
      id: "1",
      image: "/assets/demo/61d49ae554575244d2db7ab0551faf2183798c04.png",
      imageAlt: "Group of people sitting in circle on red chairs",
      location: "Rawai Park, Thailand",
      date: "June, 2024",
      title:
        "Project Averting Marginalization by building inclusive marine spatial planning",
      slug: "averting-marginalization-marine-spatial-planning",
    },
    {
      id: "2",
      image: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      imageAlt: "Group of women sitting on green chairs under tree",
      location: "Caopa, Senegal",
      date: "May, 2024",
      title:
        "Utilization of cultivated products from mangroves and oysters in Senegal",
      slug: "mangroves-oysters-senegal",
    },
    {
      id: "3",
      image: "/assets/demo/achive.png",
      imageAlt: "Person holding fishing net on beach",
      location: "Rawai Park, Thailand",
      date: "June, 2024",
      title:
        "Support toward secure tenure and rights recognition; A report on the consultation",
      slug: "secure-tenure-rights-recognition",
    },
  ],
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl font-bold text-black mb-12">{title}</h2>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.id} {...caseStudy} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
