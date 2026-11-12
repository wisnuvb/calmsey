/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import { sanitizeHtml } from "@/lib/sanitize-html";

/**
 * Quote a value as a CSS string literal (for use inside an attribute selector).
 * Escapes backslash, double quote and newlines so the value cannot break out of the string.
 */
function cssString(value: string): string {
  return `"${value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n|\f/g, "\\a ")}"`;
}

/** Neutralise anything that could terminate the surrounding <style> element. */
function neutralizeStyleClose(css: string): string {
  return css.replace(/<\/(style)/gi, "<\\/$1").replace(/<!--/g, "<\\!--");
}

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
        // The id is embedded as a JSON string literal (also a valid JS/CSS string), so a
        // crafted id cannot break out of the selector or inject script.
        const selectorLiteral = JSON.stringify(
          `[data-section-id=${cssString(String(section.id))}]`,
        );
        script.textContent = `
          (function() {
            const sectionElement = document.querySelector(${selectorLiteral});
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
          __html: neutralizeStyleClose(`
            .custom-html-section[data-section-id=${cssString(String(section.id))}] {
              ${String(customCSS)}
            }
          `),
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
          __html: sanitizeHtml(
            translation?.content ||
              '<div class="text-center text-gray-500 p-8">No custom HTML content</div>',
          ),
        }}
      />
    </>
  );
}
