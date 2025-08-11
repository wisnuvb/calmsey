// src/components/admin/PageBuilder/PageBuilderToolbar.tsx
import React from "react";
import {
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DocumentDuplicateIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PlayIcon,
  PauseIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

interface PageBuilderToolbarProps {
  previewMode: "desktop" | "tablet" | "mobile";
  onPreviewModeChange: (mode: "desktop" | "tablet" | "mobile") => void;
  onPreview: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  onOpenSettings: () => void;
  onOpenStyleGuide: () => void;
  isDirty: boolean;
  saving: boolean;
}

export function PageBuilderToolbar({
  previewMode,
  onPreviewModeChange,
  onPreview,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isPreviewMode,
  onTogglePreviewMode,
  onOpenSettings,
  onOpenStyleGuide,
  isDirty,
  saving,
}: PageBuilderToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Actions */}
        <div className="flex items-center space-x-4">
          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={saving || !isDirty}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isDirty && !saving
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-md ${
                canUndo
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title="Undo"
            >
              <ArrowUturnLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-md ${
                canRedo
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title="Redo"
            >
              <ArrowUturnRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Style Guide */}
          <button
            onClick={onOpenStyleGuide}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            title="Style Guide"
          >
            <PaintBrushIcon className="h-5 w-5" />
          </button>

          {/* Page Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            title="Page Settings"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Center Section - Preview Controls */}
        <div className="flex items-center space-x-4">
          {/* Preview Mode Toggle */}
          <button
            onClick={onTogglePreviewMode}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isPreviewMode
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isPreviewMode ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
            <span>{isPreviewMode ? "Exit Preview" : "Preview"}</span>
          </button>

          {/* Device Preview */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onPreviewModeChange("desktop")}
              className={`p-2 rounded-md transition-colors ${
                previewMode === "desktop"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Desktop Preview"
            >
              <ComputerDesktopIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPreviewModeChange("tablet")}
              className={`p-2 rounded-md transition-colors ${
                previewMode === "tablet"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Tablet Preview"
            >
              <DeviceTabletIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPreviewModeChange("mobile")}
              className={`p-2 rounded-md transition-colors ${
                previewMode === "mobile"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Mobile Preview"
            >
              <DevicePhoneMobileIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right Section - External Actions */}
        <div className="flex items-center space-x-4">
          {/* Preview in New Tab */}
          <button
            onClick={onPreview}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4" />
            <span>Preview</span>
          </button>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                saving
                  ? "bg-yellow-400"
                  : isDirty
                  ? "bg-red-400"
                  : "bg-green-400"
              }`}
            />
            <span className="text-sm text-gray-500">
              {saving ? "Saving..." : isDirty ? "Unsaved" : "Saved"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
