/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

interface RichTextSectionProps {
  section: any;
  translation: any;
  style?: React.CSSProperties;
}

export default function RichTextSection({
  section,
  translation,
  style,
}: RichTextSectionProps) {
  const layout = section.layoutSettings || {};

  const getContainerClass = () => {
    switch (layout.width || "container") {
      case "full":
        return "w-full";
      case "narrow":
        return "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8";
      case "container":
        return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
      default:
        return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
    }
  };

  return (
    <section className="py-12" style={style}>
      <div className={getContainerClass()}>
        {translation?.title && (
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
            {translation.title}
          </h2>
        )}

        {translation?.subtitle && (
          <h3 className="text-xl text-gray-600 mb-8">{translation.subtitle}</h3>
        )}

        {translation?.content && (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        )}
      </div>
    </section>
  );
}
