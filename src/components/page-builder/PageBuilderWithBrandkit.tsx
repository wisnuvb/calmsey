/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/page-builder/PageBuilderWithBrandkit.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Palette,
  Type,
  Layout,
  Layers,
  Grid,
  Save,
  Undo,
  Redo,
  X,
} from "lucide-react";
import { PageSection, PageSectionType } from "@/types/page-builder";
import { useBrandkitIntegration } from "@/hooks/useBrandkitIntegration";
import { PageBrandkitManager } from "./PageBrandkitManager";
import { BrandkitQuickActions } from "./BrandkitQuickActions";
import { EnhancedStyleEditor } from "./style-editor/EnhancedStyleEditor";
import { cn } from "@/lib/utils";

interface PageBuilderWithBrandkitProps {
  pageId: string;
  sections: PageSection[];
  selectedSectionId?: string;
  onSectionsChange: (sections: PageSection[]) => void;
  onSectionSelect: (sectionId: string) => void;
  onSectionAdd?: (
    sectionType: PageSectionType,
    afterSectionId?: string
  ) => void;
  onSectionDelete?: (sectionId: string) => void;
  onSectionDuplicate?: (sectionId: string) => void;
  onSave?: () => void;
  className?: string;
}

export function PageBuilderWithBrandkit({
  pageId,
  sections,
  selectedSectionId,
  onSectionsChange,
  onSectionSelect,
  onSectionAdd,
  onSectionDelete,
  onSectionDuplicate,
  onSave,
  className = "",
}: PageBuilderWithBrandkitProps) {
  const [isBrandkitManagerOpen, setIsBrandkitManagerOpen] = useState(false);
  const [isStyleEditorOpen, setIsStyleEditorOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [history, setHistory] = useState<PageSection[][]>([sections]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const {
    currentBrandkit,
    isLoading,
    error,
    lastResult,
    applyBrandkit,
    removeBrandkit,
    validateCompatibility,
    previewChanges,
  } = useBrandkitIntegration({ pageId });

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  console.log(sections);

  // Save to history
  const saveToHistory = (newSections: PageSection[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newSections]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevSections = history[historyIndex - 1];
      onSectionsChange(prevSections);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextSections = history[historyIndex + 1];
      onSectionsChange(nextSections);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Section operations
  const handleSectionMove = (sectionId: string, direction: "up" | "down") => {
    const currentIndex = sections.findIndex((s) => s.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    const [movedSection] = newSections.splice(currentIndex, 1);
    newSections.splice(newIndex, 0, { ...movedSection, order: newIndex });

    // Update order for all sections
    newSections.forEach((section, index) => {
      section.order = index;
    });

    onSectionsChange(newSections);
    saveToHistory(newSections);
  };

  const handleSectionToggleVisibility = (sectionId: string) => {
    const newSections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, isActive: !section.isActive }
        : section
    );
    onSectionsChange(newSections);
    saveToHistory(newSections);
  };

  const handleBrandkitApplied = (result: any) => {
    if (result.success) {
      setIsBrandkitManagerOpen(false);
      // Refresh sections would happen through parent component
    }
  };

  const handleApplyBrandkit = async () => {
    if (!currentBrandkit) return;

    try {
      await applyBrandkit(currentBrandkit.id);
    } catch (error) {
      console.error("Failed to apply brandkit:", error);
    }
  };

  const handlePreviewChanges = async () => {
    if (!currentBrandkit) return;

    try {
      await previewChanges(currentBrandkit.id);
    } catch (error) {
      console.error("Failed to preview changes:", error);
    }
  };

  // Available section types for adding
  const sectionTypes: {
    type: PageSectionType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: PageSectionType.HERO,
      label: "Hero",
      icon: <Layout className="h-4 w-4" />,
    },
    {
      type: PageSectionType.RICH_TEXT,
      label: "Text",
      icon: <Type className="h-4 w-4" />,
    },
    {
      type: PageSectionType.IMAGE,
      label: "Image",
      icon: <Grid className="h-4 w-4" />,
    },
    {
      type: PageSectionType.CONTAINER,
      label: "Container",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      type: PageSectionType.GRID,
      label: "Grid",
      icon: <Grid className="h-4 w-4" />,
    },
    {
      type: PageSectionType.BUTTON_GROUP,
      label: "Buttons",
      icon: <Plus className="h-4 w-4" />,
    },
  ];

  const SectionCard = ({
    section,
    index,
  }: {
    section: PageSection;
    index: number;
  }) => {
    const isSelected = selectedSectionId === section.id;
    const translation = section.translations.find((t) => t.languageId === "en");

    return (
      <Card
        className={`cursor-pointer transition-all ${
          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
        } ${!section.isActive ? "opacity-50" : ""}`}
        onClick={() => onSectionSelect(section.id)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionMove(section.id, "up");
                    }}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionMove(section.id, "down");
                    }}
                    disabled={index === sections.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
                <Badge variant="outline" className="text-xs">
                  {section.type}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSectionToggleVisibility(section.id);
                  }}
                  className="h-6 w-6 p-0"
                >
                  {section.isActive ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionDuplicate?.(section.id);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionDelete?.(section.id);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Section Info */}
            <div>
              <h4 className="font-medium text-sm">
                {translation?.title || `Section ${index + 1}`}
              </h4>
              {translation?.subtitle && (
                <p className="text-xs text-gray-600 mt-1">
                  {translation.subtitle}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionSelect(section.id);
                  setIsStyleEditorOpen(true);
                }}
                className="flex-1"
              >
                <Settings className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`flex h-full bg-gray-50 ${className}`}>
      {/* Left Sidebar - Section List */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Page Builder</h2>
            <div className="flex items-center gap-1">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-7 w-7 p-0"
              >
                <Save className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Add Section */}
          <div>
            <Label className="text-xs font-medium">Add Section</Label>
            <Select
              onValueChange={(value) =>
                onSectionAdd?.(value as PageSectionType)
              }
            >
              <SelectTrigger className="h-8 mt-1">
                <SelectValue placeholder="Choose section type..." />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map(({ type, label, icon }) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      {icon}
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sections List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <SectionCard key={section.id} section={section} index={index} />
              ))}

            {sections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No sections yet</p>
                <p className="text-xs mt-1">Add a section to get started</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {previewMode ? "Exit Preview" : "Preview"}
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="text-sm text-gray-600">
                {sections.length} sections •{" "}
                {sections.filter((s) => s.isActive).length} active
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBrandkitManagerOpen(true)}
              >
                <Palette className="h-3 w-3 mr-1" />
                Brandkit
              </Button>

              {!showRightSidebar && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRightSidebar(!showRightSidebar)}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Brandkit Actions
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 p-6 overflow-auto">
          {previewMode ? (
            <div className="max-w-4xl mx-auto">
              {/* Preview Mode */}
              <div className="bg-white rounded-lg shadow-sm border min-h-96">
                {sections
                  .filter((s) => s.isActive)
                  .sort((a, b) => a.order - b.order)
                  .map((section) => {
                    const translation = section.translations.find(
                      (t) => t.languageId === "en"
                    );
                    return (
                      <div
                        key={section.id}
                        className="p-8 border-b last:border-b-0"
                      >
                        <div className="text-sm text-gray-500 mb-2">
                          {section.type}
                        </div>
                        <h3 className="text-lg font-medium">
                          {translation?.title || "Untitled"}
                        </h3>
                        {translation?.subtitle && (
                          <p className="text-gray-600 mt-1">
                            {translation.subtitle}
                          </p>
                        )}
                        {translation?.content && (
                          <div
                            className="mt-4"
                            dangerouslySetInnerHTML={{
                              __html: translation.content,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Builder Mode */}
              {selectedSection ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Editing: {selectedSection.type}
                    </CardTitle>
                    <CardDescription>
                      Configure the selected section
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setIsStyleEditorOpen(true)}
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Open Style Editor
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Layers className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Section Selected
                    </h3>
                    <p className="text-gray-600">
                      Select a section from the left sidebar to start editing
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={cn(
          "w-80 border-l bg-white p-4 space-y-4",
          showRightSidebar ? "block" : "hidden"
        )}
      >
        {/* Brandkit Quick Actions */}
        <BrandkitQuickActions
          pageId={pageId}
          currentBrandkit={currentBrandkit}
          sectionsCount={sections.length}
          onApplyBrandkit={handleApplyBrandkit}
          onOpenManager={() => setIsBrandkitManagerOpen(true)}
          onPreviewChanges={handlePreviewChanges}
          setShowRightSidebar={setShowRightSidebar}
        />

        {/* Section Properties */}
        {selectedSection && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Section Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Type</Label>
                <div className="text-sm font-medium">
                  {selectedSection.type}
                </div>
              </div>
              <div>
                <Label className="text-xs">Order</Label>
                <div className="text-sm">{selectedSection.order + 1}</div>
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Badge
                  variant={selectedSection.isActive ? "default" : "secondary"}
                >
                  {selectedSection.isActive ? "Active" : "Hidden"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3">
              <div className="text-sm text-red-700">{error}</div>
            </CardContent>
          </Card>
        )}

        {/* Last Result Display */}
        {lastResult && (
          <Card
            className={`border-${lastResult.success ? "green" : "red"}-200 bg-${
              lastResult.success ? "green" : "red"
            }-50`}
          >
            <CardContent className="p-3">
              <div className="text-sm">
                <div className="font-medium mb-1">
                  {lastResult.success
                    ? "Brandkit Applied"
                    : "Application Failed"}
                </div>
                <div>
                  Applied: {lastResult.appliedSections}, Skipped:{" "}
                  {lastResult.skippedSections}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Brandkit Manager Modal */}
      {isBrandkitManagerOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Brandkit Manager</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBrandkitManagerOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <PageBrandkitManager
                pageId={pageId}
                sections={sections}
                currentBrandkit={currentBrandkit}
                onBrandkitApplied={handleBrandkitApplied}
              />
            </div>
          </div>
        </div>
      )}

      {/* Style Editor Modal */}
      {isStyleEditorOpen && selectedSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Style Editor</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsStyleEditorOpen(false)}
              >
                ×
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <EnhancedStyleEditor
                sectionId={selectedSection.id}
                currentStyles={selectedSection.styleSettings}
                currentLayout={selectedSection.layoutSettings}
                currentResponsive={selectedSection.responsiveSettings}
                brandkit={currentBrandkit || undefined}
                onStyleChange={(styles) => {
                  const updatedSections = sections.map((s) =>
                    s.id === selectedSection.id
                      ? {
                          ...s,
                          styleSettings: { ...s.styleSettings, ...styles },
                        }
                      : s
                  );
                  onSectionsChange(updatedSections);
                  saveToHistory(updatedSections);
                }}
                onLayoutChange={(layout) => {
                  const updatedSections = sections.map((s) =>
                    s.id === selectedSection.id
                      ? {
                          ...s,
                          layoutSettings: { ...s.layoutSettings, ...layout },
                        }
                      : s
                  );
                  onSectionsChange(updatedSections);
                  saveToHistory(updatedSections);
                }}
                onResponsiveChange={(responsive) => {
                  const updatedSections = sections.map((s) =>
                    s.id === selectedSection.id
                      ? {
                          ...s,
                          responsiveSettings: {
                            ...s.responsiveSettings,
                            ...responsive,
                          },
                        }
                      : s
                  );
                  onSectionsChange(updatedSections);
                  saveToHistory(updatedSections);
                }}
                onSaveAsPreset={(preset) => {
                  console.log("Save preset:", preset);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
