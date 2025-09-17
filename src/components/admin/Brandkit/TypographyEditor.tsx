// src/components/admin/TypographyEditor.tsx
"use client";

import { useState } from "react";
import { BrandkitTypography } from "@/types/brandkit";

interface TypographyEditorProps {
  typography: BrandkitTypography;
  onChange: (typography: BrandkitTypography) => void;
}

const googleFonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Source Sans Pro",
  "Poppins",
  "Oswald",
  "Raleway",
  "PT Sans",
  "Ubuntu",
  "Playfair Display",
  "Merriweather",
  "Georgia",
  "Times New Roman",
  "Arial",
  "Helvetica",
  "system-ui",
];

const fontWeights = [
  { value: 100, label: "Thin (100)" },
  { value: 200, label: "Extra Light (200)" },
  { value: 300, label: "Light (300)" },
  { value: 400, label: "Regular (400)" },
  { value: 500, label: "Medium (500)" },
  { value: 600, label: "Semi Bold (600)" },
  { value: 700, label: "Bold (700)" },
  { value: 800, label: "Extra Bold (800)" },
  { value: 900, label: "Black (900)" },
];

export default function TypographyEditor({
  typography,
  onChange,
}: TypographyEditorProps) {
  const [activeTextStyle, setActiveTextStyle] = useState("h1");

  const textStyleLabels = {
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    body: "Body Text",
    caption: "Caption",
    button: "Button Text",
  };

  const updateFontFamily = (
    type: keyof typeof typography.fontFamilies,
    value: string
  ) => {
    onChange({
      ...typography,
      fontFamilies: {
        ...typography.fontFamilies,
        [type]: value,
      },
    });
  };

  const updateTextStyle = (
    styleKey: string,
    property: string,
    value: string | number
  ) => {
    onChange({
      ...typography,
      textStyles: {
        ...typography.textStyles,
        [styleKey]: {
          ...typography.textStyles[
            styleKey as keyof typeof typography.textStyles
          ],
          [property]: value,
        },
      },
    });
  };

  const getPreviewText = (styleKey: string) => {
    switch (styleKey) {
      case "h1":
        return "Main Heading";
      case "h2":
        return "Section Heading";
      case "h3":
        return "Subsection Heading";
      case "body":
        return "This is body text that shows how paragraphs will look in your design.";
      case "caption":
        return "Caption or small text";
      case "button":
        return "Button Text";
      default:
        return "Sample Text";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Typography</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure font families and text styles for your brand
        </p>
      </div>

      {/* Font Families */}
      <div className="space-y-6">
        <h4 className="text-md font-medium text-gray-900">Font Families</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Font
            </label>
            <select
              value={typography.fontFamilies.heading.name.split(",")[0].trim()}
              onChange={(e) =>
                updateFontFamily(
                  "heading",
                  `${e.target.value}, system-ui, sans-serif`
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {googleFonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              For headings and main content
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Font
            </label>
            <select
              value={typography.fontFamilies.heading.name.split(",")[0].trim()}
              onChange={(e) =>
                updateFontFamily("heading", `${e.target.value}, serif`)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {googleFonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              For accents and special content
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monospace Font
            </label>
            <select
              value={typography.fontFamilies.mono.name.split(",")[0].trim()}
              onChange={(e) =>
                updateFontFamily("mono", `${e.target.value}, monospace`)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Fira Code">Fira Code</option>
              <option value="Monaco">Monaco</option>
              <option value="Consolas">Consolas</option>
              <option value="Courier New">Courier New</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              For code and technical content
            </p>
          </div>
        </div>
      </div>

      {/* Text Styles */}
      <div className="space-y-6">
        <h4 className="text-md font-medium text-gray-900">Text Styles</h4>

        {/* Text Style Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {Object.entries(textStyleLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTextStyle(key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTextStyle === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Active Text Style Editor */}
        {Object.entries(typography.textStyles).map(([styleKey, style]) => {
          if (styleKey !== activeTextStyle) return null;

          return (
            <div key={styleKey} className="space-y-6">
              {/* Preview */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Preview
                </h5>
                <div
                  style={{
                    fontFamily: typography.fontFamilies.heading.name,
                    fontSize: style.fontSize,
                    fontWeight: style.fontWeight,
                    lineHeight: style.lineHeight,
                    letterSpacing: style.letterSpacing,
                  }}
                >
                  {getPreviewText(styleKey)}
                </div>
              </div>

              {/* Style Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <input
                    type="text"
                    value={style.fontSize}
                    onChange={(e) =>
                      updateTextStyle(styleKey, "fontSize", e.target.value)
                    }
                    placeholder="1rem"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Weight
                  </label>
                  <select
                    value={style.fontWeight}
                    onChange={(e) =>
                      updateTextStyle(
                        styleKey,
                        "fontWeight",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fontWeights.map((weight) => (
                      <option key={weight.value} value={weight.value}>
                        {weight.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line Height
                  </label>
                  <input
                    type="text"
                    value={style.lineHeight}
                    onChange={(e) =>
                      updateTextStyle(styleKey, "lineHeight", e.target.value)
                    }
                    placeholder="1.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Letter Spacing
                  </label>
                  <input
                    type="text"
                    value={style.letterSpacing}
                    onChange={(e) =>
                      updateTextStyle(styleKey, "letterSpacing", e.target.value)
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Typography Preview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h5 className="text-sm font-medium text-gray-900 mb-4">
          Full Typography Preview
        </h5>
        <div
          className="space-y-4"
          style={{ fontFamily: typography.fontFamilies.heading.name }}
        >
          {Object.entries(typography.textStyles).map(([styleKey, style]) => (
            <div key={styleKey}>
              <div className="text-xs text-gray-500 mb-1">
                {textStyleLabels[styleKey as keyof typeof textStyleLabels]}
              </div>
              <div
                style={{
                  fontSize: style.fontSize,
                  fontWeight: style.fontWeight,
                  lineHeight: style.lineHeight,
                  letterSpacing: style.letterSpacing,
                }}
              >
                {getPreviewText(styleKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
