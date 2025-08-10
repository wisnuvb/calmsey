/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/HeroSection.tsx
"use client";

import React from "react";
import { SectionWrapper } from "../SectionRenderer";

interface HeroSectionProps {
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

export default function HeroSection({
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
}: HeroSectionProps) {
  const heroSettings = contentSettings.hero || {};
  const generalSettings = contentSettings.general || {};

  const getHeroHeight = () => {
    if (heroSettings.height === "viewport") {
      return viewMode === "mobile" ? "70vh" : "100vh";
    } else if (heroSettings.height === "custom") {
      return `${heroSettings.customHeight || 600}px`;
    }
    return "auto";
  };

  const getContentPosition = () => {
    const position = heroSettings.contentPosition || "center";
    const verticalAlign = heroSettings.contentVerticalAlign || "center";

    let justifyClass = "justify-center";
    let itemsClass = "items-center";
    let textClass = "text-center";

    switch (position) {
      case "left":
        justifyClass = "justify-start";
        textClass = "text-left";
        break;
      case "right":
        justifyClass = "justify-end";
        textClass = "text-right";
        break;
    }

    switch (verticalAlign) {
      case "top":
        itemsClass = "items-start";
        break;
      case "bottom":
        itemsClass = "items-end";
        break;
    }

    return { justifyClass, itemsClass, textClass };
  };

  const { justifyClass, itemsClass, textClass } = getContentPosition();

  return (
    <SectionWrapper
      layoutSettings={layoutSettings}
      styleSettings={styleSettings}
      animationSettings={animationSettings}
      customSettings={customSettings}
      isEditing={isEditing}
      onClick={onClick}
      className="hero-section relative overflow-hidden"
    >
      {/* Background Overlay */}
      {styleSettings.background?.overlay && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: styleSettings.background.overlay.color,
            opacity: styleSettings.background.overlay.opacity,
            mixBlendMode:
              styleSettings.background.overlay.blendMode || "normal",
          }}
        />
      )}

      {/* Hero Content Container */}
      <div
        className={`relative z-20 flex ${justifyClass} ${itemsClass} px-4 sm:px-6 lg:px-8`}
        style={{
          minHeight: getHeroHeight(),
          paddingTop: viewMode === "mobile" ? "2rem" : "3rem",
          paddingBottom: viewMode === "mobile" ? "2rem" : "3rem",
        }}
      >
        <div className={`max-w-7xl mx-auto ${textClass}`}>
          <div
            className={`${
              viewMode === "mobile"
                ? "max-w-sm"
                : viewMode === "tablet"
                ? "max-w-2xl"
                : "max-w-4xl"
            } mx-auto`}
          >
            {/* Hero Title */}
            {generalSettings.showTitle && translation?.title && (
              <h1
                className={`font-bold leading-tight mb-6 ${
                  viewMode === "mobile"
                    ? "text-3xl"
                    : viewMode === "tablet"
                    ? "text-4xl"
                    : "text-5xl lg:text-6xl"
                }`}
                style={{
                  color: styleSettings.textColor || "#ffffff",
                  fontFamily: styleSettings.typography?.fontFamily,
                  fontSize:
                    viewMode === "mobile"
                      ? (styleSettings.typography?.fontSize || 48) * 0.7
                      : viewMode === "tablet"
                      ? (styleSettings.typography?.fontSize || 48) * 0.85
                      : styleSettings.typography?.fontSize,
                  fontWeight: styleSettings.typography?.fontWeight,
                  lineHeight: styleSettings.typography?.lineHeight,
                  letterSpacing: styleSettings.typography?.letterSpacing,
                  textTransform: styleSettings.typography?.textTransform,
                }}
              >
                {translation.title}
              </h1>
            )}

            {/* Hero Subtitle */}
            {generalSettings.showSubtitle && translation?.subtitle && (
              <p
                className={`mb-6 ${
                  viewMode === "mobile"
                    ? "text-lg"
                    : viewMode === "tablet"
                    ? "text-xl"
                    : "text-xl lg:text-2xl"
                }`}
                style={{
                  color: styleSettings.textColor || "#ffffff",
                  opacity: 0.9,
                }}
              >
                {translation.subtitle}
              </p>
            )}

            {/* Hero Description */}
            {generalSettings.showDescription && translation?.content && (
              <div
                className={`mb-8 ${
                  viewMode === "mobile" ? "text-base" : "text-lg"
                }`}
                style={{
                  color: styleSettings.textColor || "#ffffff",
                  opacity: 0.8,
                }}
                dangerouslySetInnerHTML={{ __html: translation.content }}
              />
            )}

            {/* Hero Button */}
            {generalSettings.showButton && generalSettings.buttonText && (
              <div className="flex justify-center">
                <a
                  href={generalSettings.buttonUrl || "#"}
                  className={`inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200 ${
                    generalSettings.buttonStyle?.variant === "primary"
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                      : generalSettings.buttonStyle?.variant === "secondary"
                      ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl"
                      : generalSettings.buttonStyle?.variant === "outline"
                      ? "border-2 border-white text-white hover:bg-white hover:text-gray-900"
                      : "text-white hover:text-gray-200"
                  } ${
                    generalSettings.buttonStyle?.size === "sm"
                      ? "px-4 py-2 text-sm"
                      : generalSettings.buttonStyle?.size === "lg"
                      ? "px-10 py-5 text-xl"
                      : generalSettings.buttonStyle?.size === "xl"
                      ? "px-12 py-6 text-2xl"
                      : "px-8 py-4 text-lg"
                  } ${
                    generalSettings.buttonStyle?.fullWidth
                      ? "w-full justify-center"
                      : ""
                  }`}
                >
                  {generalSettings.buttonStyle?.icon &&
                    generalSettings.buttonStyle?.iconPosition === "left" && (
                      <span className="mr-2">
                        {generalSettings.buttonStyle.icon}
                      </span>
                    )}
                  {generalSettings.buttonText}
                  {generalSettings.buttonStyle?.icon &&
                    generalSettings.buttonStyle?.iconPosition === "right" && (
                      <span className="ml-2">
                        {generalSettings.buttonStyle.icon}
                      </span>
                    )}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {heroSettings.showScrollIndicator &&
        heroSettings.height === "viewport" && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="animate-bounce">
              <svg
                className="w-6 h-6 text-white opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        )}

      {/* Editing Overlay */}
      {isEditing && (
        <div className="absolute inset-0 z-30 bg-blue-500 bg-opacity-0 hover:bg-opacity-5 transition-colors cursor-pointer" />
      )}
    </SectionWrapper>
  );
}
