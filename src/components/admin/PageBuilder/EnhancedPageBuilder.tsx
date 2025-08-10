// src/components/admin/PageBuilder/EnhancedPageBuilder.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  PlusIcon,
  EyeIcon,
  CogIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

import {
  PageSection,
  PageSectionType,
  SectionCategory,
} from "@/types/page-builder";
import {
  SectionRegistry,
  SECTION_CATEGORIES,
} from "@/lib/page-builder/section-registry";

import SectionLibrary from "./SectionLibrary";
import SectionEditor from "./sections/SectionEditor";
import SectionPreview from "./sections/SectionPreview";
import ResponsivePreview from "./sections/ResponsivePreview";
import SortableSection from "./sections/SortableSection";

interface EnhancedPageBuilderProps {
  pageId: string;
  initialSections: PageSection[];
  onSave: (sections: PageSection[]) => Promise<void>;
  onPreview?: () => void;
  language?: string;
  readonly?: boolean;
}

type ViewMode = "desktop" | "tablet" | "mobile";
type PanelMode = "library" | "settings" | "preview";

export default function EnhancedPageBuilder({
  pageId,
  initialSections,
  onSave,
  onPreview,
  language = "en",
  readonly = false,
}: EnhancedPageBuilderProps) {
  // State management
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [activeSection, setActiveSection] = useState<PageSection | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [panelMode, setPanelMode] = useState<PanelMode>("library");
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSection, setDraggedSection] = useState<PageSection | null>(
    null
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && !readonly) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 30000); // Auto-save after 30 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, sections]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "z":
            e.preventDefault();
            // TODO: Implement undo/redo
            break;
          case "p":
            e.preventDefault();
            togglePreviewMode();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Section management functions
  const addSection = useCallback(
    (sectionType: PageSectionType, insertIndex?: number) => {
      const newSection = SectionRegistry.createDefaultSection(
        sectionType,
        pageId,
        insertIndex ?? sections.length
      );

      const sectionWithId: PageSection = {
        ...newSection,
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setSections((prev) => {
        const newSections = [...prev];
        if (insertIndex !== undefined) {
          newSections.splice(insertIndex, 0, sectionWithId);
          // Reorder subsequent sections
          newSections.forEach((section, index) => {
            section.order = index;
          });
        } else {
          newSections.push(sectionWithId);
        }
        return newSections;
      });

      setActiveSection(sectionWithId);
      setPanelMode("settings");
      setHasUnsavedChanges(true);
    },
    [pageId, sections]
  );

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<PageSection>) => {
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? { ...section, ...updates, updatedAt: new Date() }
            : section
        )
      );
      setHasUnsavedChanges(true);
    },
    []
  );

  const deleteSection = useCallback(
    (sectionId: string) => {
      setSections((prev) => {
        const filtered = prev.filter((section) => section.id !== sectionId);
        // Reorder remaining sections
        return filtered.map((section, index) => ({
          ...section,
          order: index,
        }));
      });

      if (activeSection?.id === sectionId) {
        setActiveSection(null);
      }
      setHasUnsavedChanges(true);
    },
    [activeSection]
  );

  const duplicateSection = useCallback(
    (sectionId: string) => {
      const sectionToDuplicate = sections.find((s) => s.id === sectionId);
      if (!sectionToDuplicate) return;

      const duplicatedSection: PageSection = {
        ...sectionToDuplicate,
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: sectionToDuplicate.order + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setSections((prev) => {
        const newSections = [...prev];
        const insertIndex = sectionToDuplicate.order + 1;
        newSections.splice(insertIndex, 0, duplicatedSection);

        // Reorder subsequent sections
        newSections.forEach((section, index) => {
          section.order = index;
        });

        return newSections;
      });

      setActiveSection(duplicatedSection);
      setHasUnsavedChanges(true);
    },
    [sections]
  );

  const moveSection = useCallback(
    (sectionId: string, direction: "up" | "down") => {
      setSections((prev) => {
        const currentIndex = prev.findIndex((s) => s.id === sectionId);
        if (currentIndex === -1) return prev;

        const newIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= prev.length) return prev;

        const newSections = [...prev];
        [newSections[currentIndex], newSections[newIndex]] = [
          newSections[newIndex],
          newSections[currentIndex],
        ];

        // Update order numbers
        newSections.forEach((section, index) => {
          section.order = index;
        });

        return newSections;
      });
      setHasUnsavedChanges(true);
    },
    []
  );

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const section = sections.find((s) => s.id === event.active.id);
    setDraggedSection(section || null);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setDraggedSection(null);

    if (!over || active.id === over.id) return;

    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newSections = [...prev];
      const [movedSection] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, movedSection);

      // Update order numbers
      return newSections.map((section, index) => ({
        ...section,
        order: index,
      }));
    });

    setHasUnsavedChanges(true);
  };

  // Save function
  const handleSave = async () => {
    if (readonly || saving) return;

    setSaving(true);
    try {
      await onSave(sections);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save sections:", error);
      // TODO: Show error notification
    } finally {
      setSaving(false);
    }
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      setActiveSection(null);
      setPanelMode("preview");
    }
  };

  // Responsive preview handlers
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Render functions
  const renderToolbar = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Page Builder</h2>
          {hasUnsavedChanges && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Unsaved Changes
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Responsive View Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              {
                mode: "desktop" as ViewMode,
                icon: ComputerDesktopIcon,
                label: "Desktop",
              },
              {
                mode: "tablet" as ViewMode,
                icon: DeviceTabletIcon,
                label: "Tablet",
              },
              {
                mode: "mobile" as ViewMode,
                icon: DevicePhoneMobileIcon,
                label: "Mobile",
              },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => handleViewModeChange(mode)}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title={label}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <button
            onClick={togglePreviewMode}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
              isPreviewMode
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            {isPreviewMode ? "Exit Preview" : "Preview"}
          </button>

          {onPreview && (
            <button
              onClick={onPreview}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Public Preview
            </button>
          )}

          {!readonly && (
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {[
            { key: "library" as PanelMode, label: "Sections", icon: PlusIcon },
            { key: "settings" as PanelMode, label: "Settings", icon: CogIcon },
            { key: "preview" as PanelMode, label: "Preview", icon: EyeIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setPanelMode(key)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                panelMode === key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="h-4 w-4 mx-auto mb-1" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        {panelMode === "library" && (
          <SectionLibrary
            onAddSection={addSection}
            categories={SECTION_CATEGORIES}
            searchable={true}
            showAdvanced={true}
          />
        )}

        {panelMode === "settings" && (
          <SectionEditor
            section={activeSection}
            language={language}
            onUpdate={updateSection}
            onClose={() => setActiveSection(null)}
            viewMode={viewMode}
          />
        )}

        {panelMode === "preview" && (
          <SectionPreview
            sections={sections}
            viewMode={viewMode}
            language={language}
          />
        )}
      </div>
    </div>
  );

  const renderMainContent = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {isPreviewMode ? (
        <ResponsivePreview
          sections={sections}
          viewMode={viewMode}
          language={language}
          onViewModeChange={handleViewModeChange}
        />
      ) : (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div
            className={`mx-auto transition-all duration-300 ${
              viewMode === "desktop"
                ? "max-w-7xl"
                : viewMode === "tablet"
                ? "max-w-3xl"
                : "max-w-sm"
            }`}
          >
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {sections.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                        <PlusIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No sections yet
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Start building your page by adding sections from the
                        library
                      </p>
                      <button
                        onClick={() => setPanelMode("library")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Browse Sections
                      </button>
                    </div>
                  ) : (
                    sections.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        isActive={activeSection?.id === section.id}
                        viewMode={viewMode}
                        language={language}
                        readonly={readonly}
                        onSelect={() => {
                          setActiveSection(section);
                          setPanelMode("settings");
                        }}
                        onUpdate={updateSection}
                        onDelete={deleteSection}
                        onDuplicate={duplicateSection}
                        onMove={moveSection}
                      />
                    ))
                  )}
                </div>
              </SortableContext>

              {/* Drag Overlay */}
              <DragOverlay>
                {draggedSection && (
                  <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg opacity-90">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {SectionRegistry.getSectionIcon(draggedSection.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {SectionRegistry.getSectionName(draggedSection.type)}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Moving section...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {renderToolbar()}

      <div className="flex-1 flex overflow-hidden">
        {!isPreviewMode && renderSidebar()}
        {renderMainContent()}
      </div>
    </div>
  );
}
