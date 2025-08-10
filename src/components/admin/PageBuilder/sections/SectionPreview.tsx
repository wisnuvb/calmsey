/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/SectionPreview.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { PageSection } from "@/types/page-builder";
import { SectionRegistry } from "@/lib/page-builder/section-registry";

interface SectionPreviewProps {
  section: PageSection;
  language: string;
  isSelected?: boolean;
  isHovered?: boolean;
  showControls?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleVisibility?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  viewMode?: "desktop" | "tablet" | "mobile";
}

export default function SectionPreview({
  section,
  language,
  isSelected = false,
  isHovered = false,
  showControls = true,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  canMoveUp = true,
  canMoveDown = true,
  viewMode = "desktop",
}: SectionPreviewProps) {
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionConfig = SectionRegistry.getSection(section.type);

  const translation =
    section.translations.find((t) => t.languageId === language) ||
    section.translations[0];

  useEffect(() => {
    if (sectionRef.current) {
      const updateDimensions = () => {
        const rect = sectionRef.current!.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, [section]);

  const handleMouseEnter = () => {
    setIsControlsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsControlsVisible(false);
  };

  const getSectionStyles = () => {
    const layout = section.layoutSettings || {};
    const style = section.styleSettings || {};
    const responsive = section.responsiveSettings?.[viewMode] || {};

    let styles: React.CSSProperties = {
      position: "relative",
      transition: "all 0.2s ease",
      cursor: "pointer",
      outline: "none",
    };

    // Apply layout settings
    if (layout.padding) {
      styles.padding = formatSpacing(layout.padding);
    }
    if (layout.margin) {
      styles.margin = formatSpacing(layout.margin);
    }
    if (layout.alignment) {
      styles.textAlign = layout.alignment;
    }

    // Apply background
    if (style.background) {
      styles = { ...styles, ...getBackgroundStyles(style.background) };
    }

    // Apply responsive overrides
    if (responsive.padding) styles.padding = formatSpacing(responsive.padding);
    if (responsive.margin) styles.margin = formatSpacing(responsive.margin);
    if (responsive.display === "none") styles.display = "none";

    // Selection and hover states
    if (isSelected) {
      styles.outline = "2px solid #3b82f6";
      styles.outlineOffset = "2px";
    } else if (isHovered || isControlsVisible) {
      styles.outline = "1px dashed #3b82f6";
      styles.outlineOffset = "1px";
    }

    // Hidden sections
    if (!section.isActive) {
      styles.opacity = 0.5;
      styles.filter = "grayscale(100%)";
    }

    return styles;
  };

  const renderSectionContent = () => {
    return (
      <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 text-center">
        <div className="text-4xl mb-2">{sectionConfig?.icon || "📄"}</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {sectionConfig?.name || section.type}
        </h3>
        <p className="text-sm text-gray-500">
          {translation?.title || "No content available"}
        </p>
        {translation?.content && (
          <div
            className="mt-4 text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      ref={sectionRef}
      style={getSectionStyles()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="section-preview"
    >
      {/* Section Content */}
      {renderSectionContent()}

      {/* Controls Overlay */}
      {showControls && (isControlsVisible || isSelected) && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 pointer-events-auto">
            <div className="flex items-center justify-between bg-blue-600 text-white text-xs">
              {/* Section Info */}
              <div className="flex items-center space-x-2 px-3 py-1">
                <span className="text-lg">{sectionConfig?.icon || "📄"}</span>
                <span className="font-medium">
                  {sectionConfig?.name || section.type}
                </span>
                <span className="text-blue-200">
                  {dimensions.width}×{dimensions.height}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center">
                {/* Visibility Toggle */}
                {onToggleVisibility && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility();
                    }}
                    className="p-2 hover:bg-blue-700 transition-colors"
                    title={section.isActive ? "Hide section" : "Show section"}
                  >
                    {section.isActive ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Move Up */}
                {onMoveUp && canMoveUp && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveUp();
                    }}
                    className="p-2 hover:bg-blue-700 transition-colors"
                    title="Move up"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Move Down */}
                {onMoveDown && canMoveDown && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveDown();
                    }}
                    className="p-2 hover:bg-blue-700 transition-colors"
                    title="Move down"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Duplicate */}
                {onDuplicate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate();
                    }}
                    className="p-2 hover:bg-blue-700 transition-colors"
                    title="Duplicate section"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Edit */}
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="p-2 hover:bg-blue-700 transition-colors"
                    title="Edit section"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Delete */}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm("Are you sure you want to delete this section?")
                      ) {
                        onDelete();
                      }
                    }}
                    className="p-2 hover:bg-red-600 transition-colors"
                    title="Delete section"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
            <div className="bg-black bg-opacity-75 text-white text-xs px-3 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span>ID: {section.id.slice(-8)}</span>
                  <span>Order: {section.order + 1}</span>
                  {section.customSettings?.cssClasses && (
                    <span>
                      Classes: {section.customSettings.cssClasses.join(", ")}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {section.animationSettings?.enabled && (
                    <span className="text-yellow-300" title="Has animations">
                      ✨
                    </span>
                  )}
                  {section.responsiveSettings &&
                    Object.keys(section.responsiveSettings).length > 0 && (
                      <span
                        className="text-green-300"
                        title="Has responsive settings"
                      >
                        📱
                      </span>
                    )}
                  {section.customSettings?.customCSS && (
                    <span className="text-purple-300" title="Has custom CSS">
                      🎨
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Resize Handles (for future use) */}
          {isSelected && (
            <>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full pointer-events-auto cursor-n-resize" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full pointer-events-auto cursor-s-resize" />
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full pointer-events-auto cursor-w-resize" />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full pointer-events-auto cursor-e-resize" />
            </>
          )}
        </div>
      )}

      {/* Empty State Overlay */}
      {!translation?.title && !translation?.content && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 pointer-events-none">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm">No content added yet</p>
            <p className="text-xs">Click to edit this section</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {false && ( // Replace with actual loading state
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

// Helper functions (reused from ResponsivePreview)
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
