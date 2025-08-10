/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/GridSection.tsx
"use client";

import React from "react";
import { PageSection } from "@/types/page-builder";

interface GridSectionProps {
  section: PageSection;
  translation: any;
  isPreview?: boolean;
  viewMode?: "desktop" | "tablet" | "mobile";
  children?: React.ReactNode[];
  onChildrenChange?: (children: PageSection[]) => void;
}

export default function GridSection({
  section,
  translation,
  isPreview = false,
  viewMode = "desktop",
  children,
}: GridSectionProps) {
  const getGridClasses = () => {
    const layout = section.layoutSettings || {};
    const responsive = section.responsiveSettings?.[viewMode] || {};
    const metadata = translation?.metadata || {};

    const classes = ["grid-section", "grid"];

    // Column configuration
    const columns = metadata.columns || "2";
    const gap = metadata.gap || "medium";
    const responsiveBreakpoints = metadata.responsiveBreakpoints !== false;

    // Base grid classes
    if (responsiveBreakpoints) {
      // Responsive grid
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
          classes.push("grid-cols-1 md:grid-cols-2");
      }
    } else {
      // Fixed grid
      classes.push(`grid-cols-${columns}`);
    }

    // Gap classes
    switch (gap) {
      case "small":
        classes.push("gap-2");
        break;
      case "medium":
        classes.push("gap-4");
        break;
      case "large":
        classes.push("gap-8");
        break;
      default:
        classes.push("gap-4");
    }

    // Width settings
    switch (layout.width || "container") {
      case "full":
        classes.push("w-full");
        break;
      case "container":
        classes.push("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8");
        break;
      case "narrow":
        classes.push("max-w-4xl mx-auto px-4 sm:px-6 lg:px-8");
        break;
      case "custom":
        classes.push("mx-auto px-4 sm:px-6 lg:px-8");
        break;
    }

    // Responsive visibility
    if (responsive.display === "none") {
      classes.push("hidden");
    }

    // Custom CSS classes
    if (section.customSettings?.cssClasses) {
      classes.push(...section.customSettings.cssClasses);
    }

    return classes.join(" ");
  };

  const getGridStyles = () => {
    const layout = section.layoutSettings || {};
    const style = section.styleSettings || {};
    const responsive = section.responsiveSettings?.[viewMode] || {};

    let styles: any = {};

    // Custom width
    if (layout.width === "custom" && layout.customWidth) {
      styles.maxWidth = `${layout.customWidth}px`;
    }

    // Spacing
    if (layout.padding) {
      styles.padding = formatSpacing(layout.padding);
    }
    if (layout.margin) {
      styles.margin = formatSpacing(layout.margin);
    }

    // Background
    if (style.background) {
      styles = { ...styles, ...getBackgroundStyles(style.background) };
    }

    // Responsive overrides
    if (responsive.padding) styles.padding = formatSpacing(responsive.padding);
    if (responsive.margin) styles.margin = formatSpacing(responsive.margin);
    if (responsive.display) styles.display = responsive.display;

    return styles;
  };

  const renderGridItems = () => {
    const metadata = translation?.metadata || {};
    const columns = parseInt(metadata.columns || "2");

    if (isPreview && !children) {
      // Generate placeholder items for preview
      return Array.from({ length: columns }, (_, index) => (
        <div
          key={index}
          className="grid-item border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 flex items-center justify-center min-h-32"
        >
          <div className="text-center text-gray-500">
            <div className="text-xl mb-2">📦</div>
            <p className="text-sm font-medium">Grid Item {index + 1}</p>
            <p className="text-xs">Drop content here</p>
          </div>
        </div>
      ));
    }

    if (children && children.length > 0) {
      return children;
    }

    // Empty state with proper number of slots
    return Array.from({ length: columns }, (_, index) => (
      <div
        key={`empty-${index}`}
        className="grid-item border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 flex items-center justify-center min-h-32"
      >
        <div className="text-center text-gray-500">
          <div className="text-xl mb-2">➕</div>
          <p className="text-sm">Add content</p>
        </div>
      </div>
    ));
  };

  const renderContent = () => {
    return (
      <div className="grid-content">
        {translation?.title && (
          <div className="grid-header mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {translation.title}
            </h2>
            {translation?.subtitle && (
              <p className="text-lg text-gray-600 mt-2">
                {translation.subtitle}
              </p>
            )}
          </div>
        )}

        {translation?.content && (
          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        )}

        {/* Grid Items */}
        <div className={getGridClasses()}>{renderGridItems()}</div>
      </div>
    );
  };

  return (
    <section
      className="grid-section-wrapper py-8"
      style={getGridStyles()}
      data-section-type="grid"
      data-section-id={section.id}
    >
      {renderContent()}
    </section>
  );
}

// Helper functions
function formatSpacing(spacing?: any) {
  if (!spacing) return undefined;

  const { top = 0, right = 0, bottom = 0, left = 0, unit = "px" } = spacing;
  return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
}

function getBackgroundStyles(background: any) {
  const styles: any = {};

  switch (background.type) {
    case "color":
      styles.backgroundColor = background.color;
      break;

    case "gradient":
      if (background.gradientType === "linear") {
        styles.background = `linear-gradient(${background.direction || 0}deg, ${
          background.startColor
        }, ${background.endColor})`;
      } else {
        styles.background = `radial-gradient(circle, ${background.startColor}, ${background.endColor})`;
      }
      break;

    case "image":
      styles.backgroundImage = `url(${background.imageUrl})`;
      styles.backgroundSize = background.size || "cover";
      styles.backgroundPosition = background.position || "center";
      styles.backgroundRepeat = background.repeat ? "repeat" : "no-repeat";

      if (background.overlayColor && background.overlayOpacity > 0) {
        const overlay = `rgba(${hexToRgb(background.overlayColor)}, ${
          background.overlayOpacity / 100
        })`;
        styles.background = `linear-gradient(${overlay}, ${overlay}), url(${background.imageUrl})`;
      }
      break;
  }

  return styles;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "0, 0, 0";
}
