/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";

interface CustomHtmlSectionProps {
  section: any;
  translation: any;
  style?: React.CSSProperties;
}

export default function CustomHtmlSection({
  section,
  translation,
  style,
}: CustomHtmlSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Execute custom JavaScript if present
    const customJS = section.customSettings?.customJS;
    if (customJS && containerRef.current) {
      try {
        // Create a sandboxed execution context
        const script = document.createElement("script");
        script.textContent = `
          (function() {
            const sectionElement = document.querySelector('[data-section-id="${section.id}"]');
            if (sectionElement) {
              ${customJS}
            }
          })();
        `;

        document.head.appendChild(script);

        // Cleanup
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      } catch (error) {
        console.error("Error executing custom JavaScript:", error);
      }
    }
  }, [section.id, section.customSettings?.customJS]);

  const renderCustomStyles = () => {
    const customCSS = section.customSettings?.customCSS;

    if (!customCSS) return null;

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .custom-html-section[data-section-id="${section.id}"] {
              ${customCSS}
            }
          `,
        }}
      />
    );
  };

  return (
    <>
      {renderCustomStyles()}
      <div
        ref={containerRef}
        className="custom-html-section"
        style={style}
        data-section-id={section.id}
        dangerouslySetInnerHTML={{
          __html:
            translation?.content ||
            '<div class="text-center text-gray-500 p-8">No custom HTML content</div>',
        }}
      />
    </>
  );
}
