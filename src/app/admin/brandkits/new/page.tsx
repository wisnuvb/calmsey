// src/app/admin/brandkits/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { Brandkit } from "@/types/brandkit";
import BrandkitEditor from "@/components/admin/Brandkit/BrandkitEditor";

export default function NewBrandkitPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Default brandkit template
  const [brandkit, setBrandkit] = useState<Brandkit>({
    id: "",
    name: "",
    description: "",
    isDefault: false,
    isActive: true,
    isPublic: false,
    version: "1.0.0",
    authorId: "",
    usageCount: 0,
    author: {
      id: "",
      name: "",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    colors: {
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
        1000: "#000000",
      },
      semantic: {
        success: {
          light: "#d1fae5",
          main: "#10b981",
          dark: "#065f46",
        },
        warning: {
          light: "#fef3c7",
          main: "#f59e0b",
          dark: "#92400e",
        },
        error: {
          light: "#fee2e2",
          main: "#ef4444",
          dark: "#991b1b",
        },
        info: {
          light: "#dbeafe",
          main: "#3b82f6",
          dark: "#1e40af",
        },
      },
    },
    typography: {
      fontFamilies: {
        heading: {
          name: "Inter, system-ui, sans-serif",
          fallback: ["system-ui", "sans-serif"],
          weights: [400, 500, 600, 700, 800, 900],
          variable: "--font-heading",
        },
        body: {
          name: "Inter, system-ui, sans-serif",
          fallback: ["system-ui", "sans-serif"],
          weights: [400, 500, 600],
          variable: "--font-body",
        },
        mono: {
          name: "Fira Code, monospace",
          fallback: ["monospace"],
          weights: [400, 500, 600],
          variable: "--font-mono",
        },
      },
      scales: {
        xs: { fontSize: "0.75rem", lineHeight: "1rem" },
        sm: { fontSize: "0.875rem", lineHeight: "1.25rem" },
        base: { fontSize: "1rem", lineHeight: "1.5rem" },
        lg: { fontSize: "1.125rem", lineHeight: "1.75rem" },
        xl: { fontSize: "1.25rem", lineHeight: "1.75rem" },
        "2xl": { fontSize: "1.5rem", lineHeight: "2rem" },
        "3xl": { fontSize: "1.875rem", lineHeight: "2.25rem" },
        "4xl": { fontSize: "2.25rem", lineHeight: "2.5rem" },
        "5xl": { fontSize: "3rem", lineHeight: "1" },
        "6xl": { fontSize: "3.75rem", lineHeight: "1" },
        "7xl": { fontSize: "4.5rem", lineHeight: "1" },
        "8xl": { fontSize: "6rem", lineHeight: "1" },
        "9xl": { fontSize: "8rem", lineHeight: "1" },
      },
      weights: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      textStyles: {
        h1: {
          fontSize: "2.25rem",
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
        },
        h2: {
          fontSize: "1.875rem",
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: "-0.025em",
        },
        h3: {
          fontSize: "1.5rem",
          fontWeight: 600,
          lineHeight: 1.4,
          letterSpacing: "0",
        },
        h4: {
          fontSize: "1.25rem",
          fontWeight: 600,
          lineHeight: 1.4,
          letterSpacing: "0",
        },
        h5: {
          fontSize: "1rem",
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: "0",
        },
        h6: {
          fontSize: "0.875rem",
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: "0",
        },
        link: {
          fontSize: "0.875rem",
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: "0",
        },
        body: {
          fontSize: "1.25rem",
          fontWeight: 400,
          lineHeight: 1.6,
          letterSpacing: "0",
        },
        small: {
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: "0",
        },
        caption: {
          fontSize: "0.875rem",
          fontWeight: 400,
          lineHeight: 1.4,
          letterSpacing: "0.025em",
        },
        button: {
          fontSize: "0.875rem",
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: "0.025em",
        },
      },
    },
    spacing: {
      baseUnit: 4,
      scale: {
        0: "0px",
        0.5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        11: "2.75rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        36: "9rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        60: "15rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem",
      },
      containerSizes: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      components: {
        button: {
          padding: "0.5rem 1rem",
          margin: "0.5rem 0",
        },
        card: {
          padding: "0.5rem 1rem",
          margin: "0.5rem 0",
        },
        form: {
          padding: "0.5rem 1rem",
          margin: "0.5rem 0",
        },
        navigation: {
          padding: "0.5rem 1rem",
          margin: "0.5rem 0",
        },
      },
    },
    assets: {
      logos: {
        primary: {
          light: "",
          dark: "",
          symbol: "",
        },
      },
      iconLibrary: {
        style: "outline",
        customIcons: [],
      },
      imageLibrary: [],
    },
  });

  const handleSave = async () => {
    if (!brandkit.name.trim()) {
      alert("Please enter a brandkit name");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/brandkits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brandkit.name,
          description: brandkit.description,
          colors: brandkit.colors,
          typography: brandkit.typography,
          spacing: brandkit.spacing,
          assets: brandkit.assets,
          isActive: brandkit.isActive,
          isPublic: brandkit.isPublic,
          isDefault: brandkit.isDefault,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/brandkits/${data.brandkit.id}`);
      } else {
        const data = await response.json();
        alert(`Failed to create brandkit: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating brandkit:", error);
      alert("Failed to create brandkit");
    } finally {
      setSaving(false);
    }
  };

  const handleBrandkitChange = (updatedBrandkit: Brandkit) => {
    setBrandkit(updatedBrandkit);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/admin/brandkits"
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Create New Brandkit
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new brand design system with colors, typography, and
                assets
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={saving || !brandkit.name.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {saving ? "Creating..." : "Create Brandkit"}
            </button>
          </div>
        </div>
      </div>

      {/* Intro Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex">
          <SwatchIcon className="h-6 w-6 text-blue-600 mt-1" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Getting Started with Brandkits
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p className="mb-2">
                A brandkit is your design system that defines colors,
                typography, spacing, and assets for consistent branding across
                your site.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Start with basic information and settings</li>
                <li>
                  Define your color palette with primary, secondary, and accent
                  colors
                </li>
                <li>Configure typography styles for headings and body text</li>
                <li>Set up spacing scales for consistent layouts</li>
                <li>Upload brand assets like logos and images</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <BrandkitEditor
        brandkit={brandkit}
        onChange={handleBrandkitChange}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
