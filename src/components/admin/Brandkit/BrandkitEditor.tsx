/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/BrandkitEditor.tsx
"use client";

import { useState } from "react";
import { SwatchIcon, PhotoIcon, CogIcon } from "@heroicons/react/24/outline";
import { Brandkit } from "@/types/brandkit";
import ColorPaletteEditor from "@/components/admin/Brandkit/ColorPaletteEditor";
import TypographyEditor from "@/components/admin/Brandkit/TypographyEditor";
import SpacingEditor from "@/components/admin/Brandkit/SpacingEditor";
import AssetsEditor from "@/components/admin/Brandkit/AssetsEditor";
import { AlignVerticalSpaceBetween, TypeIcon } from "lucide-react";

interface BrandkitEditorProps {
  brandkit: Brandkit;
  onChange: (brandkit: Brandkit) => void;
  onSave: () => void;
  saving: boolean;
}

type EditorTab = "basic" | "colors" | "typography" | "spacing" | "assets";

export default function BrandkitEditor({
  brandkit,
  onChange,
  onSave,
  saving,
}: BrandkitEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>("basic");

  const handleBasicChange = (field: string, value: any) => {
    onChange({
      ...brandkit,
      [field]: value,
    });
  };

  const handleColorsChange = (colors: any) => {
    onChange({
      ...brandkit,
      colors,
    });
  };

  const handleTypographyChange = (typography: any) => {
    onChange({
      ...brandkit,
      typography,
    });
  };

  const handleSpacingChange = (spacing: any) => {
    onChange({
      ...brandkit,
      spacing,
    });
  };

  const handleAssetsChange = (assets: any) => {
    onChange({
      ...brandkit,
      assets,
    });
  };

  const tabs = [
    { id: "basic", name: "Basic Info", icon: CogIcon },
    { id: "colors", name: "Colors", icon: SwatchIcon },
    { id: "typography", name: "Typography", icon: TypeIcon },
    { id: "spacing", name: "Spacing", icon: AlignVerticalSpaceBetween },
    { id: "assets", name: "Assets", icon: PhotoIcon },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EditorTab)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brandkit Name *
                  </label>
                  <input
                    type="text"
                    value={brandkit.name}
                    onChange={(e) => handleBasicChange("name", e.target.value)}
                    placeholder="Enter brandkit name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={brandkit.version}
                    onChange={(e) =>
                      handleBasicChange("version", e.target.value)
                    }
                    placeholder="1.0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={brandkit.description || ""}
                  onChange={(e) =>
                    handleBasicChange("description", e.target.value)
                  }
                  placeholder="Describe this brandkit and its intended use..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Settings
              </h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={brandkit.isActive}
                    onChange={(e) =>
                      handleBasicChange("isActive", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Active
                    <span className="text-gray-500 ml-1">
                      (Active brandkits can be used in pages)
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={brandkit.isPublic}
                    onChange={(e) =>
                      handleBasicChange("isPublic", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPublic"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Public
                    <span className="text-gray-500 ml-1">
                      (Public brandkits can be used by other users)
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={brandkit.isDefault}
                    onChange={(e) =>
                      handleBasicChange("isDefault", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isDefault"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Default
                    <span className="text-gray-500 ml-1">
                      (Default brandkits are used for new pages)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "colors" && (
          <ColorPaletteEditor
            colors={brandkit.colors}
            onChange={handleColorsChange}
          />
        )}

        {activeTab === "typography" && (
          <TypographyEditor
            typography={brandkit.typography}
            onChange={handleTypographyChange}
          />
        )}

        {activeTab === "spacing" && (
          <SpacingEditor
            spacing={brandkit.spacing}
            onChange={handleSpacingChange}
          />
        )}

        {activeTab === "assets" && (
          <AssetsEditor
            assets={brandkit.assets}
            onChange={handleAssetsChange}
          />
        )}
      </div>

      {/* Save Button at Bottom */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex justify-end">
          <button
            onClick={onSave}
            disabled={saving || !brandkit.name.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Brandkit"}
          </button>
        </div>
      </div>
    </div>
  );
}
