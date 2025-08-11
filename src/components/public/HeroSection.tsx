/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";

interface HeroSectionProps {
  translation: any;
  language: string;
  style?: React.CSSProperties;
}

export default function HeroSection({
  translation,
  language,
  style,
}: HeroSectionProps) {
  const metadata = translation?.metadata || {};
  const prefix = language === "en" ? "" : `/${language}`;

  return (
    <section
      className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden"
      style={style}
    >
      {/* Background Image */}
      {metadata.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${metadata.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {translation?.title && (
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              {translation.title}
            </h1>
          )}

          {translation?.subtitle && (
            <p className="mt-6 text-lg leading-8 text-blue-100 max-w-3xl mx-auto">
              {translation.subtitle}
            </p>
          )}

          {translation?.content && (
            <div
              className="mt-6 text-blue-100 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />
          )}

          {(metadata.buttonText || metadata.buttonUrl) && (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={metadata.buttonUrl || `${prefix}/contact`}
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                {metadata.buttonText || "Get Started"}
              </Link>

              {metadata.secondaryButtonText && (
                <Link
                  href={metadata.secondaryButtonUrl || `${prefix}/about`}
                  className="text-base font-semibold leading-6 text-white hover:text-blue-100 transition-colors"
                >
                  {metadata.secondaryButtonText}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
