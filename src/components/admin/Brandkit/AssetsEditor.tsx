/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/AssetsEditor.tsx
"use client";

import { useState } from "react";
import {
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { BrandkitAssets } from "@/types/brandkit";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface AssetsEditorProps {
  assets: BrandkitAssets;
  onChange: (assets: BrandkitAssets) => void;
}

export default function AssetsEditor({ assets, onChange }: AssetsEditorProps) {
  const [activeTab, setActiveTab] = useState<"logos" | "icons" | "images">(
    "logos"
  );
  const [uploading, setUploading] = useState(false);

  const updateLogo = (type: keyof typeof assets.logos, url: string) => {
    onChange({
      ...assets,
      logos: {
        ...assets.logos,
        [type]: url,
      },
    });
  };

  const updateIconStyle = (style: string) => {
    onChange({
      ...assets,
      iconLibrary: {
        ...assets.iconLibrary,
        style: style as "outline" | "filled" | "duotone" | "custom",
      },
    });
  };

  const addCustomIcon = (icon: {
    name: string;
    url: string;
    category: string;
  }) => {
    onChange({
      ...assets,
      iconLibrary: {
        ...assets.iconLibrary,
        customIcons: [...assets.iconLibrary.customIcons, icon],
      },
    });
  };

  const removeCustomIcon = (index: number) => {
    onChange({
      ...assets,
      iconLibrary: {
        ...assets.iconLibrary,
        customIcons: assets.iconLibrary.customIcons.filter(
          (_, i) => i !== index
        ),
      },
    });
  };

  const addImage = (image: {
    id: string;
    name: string;
    url: string;
    category: string;
    alt: string;
    dimensions: { width: number; height: number };
  }) => {
    onChange({
      ...assets,
      imageLibrary: [...assets.imageLibrary, image],
    });
  };

  const removeImage = (id: string) => {
    onChange({
      ...assets,
      imageLibrary: assets.imageLibrary.filter((img) => img.id !== id),
    });
  };

  const handleFileUpload = async (file: File, type: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: "logos", name: "Logos", icon: DocumentIcon },
    { id: "icons", name: "Icons", icon: PhotoIcon },
    { id: "images", name: "Images", icon: PhotoIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Brand Assets</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage logos, icons, and images for your brand
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Logos Tab */}
      {activeTab === "logos" && (
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Brand Logos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Logo
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={assets.logos.primary.light}
                    onChange={(e) => updateLogo("primary", e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file, "logo");
                          if (url) updateLogo("primary", url);
                        }
                      }}
                      className="hidden"
                      id="primary-logo-upload"
                    />
                    <label
                      htmlFor="primary-logo-upload"
                      className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                      Upload Logo
                    </label>
                  </div>
                  {assets.logos.primary && (
                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                      <Image
                        width={64}
                        height={64}
                        src={getImageUrl(assets.logos.primary.light)}
                        alt="Primary Logo"
                        className="max-h-16 mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Logo
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={assets.logos.secondary?.light}
                    onChange={(e) => updateLogo("secondary", e.target.value)}
                    placeholder="https://example.com/logo-alt.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file, "logo");
                          if (url) updateLogo("secondary", url);
                        }
                      }}
                      className="hidden"
                      id="secondary-logo-upload"
                    />
                    <label
                      htmlFor="secondary-logo-upload"
                      className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                      Upload Logo
                    </label>
                  </div>
                  {assets.logos.secondary?.light && (
                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                      <Image
                        width={64}
                        height={64}
                        src={getImageUrl(assets.logos.secondary?.light)}
                        alt="Secondary Logo"
                        className="max-h-16 mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={assets.logos.primary.symbol}
                    onChange={(e) => updateLogo("primary", e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/x-icon,image/png"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file, "favicon");
                          if (url) updateLogo("primary", url);
                        }
                      }}
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label
                      htmlFor="favicon-upload"
                      className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                      Upload Favicon
                    </label>
                  </div>
                  {assets.logos.primary.symbol && (
                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                      <Image
                        width={32}
                        height={32}
                        src={getImageUrl(assets.logos.primary.symbol)}
                        alt="Favicon"
                        className="w-8 h-8 mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Icons Tab */}
      {activeTab === "icons" && (
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Icon Settings
            </h4>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Icon Style
              </label>
              <select
                value={assets.iconLibrary.style}
                onChange={(e) => updateIconStyle(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="outline">Outline</option>
                <option value="solid">Solid</option>
                <option value="mini">Mini</option>
              </select>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3">
              Custom Icons
            </h5>
            <div className="space-y-4">
              {assets.iconLibrary.customIcons.map((icon, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md"
                >
                  <Image
                    width={32}
                    height={32}
                    src={getImageUrl(icon.url)}
                    alt={icon.name}
                    className="w-8 h-8"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {icon.name}
                    </p>
                    <p className="text-xs text-gray-500">{icon.category}</p>
                  </div>
                  <button
                    onClick={() => removeCustomIcon(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  const name = prompt("Icon name:");
                  const url = prompt("Icon URL:");
                  const category = prompt("Category:");
                  if (name && url && category) {
                    addCustomIcon({ name, url, category });
                  }
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Custom Icon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Tab */}
      {activeTab === "images" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900">Image Library</h4>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  for (const file of files) {
                    const url = await handleFileUpload(file, "image");
                    if (url) {
                      addImage({
                        id: Date.now().toString() + Math.random(),
                        name: file.name,
                        url,
                        category: "general",
                        alt: file.name,
                        dimensions: { width: 0, height: 0 }, // Would be determined by actual image
                      });
                    }
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                Upload Images
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {assets.imageLibrary.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    width={64}
                    height={64}
                    src={getImageUrl(image.url)}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
                <p className="mt-1 text-xs text-gray-600 truncate">
                  {image.name}
                </p>
              </div>
            ))}
          </div>

          {assets.imageLibrary.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No images
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload images to build your brand image library.
              </p>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Uploading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
