/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/StatsCounterSection.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { SectionWrapper } from "../SectionRenderer";

interface StatsCounterSectionProps {
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

interface CounterData {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  duration: number;
}

export default function StatsCounterSection({
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
}: StatsCounterSectionProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<number, number>>(
    {}
  );
  const sectionRef = useRef<HTMLDivElement>(null);

  const statsSettings = contentSettings.stats || {};
  const generalSettings = contentSettings.general || {};

  // Default counters or from settings
  const counters: CounterData[] = statsSettings.counters || [
    {
      label: "Happy Clients",
      value: 500,
      suffix: "+",
      prefix: "",
      duration: 2000,
    },
    {
      label: "Projects Completed",
      value: 1200,
      suffix: "+",
      prefix: "",
      duration: 2500,
    },
    {
      label: "Years Experience",
      value: 10,
      suffix: "",
      prefix: "",
      duration: 1500,
    },
    {
      label: "Team Members",
      value: 50,
      suffix: "+",
      prefix: "",
      duration: 2000,
    },
  ];

  const layout = statsSettings.layout || "grid";
  const columns =
    statsSettings.columns ||
    Math.min(counters.length, viewMode === "mobile" ? 2 : 4);
  const enableAnimation = statsSettings.enableAnimation !== false;

  // Intersection Observer for triggering animation
  useEffect(() => {
    if (!enableAnimation || isEditing || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          startCounterAnimations();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [enableAnimation, isEditing, hasAnimated]);

  const startCounterAnimations = () => {
    counters.forEach((counter, index) => {
      animateCounter(index, counter.value, counter.duration);
    });
  };

  const animateCounter = (
    index: number,
    targetValue: number,
    duration: number
  ) => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(
        startValue + (targetValue - startValue) * easedProgress
      );

      setAnimatedValues((prev) => ({ ...prev, [index]: currentValue }));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const getGridClasses = () => {
    if (layout !== "grid") return "";

    const colClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };

    if (viewMode === "mobile") {
      return "grid grid-cols-2 gap-6";
    } else if (viewMode === "tablet") {
      return `grid ${
        colClasses[Math.min(columns, 3) as keyof typeof colClasses] ||
        "grid-cols-3"
      } gap-8`;
    } else {
      return `grid ${
        colClasses[columns as keyof typeof colClasses] || "grid-cols-4"
      } gap-8`;
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-wrap justify-center gap-8";
      case "vertical":
        return "space-y-8";
      default:
        return getGridClasses();
    }
  };

  const renderCounter = (counter: CounterData, index: number) => {
    const displayValue =
      enableAnimation && hasAnimated && !isEditing
        ? animatedValues[index] ?? 0
        : counter.value;

    return (
      <div
        key={index}
        className={`text-center ${
          layout === "horizontal" ? "flex-shrink-0" : ""
        }`}
      >
        {/* Counter Value */}
        <div
          className={`font-bold mb-2 ${
            viewMode === "mobile"
              ? "text-3xl"
              : viewMode === "tablet"
              ? "text-4xl"
              : "text-5xl"
          }`}
          style={{
            color: styleSettings.textColor || "#333333",
            fontFamily: styleSettings.typography?.fontFamily,
            fontSize:
              viewMode === "mobile"
                ? (styleSettings.typography?.fontSize || 48) * 0.7
                : styleSettings.typography?.fontSize,
            fontWeight: styleSettings.typography?.fontWeight || 700,
            lineHeight: styleSettings.typography?.lineHeight || 1.2,
          }}
        >
          {counter.prefix}
          {displayValue.toLocaleString()}
          {counter.suffix}
        </div>

        {/* Counter Label */}
        <div
          className={`font-medium ${
            viewMode === "mobile" ? "text-sm" : "text-base"
          }`}
          style={{
            color: styleSettings.textColor || "#666666",
            opacity: 0.8,
          }}
        >
          {counter.label}
        </div>
      </div>
    );
  };

  return (
    <SectionWrapper
      layoutSettings={layoutSettings}
      styleSettings={styleSettings}
      animationSettings={animationSettings}
      customSettings={customSettings}
      isEditing={isEditing}
      onClick={onClick}
      className="stats-counter-section"
    >
      <div ref={sectionRef} className="mx-auto">
        {/* Section Title */}
        {generalSettings.showTitle && translation?.title && (
          <h2
            className={`font-bold mb-12 ${
              viewMode === "mobile"
                ? "text-2xl"
                : viewMode === "tablet"
                ? "text-3xl"
                : "text-4xl"
            }`}
            style={{
              color: styleSettings.textColor,
              textAlign: layoutSettings.alignment || "center",
            }}
          >
            {translation.title}
          </h2>
        )}

        {/* Section Description */}
        {generalSettings.showDescription && translation?.content && (
          <div
            className={`mb-12 ${
              layoutSettings.alignment === "center"
                ? "text-center"
                : layoutSettings.alignment === "right"
                ? "text-right"
                : "text-left"
            }`}
            style={{ color: styleSettings.textColor, opacity: 0.8 }}
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        )}

        {/* Stats Counters */}
        {counters.length > 0 ? (
          <div className={getLayoutClasses()}>
            {counters.map((counter, index) => renderCounter(counter, index))}
          </div>
        ) : (
          /* Editing Placeholder */
          isEditing && (
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                Click to configure statistics counters
              </p>
            </div>
          )
        )}

        {/* Additional CTA */}
        {generalSettings.showButton && generalSettings.buttonText && (
          <div
            className={`mt-12 ${
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
      </div>
    </SectionWrapper>
  );
}
