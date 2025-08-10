// src/components/admin/PageBuilder/SortableSection.tsx
"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PageSection } from "@/types/page-builder";
import SectionPreview from "./SectionPreview";

interface SortableSectionProps {
  section: PageSection;
  language: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onToggleVisibility?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  viewMode?: "desktop" | "tablet" | "mobile";
  disabled?: boolean;
}

export default function SortableSection({
  section,
  language,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  canMoveUp = true,
  canMoveDown = true,
  viewMode = "desktop",
  disabled = false,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active,
  } = useSortable({
    id: section.id,
    disabled: disabled || !section.isActive,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverCurrent = isOver && active?.id !== section.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      {...attributes}
    >
      {/* Drop Indicator */}
      {isOverCurrent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 z-50 rounded-full" />
      )}

      {/* Drag Handle Overlay */}
      {!disabled && (
        <div
          {...listeners}
          className={`absolute top-0 left-0 right-0 h-8 z-40 cursor-grab active:cursor-grabbing ${
            isDragging
              ? "bg-blue-200 bg-opacity-50"
              : "hover:bg-blue-100 hover:bg-opacity-30"
          } transition-colors`}
        >
          <div className="flex items-center justify-center h-full">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Section Preview */}
      <SectionPreview
        section={section}
        language={language}
        isSelected={isSelected}
        isHovered={isDragging}
        showControls={!isDragging}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onToggleVisibility={onToggleVisibility}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        viewMode={viewMode}
      />

      {/* Dragging Ghost Effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
          <div className="text-blue-600 text-center">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm font-medium">Moving section...</p>
          </div>
        </div>
      )}
    </div>
  );
}
