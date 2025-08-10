/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/ResponsivePreview.tsx
"use client";

import React, { useState } from "react";
import {
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
  DeviceSettings,
  PageSection,
  ResponsiveSettings,
  SpacingValue,
} from "@/types/page-builder";
import Image from "next/image";

interface ResponsivePreviewProps {
  sections: PageSection[];
  language: string;
  viewMode: "desktop" | "tablet" | "mobile";
  onViewModeChange: (mode: "desktop" | "tablet" | "mobile") => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
}

export default function ResponsivePreview({
  sections,
  language,
  viewMode,
  onViewModeChange,
  showGrid = false,
  onToggleGrid,
}: ResponsivePreviewProps) {
  const [zoom, setZoom] = useState(100);

  const deviceSpecs = {
    desktop: { width: 1200, height: 800, label: "Desktop" },
    tablet: { width: 768, height: 1024, label: "Tablet" },
    mobile: { width: 375, height: 667, label: "Mobile" },
  };

  const currentDevice = deviceSpecs[viewMode];

  const getContainerStyle = () => {
    const baseStyle = {
      width: `${currentDevice.width}px`,
      minHeight: `${currentDevice.height}px`,
      transform: `scale(${zoom / 100})`,
      transformOrigin: "top left",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    };

    return baseStyle;
  };

  const renderSection = (section: PageSection) => {
    const translation =
      section.translations.find((t) => t.languageId === language) ||
      section.translations[0];

    const sectionStyle = {
      position: "relative" as const,
      ...getSectionResponsiveStyles(section, viewMode),
      ...(showGrid && {
        outline: "1px dashed #3b82f6",
        outlineOffset: "-1px",
      }),
    };

    return (
      <div
        key={section.id}
        style={sectionStyle}
        className={`section-${section.type} ${showGrid ? "grid-overlay" : ""}`}
      >
        {showGrid && (
          <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 z-10">
            {section.type}
          </div>
        )}
        <SectionRenderer section={section} translation={translation} />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {/* Device Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {Object.entries(deviceSpecs).map(([key, device]) => {
              const Icon =
                key === "desktop"
                  ? ComputerDesktopIcon
                  : key === "tablet"
                  ? DeviceTabletIcon
                  : DevicePhoneMobileIcon;
              return (
                <button
                  key={key}
                  onClick={() => onViewModeChange(key as any)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{device.label}</span>
                </button>
              );
            })}
          </div>

          {/* Device Info */}
          <div className="text-sm text-gray-500 hidden md:block">
            {currentDevice.width} × {currentDevice.height}px
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Control */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Zoom:</span>
            <select
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={25}>25%</option>
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
            </select>
          </div>

          {/* Grid Toggle */}
          {onToggleGrid && (
            <button
              onClick={onToggleGrid}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                showGrid
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {showGrid ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
              <span>Grid</span>
            </button>
          )}
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-center">
          <div
            style={getContainerStyle()}
            className="bg-white rounded-lg overflow-hidden"
          >
            {sections.length > 0 ? (
              sections.map(renderSection)
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p>No sections added yet</p>
                  <p className="text-sm">Add sections from the left panel</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Overlay Styles */}
      {showGrid && (
        <style jsx>{`
          .grid-overlay::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: linear-gradient(
                rgba(59, 130, 246, 0.1) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(59, 130, 246, 0.1) 1px,
                transparent 1px
              );
            background-size: 20px 20px;
            pointer-events: none;
            z-index: 1;
          }
        `}</style>
      )}
    </div>
  );
}

// Helper function to get responsive styles for a section
function getSectionResponsiveStyles(section: PageSection, viewMode: string) {
  const responsive = section.responsiveSettings || {};
  const layout = section.layoutSettings || {};
  const style = section.styleSettings || {};

  // Base styles
  let styles: any = {
    padding: formatSpacing(layout.padding),
    margin: formatSpacing(layout.margin),
    backgroundColor: style.background?.color || "transparent",
    color: style.textColor || "#333333",
    textAlign: layout.alignment || "left",
  };

  // Apply responsive overrides
  const deviceSettings = responsive[viewMode as keyof ResponsiveSettings];
  if (
    deviceSettings &&
    typeof deviceSettings === "object" &&
    !Array.isArray(deviceSettings)
  ) {
    const settings = deviceSettings as DeviceSettings;
    if (settings?.padding) styles.padding = formatSpacing(settings.padding);
    if (settings?.margin) styles.margin = formatSpacing(settings.margin);
    if (settings?.display) styles.display = settings.display;
    if (settings?.fontSize) styles.fontSize = `${settings.fontSize}px`;
  }

  // Apply background
  if (style.background) {
    styles = { ...styles, ...getBackgroundStyles(style.background) };
  }

  // Apply typography
  if (style.typography) {
    styles = { ...styles, ...getTypographyStyles(style.typography) };
  }

  return styles;
}

// Helper function to format spacing
function formatSpacing(spacing?: SpacingValue) {
  if (!spacing) return undefined;

  const { top = 0, right = 0, bottom = 0, left = 0, unit = "px" } = spacing;
  return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
}

// Helper function to get background styles
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

// Helper function to get typography styles
function getTypographyStyles(typography: any) {
  const styles: any = {};

  if (typography.fontFamily) styles.fontFamily = typography.fontFamily;
  if (typography.fontSize)
    styles.fontSize = `${typography.fontSize}${
      typography.fontSizeUnit || "px"
    }`;
  if (typography.lineHeight) styles.lineHeight = typography.lineHeight;
  if (typography.fontWeight) styles.fontWeight = typography.fontWeight;
  if (typography.letterSpacing)
    styles.letterSpacing = `${typography.letterSpacing}em`;
  if (typography.italic) styles.fontStyle = "italic";
  if (typography.underline) styles.textDecoration = "underline";
  if (typography.uppercase) styles.textTransform = "uppercase";
  if (typography.lowercase) styles.textTransform = "lowercase";

  return styles;
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "0, 0, 0";
}

// Basic Section Renderer
function SectionRenderer({
  section,
  translation,
}: {
  section: PageSection;
  translation: any;
}) {
  const { type } = section;

  // This is a simplified renderer - in practice, you'd import the actual section components
  switch (type) {
    case "HERO":
      return (
        <div className="relative py-20 px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {translation?.title || "Hero Title"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {translation?.subtitle || "Hero subtitle"}
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              {translation?.metadata?.buttonText || "Call to Action"}
            </button>
          </div>
        </div>
      );

    case "RICH_TEXT":
      return (
        <div className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {translation?.title && (
              <h2 className="text-2xl font-bold mb-4">{translation.title}</h2>
            )}
            {translation?.subtitle && (
              <h3 className="text-lg text-gray-600 mb-6">
                {translation.subtitle}
              </h3>
            )}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: translation?.content || "Content goes here...",
              }}
            />
          </div>
        </div>
      );

    case "IMAGE":
      return (
        <div className="py-8">
          {translation?.metadata?.imageUrl ? (
            <Image
              src={translation.metadata.imageUrl}
              alt={translation?.metadata?.alt || translation?.title || "Image"}
              className="w-full h-auto"
              width={1000}
              height={1000}
            />
          ) : (
            <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500">
              No image selected
            </div>
          )}
          {(translation?.title || translation?.subtitle) && (
            <div className="text-center mt-4">
              {translation?.title && (
                <h3 className="text-lg font-semibold">{translation.title}</h3>
              )}
              {translation?.subtitle && (
                <p className="text-gray-600">{translation.subtitle}</p>
              )}
            </div>
          )}
        </div>
      );

    case "CONTAINER":
      return (
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            {translation?.title && (
              <h2 className="text-2xl font-bold mb-6">{translation.title}</h2>
            )}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
              Container Section - Child sections would appear here
            </div>
          </div>
        </div>
      );

    case "GRID":
      return (
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            {translation?.title && (
              <h2 className="text-2xl font-bold mb-6">{translation.title}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 text-center text-gray-500"
                >
                  Grid Item {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "SPACER":
      const height = translation?.metadata?.height || 40;
      return (
        <div
          style={{ height: `${height}px` }}
          className="bg-gray-50 border-t border-b border-gray-200"
        />
      );

    case "CUSTOM_HTML":
      return (
        <div
          className="py-4"
          dangerouslySetInnerHTML={{
            __html:
              translation?.content ||
              '<div class="text-center text-gray-500">Custom HTML content goes here</div>',
          }}
        />
      );

    default:
      return (
        <div className="py-8 px-6 bg-gray-50 text-center text-gray-500">
          <div className="text-2xl mb-2">🔧</div>
          <p>Section type: {type}</p>
          <p className="text-sm">Preview not available</p>
        </div>
      );
  }
}
