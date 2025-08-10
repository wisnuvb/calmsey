/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  CogIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  CodeBracketIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import { PageSection, SectionSettingsKey } from "@/types/page-builder";
import { SectionRegistry } from "@/lib/page-builder/section-registry";

interface SectionEditorProps {
  section: PageSection | null;
  language: string;
  onUpdate: (sectionId: string, updates: Partial<PageSection>) => void;
  onClose: () => void;
  viewMode: "desktop" | "tablet" | "mobile";
}

type EditorTab =
  | "content"
  | "layout"
  | "style"
  | "responsive"
  | "animation"
  | "custom";

export default function SectionEditor({
  section,
  language,
  onUpdate,
  onClose,
  viewMode,
}: SectionEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["general"])
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  if (!section) {
    return (
      <div className="p-6 text-center text-gray-500">
        <CogIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Select a section to edit its settings</p>
      </div>
    );
  }

  const sectionConfig = SectionRegistry.getSection(section.type);
  const availableSettings = sectionConfig?.availableSettings;

  const translation =
    section.translations.find((t) => t.languageId === language) ||
    section.translations[0];

  const tabs: Array<{
    key: EditorTab;
    label: string;
    icon: any;
    available: boolean;
  }> = [
    { key: "content", label: "Content", icon: CogIcon, available: true },
    {
      key: "layout",
      label: "Layout",
      icon: CogIcon,
      available: availableSettings?.layout ? true : false,
    },
    {
      key: "style",
      label: "Style",
      icon: PaintBrushIcon,
      available: availableSettings?.style ? true : false,
    },
    {
      key: "responsive",
      label: "Responsive",
      icon: DevicePhoneMobileIcon,
      available: availableSettings?.responsive || false,
    },
    {
      key: "animation",
      label: "Animation",
      icon: SparklesIcon,
      available: availableSettings?.animation || false,
    },
    {
      key: "custom",
      label: "Custom",
      icon: CodeBracketIcon,
      available: availableSettings?.custom ? true : false,
    },
  ];

  const handleUpdate = (settingsKey: SectionSettingsKey, updates: any) => {
    onUpdate(section.id, {
      [settingsKey]: { ...section[settingsKey], ...updates },
    });
    setHasUnsavedChanges(true);
  };

  const handleTranslationUpdate = (updates: any) => {
    const newTranslations = section.translations.map((t) =>
      t.languageId === language ? { ...t, ...updates } : t
    );
    onUpdate(section.id, { translations: newTranslations });
    setHasUnsavedChanges(true);
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "content":
        return (
          <ContentEditor
            section={section}
            translation={translation}
            onTranslationUpdate={handleTranslationUpdate}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
          />
        );
      case "layout":
        return (
          <LayoutEditor
            settings={section.layoutSettings}
            onUpdate={(updates) => handleUpdate("layoutSettings", updates)}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
            viewMode={viewMode}
          />
        );
      case "style":
        return (
          <StyleEditor
            settings={section.styleSettings}
            onUpdate={(updates) => handleUpdate("styleSettings", updates)}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
          />
        );
      case "responsive":
        return (
          <ResponsiveEditor
            settings={section.responsiveSettings}
            onUpdate={(updates: any) =>
              handleUpdate("responsiveSettings", updates)
            }
            viewMode={viewMode}
          />
        );
      case "animation":
        return (
          <AnimationEditor
            settings={section.animationSettings}
            onUpdate={(updates: any) =>
              handleUpdate("animationSettings", updates)
            }
          />
        );
      case "custom":
        return (
          <CustomEditor
            settings={section.customSettings}
            onUpdate={(updates: any) => handleUpdate("customSettings", updates)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{sectionConfig?.icon || "📄"}</span>
            <h3 className="font-medium text-gray-900">
              {sectionConfig?.name || section.type}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Section Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>ID: {section.id.slice(-8)}</div>
          <div>Type: {section.type}</div>
          <div>Order: {section.order + 1}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex overflow-x-auto">
          {tabs
            .filter((tab) => tab.available)
            .map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-shrink-0 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-3 h-3 mx-auto mb-1" />
                {label}
              </button>
            ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {renderTabContent()}
      </div>

      {/* Footer */}
      {hasUnsavedChanges && (
        <div className="p-3 bg-orange-50 border-t border-orange-200">
          <p className="text-xs text-orange-800">Changes will be auto-saved</p>
        </div>
      )}
    </div>
  );
}

// Content Editor Component
function ContentEditor({
  section,
  translation,
  onTranslationUpdate,
  expandedGroups,
  onToggleGroup,
}: {
  section: PageSection;
  translation: any;
  onTranslationUpdate: (updates: any) => void;
  expandedGroups: Set<string>;
  onToggleGroup: (key: string) => void;
}) {
  const sectionConfig = SectionRegistry.getSection(section.type);

  return (
    <div className="p-4 space-y-4">
      {/* Basic Content */}
      <EditorGroup
        title="Basic Content"
        groupKey="content"
        expanded={expandedGroups.has("content")}
        onToggle={onToggleGroup}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={translation?.title || ""}
              onChange={(e) => onTranslationUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter section title"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={translation?.subtitle || ""}
              onChange={(e) =>
                onTranslationUpdate({ subtitle: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter section subtitle"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={translation?.content || ""}
              onChange={(e) => onTranslationUpdate({ content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter section content"
            />
          </div>
        </div>
      </EditorGroup>

      {/* Section-Specific Settings */}
      {sectionConfig?.contentSchema &&
        sectionConfig.contentSchema.length > 0 && (
          <EditorGroup
            title="Section Settings"
            groupKey="section-settings"
            expanded={expandedGroups.has("section-settings")}
            onToggle={onToggleGroup}
          >
            <div className="space-y-3">
              {sectionConfig.contentSchema.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {field.description && (
                    <p className="text-xs text-gray-500 mb-1">
                      {field.description}
                    </p>
                  )}
                  {renderContentField(
                    field,
                    translation?.metadata?.[field.key] || field.defaultValue,
                    (value) => {
                      const metadata = {
                        ...translation?.metadata,
                        [field.key]: value,
                      };
                      onTranslationUpdate({ metadata });
                    }
                  )}
                </div>
              ))}
            </div>
          </EditorGroup>
        )}
    </div>
  );
}

// Layout Editor Component
function LayoutEditor({
  settings,
  onUpdate,
  expandedGroups,
  onToggleGroup,
  viewMode,
}: {
  settings: any;
  onUpdate: (updates: any) => void;
  expandedGroups: Set<string>;
  onToggleGroup: (key: string) => void;
  viewMode: string;
}) {
  return (
    <div className="p-4 space-y-4">
      {/* Width & Container */}
      <EditorGroup
        title="Width & Container"
        groupKey="width"
        expanded={expandedGroups.has("width")}
        onToggle={onToggleGroup}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Width
            </label>
            <select
              value={settings.width || "container"}
              onChange={(e) => onUpdate({ width: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="full">Full Width</option>
              <option value="container">Container</option>
              <option value="narrow">Narrow</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {settings.width === "custom" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Custom Width (px)
              </label>
              <input
                type="number"
                value={settings.customWidth || 1200}
                onChange={(e) =>
                  onUpdate({ customWidth: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </EditorGroup>

      {/* Spacing */}
      <EditorGroup
        title="Spacing"
        groupKey="spacing"
        expanded={expandedGroups.has("spacing")}
        onToggle={onToggleGroup}
      >
        <SpacingEditor
          label="Padding"
          values={
            settings.padding || {
              top: 40,
              right: 20,
              bottom: 40,
              left: 20,
              unit: "px",
            }
          }
          onChange={(padding) => onUpdate({ padding })}
        />
        <SpacingEditor
          label="Margin"
          values={
            settings.margin || {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              unit: "px",
            }
          }
          onChange={(margin) => onUpdate({ margin })}
        />
      </EditorGroup>

      {/* Alignment */}
      <EditorGroup
        title="Alignment"
        groupKey="alignment"
        expanded={expandedGroups.has("alignment")}
        onToggle={onToggleGroup}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Text Alignment
            </label>
            <div className="grid grid-cols-4 gap-1">
              {["left", "center", "right", "justify"].map((align) => (
                <button
                  key={align}
                  onClick={() => onUpdate({ alignment: align })}
                  className={`px-2 py-1 text-xs rounded ${
                    settings.alignment === align
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {align[0].toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </EditorGroup>
    </div>
  );
}

// Style Editor Component
function StyleEditor({
  settings,
  onUpdate,
  expandedGroups,
  onToggleGroup,
}: {
  settings: any;
  onUpdate: (updates: any) => void;
  expandedGroups: Set<string>;
  onToggleGroup: (key: string) => void;
}) {
  return (
    <div className="p-4 space-y-4">
      {/* Background */}
      <EditorGroup
        title="Background"
        groupKey="background"
        expanded={expandedGroups.has("background")}
        onToggle={onToggleGroup}
      >
        <BackgroundEditor
          background={settings.background || { type: "none" }}
          onChange={(background) => onUpdate({ background })}
        />
      </EditorGroup>

      {/* Colors */}
      <EditorGroup
        title="Colors"
        groupKey="colors"
        expanded={expandedGroups.has("colors")}
        onToggle={onToggleGroup}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <input
              type="color"
              value={settings.textColor || "#333333"}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>
      </EditorGroup>

      {/* Typography */}
      <EditorGroup
        title="Typography"
        groupKey="typography"
        expanded={expandedGroups.has("typography")}
        onToggle={onToggleGroup}
      >
        <TypographyEditor
          typography={settings.typography || {}}
          onChange={(typography) => onUpdate({ typography })}
        />
      </EditorGroup>
    </div>
  );
}

// Responsive Editor (Placeholder)
function ResponsiveEditor({ settings, onUpdate, viewMode }: any) {
  return (
    <div className="p-4">
      <div className="text-center text-gray-500 py-8">
        <DevicePhoneMobileIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Responsive settings</p>
        <p className="text-xs text-gray-400 mt-1">
          Configure different settings for {viewMode} view
        </p>
      </div>
    </div>
  );
}

// Animation Editor (Placeholder)
function AnimationEditor({ settings, onUpdate }: any) {
  return (
    <div className="p-4">
      <div className="text-center text-gray-500 py-8">
        <SparklesIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Animation settings</p>
        <p className="text-xs text-gray-400 mt-1">
          Configure entrance, scroll, and hover animations
        </p>
      </div>
    </div>
  );
}

// Custom Editor (Placeholder)
function CustomEditor({ settings, onUpdate }: any) {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Custom CSS Classes
          </label>
          <input
            type="text"
            value={settings.cssClasses?.join(" ") || ""}
            onChange={(e) =>
              onUpdate({
                cssClasses: e.target.value.split(" ").filter(Boolean),
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="class1 class2 class3"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Custom CSS
          </label>
          <textarea
            value={settings.customCSS || ""}
            onChange={(e) => onUpdate({ customCSS: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            placeholder="/* Custom CSS styles */"
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function EditorGroup({
  title,
  groupKey,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  groupKey: string;
  expanded: boolean;
  onToggle: (key: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => onToggle(groupKey)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {expanded ? (
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
}

function SpacingEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: any;
  onChange: (values: any) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {["top", "right", "bottom", "left"].map((side) => (
          <div key={side}>
            <label className="block text-xs text-gray-500 mb-1 capitalize">
              {side}
            </label>
            <input
              type="number"
              value={values[side] || 0}
              onChange={(e) =>
                onChange({ ...values, [side]: parseInt(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function BackgroundEditor({
  background,
  onChange,
}: {
  background: any;
  onChange: (background: any) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Background Type
        </label>
        <select
          value={background.type || "none"}
          onChange={(e) => onChange({ ...background, type: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="none">None</option>
          <option value="color">Solid Color</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      {background.type === "color" && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={background.color || "#ffffff"}
            onChange={(e) => onChange({ ...background, color: e.target.value })}
            className="w-full h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      )}

      {background.type === "gradient" && (
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gradient Type
            </label>
            <select
              value={background.gradientType || "linear"}
              onChange={(e) =>
                onChange({ ...background, gradientType: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Color
              </label>
              <input
                type="color"
                value={background.startColor || "#3b82f6"}
                onChange={(e) =>
                  onChange({ ...background, startColor: e.target.value })
                }
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Color
              </label>
              <input
                type="color"
                value={background.endColor || "#1d4ed8"}
                onChange={(e) =>
                  onChange({ ...background, endColor: e.target.value })
                }
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
          {background.gradientType === "linear" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Direction (degrees)
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={background.direction || 0}
                onChange={(e) =>
                  onChange({
                    ...background,
                    direction: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {background.direction || 0}°
              </div>
            </div>
          )}
        </div>
      )}

      {background.type === "image" && (
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={background.imageUrl || ""}
              onChange={(e) =>
                onChange({ ...background, imageUrl: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                value={background.size || "cover"}
                onChange={(e) =>
                  onChange({ ...background, size: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                value={background.position || "center"}
                onChange={(e) =>
                  onChange({ ...background, position: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={background.repeat || false}
                onChange={(e) =>
                  onChange({ ...background, repeat: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">Repeat background</span>
            </label>
          </div>
        </div>
      )}

      {background.type === "video" && (
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <input
              type="url"
              value={background.videoUrl || ""}
              onChange={(e) =>
                onChange({ ...background, videoUrl: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com/video.mp4"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={background.autoplay || true}
                onChange={(e) =>
                  onChange({ ...background, autoplay: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">Autoplay</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={background.loop || true}
                onChange={(e) =>
                  onChange({ ...background, loop: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">Loop</span>
            </label>
          </div>
        </div>
      )}

      {(background.type === "image" || background.type === "video") && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Overlay Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={background.overlayColor || "#000000"}
              onChange={(e) =>
                onChange({ ...background, overlayColor: e.target.value })
              }
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={background.overlayOpacity || 0}
              onChange={(e) =>
                onChange({
                  ...background,
                  overlayOpacity: parseInt(e.target.value),
                })
              }
              className="flex-1"
            />
            <span className="text-xs text-gray-500 w-10 text-right">
              {background.overlayOpacity || 0}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function TypographyEditor({
  typography,
  onChange,
}: {
  typography: any;
  onChange: (typography: any) => void;
}) {
  const fontFamilies = [
    "Inter, sans-serif",
    "Arial, sans-serif",
    "Georgia, serif",
    "Times New Roman, serif",
    "Helvetica, sans-serif",
    "Roboto, sans-serif",
    "Open Sans, sans-serif",
    "Lato, sans-serif",
    "Montserrat, sans-serif",
    "Poppins, sans-serif",
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Font Family
        </label>
        <select
          value={typography.fontFamily || "Inter, sans-serif"}
          onChange={(e) =>
            onChange({ ...typography, fontFamily: e.target.value })
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font.split(",")[0]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <div className="flex items-center space-x-1">
            <input
              type="number"
              value={typography.fontSize || 16}
              onChange={(e) =>
                onChange({ ...typography, fontSize: parseInt(e.target.value) })
              }
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="8"
              max="96"
            />
            <select
              value={typography.fontSizeUnit || "px"}
              onChange={(e) =>
                onChange({ ...typography, fontSizeUnit: e.target.value })
              }
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Line Height
          </label>
          <input
            type="number"
            step="0.1"
            value={typography.lineHeight || 1.5}
            onChange={(e) =>
              onChange({
                ...typography,
                lineHeight: parseFloat(e.target.value),
              })
            }
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="0.8"
            max="3"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Font Weight
          </label>
          <select
            value={typography.fontWeight || 400}
            onChange={(e) =>
              onChange({ ...typography, fontWeight: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={300}>Light (300)</option>
            <option value={400}>Regular (400)</option>
            <option value={500}>Medium (500)</option>
            <option value={600}>Semibold (600)</option>
            <option value={700}>Bold (700)</option>
            <option value={800}>Extra Bold (800)</option>
            <option value={900}>Black (900)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Letter Spacing
          </label>
          <div className="flex items-center space-x-1">
            <input
              type="number"
              step="0.01"
              value={typography.letterSpacing || 0}
              onChange={(e) =>
                onChange({
                  ...typography,
                  letterSpacing: parseFloat(e.target.value),
                })
              }
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="-0.5"
              max="1"
            />
            <span className="text-xs text-gray-500">em</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Text Style
        </label>
        <div className="flex flex-wrap gap-1">
          {[
            { key: "italic", label: "I", style: "italic" },
            { key: "underline", label: "U", style: "underline" },
            { key: "uppercase", label: "AA", style: "normal" },
            { key: "lowercase", label: "aa", style: "normal" },
          ].map(({ key, label, style }) => (
            <button
              key={key}
              onClick={() => {
                const current = typography[key] || false;
                onChange({ ...typography, [key]: !current });
              }}
              className={`px-2 py-1 text-xs rounded border ${
                typography[key]
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              style={{
                fontStyle:
                  key === "italic" && typography[key] ? style : "normal",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Render content field based on schema
function renderContentField(
  field: any,
  value: any,
  onChange: (value: any) => void
) {
  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "textarea":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows || 3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "url":
      return (
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "number":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step}
          required={field.required}
        />
      );

    case "select":
      return (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required={field.required}
        >
          <option value="">Select an option</option>
          {field.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{field.label}</span>
        </label>
      );

    case "color":
      return (
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded cursor-pointer"
        />
      );

    case "image":
      return (
        <div className="space-y-2">
          <input
            type="url"
            value={value?.url || ""}
            onChange={(e) => onChange({ ...value, url: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Image URL"
          />
          <input
            type="text"
            value={value?.alt || ""}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Alt text"
          />
          {value?.url && (
            <div className="mt-2">
              <img
                src={value.url}
                alt={value.alt || "Preview"}
                className="w-full h-32 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      );

    case "repeater":
      return (
        <div className="space-y-2">
          {(value || []).map((item: any, index: number) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Item {index + 1}
                </span>
                <button
                  onClick={() => {
                    const newValue = [...(value || [])];
                    newValue.splice(index, 1);
                    onChange(newValue);
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Remove
                </button>
              </div>
              {field.fields?.map((subField: any) => (
                <div key={subField.key} className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {subField.label}
                  </label>
                  {renderContentField(
                    subField,
                    item[subField.key],
                    (newValue) => {
                      const newItems = [...(value || [])];
                      newItems[index] = {
                        ...newItems[index],
                        [subField.key]: newValue,
                      };
                      onChange(newItems);
                    }
                  )}
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={() => {
              const newItem =
                field.fields?.reduce((acc: any, f: any) => {
                  acc[f.key] = f.defaultValue || "";
                  return acc;
                }, {}) || {};
              onChange([...(value || []), newItem]);
            }}
            className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
          >
            Add Item
          </button>
        </div>
      );

    default:
      return (
        <div className="text-xs text-red-500">
          Unsupported field type: {field.type}
        </div>
      );
  }
}
