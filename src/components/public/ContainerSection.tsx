/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

interface ContainerSectionProps {
  section: any;
  translation: any;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function ContainerSection({
  section,
  translation,
  style,
  children,
}: ContainerSectionProps) {
  const layout = section.layoutSettings || {};

  const getContainerClass = () => {
    switch (layout.width || "container") {
      case "full":
        return "w-full";
      case "narrow":
        return "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8";
      case "container":
        return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
      case "custom":
        return `mx-auto px-4 sm:px-6 lg:px-8`;
      default:
        return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
    }
  };

  return (
    <section
      className="py-8"
      style={{
        ...style,
        ...(layout.width === "custom" && layout.customWidth
          ? { maxWidth: `${layout.customWidth}px` }
          : {}),
      }}
    >
      <div className={getContainerClass()}>
        {translation?.title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {translation.title}
          </h2>
        )}

        {translation?.subtitle && (
          <p className="text-lg text-gray-600 mb-8">{translation.subtitle}</p>
        )}

        {translation?.content && (
          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        )}

        {children || (
          <div className="min-h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-xl mb-2">📦</div>
              <p className="text-sm">Container content goes here</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
