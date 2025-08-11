/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Palette,
  Type,
  Layers,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Undo,
  Redo,
  Copy,
  Wand2,
  Search,
  Grid,
  List,
  ClipboardPasteIcon,
} from "lucide-react";

import {
  StyleSettings,
  LayoutSettings,
  ResponsiveSettings,
} from "@/types/page-builder";
import { Brandkit, StylePreset } from "@/types/brandkit";
import { BrandkitColorPicker } from "./components/BrandkitColorPicker";
import { BrandkitTypographySelector } from "./components/BrandkitTypographySelector";
import { BrandkitSpacingSelector } from "./components/BrandkitSpacingSelector";
import { StylePresetLibrary } from "./components/StylePresetLibrary";
import { ResponsivePreview } from "./components/ResponsivePreview";

interface EnhancedStyleEditorProps {
  sectionId: string;
  currentStyles: StyleSettings;
  currentLayout: LayoutSettings;
  currentResponsive: ResponsiveSettings;
  brandkit?: Brandkit;
  onStyleChange: (styles: Partial<StyleSettings>) => void;
  onLayoutChange: (layout: Partial<LayoutSettings>) => void;
  onResponsiveChange: (responsive: Partial<ResponsiveSettings>) => void;
  onSaveAsPreset?: (preset: Partial<StylePreset>) => void;
  className?: string;
}

type DeviceType = "desktop" | "tablet" | "mobile";
type ViewMode = "grid" | "list";

export function EnhancedStyleEditor({
  sectionId,
  currentStyles,
  currentLayout,
  currentResponsive,
  brandkit,
  onStyleChange,
  onLayoutChange,
  onResponsiveChange,
  onSaveAsPreset,
  className = "",
}: EnhancedStyleEditorProps) {
  const [activeDevice, setActiveDevice] = useState<DeviceType>("desktop");
  const [activeTab, setActiveTab] = useState("styles");
  const [presetViewMode, setPresetViewMode] = useState<ViewMode>("grid");
  const [presetSearch, setPresetSearch] = useState("");
  const [presetFilter, setPresetFilter] = useState<string>("all");
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copiedStyles, setCopiedStyles] = useState<any>(null);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      setHistory([
        {
          styles: currentStyles,
          layout: currentLayout,
          responsive: currentResponsive,
        },
      ]);
      setHistoryIndex(0);
    }
  }, [currentLayout, currentResponsive, currentStyles, history.length]);

  // Save state to history on changes
  const saveToHistory = (
    styles: StyleSettings,
    layout: LayoutSettings,
    responsive: ResponsiveSettings
  ) => {
    const newState = { styles, layout, responsive };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      onStyleChange(prevState.styles);
      onLayoutChange(prevState.layout);
      onResponsiveChange(prevState.responsive);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      onStyleChange(nextState.styles);
      onLayoutChange(nextState.layout);
      onResponsiveChange(nextState.responsive);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Copy styles
  const handleCopyStyles = () => {
    setCopiedStyles({
      styles: currentStyles,
      layout: currentLayout,
      responsive: currentResponsive,
    });
  };

  // Paste styles
  const handlePasteStyles = () => {
    if (copiedStyles) {
      onStyleChange(copiedStyles.styles);
      onLayoutChange(copiedStyles.layout);
      onResponsiveChange(copiedStyles.responsive);
      saveToHistory(
        copiedStyles.styles,
        copiedStyles.layout,
        copiedStyles.responsive
      );
    }
  };

  // Get current device styles
  const getCurrentDeviceStyles = () => {
    switch (activeDevice) {
      case "tablet":
        return currentResponsive.tablet;
      case "mobile":
        return currentResponsive.mobile;
      default:
        return currentResponsive.desktop;
    }
  };

  // Update device-specific styles
  const updateDeviceStyles = (updates: any) => {
    const newResponsive = {
      ...currentResponsive,
      [activeDevice]: {
        ...getCurrentDeviceStyles(),
        ...updates,
      },
    };
    onResponsiveChange(newResponsive);
  };

  // Filter and search presets
  const filteredPresets = useMemo(() => {
    // This would come from your preset library
    const mockPresets: StylePreset[] = [];

    return mockPresets.filter((preset) => {
      const matchesSearch =
        preset.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
        (preset.description
          ?.toLowerCase()
          .includes(presetSearch.toLowerCase()) ??
          false);
      const matchesFilter = presetFilter === "all";
      return matchesSearch && matchesFilter;
    });
  }, [presetSearch, presetFilter]);

  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
      {/* Header with controls */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Style Editor</h3>
          <div className="flex items-center gap-2">
            {/* History controls */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="h-7 w-7 p-0"
              >
                <Undo className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="h-7 w-7 p-0"
              >
                <Redo className="h-3 w-3" />
              </Button>
            </div>

            {/* Copy/Paste controls */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyStyles}
                className="h-7 w-7 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePasteStyles}
                disabled={!copiedStyles}
                className="h-7 w-7 p-0"
              >
                <ClipboardPasteIcon className="h-3 w-3" />
              </Button>
            </div>

            {/* Save as preset */}
            {onSaveAsPreset && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onSaveAsPreset({
                    name: `Section ${sectionId} Style`,
                    // category: "CUSTOM",
                    styleData: {
                      // styles: currentStyles as StyleSettings,
                      // responsive: currentResponsive,
                    },
                  })
                }
                className="h-8"
              >
                <Save className="h-3 w-3 mr-1" />
                Save Preset
              </Button>
            )}
          </div>
        </div>

        {/* Device selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Device:</span>
          <div className="flex items-center gap-1 p-1 bg-white rounded border">
            {[
              { key: "desktop" as DeviceType, icon: Monitor, label: "Desktop" },
              { key: "tablet" as DeviceType, icon: Tablet, label: "Tablet" },
              {
                key: "mobile" as DeviceType,
                icon: Smartphone,
                label: "Mobile",
              },
            ].map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                variant={activeDevice === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveDevice(key)}
                className="h-7 px-2"
              >
                <Icon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="styles" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              <span className="hidden sm:inline">Styles</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              <span className="hidden sm:inline">Layout</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              <span className="hidden sm:inline">Typography</span>
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-1">
              {/* <Spacing className="h-3 w-3" /> */}
              <span className="hidden sm:inline">Spacing</span>
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-1">
              <Wand2 className="h-3 w-3" />
              <span className="hidden sm:inline">Presets</span>
            </TabsTrigger>
          </TabsList>

          {/* Styles Tab */}
          <TabsContent value="styles" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Colors & Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {brandkit ? (
                  <BrandkitColorPicker
                    brandkit={brandkit}
                    currentStyles={currentStyles}
                    onColorChange={(colors) => {
                      onStyleChange(colors);
                      saveToHistory(
                        { ...currentStyles, ...colors },
                        currentLayout,
                        currentResponsive
                      );
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium">Text Color</Label>
                      <Input
                        type="color"
                        value={currentStyles.textColor}
                        onChange={(e) => {
                          const newStyles = { textColor: e.target.value };
                          onStyleChange(newStyles);
                          saveToHistory(
                            { ...currentStyles, ...newStyles },
                            currentLayout,
                            currentResponsive
                          );
                        }}
                        className="h-8 w-16"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">
                        Background Color
                      </Label>
                      <Input
                        type="color"
                        value={currentStyles.background?.color || "#ffffff"}
                        onChange={(e) => {
                          const newStyles = {
                            background: {
                              ...currentStyles.background,
                              type: "color" as const,
                              color: e.target.value,
                            },
                          };
                          onStyleChange(newStyles);
                          saveToHistory(
                            { ...currentStyles, ...newStyles },
                            currentLayout,
                            currentResponsive
                          );
                        }}
                        className="h-8 w-16"
                      />
                    </div>
                  </div>
                )}

                {/* Opacity */}
                <div>
                  <Label className="text-xs font-medium">Opacity</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[currentStyles.opacity || 0 * 100]}
                      onValueChange={([value]) => {
                        const newStyles = { opacity: value / 100 };
                        onStyleChange(newStyles);
                        saveToHistory(
                          { ...currentStyles, ...newStyles },
                          currentLayout,
                          currentResponsive
                        );
                      }}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-10">
                      {Math.round(currentStyles.opacity || 0 * 100)}%
                    </span>
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <Label className="text-xs font-medium">Border Radius</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[currentStyles.borderRadius || 0]}
                      onValueChange={([value]) => {
                        const newStyles = { borderRadius: value };
                        onStyleChange(newStyles);
                        saveToHistory(
                          { ...currentStyles, ...newStyles },
                          currentLayout,
                          currentResponsive
                        );
                      }}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-10">
                      {currentStyles.borderRadius || 0}px
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Layout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Container Type */}
                <div>
                  <Label className="text-xs font-medium">Container Type</Label>
                  {/* <Select
                    value={currentLayout.containerType || "container"}
                    onValueChange={(value: any) => {
                      const newLayout = { containerType: value };
                      onLayoutChange(newLayout);
                      saveToHistory(
                        currentStyles,
                        { ...currentLayout, ...newLayout },
                        currentResponsive
                      );
                    }}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="container">Container</SelectItem>
                      <SelectItem value="fluid">Fluid</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>

                {/* Display */}
                <div>
                  <Label className="text-xs font-medium">Display</Label>
                  <Select
                    value={currentLayout.display || "block"}
                    onValueChange={(value: any) => {
                      const newLayout = { display: value };
                      onLayoutChange(newLayout);
                      saveToHistory(
                        currentStyles,
                        { ...currentLayout, ...newLayout },
                        currentResponsive
                      );
                    }}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="flex">Flex</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="inline-block">Inline Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Flex Direction (if display is flex) */}
                {currentLayout.display === "flex" && (
                  <div>
                    <Label className="text-xs font-medium">
                      Flex Direction
                    </Label>
                    <Select
                      value={currentLayout.flexDirection}
                      onValueChange={(value: any) => {
                        const newLayout = { flexDirection: value };
                        onLayoutChange(newLayout);
                        saveToHistory(
                          currentStyles,
                          { ...currentLayout, ...newLayout },
                          currentResponsive
                        );
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="row">Row</SelectItem>
                        <SelectItem value="column">Column</SelectItem>
                        <SelectItem value="row-reverse">Row Reverse</SelectItem>
                        <SelectItem value="column-reverse">
                          Column Reverse
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Grid Columns (if display is grid) */}
                {currentLayout.display === "grid" && (
                  <div>
                    <Label className="text-xs font-medium">Grid Columns</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[currentLayout.gridColumns || 1]}
                        onValueChange={([value]) => {
                          const newLayout = { gridColumns: value };
                          onLayoutChange(newLayout);
                          saveToHistory(
                            currentStyles,
                            { ...currentLayout, ...newLayout },
                            currentResponsive
                          );
                        }}
                        min={1}
                        max={12}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 w-6">
                        {currentLayout.gridColumns || 1}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Typography</CardTitle>
              </CardHeader>
              <CardContent>
                {brandkit ? (
                  <BrandkitTypographySelector
                    brandkit={brandkit}
                    currentStyles={currentStyles}
                    onTypographyChange={(typography) => {
                      onStyleChange(typography);
                      saveToHistory(
                        { ...currentStyles, ...typography },
                        currentLayout,
                        currentResponsive
                      );
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium">Font Family</Label>
                      {/* <Input
                        value={currentStyles.typography?.fontFamily || ""}
                        onChange={(e) => {
                          const newStyles = {
                            typography: {
                              ...currentStyles.typography,
                              fontFamily: e.target.value,
                            },
                          };
                          onStyleChange(newStyles);
                          saveToHistory(
                            { ...currentStyles, ...newStyles },
                            currentLayout,
                            currentResponsive
                          );
                        }}
                        className="h-8"
                        placeholder="Inter, sans-serif"
                      /> */}
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Font Size</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {/* <Slider
                          value={[currentStyles.typography?.fontSize || 0]}
                          onValueChange={([value]) => {
                            const newStyles = {
                              typography: {
                                ...currentStyles.typography,
                                fontSize: value,
                              },
                            };
                            onStyleChange(newStyles);
                            saveToHistory(
                              { ...currentStyles, ...newStyles },
                              currentLayout,
                              currentResponsive
                            );
                          }}
                          min={8}
                          max={72}
                          step={1}
                          className="flex-1"
                        /> */}
                        <span className="text-xs text-gray-500 w-10">
                          {currentStyles.typography?.fontSize || 0}px
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Spacing</CardTitle>
              </CardHeader>
              <CardContent>
                {brandkit ? (
                  <BrandkitSpacingSelector
                    brandkit={brandkit}
                    currentLayout={currentLayout}
                    onSpacingChange={(spacing) => {
                      onLayoutChange(spacing);
                      saveToHistory(
                        currentStyles,
                        { ...currentLayout, ...spacing },
                        currentResponsive
                      );
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium">Padding</Label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {["top", "right", "bottom", "left"].map((side) => (
                          <div key={side}>
                            <Label className="text-xs text-gray-500 capitalize">
                              {side}
                            </Label>
                            <Input
                              type="number"
                              value={
                                currentLayout.padding[
                                  side as keyof typeof currentLayout.padding
                                ]
                              }
                              onChange={(e) => {
                                const newLayout = {
                                  padding: {
                                    ...currentLayout.padding,
                                    [side]: parseInt(e.target.value) || 0,
                                  },
                                };
                                onLayoutChange(newLayout);
                                saveToHistory(
                                  currentStyles,
                                  { ...currentLayout, ...newLayout },
                                  currentResponsive
                                );
                              }}
                              className="h-8"
                              min="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Margin</Label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {["top", "right", "bottom", "left"].map((side) => (
                          <div key={side}>
                            <Label className="text-xs text-gray-500 capitalize">
                              {side}
                            </Label>
                            <Input
                              type="number"
                              value={
                                currentLayout.margin[
                                  side as keyof typeof currentLayout.margin
                                ]
                              }
                              onChange={(e) => {
                                const newLayout = {
                                  margin: {
                                    ...currentLayout.margin,
                                    [side]: parseInt(e.target.value) || 0,
                                  },
                                };
                                onLayoutChange(newLayout);
                                saveToHistory(
                                  currentStyles,
                                  { ...currentLayout, ...newLayout },
                                  currentResponsive
                                );
                              }}
                              className="h-8"
                              min="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Style Presets</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded">
                      <Button
                        variant={
                          presetViewMode === "grid" ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setPresetViewMode("grid")}
                        className="h-6 w-6 p-0"
                      >
                        <Grid className="h-3 w-3" />
                      </Button>
                      <Button
                        variant={
                          presetViewMode === "list" ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setPresetViewMode("list")}
                        className="h-6 w-6 p-0"
                      >
                        <List className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                    <Input
                      placeholder="Search presets..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="h-7 pl-7"
                    />
                  </div>
                  <Select
                    value={presetFilter}
                    onValueChange={(value: any) => setPresetFilter(value)}
                  >
                    <SelectTrigger className="h-7 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="LAYOUT">Layout</SelectItem>
                      <SelectItem value="TYPOGRAPHY">Typography</SelectItem>
                      <SelectItem value="COLOR">Color</SelectItem>
                      <SelectItem value="SPACING">Spacing</SelectItem>
                      <SelectItem value="EFFECTS">Effects</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <StylePresetLibrary
                  presets={filteredPresets}
                  viewMode={presetViewMode}
                  onApplyPreset={(preset) => {
                    if (preset.styleData.styles) {
                      onStyleChange(preset.styleData.styles as StyleSettings);
                    }
                    // if (preset.styleData.responsive) {
                    //   onResponsiveChange(
                    //     preset.styleData.responsive as ResponsiveSettings
                    //   );
                    // }
                    saveToHistory(
                      {
                        ...currentStyles,
                        ...(preset.styleData.styles || {}),
                      } as StyleSettings,
                      currentLayout,
                      {
                        ...currentResponsive,
                        //     ...(preset.styleData.responsive || {}),
                      } as ResponsiveSettings
                    );
                  }}
                  brandkit={brandkit}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Responsive Preview */}
        {activeDevice !== "desktop" && (
          <div className="mt-4">
            <ResponsivePreview
              device={activeDevice}
              styles={currentStyles}
              layout={currentLayout}
              responsive={currentResponsive}
            />
          </div>
        )}
      </div>
    </div>
  );
}
