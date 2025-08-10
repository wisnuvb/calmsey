/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/SpacerSection.tsx
"use client";

import React from "react";
import { PageSection } from "@/types/page-builder";

interface SpacerSectionProps {
  section: PageSection;
  translation: any;
  isPreview?: boolean;
  viewMode?: "desktop" | "tablet" | "mobile";
}

export default function SpacerSection({
  section,
  translation,
  isPreview = false,
  viewMode = "desktop",
}: SpacerSectionProps) {
  const getSpacerHeight = () => {
    const metadata = translation?.metadata || {};
    const responsive = section.responsiveSettings?.[viewMode] || {};

    // Get height from metadata or default
    let height = metadata.height || 40;

    // Apply responsive overrides
    if (responsive.height) {
      height = responsive.height;
    }

    // Ensure minimum height
    return Math.max(height, 10);
  };

  const getSpacerStyles = () => {
    const style = section.styleSettings || {};
    const layout = section.layoutSettings || {};
    const responsive = section.responsiveSettings?.[viewMode] || {};

    let styles: any = {
      height: `${getSpacerHeight()}px`,
      width: "100%",
    };

    // Background (optional for spacers)
    if (style.background && style.background.type !== "none") {
      styles = { ...styles, ...getBackgroundStyles(style.background) };
    }

    // Margin (but not padding for spacers)
    if (layout.margin) {
      styles.margin = formatSpacing(layout.margin);
    }

    // Border (for visual debugging or design purposes)
    if (style.border && style.border.enabled) {
      styles.border = `${style.border.width || 1}px ${
        style.border.style || "solid"
      } ${style.border.color || "#e5e7eb"}`;
    }

    // Responsive overrides
    if (responsive.margin) styles.margin = formatSpacing(responsive.margin);
    if (responsive.display) styles.display = responsive.display;

    return styles;
  };

  const getSpacerClasses = () => {
    const responsive = section.responsiveSettings?.[viewMode] || {};
    const classes = ["spacer-section"];

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

  const renderPreviewContent = () => {
    if (!isPreview) return null;

    const height = getSpacerHeight();

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white bg-opacity-90 rounded-lg px-3 py-1 border border-gray-300 shadow-sm">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>📏</span>
            <span>Spacer</span>
            <span className="font-mono">{height}px</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={getSpacerClasses()}
      style={getSpacerStyles()}
      data-section-type="spacer"
      data-section-id={section.id}
    >
      {/* Preview overlay */}
      {isPreview && (
        <div className="relative h-full">
          {/* Visual indicator for empty spacer */}
          {(!section.styleSettings?.background ||
            section.styleSettings.background.type === "none") && (
            <div className="absolute inset-0 border-t border-b border-dashed border-gray-300 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-50" />
          )}

          {renderPreviewContent()}
        </div>
      )}

      {/* Actual spacer content (usually empty) */}
      {translation?.content && (
        <div
          className="spacer-content h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: translation.content }}
        />
      )}
    </div>
  );
}

// Advanced Spacer with responsive breakpoints
export function ResponsiveSpacerSection({
  section,
  translation,
  isPreview = false,
  viewMode = "desktop",
}: SpacerSectionProps) {
  const getResponsiveStyles = () => {
    const metadata = translation?.metadata || {};
    const responsive = section.responsiveSettings || {};

    // Default heights
    const desktopHeight = metadata.height || 40;
    const tabletHeight =
      responsive.tablet?.height || Math.round(desktopHeight * 0.75);
    const mobileHeight =
      responsive.mobile?.height || Math.round(desktopHeight * 0.5);

    return {
      "--spacer-desktop": `${desktopHeight}px`,
      "--spacer-tablet": `${tabletHeight}px`,
      "--spacer-mobile": `${mobileHeight}px`,
      height: "var(--spacer-desktop)",
    } as React.CSSProperties;
  };

  return (
    <div
      className="spacer-section responsive-spacer"
      style={getResponsiveStyles()}
      data-section-type="spacer"
      data-section-id={section.id}
    >
      {/* Responsive CSS */}
      <style jsx>{`
        .responsive-spacer {
          height: var(--spacer-desktop);
        }

        @media (max-width: 1024px) {
          .responsive-spacer {
            height: var(--spacer-tablet);
          }
        }

        @media (max-width: 640px) {
          .responsive-spacer {
            height: var(--spacer-mobile);
          }
        }
      `}</style>

      {isPreview && (
        <div className="relative h-full">
          <div className="absolute inset-0 border-t border-b border-dashed border-gray-300 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white bg-opacity-90 rounded-lg px-3 py-1 border border-gray-300 shadow-sm">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>📏</span>
                <span>Responsive Spacer</span>
                <span className="font-mono">
                  {viewMode === "desktop" &&
                    `${translation?.metadata?.height || 40}px`}
                  {viewMode === "tablet" &&
                    `${
                      section.responsiveSettings?.tablet?.height ||
                      Math.round((translation?.metadata?.height || 40) * 0.75)
                    }px`}
                  {viewMode === "mobile" &&
                    `${
                      section.responsiveSettings?.mobile?.height ||
                      Math.round((translation?.metadata?.height || 40) * 0.5)
                    }px`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Divider Spacer with decorative elements
export function DividerSpacerSection({
  section,
  translation,
  isPreview = false,
  viewMode = "desktop",
}: SpacerSectionProps) {
  const metadata = translation?.metadata || {};
  const dividerStyle = metadata.dividerStyle || "line";
  const dividerColor = metadata.dividerColor || "#e5e7eb";
  const dividerWidth = metadata.dividerWidth || "100%";

  const renderDivider = () => {
    switch (dividerStyle) {
      case "line":
        return (
          <hr
            style={{
              borderColor: dividerColor,
              width: dividerWidth,
              margin: "0 auto",
            }}
            className="border-t"
          />
        );

      case "dots":
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: dividerColor }}
              />
            ))}
          </div>
        );

      case "star":
        return (
          <div className="text-center" style={{ color: dividerColor }}>
            ✦
          </div>
        );

      case "wave":
        return (
          <div className="text-center text-2xl" style={{ color: dividerColor }}>
            〜
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="spacer-section divider-spacer flex items-center justify-center"
      style={{
        height: `${metadata.height || 40}px`,
        ...getBackgroundStyles(section.styleSettings?.background),
      }}
      data-section-type="spacer"
      data-section-id={section.id}
    >
      {renderDivider()}
    </div>
  );
}

// Helper functions
function formatSpacing(spacing?: any) {
  if (!spacing) return undefined;

  const { top = 0, right = 0, bottom = 0, left = 0, unit = "px" } = spacing;
  return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
}

function getBackgroundStyles(background: any) {
  if (!background || background.type === "none") return {};

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
      break;
  }

  return styles;
}
