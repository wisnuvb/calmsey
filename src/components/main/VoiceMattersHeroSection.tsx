"use client";

import React from "react";
import { Mail, ArrowRight } from "lucide-react";

interface VoiceMattersHeroSectionProps {
  title?: string;
  description?: string;
  feedbackButtonText?: string;
  feedbackButtonLink?: string;
  learnButtonText?: string;
  learnButtonLink?: string;
  backgroundColor?: string;
}

export const VoiceMattersHeroSection: React.FC<
  VoiceMattersHeroSectionProps
> = ({
  title = "Your Voice Matters in Shaping Tenure Rights",
  description = "Have feedback on our governance policies? Share your thoughts to help us strengthen tenure rights and ensure fair, inclusive practices.",
  feedbackButtonText = "Give Feedback",
  feedbackButtonLink = "/feedback",
  learnButtonText = "Learn How We Partners",
  learnButtonLink = "/partners",
  backgroundColor = "bg-blue-600",
}) => {
  return (
    <section
      className={`w-full ${backgroundColor} py-16 md:py-24 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
        <div className="w-full h-full rounded-full border-4 border-blue-300"></div>
      </div>
      <div className="absolute top-8 right-8 w-32 h-32 opacity-30">
        <div className="w-full h-full rounded-full border-2 border-blue-200"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {title}
              </h1>

              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>
          </div>

          {/* Right Section - Buttons */}
          <div className="flex flex-col space-y-4">
            {/* Give Feedback Button */}
            <a
              href={feedbackButtonLink}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black hover:bg-gray-100 transition-colors duration-200 rounded-lg font-semibold text-lg shadow-lg"
            >
              <Mail className="w-5 h-5" />
              {feedbackButtonText}
            </a>

            {/* Learn How We Partners Button */}
            <a
              href={learnButtonLink}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-colors duration-200 rounded-lg font-semibold text-lg"
            >
              {learnButtonText}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
