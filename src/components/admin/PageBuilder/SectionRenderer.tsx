// src/components/admin/PageBuilder/SectionRenderer.tsx
"use client";

import React from "react";
import { PageSection, PageSectionType } from "@/types/page-builder";

// Individual section components
import HeroSection from "./sections/HeroSection";
import RichTextSection from "./sections/RichTextSection";
import ImageSection from "./sections/ImageSection";
import ContactFormSection from "./sections/ContactFormSection";
import StatsCounterSection from "./sections/StatsCounterSection";
import ContainerSection from "./sections/ContainerSection";
import GridSection from "./sections/GridSection";
import SpacerSection from "./sections/SpacerSection";
import CustomHtmlSection from "./sections/CustomHtmlSection";

type ViewMode = "desktop" | "tablet" | "mobile";

interface SectionRendererProps {
  section: PageSection;
  viewMode: ViewMode;
  language: string;
  isEditing?: boolean;
  onClick?: () => void;
}

export default function SectionRenderer({
  section,
  viewMode,
  language,
  isEditing = false,
  onClick,
}: SectionRendererProps) {
  // Get translation for current language
  const translation =
    section.translations.find((t) => t.languageId === language) ||
    section.translations.find((t) => t.languageId === "en") ||
    section.translations[0];

  // Apply responsive settings based on view mode
  const getResponsiveSettings = () => {
    const responsive = section.responsiveSettings;
    switch (viewMode) {
      case "mobile":
        return { ...section.layoutSettings, ...responsive.mobile.layout };
      case "tablet":
        return { ...section.layoutSettings, ...responsive.tablet.layout };
      default:
        return section.layoutSettings;
    }
  };

  const getResponsiveStyles = () => {
    const responsive = section.responsiveSettings;
    switch (viewMode) {
      case "mobile":
        return { ...section.styleSettings, ...responsive.mobile.style };
      case "tablet":
        return { ...section.styleSettings, ...responsive.tablet.style };
      default:
        return section.styleSettings;
    }
  };

  // Common props for all section components
  const commonProps = {
    section,
    translation,
    layoutSettings: getResponsiveSettings(),
    styleSettings: getResponsiveStyles(),
    contentSettings: section.contentSettings,
    customSettings: section.customSettings,
    animationSettings: section.animationSettings,
    viewMode,
    isEditing,
    onClick,
  };

  // Render appropriate section component based on type
  const renderSection = () => {
    switch (section.type) {
      case PageSectionType.HERO:
        return <HeroSection {...commonProps} />;

      case PageSectionType.RICH_TEXT:
        return <RichTextSection {...commonProps} />;

      case PageSectionType.IMAGE:
        return <ImageSection {...commonProps} />;

      case PageSectionType.CONTACT_FORM:
        return <ContactFormSection {...commonProps} />;

      case PageSectionType.STATS_COUNTER:
        return <StatsCounterSection {...commonProps} />;

      case PageSectionType.CONTAINER:
        return <ContainerSection {...commonProps} />;

      case PageSectionType.GRID:
        return <GridSection {...commonProps} />;

      case PageSectionType.SPACER:
        return <SpacerSection {...commonProps} />;

      case PageSectionType.CUSTOM_HTML:
        return <CustomHtmlSection {...commonProps} />;

      // Add more section types as needed
      case PageSectionType.IMAGE_GALLERY:
      case PageSectionType.VIDEO_EMBED:
      case PageSectionType.SLIDER_CAROUSEL:
      case PageSectionType.SUBSCRIPTION_FORM:
      case PageSectionType.ACCORDION:
      case PageSectionType.TABS:
      case PageSectionType.MODAL_TRIGGER:
      case PageSectionType.BUTTON_GROUP:
      case PageSectionType.ARTICLE_LIST:
      case PageSectionType.CATEGORY_SHOWCASE:
      case PageSectionType.FEATURED_CONTENT:
      case PageSectionType.SEARCH_INTERFACE:
      case PageSectionType.TESTIMONIALS:
      case PageSectionType.TEAM_SHOWCASE:
      case PageSectionType.SOCIAL_FEED:
      case PageSectionType.COUNTDOWN:
      case PageSectionType.PRICING_TABLE:
      case PageSectionType.TIMELINE:
      case PageSectionType.PROGRESS_BAR:
      case PageSectionType.CHART_DISPLAY:
      case PageSectionType.MAP_EMBED:
      case PageSectionType.EMBED_CODE:
      case PageSectionType.WIDGET_AREA:
        return (
          <PlaceholderSection {...commonProps} sectionType={section.type} />
        );

      default:
        return (
          <PlaceholderSection {...commonProps} sectionType={section.type} />
        );
    }
  };

  return (
    <div
      className={`section-renderer ${isEditing ? "editing-mode" : ""}`}
      data-section-id={section.id}
      data-section-type={section.type}
    >
      {renderSection()}
    </div>
  );
}

// Placeholder component for sections not yet implemented
function PlaceholderSection({
  section,
  translation,
  layoutSettings,
  styleSettings,
  sectionType,
  isEditing,
  onClick,
}: any) {
  const sectionName = sectionType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <div
      className={`relative min-h-[120px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${
        isEditing ? "cursor-pointer hover:border-gray-400" : ""
      }`}
      onClick={onClick}
      style={{
        padding: `${layoutSettings.padding?.top || 40}px ${
          layoutSettings.padding?.right || 20
        }px ${layoutSettings.padding?.bottom || 40}px ${
          layoutSettings.padding?.left || 20
        }px`,
        backgroundColor: styleSettings.background?.color || "transparent",
      }}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <span className="text-2xl text-gray-400">📄</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {sectionName} Section
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {translation?.title || "This section type is not yet implemented"}
        </p>
        {isEditing && (
          <p className="text-xs text-gray-400">
            Click to configure this section
          </p>
        )}
      </div>

      {/* Section Type Badge */}
      <div className="absolute top-2 right-2">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
          {sectionType}
        </span>
      </div>
    </div>
  );
}

// Section wrapper component for applying common styles and animations
export function SectionWrapper({
  children,
  layoutSettings,
  styleSettings,
  animationSettings,
  customSettings,
  className = "",
  isEditing = false,
  onClick,
}: {
  children: React.ReactNode;
  layoutSettings: any;
  styleSettings: any;
  animationSettings: any;
  customSettings: any;
  className?: string;
  isEditing?: boolean;
  onClick?: () => void;
}) {
  // Generate CSS styles from settings
  const generateStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    // Layout styles
    if (layoutSettings.width === "full") {
      styles.width = "100%";
    } else if (layoutSettings.width === "container") {
      styles.maxWidth = `${layoutSettings.customWidth || 1200}px`;
      styles.marginLeft = "auto";
      styles.marginRight = "auto";
    } else if (layoutSettings.width === "narrow") {
      styles.maxWidth = "800px";
      styles.marginLeft = "auto";
      styles.marginRight = "auto";
    }

    // Padding
    if (layoutSettings.padding) {
      const p = layoutSettings.padding;
      styles.padding = `${p.top || 0}${p.unit || "px"} ${p.right || 0}${
        p.unit || "px"
      } ${p.bottom || 0}${p.unit || "px"} ${p.left || 0}${p.unit || "px"}`;
    }

    // Margin
    if (layoutSettings.margin) {
      const m = layoutSettings.margin;
      styles.margin = `${m.top || 0}${m.unit || "px"} ${m.right || 0}${
        m.unit || "px"
      } ${m.bottom || 0}${m.unit || "px"} ${m.left || 0}${m.unit || "px"}`;
    }

    // Background
    if (styleSettings.background) {
      const bg = styleSettings.background;
      switch (bg.type) {
        case "color":
          styles.backgroundColor = bg.color;
          break;
        case "image":
          if (bg.image?.url) {
            styles.backgroundImage = `url(${bg.image.url})`;
            styles.backgroundSize = bg.image.size || "cover";
            styles.backgroundPosition = bg.image.position || "center";
            styles.backgroundRepeat = bg.image.repeat || "no-repeat";
          }
          break;
        case "gradient":
          if (bg.gradient) {
            const colors = bg.gradient.colors
              .map((c: any) => `${c.color} ${c.position}%`)
              .join(", ");
            styles.backgroundImage = `linear-gradient(${
              bg.gradient.direction || 0
            }deg, ${colors})`;
          }
          break;
      }
    }

    // Text color
    if (styleSettings.textColor) {
      styles.color = styleSettings.textColor;
    }

    // Border
    if (styleSettings.border && styleSettings.border.width?.top > 0) {
      const b = styleSettings.border;
      styles.border = `${b.width.top}${b.width.unit || "px"} ${b.style} ${
        b.color
      }`;
    }

    // Border radius
    if (styleSettings.borderRadius) {
      styles.borderRadius = `${styleSettings.borderRadius}px`;
    }

    // Box shadow
    if (styleSettings.boxShadow && styleSettings.boxShadow.length > 0) {
      styles.boxShadow = styleSettings.boxShadow
        .map(
          (shadow: any) =>
            `${shadow.inset ? "inset " : ""}${shadow.x}px ${shadow.y}px ${
              shadow.blur
            }px ${shadow.spread}px ${shadow.color}`
        )
        .join(", ");
    }

    // Transform
    if (styleSettings.transform) {
      const t = styleSettings.transform;
      const transforms = [];
      if (t.translateX) transforms.push(`translateX(${t.translateX}px)`);
      if (t.translateY) transforms.push(`translateY(${t.translateY}px)`);
      if (t.scaleX !== 1 || t.scaleY !== 1)
        transforms.push(`scale(${t.scaleX}, ${t.scaleY})`);
      if (t.rotate) transforms.push(`rotate(${t.rotate}deg)`);
      if (transforms.length > 0) {
        styles.transform = transforms.join(" ");
      }
    }

    // Opacity
    if (styleSettings.opacity !== undefined) {
      styles.opacity = styleSettings.opacity;
    }

    return styles;
  };

  // Generate CSS classes
  const generateClasses = (): string => {
    const classes = [className];

    // Alignment
    if (layoutSettings.alignment === "center") {
      classes.push("text-center");
    } else if (layoutSettings.alignment === "right") {
      classes.push("text-right");
    }

    // Display
    if (layoutSettings.display === "flex") {
      classes.push("flex");
      if (layoutSettings.flexDirection) {
        classes.push(`flex-${layoutSettings.flexDirection.replace("-", "-")}`);
      }
      if (layoutSettings.justifyContent) {
        classes.push(
          `justify-${layoutSettings.justifyContent.replace("flex-", "")}`
        );
      }
      if (layoutSettings.alignItems) {
        classes.push(`items-${layoutSettings.alignItems.replace("flex-", "")}`);
      }
    } else if (layoutSettings.display === "grid") {
      classes.push("grid");
      if (layoutSettings.gridColumns) {
        classes.push(`grid-cols-${layoutSettings.gridColumns}`);
      }
    }

    // Custom CSS classes
    if (customSettings.cssClasses) {
      classes.push(...customSettings.cssClasses);
    }

    // Editing mode
    if (isEditing) {
      classes.push("editing-section");
    }

    return classes.filter(Boolean).join(" ");
  };

  return (
    <div
      className={generateClasses()}
      style={generateStyles()}
      onClick={onClick}
      dangerouslySetInnerHTML={
        customSettings.customCSS
          ? {
              __html: `<style>${customSettings.customCSS}</style>`,
            }
          : undefined
      }
    >
      {children}

      {/* Custom JavaScript (only in editing mode for safety) */}
      {isEditing && customSettings.customJS && (
        <script dangerouslySetInnerHTML={{ __html: customSettings.customJS }} />
      )}
    </div>
  );
}
