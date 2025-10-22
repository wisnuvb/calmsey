/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

interface GridSectionProps {
  translation: any;
  style?: React.CSSProperties;
  children?: React.ReactNode[];
}

export default function GridSection({
  translation,
  style,
  children,
}: GridSectionProps) {
  const metadata = translation?.metadata || {};
  const columns = metadata.columns || "3";
  const gap = metadata.gap || "medium";

  const getGridClasses = () => {
    const classes = ["grid"];

    // Column classes
    switch (columns) {
      case "1":
        classes.push("grid-cols-1");
        break;
      case "2":
        classes.push("grid-cols-1 md:grid-cols-2");
        break;
      case "3":
        classes.push("grid-cols-1 md:grid-cols-2 lg:grid-cols-3");
        break;
      case "4":
        classes.push("grid-cols-1 md:grid-cols-2 lg:grid-cols-4");
        break;
      case "6":
        classes.push("grid-cols-2 md:grid-cols-3 lg:grid-cols-6");
        break;
      default:
        classes.push("grid-cols-1 md:grid-cols-2 lg:grid-cols-3");
    }

    // Gap classes
    switch (gap) {
      case "small":
        classes.push("gap-4");
        break;
      case "medium":
        classes.push("gap-6");
        break;
      case "large":
        classes.push("gap-8");
        break;
      default:
        classes.push("gap-6");
    }

    return classes.join(" ");
  };

  return (
    <section className="py-12" style={style}>
      <div className="container mx-auto px-4">
        {translation?.title && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {translation.title}
          </h2>
        )}

        {translation?.subtitle && (
          <p className="text-lg text-gray-600 text-center mb-12">
            {translation.subtitle}
          </p>
        )}

        <div className={getGridClasses()}>
          {children ||
            Array.from({ length: parseInt(columns) }, (_, index) => (
              <div
                key={index}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center min-h-32"
              >
                <div className="text-center text-gray-500">
                  <div className="text-xl mb-2">📦</div>
                  <p className="text-sm">Grid Item {index + 1}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
