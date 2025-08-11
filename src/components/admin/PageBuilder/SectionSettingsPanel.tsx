/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  XMarkIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

interface SectionSettingsPanelProps {
  section: any;
  onClose: () => void;
  onUpdate: (settings: any) => void;
}

export function SectionSettingsPanel({
  section,
  onClose,
  onUpdate,
}: SectionSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "layout" | "style" | "responsive" | "animation" | "custom"
  >("layout");
  const [settings, setSettings] = useState({
    layout: JSON.parse(section.layoutSettings || "{}"),
    style: JSON.parse(section.styleSettings || "{}"),
    responsive: JSON.parse(section.responsiveSettings || "{}"),
    animation: JSON.parse(section.animationSettings || "{}"),
    custom: JSON.parse(section.customSettings || "{}"),
  });

  const tabs = [
    { id: "layout", name: "Layout", icon: AdjustmentsHorizontalIcon },
    { id: "style", name: "Style", icon: PaintBrushIcon },
    { id: "responsive", name: "Responsive", icon: DevicePhoneMobileIcon },
    { id: "animation", name: "Animation", icon: SparklesIcon },
    { id: "custom", name: "Custom", icon: CodeBracketIcon },
  ];

  const handleSettingChange = (tab: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [tab]: {
        ...settings[tab as keyof typeof settings],
        [key]: value,
      },
    };
    setSettings(newSettings);
    onUpdate(newSettings);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Section Settings</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "layout" && (
          <LayoutSettings
            settings={settings.layout}
            onChange={(key, value) => handleSettingChange("layout", key, value)}
          />
        )}
        {activeTab === "style" && (
          <StyleSettings
            settings={settings.style}
            onChange={(key, value) => handleSettingChange("style", key, value)}
          />
        )}
        {activeTab === "responsive" && (
          <ResponsiveSettings
            settings={settings.responsive}
            onChange={(key, value) =>
              handleSettingChange("responsive", key, value)
            }
          />
        )}
        {activeTab === "animation" && (
          <AnimationSettings
            settings={settings.animation}
            onChange={(key, value) =>
              handleSettingChange("animation", key, value)
            }
          />
        )}
        {activeTab === "custom" && (
          <CustomSettings
            settings={settings.custom}
            onChange={(key, value) => handleSettingChange("custom", key, value)}
          />
        )}
      </div>
    </div>
  );
}

// Layout Settings Component
function LayoutSettings({
  settings,
  onChange,
}: {
  settings: any;
  onChange: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Width
        </label>
        <select
          value={settings.width || "auto"}
          onChange={(e) => onChange("width", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto">Auto</option>
          <option value="100%">Full Width</option>
          <option value="1200px">1200px</option>
          <option value="1024px">1024px</option>
          <option value="768px">768px</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Padding
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Top"
            value={settings.paddingTop || ""}
            onChange={(e) => onChange("paddingTop", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Right"
            value={settings.paddingRight || ""}
            onChange={(e) => onChange("paddingRight", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Bottom"
            value={settings.paddingBottom || ""}
            onChange={(e) => onChange("paddingBottom", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Left"
            value={settings.paddingLeft || ""}
            onChange={(e) => onChange("paddingLeft", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Margin
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Top"
            value={settings.marginTop || ""}
            onChange={(e) => onChange("marginTop", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Right"
            value={settings.marginRight || ""}
            onChange={(e) => onChange("marginRight", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Bottom"
            value={settings.marginBottom || ""}
            onChange={(e) => onChange("marginBottom", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Left"
            value={settings.marginLeft || ""}
            onChange={(e) => onChange("marginLeft", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Alignment
        </label>
        <select
          value={settings.textAlign || "left"}
          onChange={(e) => onChange("textAlign", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
    </div>
  );
}

// Style Settings Component
function StyleSettings({
  settings,
  onChange,
}: {
  settings: any;
  onChange: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Color
        </label>
        <input
          type="color"
          value={settings.backgroundColor || "#ffffff"}
          onChange={(e) => onChange("backgroundColor", e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Color
        </label>
        <input
          type="color"
          value={settings.textColor || "#000000"}
          onChange={(e) => onChange("textColor", e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size
        </label>
        <input
          type="text"
          value={settings.fontSize || ""}
          onChange={(e) => onChange("fontSize", e.target.value)}
          placeholder="16px"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Weight
        </label>
        <select
          value={settings.fontWeight || "normal"}
          onChange={(e) => onChange("fontWeight", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="300">Light</option>
          <option value="500">Medium</option>
          <option value="600">Semi Bold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Border Radius
        </label>
        <input
          type="text"
          value={settings.borderRadius || ""}
          onChange={(e) => onChange("borderRadius", e.target.value)}
          placeholder="8px"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Box Shadow
        </label>
        <select
          value={settings.boxShadow || "none"}
          onChange={(e) => onChange("boxShadow", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">None</option>
          <option value="0 1px 3px rgba(0,0,0,0.1)">Small</option>
          <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
          <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
          <option value="0 25px 50px rgba(0,0,0,0.25)">Extra Large</option>
        </select>
      </div>
    </div>
  );
}

// Responsive Settings Component
function ResponsiveSettings({
  settings,
  onChange,
}: {
  settings: any;
  onChange: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Mobile Settings
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Display</label>
            <select
              value={settings.mobile?.display || "block"}
              onChange={(e) =>
                onChange("mobile", {
                  ...settings.mobile,
                  display: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="block">Block</option>
              <option value="none">Hidden</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Text Size
            </label>
            <select
              value={settings.mobile?.fontSize || "base"}
              onChange={(e) =>
                onChange("mobile", {
                  ...settings.mobile,
                  fontSize: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="xs">Extra Small</option>
              <option value="sm">Small</option>
              <option value="base">Base</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Tablet Settings
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Display</label>
            <select
              value={settings.tablet?.display || "block"}
              onChange={(e) =>
                onChange("tablet", {
                  ...settings.tablet,
                  display: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="block">Block</option>
              <option value="none">Hidden</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Desktop Settings
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Display</label>
            <select
              value={settings.desktop?.display || "block"}
              onChange={(e) =>
                onChange("desktop", {
                  ...settings.desktop,
                  display: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="block">Block</option>
              <option value="none">Hidden</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animation Settings Component
function AnimationSettings({
  settings,
  onChange,
}: {
  settings: any;
  onChange: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.enableAnimations || false}
            onChange={(e) => onChange("enableAnimations", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Enable Animations
          </span>
        </label>
      </div>

      {settings.enableAnimations && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entrance Animation
            </label>
            <select
              value={settings.entranceAnimation || "fadeIn"}
              onChange={(e) => onChange("entranceAnimation", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fadeIn">Fade In</option>
              <option value="slideUp">Slide Up</option>
              <option value="slideDown">Slide Down</option>
              <option value="slideLeft">Slide Left</option>
              <option value="slideRight">Slide Right</option>
              <option value="zoomIn">Zoom In</option>
              <option value="bounceIn">Bounce In</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Animation Duration
            </label>
            <select
              value={settings.animationDuration || "0.5s"}
              onChange={(e) => onChange("animationDuration", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0.3s">Fast (0.3s)</option>
              <option value="0.5s">Normal (0.5s)</option>
              <option value="0.8s">Slow (0.8s)</option>
              <option value="1.2s">Very Slow (1.2s)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Animation Delay
            </label>
            <input
              type="text"
              value={settings.animationDelay || "0s"}
              onChange={(e) => onChange("animationDelay", e.target.value)}
              placeholder="0s"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}
    </div>
  );
}

// Custom Settings Component
function CustomSettings({
  settings,
  onChange,
}: {
  settings: any;
  onChange: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom CSS Classes
        </label>
        <input
          type="text"
          value={settings.cssClasses || ""}
          onChange={(e) => onChange("cssClasses", e.target.value)}
          placeholder="custom-class another-class"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom CSS
        </label>
        <textarea
          value={settings.customCSS || ""}
          onChange={(e) => onChange("customCSS", e.target.value)}
          placeholder="/* Your custom CSS here */"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom JavaScript
        </label>
        <textarea
          value={settings.customJS || ""}
          onChange={(e) => onChange("customJS", e.target.value)}
          placeholder="// Your custom JavaScript here"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Attributes
        </label>
        <textarea
          value={settings.customAttributes || ""}
          onChange={(e) => onChange("customAttributes", e.target.value)}
          placeholder="data-custom=value&#10;aria-label=description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          One attribute per line in format: attribute=value
        </p>
      </div>
    </div>
  );
}
