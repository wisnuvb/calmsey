/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/ContainerSection.tsx
"use client";

import React from "react";
import { PageSection } from "@/types/page-builder";

interface ContainerSectionProps {
  section: PageSection;
  translation: any;
  isPreview?: boolean;
  viewMode?: "desktop" | "tablet" | "mobile";
  children?: React.ReactNode;
  onChildrenChange?: (children: PageSection[]) => void;
}

export default function ContainerSection({
  section,
  translation,
  isPreview = false,
  viewMode = "desktop",
  children,
}: ContainerSectionProps) {
  const getContainerClasses = () => {
    const layout = section.layoutSettings || {};
    const responsive = section.responsiveSettings?.[viewMode] || {};

    const classes = ["container-section"];

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
        // Custom width will be handled in inline styles
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

  const getContainerStyles = () => {
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

    // Border and border radius
    if (style.border) {
      styles.border = `${style.border.width || 1}px ${
        style.border.style || "solid"
      } ${style.border.color || "#e5e7eb"}`;
    }
    if (style.borderRadius) {
      styles.borderRadius = `${style.borderRadius}px`;
    }

    // Box shadow
    if (style.boxShadow && style.boxShadow.length > 0) {
      const shadows = {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      };
      styles.boxShadow = shadows.medium;
    }

    // Responsive overrides
    if (responsive.padding) styles.padding = formatSpacing(responsive.padding);
    if (responsive.margin) styles.margin = formatSpacing(responsive.margin);
    if (responsive.display) styles.display = responsive.display;

    // Custom CSS
    if (section.customSettings?.customCSS) {
      // This would be injected as a style tag in a real implementation
    }

    return styles;
  };

  const renderContent = () => {
    if (isPreview && !children) {
      return (
        <div className="min-h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm font-medium">Container Section</p>
            <p className="text-xs">Drop sections here to organize content</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container-content">
        {translation?.title && (
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
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

        {/* Child sections would be rendered here */}
        {children || (
          <div className="min-h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="text-xl mb-2">➕</div>
              <p className="text-sm">Add content sections</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      className={getContainerClasses()}
      style={getContainerStyles()}
      data-section-type="container"
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

    case "video":
      // Video backgrounds would need special handling
      styles.position = "relative";
      styles.overflow = "hidden";
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
