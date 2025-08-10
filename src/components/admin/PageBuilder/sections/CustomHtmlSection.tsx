/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/CustomHtmlSection.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { PageSection } from "@/types/page-builder";

interface CustomHtmlSectionProps {
  section: PageSection;
  translation: any;
  isPreview?: boolean;
  viewMode?: "desktop" | "tablet" | "mobile";
  isEditor?: boolean;
}

export default function CustomHtmlSection({
  section,
  translation,
  isPreview = false,
  viewMode = "desktop",
  isEditor = false,
}: CustomHtmlSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getSectionStyles = () => {
    const layout = section.layoutSettings || {};
    const style = section.styleSettings || {};
    const responsive = section.responsiveSettings?.[viewMode] || {};

    let styles: any = {};

    // Spacing
    if (layout.padding) {
      styles.padding = formatSpacing(layout.padding);
    }
    if (layout.margin) {
      styles.margin = formatSpacing(layout.margin);
    }

    // Background
    if (style.background) {
      styles = { ...styles, ...getBackgroundStyles(style.background) };
    }

    // Width settings
    switch (layout.width || "container") {
      case "full":
        styles.width = "100%";
        break;
      case "container":
        styles.maxWidth = "1200px";
        styles.margin = "0 auto";
        styles.padding = "0 1rem";
        break;
      case "narrow":
        styles.maxWidth = "800px";
        styles.margin = "0 auto";
        styles.padding = "0 1rem";
        break;
      case "custom":
        if (layout.customWidth) {
          styles.maxWidth = `${layout.customWidth}px`;
          styles.margin = "0 auto";
        }
        break;
    }

    // Responsive overrides
    if (responsive.padding) styles.padding = formatSpacing(responsive.padding);
    if (responsive.margin) styles.margin = formatSpacing(responsive.margin);
    if (responsive.display === "none") styles.display = "none";

    return styles;
  };

  const getSectionClasses = () => {
    const responsive = section.responsiveSettings?.[viewMode] || {};
    const classes = ["custom-html-section"];

    // Responsive visibility
    if (responsive.display === "none") {
      classes.push("hidden");
    }

    // Custom CSS classes
    if (section.customSettings?.cssClasses) {
      classes.push(...section.customSettings.cssClasses);
    }

    return classes.join(" ");
  };

  const sanitizeHtml = (html: string) => {
    // Basic HTML sanitization for security
    // In production, use a proper sanitization library like DOMPurify

    // Remove script tags
    html = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    // Remove dangerous event handlers
    html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

    // Remove javascript: urls
    html = html.replace(/javascript:[^"']*/gi, "");

    return html;
  };

  const renderCustomHtml = () => {
    try {
      const content = translation?.content || "";

      if (!content.trim()) {
        return renderEmptyState();
      }

      // Sanitize HTML in preview mode
      const htmlContent = isPreview ? sanitizeHtml(content) : content;

      return (
        <div
          className="custom-html-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    } catch (error) {
      console.error("Error rendering custom HTML:", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      return renderErrorState();
    }
  };

  const renderEmptyState = () => {
    if (!isPreview && !isEditor) return null;

    return (
      <div className="custom-html-empty-state border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <div className="text-4xl mb-4">💻</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Custom HTML Section
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Add your custom HTML, CSS, and JavaScript code here
        </p>
        {isEditor && (
          <div className="text-xs text-gray-400">
            <p>Supported: HTML5, CSS3, JavaScript</p>
            <p>Note: External scripts may be blocked for security</p>
          </div>
        )}
      </div>
    );
  };

  const renderErrorState = () => {
    return (
      <div className="custom-html-error border-2 border-red-300 rounded-lg p-6 bg-red-50">
        <div className="flex items-center space-x-2 text-red-600 mb-2">
          <span className="text-xl">⚠️</span>
          <h3 className="font-semibold">HTML Rendering Error</h3>
        </div>
        <p className="text-sm text-red-700 mb-3">
          There was an error rendering the custom HTML content.
        </p>
        {errorMessage && (
          <details className="text-xs text-red-600">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 bg-red-100 p-2 rounded overflow-auto">
              {errorMessage}
            </pre>
          </details>
        )}
        {isEditor && (
          <div className="mt-4 text-xs text-red-600">
            <p>Tips:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Check for unclosed HTML tags</li>
              <li>Validate CSS syntax</li>
              <li>Ensure JavaScript is properly formatted</li>
              <li>Avoid conflicting CSS class names</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

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

  const renderIframeSandbox = () => {
    const content = translation?.content || "";

    if (!content.trim()) return renderEmptyState();

    // Create a complete HTML document for the iframe
    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              margin: 0;
              padding: 16px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            ${section.customSettings?.customCSS || ""}
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    return (
      <iframe
        srcDoc={iframeContent}
        className="w-full border-0"
        style={{ minHeight: "200px" }}
        sandbox="allow-scripts allow-same-origin"
        title="Custom HTML Content"
      />
    );
  };

  // Execute custom JavaScript after component mounts
  useEffect(() => {
    if (!isPreview || !containerRef.current) return;

    const customJS = section.customSettings?.customJS;
    if (!customJS) return;

    try {
      // Create a sandboxed execution context
      const script = document.createElement("script");
      script.textContent = `
        (function() {
          // Sandboxed execution
          const sectionElement = document.querySelector('[data-section-id="${section.id}"]');
          if (sectionElement) {
            ${customJS}
          }
        })();
      `;

      document.head.appendChild(script);

      // Cleanup
      return () => {
        document.head.removeChild(script);
      };
    } catch (error) {
      console.error("Error executing custom JavaScript:", error);
      setHasError(true);
      setErrorMessage(`JavaScript Error: ${error}`);
    }
  }, [section.id, section.customSettings?.customJS, isPreview]);

  return (
    <section
      ref={containerRef}
      className={getSectionClasses()}
      style={getSectionStyles()}
      data-section-type="custom_html"
      data-section-id={section.id}
    >
      {/* Custom CSS */}
      {renderCustomStyles()}

      {/* Main Content */}
      {hasError
        ? renderErrorState()
        : isEditor && section.customSettings?.useSandbox
        ? renderIframeSandbox()
        : renderCustomHtml()}

      {/* Debug Info (only in editor) */}
      {isEditor && isPreview && !hasError && translation?.content && (
        <div className="custom-html-debug mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Custom HTML Section</span>
            <div className="flex items-center space-x-4">
              <span>Length: {translation.content.length} chars</span>
              {section.customSettings?.customCSS && <span>📝 Custom CSS</span>}
              {section.customSettings?.customJS && <span>⚡ Custom JS</span>}
              {section.customSettings?.useSandbox && <span>🛡️ Sandboxed</span>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Code Editor Component for better editing experience
export function CustomHtmlEditor({
  section,
  translation,
  onUpdate,
}: {
  section: PageSection;
  translation: any;
  onUpdate: (content: string) => void;
}) {
  const [content, setContent] = useState(translation?.content || "");
  const [isPreview, setIsPreview] = useState(false);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  return (
    <div className="custom-html-editor">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Custom HTML Editor</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 rounded text-sm ${
              isPreview ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {isPreview ? (
        <div className="border rounded-lg p-4 bg-white">
          <CustomHtmlSection
            section={section}
            translation={{ ...translation, content }}
            isPreview={true}
            isEditor={true}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTML Content
            </label>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Enter your HTML code here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom CSS
              </label>
              <textarea
                value={section.customSettings?.customCSS || ""}
                onChange={(e) => {
                  // This would need to be handled by the parent component
                  console.log("CSS changed:", e.target.value);
                }}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="/* Custom CSS styles */"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom JavaScript
              </label>
              <textarea
                value={section.customSettings?.customJS || ""}
                onChange={(e) => {
                  // This would need to be handled by the parent component
                  console.log("JS changed:", e.target.value);
                }}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="// Custom JavaScript code"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={section.customSettings?.useSandbox || false}
                onChange={(e) => {
                  // This would need to be handled by the parent component
                  console.log("Sandbox changed:", e.target.checked);
                }}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Use iframe sandbox</span>
            </label>

            <div className="text-xs text-gray-500">
              Recommended for untrusted content
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="text-yellow-400 mr-2">⚠️</div>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">Security Notice:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Custom HTML/JS can pose security risks</li>
                  <li>Avoid inline event handlers and external scripts</li>
                  <li>Test thoroughly before publishing</li>
                  <li>Use iframe sandbox for untrusted content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatSpacing(spacing?: any) {
  if (!spacing) return undefined;

  const { top = 0, right = 0, bottom = 0, left = 0, unit = "px" } = spacing;
  return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
}

function getBackgroundStyles(background: any) {
  if (!background || background.type === "none") return {};

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
