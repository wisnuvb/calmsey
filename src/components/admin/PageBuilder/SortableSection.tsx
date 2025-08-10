// src/components/admin/PageBuilder/SortableSection.tsx
"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import { PageSection } from "@/types/page-builder";
import { SectionRegistry } from "@/lib/page-builder/section-registry";
import SectionRenderer from "./SectionRenderer";

type ViewMode = "desktop" | "tablet" | "mobile";

interface SortableSectionProps {
  section: PageSection;
  isActive: boolean;
  viewMode: ViewMode;
  language: string;
  readonly: boolean;
  onSelect: () => void;
  onUpdate: (sectionId: string, updates: Partial<PageSection>) => void;
  onDelete: (sectionId: string) => void;
  onDuplicate: (sectionId: string) => void;
  onMove: (sectionId: string, direction: "up" | "down") => void;
}

export default function SortableSection({
  section,
  isActive,
  viewMode,
  language,
  readonly,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
}: SortableSectionProps) {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    disabled: readonly,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionConfig = SectionRegistry.getSection(section.type);

  const handleToggleVisibility = () => {
    onUpdate(section.id, { isActive: !section.isActive });
  };

  const handleDeleteClick = () => {
    if (
      confirm(
        "Are you sure you want to delete this section? This action cannot be undone."
      )
    ) {
      onDelete(section.id);
    }
  };

  const renderSectionHeader = () => (
    <div
      className={`absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3 transition-all duration-200 ${
        isActive || isHovered
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Section Info */}
        <div className="flex items-center space-x-3">
          {/* Drag Handle */}
          {!readonly && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
            >
              <Bars3Icon className="h-4 w-4" />
            </button>
          )}

          {/* Section Icon & Name */}
          <div className="flex items-center space-x-2">
            <span className="text-lg">{sectionConfig?.icon || "📄"}</span>
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {sectionConfig?.name || section.type}
              </h4>
              <p className="text-xs text-gray-500">
                Order: {section.order + 1}
              </p>
            </div>
          </div>

          {/* Section Status */}
          <div className="flex items-center space-x-2">
            {!section.isActive && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                Hidden
              </span>
            )}
            {sectionConfig?.isAdvanced && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                Advanced
              </span>
            )}
          </div>
        </div>

        {/* Section Actions */}
        {!readonly && (
          <div className="flex items-center space-x-1">
            {/* Quick Actions */}
            <button
              onClick={handleToggleVisibility}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title={section.isActive ? "Hide section" : "Show section"}
            >
              {section.isActive ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeSlashIcon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={onSelect}
              className={`p-1.5 rounded-md transition-colors ${
                isActive
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              title="Edit section settings"
            >
              <CogIcon className="h-4 w-4" />
            </button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                title="More actions"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
              </button>

              {showActions && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={() => {
                        onMove(section.id, "up");
                        setShowActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      disabled={section.order === 0}
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                      <span>Move Up</span>
                    </button>

                    <button
                      onClick={() => {
                        onMove(section.id, "down");
                        setShowActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <ArrowDownIcon className="h-4 w-4" />
                      <span>Move Down</span>
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        onDuplicate(section.id);
                        setShowActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                      <span>Duplicate</span>
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        handleDeleteClick();
                        setShowActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSectionContent = () => (
    <div
      className={`transition-opacity duration-200 ${
        !section.isActive ? "opacity-50" : ""
      }`}
    >
      <SectionRenderer
        section={section}
        viewMode={viewMode}
        language={language}
        isEditing={true}
        onClick={readonly ? undefined : onSelect}
      />
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg overflow-hidden transition-all duration-200 ${
        isActive
          ? "ring-2 ring-blue-500 ring-opacity-50 shadow-lg"
          : "hover:ring-1 hover:ring-gray-300"
      } ${isDragging ? "z-10" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowActions(false);
      }}
    >
      {/* Section Header Overlay */}
      {renderSectionHeader()}

      {/* Section Content */}
      <div className="relative">
        {renderSectionContent()}

        {/* Click Overlay for Selection */}
        {!readonly && (
          <div
            className={`absolute inset-0 cursor-pointer transition-colors ${
              isActive ? "bg-blue-500/5" : "hover:bg-gray-500/5"
            }`}
            onClick={onSelect}
          />
        )}
      </div>

      {/* Bottom Border for Drop Zone Indication */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Section Footer Info (when expanded) */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-3 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Type: {section.type}</span>
              <span>Order: {section.order + 1}</span>
              <span>Language: {language}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                Last updated: {new Date(section.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
