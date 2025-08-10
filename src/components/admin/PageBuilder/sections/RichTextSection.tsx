/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/RichTextSection.tsx
"use client";

import React from "react";
import { SectionWrapper } from "../SectionRenderer";

interface RichTextSectionProps {
  section: any;
  translation: any;
  layoutSettings: any;
  styleSettings: any;
  contentSettings: any;
  customSettings: any;
  animationSettings: any;
  viewMode: "desktop" | "tablet" | "mobile";
  isEditing: boolean;
  onClick?: () => void;
}

export default function RichTextSection({
  section,
  translation,
  layoutSettings,
  styleSettings,
  contentSettings,
  customSettings,
  animationSettings,
  viewMode,
  isEditing,
  onClick,
}: RichTextSectionProps) {
  const richTextSettings = contentSettings.richText || {};
  const generalSettings = contentSettings.general || {};

  const getMaxWidth = () => {
    if (richTextSettings.maxWidth) {
      return `${richTextSettings.maxWidth}px`;
    }
    return viewMode === "mobile" ? "100%" : "800px";
  };

  const getColumnStyles = () => {
    if (
      richTextSettings.columnCount &&
      richTextSettings.columnCount > 1 &&
      viewMode === "desktop"
    ) {
      return {
        columnCount: richTextSettings.columnCount,
        columnGap: `${richTextSettings.columnGap || 40}px`,
        columnFill: "balance",
      };
    }
    return {};
  };

  return (
    <SectionWrapper
      layoutSettings={layoutSettings}
      styleSettings={styleSettings}
      animationSettings={animationSettings}
      customSettings={customSettings}
      isEditing={isEditing}
      onClick={onClick}
      className="rich-text-section"
    >
      <div className="mx-auto" style={{ maxWidth: getMaxWidth() }}>
        {/* Section Title */}
        {generalSettings.showTitle && translation?.title && (
          <h2
            className={`font-bold mb-6 ${
              viewMode === "mobile"
                ? "text-2xl"
                : viewMode === "tablet"
                ? "text-3xl"
                : "text-4xl"
            }`}
            style={{
              color: styleSettings.textColor,
              fontFamily: styleSettings.typography?.fontFamily,
              textAlign: layoutSettings.alignment || "left",
            }}
          >
            {translation.title}
          </h2>
        )}

        {/* Section Subtitle */}
        {generalSettings.showSubtitle && translation?.subtitle && (
          <h3
            className={`font-medium mb-4 ${
              viewMode === "mobile" ? "text-lg" : "text-xl"
            }`}
            style={{
              color: styleSettings.textColor,
              opacity: 0.8,
              textAlign: layoutSettings.alignment || "left",
            }}
          >
            {translation.subtitle}
          </h3>
        )}

        {/* Reading Time (if enabled) */}
        {richTextSettings.enableReadingTime && translation?.content && (
          <div className="mb-4 text-sm text-gray-500">
            <span>
              📖 Estimated reading time:{" "}
              {calculateReadingTime(translation.content)} min
            </span>
          </div>
        )}

        {/* Table of Contents (if enabled) */}
        {richTextSettings.enableTableOfContents && translation?.content && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">
              Table of Contents
            </h4>
            <div
              dangerouslySetInnerHTML={{
                __html: generateTableOfContents(translation.content),
              }}
            />
          </div>
        )}

        {/* Rich Text Content */}
        {translation?.content && (
          <div
            className={`prose prose-lg max-w-none ${
              richTextSettings.enableDropCap
                ? "first-letter:float-left first-letter:font-bold first-letter:text-7xl first-letter:line-height-none first-letter:pr-2 first-letter:pt-1"
                : ""
            }`}
            style={
              {
                ...getColumnStyles(),
                color: styleSettings.textColor,
                fontFamily: styleSettings.typography?.fontFamily,
                fontSize: styleSettings.typography?.fontSize,
                lineHeight: styleSettings.typography?.lineHeight,
                letterSpacing: styleSettings.typography?.letterSpacing,
                textAlign: layoutSettings.alignment || "left",
              } as React.CSSProperties
            }
            dangerouslySetInnerHTML={{
              __html: enhanceContent(translation.content, richTextSettings),
            }}
          />
        )}

        {/* Call to Action Button */}
        {generalSettings.showButton && generalSettings.buttonText && (
          <div
            className={`mt-8 ${
              layoutSettings.alignment === "center"
                ? "text-center"
                : layoutSettings.alignment === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            <a
              href={generalSettings.buttonUrl || "#"}
              className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-md transition-colors ${
                generalSettings.buttonStyle?.variant === "primary"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : generalSettings.buttonStyle?.variant === "secondary"
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  : generalSettings.buttonStyle?.variant === "outline"
                  ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {generalSettings.buttonText}
            </a>
          </div>
        )}

        {/* Editing Placeholder */}
        {isEditing &&
          (!translation?.content || translation.content.trim() === "") && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                Click to add rich text content
              </p>
            </div>
          )}
      </div>
    </SectionWrapper>
  );
}

// Helper functions
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function generateTableOfContents(content: string): string {
  const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
  if (headings.length === 0)
    return '<p class="text-gray-500 text-sm">No headings found</p>';

  const toc = headings
    .map((heading, index) => {
      const level = parseInt(heading.match(/<h([1-6])/)?.[1] || "1");
      const text = heading.replace(/<[^>]*>/g, "");
      const id = `heading-${index}`;
      const indent = "ml-" + (level - 1) * 4;

      return `<a href="#${id}" class="block py-1 text-blue-600 hover:text-blue-800 ${indent}">${text}</a>`;
    })
    .join("");

  return `<nav class="text-sm">${toc}</nav>`;
}

function enhanceContent(content: string, settings: any): string {
  let enhanced = content;

  // Add IDs to headings for TOC linking
  if (settings.enableTableOfContents) {
    let headingIndex = 0;
    enhanced = enhanced.replace(
      /<h([1-6])([^>]*)>/gi,
      (match, level, attrs) => {
        return `<h${level}${attrs} id="heading-${headingIndex++}">`;
      }
    );
  }

  // Enhance tables with responsive classes
  enhanced = enhanced.replace(
    /<table([^>]*)>/gi,
    '<div class="overflow-x-auto"><table$1 class="min-w-full table-auto border-collapse border border-gray-300">'
  );
  enhanced = enhanced.replace(/<\/table>/gi, "</table></div>");

  // Enhance images with responsive classes
  enhanced = enhanced.replace(
    /<img([^>]*)>/gi,
    '<img$1 class="max-w-full h-auto rounded-lg shadow-md" loading="lazy">'
  );

  // Enhance code blocks
  enhanced = enhanced.replace(
    /<pre([^>]*)>/gi,
    '<pre$1 class="bg-gray-100 rounded-lg p-4 overflow-x-auto">'
  );
  enhanced = enhanced.replace(
    /<code([^>]*)>/gi,
    '<code$1 class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">'
  );

  // Enhance blockquotes
  enhanced = enhanced.replace(
    /<blockquote([^>]*)>/gi,
    '<blockquote$1 class="border-l-4 border-blue-500 pl-4 py-2 italic text-gray-700 bg-gray-50 rounded-r-lg">'
  );

  return enhanced;
}
