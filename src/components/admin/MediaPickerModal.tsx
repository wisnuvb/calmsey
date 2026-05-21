"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMediaFiles } from "@/hooks/useMediaFiles";
import { useMediaSelection } from "@/hooks/useMediaSelection";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import Image from "next/image";
import {
  X,
  Image as ImageIcon,
  File,
  Video,
  Music,
  Plus,
  Upload,
  Search,
  FolderOpen,
  LayoutGrid,
  List,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { formatFileSize, getFileTypeLabel } from "@/lib/media";
import { Pagination } from "@/components/common/Pagination";

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  createdAt?: string;
}

function getMediaDisplayName(file: MediaFile): string {
  const original = (file.originalName || "").trim();
  if (original) return original;
  const stored = (file.filename || "").trim();
  if (stored) return stored;
  const shortId = file.id.length > 12 ? `${file.id.slice(0, 8)}…` : file.id;
  return `${shortId} (${file.mimeType || "file"})`;
}

type FileFilter = "all" | "images" | "documents" | "videos" | "audio";

const FILTER_OPTIONS: {
  key: FileFilter;
  label: string;
  icon: typeof FolderOpen;
}[] = [
  { key: "all", label: "All Files", icon: FolderOpen },
  { key: "images", label: "Images", icon: ImageIcon },
  { key: "documents", label: "Documents", icon: File },
  { key: "videos", label: "Videos", icon: Video },
  { key: "audio", label: "Audio", icon: Music },
];

type ViewMode = "grid" | "list";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  mode?: "single" | "multiple";
  allowedTypes?: FileFilter[];
  initialFilter?: FileFilter;
  /** Tailwind z-index class when opened above other modals (default `z-50`). */
  overlayClassName?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  mode = "single",
  allowedTypes,
  initialFilter = "all",
  overlayClassName = "z-50",
}: MediaPickerModalProps) {
  const visibleFilters = FILTER_OPTIONS.filter((opt) => {
    if (!allowedTypes || allowedTypes.length === 0) return true;
    if (allowedTypes.includes("all")) return true;
    return allowedTypes.includes(opt.key);
  });

  const resolvedInitialFilter =
    visibleFilters.some((o) => o.key === initialFilter)
      ? initialFilter
      : (visibleFilters[0]?.key ?? "all");

  const {
    filteredFiles,
    loading,
    search,
    setSearch,
    filter,
    setFilter,
    stats,
    refreshMediaFiles,
    pagination,
    handlePageChange,
    resetPage,
  } = useMediaFiles({
    initialFilter: resolvedInitialFilter,
    autoFetch: isOpen,
    scrollTopOnPageChange: false,
    itemsPerPage: 24,
  });

  const { selectedFiles, toggleFileSelection, clearSelection } =
    useMediaSelection();

  const [multiSelectUrls, setMultiSelectUrls] = useState<Map<string, string>>(
    () => new Map(),
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const modalRef = useRef<HTMLDivElement>(null);
  const uploadModalRef = useRef<HTMLDivElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  const { uploading, uploadFiles } = useMediaUpload({
    onSuccess: () => {
      refreshMediaFiles();
      setShowUploadModal(false);
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    setFilter(resolvedInitialFilter);
    setSearch("");
    setViewMode("grid");
    resetPage();
    clearSelection();
    setMultiSelectUrls(new Map());
  }, [
    isOpen,
    resolvedInitialFilter,
    setFilter,
    setSearch,
    resetPage,
    clearSelection,
  ]);

  const handleFilterChange = (next: FileFilter) => {
    setFilter(next);
    resetPage();
    gridScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = useCallback(() => {
    clearSelection();
    setMultiSelectUrls(new Map());
    onClose();
  }, [clearSelection, onClose]);

  const handleSelect = () => {
    const selectedUrls = Array.from(multiSelectUrls.values());
    onSelect(selectedUrls);
    handleClose();
  };

  const handlePageChangeInModal = (page: number) => {
    handlePageChange(page);
    gridScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileClick = (file: MediaFile) => {
    if (mode === "single") {
      onSelect([file.url]);
      handleClose();
    } else {
      toggleFileSelection(file.id);
      setMultiSelectUrls((prev) => {
        const next = new Map(prev);
        if (next.has(file.id)) next.delete(file.id);
        else next.set(file.id, file.url);
        return next;
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    if (mimeType.startsWith("video/")) return <Video className="w-5 h-5" />;
    if (mimeType.startsWith("audio/")) return <Music className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !showUploadModal
      ) {
        handleClose();
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
  }, [isOpen, handleClose, showUploadModal]);

  // Upload modal handlers
  const [dragOver, setDragOver] = useState(false);
  const [enableImageCompression, setEnableImageCompression] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      uploadFiles(files, { enableImageCompression });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      uploadFiles(files, { enableImageCompression });
    }
  };

  const formatUploadedDate = (iso?: string) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const renderFilePreview = (file: MediaFile, compact = false) => {
    const isImage = file.mimeType.startsWith("image/");
    const boxClass = compact
      ? "h-10 w-10 shrink-0"
      : "aspect-square w-full";

    if (isImage) {
      return (
        <div
          className={`${boxClass} overflow-hidden rounded bg-gray-100 flex items-center justify-center`}
        >
          <Image
            src={getImageUrl(file.url)}
            alt={file.alt || getMediaDisplayName(file)}
            width={compact ? 40 : 200}
            height={compact ? 40 : 200}
            className={
              compact
                ? "h-full w-full object-cover"
                : "h-full w-full object-cover"
            }
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      );
    }

    return (
      <div
        className={`${boxClass} flex items-center justify-center rounded bg-gray-100 text-gray-400`}
      >
        {getFileIcon(file.mimeType)}
      </div>
    );
  };

  const isFileSelected = (fileId: string) =>
    mode === "multiple"
      ? multiSelectUrls.has(fileId)
      : selectedFiles.has(fileId);

  if (!isOpen) return null;

  const uploadOverlayClassName =
    overlayClassName === "z-50" ? "z-[60]" : "z-[260]";

  return (
    <>
      <div
        className={`fixed inset-0 ${overlayClassName} flex items-center justify-center bg-black bg-opacity-50`}
      >
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
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Stats summary */}
          {stats.total > 0 ? (
            <div className="grid grid-cols-2 gap-2 border-b bg-white px-6 py-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: "Total Files", value: stats.total, className: "text-gray-900" },
                { label: "Images", value: stats.images, className: "text-blue-600" },
                { label: "Documents", value: stats.documents, className: "text-green-600" },
                { label: "Videos", value: stats.videos, className: "text-purple-600" },
                { label: "Audio", value: stats.audio, className: "text-orange-600" },
                {
                  label: "Total Size",
                  value: formatFileSize(stats.totalSize),
                  className: "text-gray-900",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <div className={`text-lg font-bold leading-tight ${item.className}`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Search, filters & view mode — same layout as Media Library */}
          <div className="border-b bg-white px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                <div className="relative w-full min-w-[200px] sm:w-64 shrink-0">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search files..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Search files"
                  />
                  {loading && filteredFiles.length > 0 ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      Searching…
                    </span>
                  ) : null}
                </div>

                {visibleFilters.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {visibleFilters.map((filterOption) => {
                      const Icon = filterOption.icon;
                      const isActive = filter === filterOption.key;
                      return (
                        <button
                          key={filterOption.key}
                          type="button"
                          onClick={() => handleFilterChange(filterOption.key)}
                          className={`inline-flex items-center whitespace-nowrap rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? "border-blue-300 bg-blue-100 text-blue-700"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="mr-1.5 h-4 w-4" />
                          {filterOption.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 justify-end space-x-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Media grid / list + pagination */}
          <div className="flex-1 flex flex-col min-h-0">
            <div ref={gridScrollRef} className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading media...</div>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                  <p>
                    {search.trim() || filter !== "all"
                      ? "No files match your search or filters"
                      : "No files found"}
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredFiles.map((file) => {
                    const isSelected = isFileSelected(file.id);

                    return (
                      <div
                        key={file.id}
                        onClick={() => handleFileClick(file)}
                        className={`relative group cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                          isSelected
                            ? "border-blue-600 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        {mode === "multiple" && (
                          <div className="absolute top-2 right-2 z-10">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                        )}

                        {renderFilePreview(file)}

                        <div className="bg-white p-2">
                          <p
                            className="truncate text-xs font-medium text-gray-900"
                            title={getMediaDisplayName(file)}
                          >
                            {getMediaDisplayName(file)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getFileTypeLabel(file.mimeType)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>

                        <div className="absolute inset-0 bg-blue-600 bg-opacity-0 transition-all group-hover:bg-opacity-10" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {mode === "multiple" ? (
                          <th className="w-10 px-4 py-3" aria-label="Select" />
                        ) : null}
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          File
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Size
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Uploaded
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredFiles.map((file) => {
                        const isSelected = isFileSelected(file.id);
                        return (
                          <tr
                            key={file.id}
                            onClick={() => handleFileClick(file)}
                            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                              isSelected ? "bg-blue-50" : ""
                            }`}
                          >
                            {mode === "multiple" ? (
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                            ) : null}
                            <td className="px-4 py-3">
                              <div className="flex min-w-0 items-center gap-3">
                                {renderFilePreview(file, true)}
                                <span
                                  className="truncate text-sm font-medium text-gray-900"
                                  title={getMediaDisplayName(file)}
                                >
                                  {getMediaDisplayName(file)}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                              {getFileTypeLabel(file.mimeType)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                              {formatFileSize(file.size)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                              {formatUploadedDate(file.createdAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-gray-50 p-6">
            <div className="space-y-2">
              {!loading && pagination.totalCount > 0 ? (
                <>
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.totalCount,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{pagination.totalCount}</span>{" "}
                    results
                  </p>
                  {pagination.totalPages > 1 ? (
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChangeInModal}
                    />
                  ) : null}
                </>
              ) : null}
              {mode === "multiple" && multiSelectUrls.size > 0 ? (
                <p className="text-sm text-gray-600">
                  {multiSelectUrls.size} file selected
                </p>
              ) : null}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              {mode === "multiple" && (
                <button
                  type="button"
                  onClick={handleSelect}
                  disabled={multiSelectUrls.size === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Select ({multiSelectUrls.size})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className={`fixed inset-0 ${uploadOverlayClassName} flex items-center justify-center bg-black bg-opacity-50`}
        >
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
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver
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

              {/* Compress Images Option */}
              <div className="mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableImageCompression}
                    onChange={(e) =>
                      setEnableImageCompression(e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Compress images on upload (smaller file size, recommended)
                  </span>
                </label>
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
