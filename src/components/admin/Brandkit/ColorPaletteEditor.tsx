// src/components/admin/ColorPaletteEditor.tsx
"use client";

import { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { BrandkitColors } from "@/types/brandkit";

interface ColorPaletteEditorProps {
  colors: BrandkitColors;
  onChange: (colors: BrandkitColors) => void;
}

export default function ColorPaletteEditor({
  colors,
  onChange,
}: ColorPaletteEditorProps) {
  const [activeColorGroup, setActiveColorGroup] = useState<string>("primary");

  const colorGroups = [
    { id: "primary", name: "Primary", description: "Main brand color" },
    { id: "secondary", name: "Secondary", description: "Supporting color" },
    { id: "accent", name: "Accent", description: "Highlight color" },
    { id: "neutral", name: "Neutral", description: "Grays and neutrals" },
    { id: "success", name: "Success", description: "Success states" },
    { id: "warning", name: "Warning", description: "Warning states" },
    { id: "error", name: "Error", description: "Error states" },
  ];

  const shadeNumbers = [
    0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
  ];

  const updateColorShade = (groupId: string, shade: number, color: string) => {
    const updatedColors = {
      ...colors,
      [groupId]: {
        ...colors[groupId as keyof BrandkitColors],
        [shade]: color,
      },
    };
    onChange(updatedColors);
  };

  const generateColorPalette = (groupId: string, baseColor: string) => {
    // Simple color generation based on base color
    // In production, you might want to use a more sophisticated color generation library
    const generateShades = (base: string) => {
      const hex = base.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      const shades: Record<number, string> = {};

      shadeNumbers.forEach((shade) => {
        let factor: number;
        if (shade === 0) factor = 1;
        else if (shade <= 50) factor = 0.95 + (shade / 50) * 0.05;
        else if (shade <= 500) factor = 0.95 - ((shade - 50) / 450) * 0.45;
        else factor = 0.5 - ((shade - 500) / 450) * 0.45;

        const newR = Math.round(r * factor);
        const newG = Math.round(g * factor);
        const newB = Math.round(b * factor);

        shades[shade] = `#${newR.toString(16).padStart(2, "0")}${newG
          .toString(16)
          .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
      });

      return shades;
    };

    const generatedShades = generateShades(baseColor);
    const updatedColors = {
      ...colors,
      [groupId]: generatedShades,
    };
    onChange(updatedColors);
  };

  const resetToDefaults = () => {
    const defaultColors: BrandkitColors = {
      primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
        950: "#172554",
      },
      secondary: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
        950: "#020617",
      },
      accent: {
        50: "#fdf4ff",
        100: "#fae8ff",
        200: "#f5d0fe",
        300: "#f0abfc",
        400: "#e879f9",
        500: "#d946ef",
        600: "#c026d3",
        700: "#a21caf",
        800: "#86198f",
        900: "#701a75",
        950: "#4a044e",
      },
      neutral: {
        0: "#ffffff",
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
        950: "#030712",
      },
    };
    onChange(defaultColors);
  };

  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Color Palette</h3>
          <p className="mt-1 text-sm text-gray-500">
            Define your brand colors and their variations
          </p>
        </div>
        <button
          onClick={resetToDefaults}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Reset to Defaults
        </button>
      </div>

      {/* Color Group Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {colorGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveColorGroup(group.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeColorGroup === group.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {group.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Color Group Editor */}
      {colorGroups.map((group) => {
        if (group.id !== activeColorGroup) return null;

        const colorGroup = colors[group.id as keyof BrandkitColors] || {};

        return (
          <div key={group.id} className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-gray-900">
                {group.name} Colors
              </h4>
              <p className="text-sm text-gray-500">{group.description}</p>
            </div>

            {/* Quick Color Generator */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-900 mb-2">
                Quick Generate from Base Color
              </h5>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={colorGroup[500] || "#3b82f6"}
                  onChange={(e) =>
                    generateColorPalette(group.id, e.target.value)
                  }
                  className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  Choose a base color to generate all shades automatically
                </span>
              </div>
            </div>

            {/* Color Preview */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="text-sm font-medium text-gray-900 mb-3">
                Preview
              </h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(colorGroup).map(([shade, color]) => (
                  <div
                    key={shade}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: color,
                      color: getContrastColor(color),
                    }}
                  >
                    <span className="font-medium">{shade}</span>
                    <span className="text-xs opacity-75">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
//   {shadeNumbers.map((shade) => {
//     const colorValue = colorGroup[shade] || "";
//     const textColor = colorValue ? getContrastColor(colorValue) : "#000000";

//     return (
//       <div key={shade} className="space-y-2">
//         <label className="block text-xs font-medium text-gray-700">
//           {group.id}-{shade}
//         </label>
//         <div className="relative">
//           <div
//             className="w-full h-16 rounded-lg border border-gray-300 cursor-pointer flex items-center justify-center text-xs font-medium"
//             style={{
//               backgroundColor: colorValue || "#ffffff",
//               color: textColor,
//             }}
//             onClick={() => {
//               const input = document.getElementById(`color-${group.id}-${shade}`) as HTMLInputElement;
//               input?.click();
//             }}
//           >
//             {shade}
//           </div>
//           <input
//             id={`color-${group.id}-${shade}`}
//             type="color"
//             value={colorValue}
//             onChange={(e) => updateColorShade(group.id, shade, e.target.value)}
//             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           />
//         </div>
//         <input
//           type="text"
//           value={colorValue}
//           onChange={(e) => updateColorShade(group.id, shade, e.target.value)}
//           placeholder="#000000"
//           className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//         />
//       </div>
//     );
//   })}
// </div>

// {/* Color
