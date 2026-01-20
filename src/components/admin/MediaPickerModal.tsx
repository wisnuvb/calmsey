"use client";

import { useState, useEffect, useRef } from "react";
import { useMediaFiles } from "@/hooks/useMediaFiles";
import { useMediaSelection } from "@/hooks/useMediaSelection";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import Image from "next/image";
import {
  X,
  Search,
  Image as ImageIcon,
  File,
  Video,
  Music,
  Plus,
  Upload,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
}

type FileFilter = "all" | "images" | "documents" | "videos" | "audio";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  mode?: "single" | "multiple";
  allowedTypes?: FileFilter[];
  initialFilter?: FileFilter;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  mode = "single",
  allowedTypes = ["all"],
  initialFilter = "all",
}: MediaPickerModalProps) {
  const {
    filteredFiles,
    loading,
    search,
    setSearch,
    filter,
    setFilter,
    refreshMediaFiles,
  } = useMediaFiles({
    initialFilter,
    autoFetch: isOpen,
  });

  const { selectedFiles, toggleFileSelection, clearSelection } =
    useMediaSelection();

  const [localSearch, setLocalSearch] = useState(search);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const uploadModalRef = useRef<HTMLDivElement>(null);

  const { uploading, uploadFiles } = useMediaUpload({
    onSuccess: () => {
      refreshMediaFiles();
      setShowUploadModal(false);
    },
  });

  useEffect(() => {
    if (isOpen) {
      refreshMediaFiles();
      clearSelection();
    }
  }, [isOpen, refreshMediaFiles, clearSelection]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const handleSelect = () => {
    const selectedUrls = filteredFiles
      .filter((file) => selectedFiles.has(file.id))
      .map((file) => file.url);

    onSelect(selectedUrls);
    onClose();
    clearSelection();
  };

  const handleFileClick = (file: MediaFile) => {
    if (mode === "single") {
      onSelect([file.url]);
      onClose();
    } else {
      toggleFileSelection(file.id);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    if (mimeType.startsWith("video/")) return <Video className="w-5 h-5" />;
    if (mimeType.startsWith("audio/")) return <Music className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !showUploadModal
      ) {
        onClose();
      }
      if (
        uploadModalRef.current &&
        !uploadModalRef.current.contains(event.target as Node) &&
        showUploadModal
      ) {
        setShowUploadModal(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, showUploadModal]);

  // Upload modal handlers
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      uploadFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      uploadFiles(files);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select Media</h2>
              <p className="text-sm text-gray-500 mt-1">
                {mode === "single"
                  ? "Click image to select"
                  : "Select one or more files"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add File
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="p-6 border-b space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {allowedTypes.includes("all") && (
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  All
                </button>
              )}
              {allowedTypes.includes("images") && (
                <button
                  onClick={() => setFilter("images")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "images"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Images
                </button>
              )}
              {allowedTypes.includes("documents") && (
                <button
                  onClick={() => setFilter("documents")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "documents"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Documents
                </button>
              )}
              {allowedTypes.includes("videos") && (
                <button
                  onClick={() => setFilter("videos")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "videos"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Videos
                </button>
              )}
              {allowedTypes.includes("audio") && (
                <button
                  onClick={() => setFilter("audio")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "audio"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Audios
                </button>
              )}
            </div>
          </div>

          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading media...</div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                <p>No files found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFiles.has(file.id);
                  const isImage = file.mimeType.startsWith("image/");

                  return (
                    <div
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      className={`relative group cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${isSelected
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-400"
                        }`}
                    >
                      {/* Checkbox for multiple mode */}
                      {mode === "multiple" && (
                        <div className="absolute top-2 right-2 z-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      )}

                      {/* Preview */}
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {isImage ? (
                          <Image
                            src={getImageUrl(file.url)}
                            alt={file.alt || file.originalName}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="text-gray-400">
                            {getFileIcon(file.mimeType)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-2 bg-white">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {mode === "multiple" && selectedFiles.size > 0 && (
                <span>{selectedFiles.size} file selected</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              {mode === "multiple" && (
                <button
                  onClick={handleSelect}
                  disabled={selectedFiles.size === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Select ({selectedFiles.size})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={uploadModalRef}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Upload Media
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                }}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {dragOver ? "Drop files here" : "Upload your files"}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop files here, or click to select files
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Select Files
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
              </div>

              {/* Supported Formats */}
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Supported Formats
                </h5>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    • Images: JPG, PNG, GIF, WebP, SVG
                  </p>
                  <p className="text-sm text-gray-600">
                    • Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
                  </p>
                  <p className="text-sm text-gray-600">
                    • Videos: MP4, WebM, AVI, MOV
                  </p>
                  <p className="text-sm text-gray-600">
                    • Audio: MP3, WAV, OGG, M4A
                  </p>
                </div>
              </div>

              {/* Upload Limits */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <div className="text-sm text-yellow-800">
                    <p>
                      <strong>Upload Limits:</strong>
                    </p>
                    <p>• Maximum file size: 2MB per file</p>
                    <p>• Maximum 10 files per upload</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
