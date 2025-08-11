/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  PageSection,
  PageSectionType,
  ResponsiveSettings,
} from "@/types/page-builder";
import HeroSection from "./HeroSection";
import RichTextSection from "./RichTextSection";
import ImageSection from "./ImageSection";
import ContainerSection from "./ContainerSection";
import GridSection from "./GridSection";
import ContactFormSection from "./ContactFormSection";
import TestimonialsSection from "./TestimonialsSection";
import StatsCounterSection from "./StatsCounterSection";
import SpacerSection from "./SpacerSection";
import CustomHtmlSection from "./CustomHtmlSection";

interface SectionRendererProps {
  section: PageSection;
  language: string;
  isPublic?: boolean;
  isPreview?: boolean;
}

export default function SectionRenderer({
  section,
  language,
  isPublic = false,
  isPreview = false,
}: SectionRendererProps) {
  // Get translation for current language
  const translation =
    section.translations.find((t) => t.languageId === language) ||
    section.translations[0];

  if (!translation && isPublic) {
    return null; // Don't render sections without translations in public view
  }

  // Apply responsive styles based on current viewport
  const sectionStyles = getSectionStyles(section, "desktop"); // In real app, detect viewport

  const commonProps = {
    section,
    translation,
    language,
    isPublic,
    isPreview,
    style: sectionStyles,
  };

  switch (section.type) {
    case PageSectionType.HERO:
      return <HeroSection {...commonProps} />;

    case PageSectionType.RICH_TEXT:
      return <RichTextSection {...commonProps} />;

    case PageSectionType.IMAGE:
      return <ImageSection {...commonProps} />;

    case PageSectionType.CONTAINER:
      return <ContainerSection {...commonProps} />;

    case PageSectionType.GRID:
      return <GridSection {...commonProps} />;

    case PageSectionType.CONTACT_FORM:
      return <ContactFormSection {...commonProps} />;

    // case PageSectionType.ARTICLE_LIST:
    //   return <ArticleListSection {...commonProps} />;

    case PageSectionType.TESTIMONIALS:
      return <TestimonialsSection {...commonProps} />;

    case PageSectionType.STATS_COUNTER:
      return <StatsCounterSection {...commonProps} />;

    case PageSectionType.SPACER:
      return <SpacerSection {...commonProps} />;

    case PageSectionType.CUSTOM_HTML:
      return <CustomHtmlSection {...commonProps} />;

    default:
      if (isPreview) {
        return (
          <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg">
            <p className="text-yellow-800">
              Section type &quot;{section.type}&quot; not implemented yet
            </p>
          </div>
        );
      }
      return null;
  }
}

// Helper function to get section styles
function getSectionStyles(section: PageSection, viewMode: string) {
  const layout = section.layoutSettings || {};
  const style = section.styleSettings || {};
  const responsive =
    section.responsiveSettings?.[viewMode as keyof ResponsiveSettings] || {};

  let styles: React.CSSProperties = {};

  // Apply layout settings
  if (layout.padding) {
    styles.padding = formatSpacing(layout.padding);
  }
  if (layout.margin) {
    styles.margin = formatSpacing(layout.margin);
  }
  if (layout.alignment) {
    styles.textAlign = layout.alignment as any;
  }

  // Apply background
  if (style.background) {
    styles = { ...styles, ...getBackgroundStyles(style.background) };
  }

  // Apply responsive overrides
  if (
    responsive &&
    typeof responsive === "object" &&
    !Array.isArray(responsive)
  ) {
    if (responsive.padding) styles.padding = formatSpacing(responsive.padding);
    if (responsive.margin) styles.margin = formatSpacing(responsive.margin);
    if (responsive.display) styles.display = responsive.display;
  }

  return styles;
}

function formatSpacing(spacing: any) {
  if (!spacing) return undefined;

  const { top = 0, right = 0, bottom = 0, left = 0, unit = "px" } = spacing;
  return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
}

function getBackgroundStyles(background: any) {
  const styles: any = {};

  switch (background?.type) {
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
