// src/components/admin/BrandkitPreview.tsx
"use client";

import { Brandkit } from "@/types/brandkit";
import Image from "next/image";

interface BrandkitPreviewProps {
  brandkit: Brandkit;
}

export default function BrandkitPreview({ brandkit }: BrandkitPreviewProps) {
  const getContrastColor = (hexColor: string | object): string => {
    // Handle case where hexColor is an object (like semantic colors)
    if (typeof hexColor === "object" && hexColor !== null) {
      // If it's a semantic color object, use the 'main' property
      if ("main" in hexColor && typeof hexColor.main === "string") {
        hexColor = hexColor.main;
      } else {
        // Fallback to white if we can't determine the color
        return "#ffffff";
      }
    }

    // Ensure hexColor is a string
    if (typeof hexColor !== "string" || !hexColor) {
      return "#ffffff";
    }

    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const getColorValue = (color: string | object): string => {
    // Handle case where color is an object (like semantic colors)
    if (typeof color === "object" && color !== null) {
      // If it's a semantic color object, use the 'main' property
      if ("main" in color && typeof color.main === "string") {
        return color.main;
      } else {
        // Fallback to a default color if we can't determine the color
        return "#000000";
      }
    }

    // Ensure color is a string
    if (typeof color !== "string" || !color) {
      return "#000000";
    }

    return color;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {brandkit.name} Preview
        </h2>
        <p className="mt-2 text-gray-600">{brandkit.description}</p>
      </div>

      {/* Color Palette Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Color Palette
        </h3>
        <div className="space-y-6">
          {Object.entries(brandkit.colors).map(([groupName, colors]) => (
            <div key={groupName}>
              <h4 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                {groupName} Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(colors).map(([shade, color]) => (
                  <div key={shade} className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-xs font-medium"
                      style={{
                        backgroundColor: getColorValue(
                          color as string | object
                        ),
                        color: getContrastColor(color as string | object),
                      }}
                    >
                      {shade}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {getColorValue(color as string | object)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>

        {/* Font Families */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Font Families
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Primary</p>
              <p
                style={{
                  fontFamily: brandkit.typography.fontFamilies.heading.name,
                }}
              >
                {brandkit.typography.fontFamilies.heading.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Secondary</p>
              <p
                style={{
                  fontFamily: brandkit.typography.fontFamilies.heading.name,
                }}
              >
                {brandkit.typography.fontFamilies.heading.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Monospace</p>
              <p
                style={{
                  fontFamily: brandkit.typography.fontFamilies.mono.name,
                }}
              >
                {brandkit.typography.fontFamilies.mono.name}
              </p>
            </div>
          </div>
        </div>

        {/* Text Styles */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Text Styles
          </h4>
          <div className="space-y-4">
            {Object.entries(brandkit.typography.textStyles).map(
              ([styleName, style]) => (
                <div key={styleName} className="flex items-center space-x-4">
                  <div className="w-20 text-xs text-gray-500 capitalize">
                    {styleName}
                  </div>
                  <div
                    style={{
                      fontFamily: brandkit.typography.fontFamilies.heading.name,
                      fontSize: style.fontSize,
                      fontWeight: style.fontWeight,
                      lineHeight: style.lineHeight,
                      letterSpacing: style.letterSpacing,
                    }}
                  >
                    {styleName === "h1" && "Main Heading Style"}
                    {styleName === "h2" && "Section Heading Style"}
                    {styleName === "h3" && "Subsection Heading Style"}
                    {styleName === "body" &&
                      "This is how body text will appear in your design system."}
                    {styleName === "caption" && "Caption text style"}
                    {styleName === "button" && "Button Text"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {style.fontSize} / {style.fontWeight} / {style.lineHeight}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Spacing Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Spacing System
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section Spacing */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Section Spacing
            </h4>
            <div className="space-y-2">
              {Object.entries(brandkit.spacing.scale).map(([size, value]) => (
                <div key={size} className="flex items-center space-x-3">
                  <div className="w-8 text-xs text-gray-500">{size}</div>
                  <div
                    className="bg-blue-200 rounded flex items-center justify-center text-xs text-blue-800 min-w-0"
                    style={{
                      height: String(value),
                      minHeight: "20px",
                      width: "120px",
                    }}
                  >
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Component Spacing */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Component Spacing
            </h4>
            <div className="space-y-2">
              {Object.entries(brandkit.spacing.components).map(
                ([component, spacing]) => (
                  <div key={component} className="flex items-center space-x-3">
                    <div className="w-8 text-xs text-gray-500 capitalize">
                      {component}
                    </div>
                    <div
                      className="bg-green-200 rounded flex items-center justify-center text-xs text-green-800 min-w-0"
                      style={{
                        height: "30px",
                        minHeight: "20px",
                        width: "120px",
                      }}
                    >
                      <div className="text-center">
                        <div className="text-xs">
                          P: {String(spacing.padding)}
                        </div>
                        <div className="text-xs">
                          M: {String(spacing.margin)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assets Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Assets</h3>

        {/* Logos */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Logos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brandkit.assets.logos.primary && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Primary Logo</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Image
                    src={brandkit.assets.logos.primary.light}
                    width={64}
                    height={64}
                    alt="Primary Logo"
                    className="max-h-16 mx-auto"
                  />
                </div>
              </div>
            )}
            {brandkit.assets.logos.secondary && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Secondary Logo</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Image
                    width={64}
                    height={64}
                    src={brandkit.assets.logos.secondary.light}
                    alt="Secondary Logo"
                    className="max-h-16 mx-auto"
                  />
                </div>
              </div>
            )}
            {brandkit.assets.logos.primary.symbol && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Favicon</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Image
                    width={64}
                    height={64}
                    src={brandkit.assets.logos.primary.symbol}
                    alt="Favicon"
                    className="w-8 h-8 mx-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Library */}
        {brandkit.assets.imageLibrary.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Image Library
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {brandkit.assets.imageLibrary.slice(0, 12).map((image) => (
                <div
                  key={image.id}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    width={64}
                    height={64}
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {brandkit.assets.imageLibrary.length > 12 && (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    +{brandkit.assets.imageLibrary.length - 12} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sample Component Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Component Preview
        </h3>

        <div className="space-y-6">
          {/* Button Styles */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <button
                style={{
                  backgroundColor: brandkit.colors.primary[500],
                  color: getContrastColor(brandkit.colors.primary[500]),
                  fontFamily: brandkit.typography.fontFamilies.heading.name,
                  fontSize: brandkit.typography.textStyles.button.fontSize,
                  fontWeight: brandkit.typography.textStyles.button.fontWeight,
                  padding: `${brandkit.spacing.scale[0.5]} ${brandkit.spacing.scale[1]}`,
                }}
                className="rounded-md border-0"
              >
                Primary Button
              </button>
              <button
                style={{
                  backgroundColor: brandkit.colors.secondary[500],
                  color: getContrastColor(brandkit.colors.secondary[500]),
                  fontFamily: brandkit.typography.fontFamilies.heading.name,
                  fontSize: brandkit.typography.textStyles.button.fontSize,
                  fontWeight: brandkit.typography.textStyles.button.fontWeight,
                  padding: `${brandkit.spacing.scale[0.5]} ${brandkit.spacing.scale[1]}`,
                }}
                className="rounded-md border-0"
              >
                Secondary Button
              </button>
              <button
                style={{
                  backgroundColor: "transparent",
                  color: brandkit.colors.primary[500],
                  border: `1px solid ${brandkit.colors.primary[500]}`,
                  fontFamily: brandkit.typography.fontFamilies.heading.name,
                  fontSize: brandkit.typography.textStyles.button.fontSize,
                  fontWeight: brandkit.typography.textStyles.button.fontWeight,
                  padding: `${brandkit.spacing.scale[0.5]} ${brandkit.spacing.scale[1]}`,
                }}
                className="rounded-md"
              >
                Outline Button
              </button>
            </div>
          </div>

          {/* Card Example */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Card Example
            </h4>
            <div
              className="border rounded-lg shadow-sm"
              style={{
                fontFamily: brandkit.typography.fontFamilies.heading.name,
                padding: brandkit.spacing.components.card.padding,
              }}
            >
              <h3
                style={{
                  fontSize: brandkit.typography.textStyles.h3.fontSize,
                  fontWeight: brandkit.typography.textStyles.h3.fontWeight,
                  lineHeight: brandkit.typography.textStyles.h3.lineHeight,
                  marginBottom: brandkit.spacing.scale[0.5],
                  color: brandkit.colors.neutral[900],
                }}
              >
                Sample Card Title
              </h3>
              <p
                style={{
                  fontSize: brandkit.typography.textStyles.body.fontSize,
                  fontWeight: brandkit.typography.textStyles.body.fontWeight,
                  lineHeight: brandkit.typography.textStyles.body.lineHeight,
                  marginBottom: brandkit.spacing.scale[1],
                  color: brandkit.colors.neutral[600],
                }}
              >
                This is how body text would appear in a card component using
                your brandkit settings.
              </p>
              <button
                style={{
                  backgroundColor: brandkit.colors.accent[500],
                  color: getContrastColor(brandkit.colors.accent[500]),
                  fontFamily: brandkit.typography.fontFamilies.heading.name,
                  fontSize: brandkit.typography.textStyles.button.fontSize,
                  fontWeight: brandkit.typography.textStyles.button.fontWeight,
                  padding: `${brandkit.spacing.scale[0.5]} ${brandkit.spacing.scale[1]}`,
                  border: "none",
                }}
                className="rounded-md"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Brandkit Information
        </h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <strong>Version:</strong> {brandkit.version}
          </p>
          <p>
            <strong>Status:</strong> {brandkit.isActive ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Visibility:</strong>{" "}
            {brandkit.isPublic ? "Public" : "Private"}
          </p>
          <p>
            <strong>Usage:</strong> Used in {brandkit.usageCount} pages
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(brandkit.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(brandkit.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
