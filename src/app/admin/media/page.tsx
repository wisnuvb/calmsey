"use client";

import { useState, useRef, useCallback } from "react";
import {
  PhotoIcon,
  DocumentIcon,
  FilmIcon,
  MusicalNoteIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  FolderIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  formatFileSize,
  getFileIcon,
  getFileTypeLabel,
  MediaFile,
} from "@/lib/media";
import { useMedia } from "@/hooks/useMedia";
import { getImageUrl } from "@/lib/utils";

export default function MediaPage() {
  const {
    // Data
    filteredFiles,
    stats,
    loading,
    uploading,

    // State
    search,
    setSearch,
    filter,
    setFilter,
    viewMode,
    setViewMode,
    selectedFiles,
    bulkActionMode,
    setBulkActionMode,
    showUploadModal,
    setShowUploadModal,
    dragOver,

    // Actions
    uploadFiles,
    deleteFile,
    handleBulkDelete,
    toggleFileSelection,
    selectAllFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  } = useMedia();

  const handleSelectAll = useCallback(() => {
    selectAllFiles(filteredFiles.map((file) => file.id));
  }, [selectAllFiles, filteredFiles]);

  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const [dragOver, setDragOver] = useState(false);

  // useEffect(() => {
  //   fetchMediaFiles();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [search, filter]);

  // const fetchMediaFiles = async () => {
  //   try {
  //     const params = new URLSearchParams({
  //       search,
  //       filter: filter === "all" ? "" : filter,
  //     });

  //     const response = await fetch(`/api/admin/media?${params}`);
  //     const data = await response.json();
  //     setMediaFiles(data.data || []);
  //     setStats(data.stats || stats);
  //   } catch (error) {
  //     console.error("Failed to fetch media files:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return "0 Bytes";
  //   const k = 1024;
  //   const sizes = ["Bytes", "KB", "MB", "GB"];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  // };

  // const handleFileUpload = async (files: FileList) => {
  //   if (!files.length) return;

  //   setUploading(true);
  //   const formData = new FormData();

  //   Array.from(files).forEach((file) => {
  //     formData.append("files", file);
  //   });

  //   try {
  //     const response = await fetch("/api/admin/media", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       fetchMediaFiles();
  //       setShowUploadModal(false);
  //     } else {
  //       const error = await response.json();
  //       alert(error.error || "Failed to upload files");
  //     }
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     alert("Failed to upload files");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setDragOver(false);
  //   const files = e.dataTransfer.files;
  //   if (files.length) {
  //     handleFileUpload(files);
  //   }
  // };

  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setDragOver(true);
  // };

  // const handleDragLeave = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setDragOver(false);
  // };

  // const deleteFile = async (fileId: string, filename: string) => {
  //   if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

  //   try {
  //     const response = await fetch(`/api/admin/media/${fileId}`, {
  //       method: "DELETE",
  //     });

  //     if (response.ok) {
  //       fetchMediaFiles();
  //       setSelectedFiles((prev) => {
  //         const newSet = new Set(prev);
  //         newSet.delete(fileId);
  //         return newSet;
  //       });
  //     } else {
  //       const error = await response.json();
  //       alert(error.error || "Failed to delete file");
  //     }
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     alert("Failed to delete file");
  //   }
  // };

  // const bulkDeleteFiles = async () => {
  //   if (selectedFiles.size === 0) return;

  //   if (!confirm(`Delete ${selectedFiles.size} selected files?`)) return;

  //   try {
  //     const promises = Array.from(selectedFiles).map((fileId) =>
  //       fetch(`/api/admin/media/${fileId}`, { method: "DELETE" })
  //     );

  //     await Promise.all(promises);
  //     fetchMediaFiles();
  //     setSelectedFiles(new Set());
  //     setBulkActionMode(false);
  //   } catch (error) {
  //     console.error("Bulk delete error:", error);
  //     alert("Failed to delete some files");
  //   }
  // };

  // const toggleFileSelection = (fileId: string) => {
  //   const newSet = new Set(selectedFiles);
  //   if (newSet.has(fileId)) {
  //     newSet.delete(fileId);
  //   } else {
  //     newSet.add(fileId);
  //   }
  //   setSelectedFiles(newSet);
  // };

  // const selectAllFiles = () => {
  //   if (selectedFiles.size === filteredFiles.length) {
  //     setSelectedFiles(new Set());
  //   } else {
  //     setSelectedFiles(new Set(filteredFiles.map((file) => file.id)));
  //   }
  // };

  // Filter files based on type
  // const filteredFiles = mediaFiles.filter((file) => {
  //   if (filter === "images") return file.mimeType.startsWith("image/");
  //   if (filter === "documents")
  //     return (
  //       !file.mimeType.startsWith("image/") &&
  //       !file.mimeType.startsWith("video/") &&
  //       !file.mimeType.startsWith("audio/")
  //     );
  //   if (filter === "videos") return file.mimeType.startsWith("video/");
  //   if (filter === "audio") return file.mimeType.startsWith("audio/");
  //   return true;
  // });

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Media Library
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload and manage your media files including images, documents,
            videos, and audio.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          {bulkActionMode && selectedFiles.size > 0 && (
            <>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Selected ({selectedFiles.size})
              </button>
              <button
                onClick={() => {
                  setBulkActionMode(false);
                  selectAllFiles(filteredFiles.map((file) => file.id));
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          )}

          {!bulkActionMode && (
            <>
              <button
                onClick={() => setBulkActionMode(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Bulk Actions
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload Media
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Files</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.images}</div>
          <div className="text-sm text-gray-600">Images</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-green-600">
            {stats.documents}
          </div>
          <div className="text-sm text-gray-600">Documents</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-purple-600">
            {stats.videos}
          </div>
          <div className="text-sm text-gray-600">Videos</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-orange-600">
            {stats.audio}
          </div>
          <div className="text-sm text-gray-600">Audio</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-lg font-bold text-gray-900">
            {formatFileSize(stats.totalSize)}
          </div>
          <div className="text-sm text-gray-600">Total Size</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="flex space-x-2">
              {(
                [
                  { key: "all", label: "All Files", icon: FolderIcon },
                  { key: "images", label: "Images", icon: PhotoIcon },
                  { key: "documents", label: "Documents", icon: DocumentIcon },
                  { key: "videos", label: "Videos", icon: FilmIcon },
                  { key: "audio", label: "Audio", icon: MusicalNoteIcon },
                ] as const
              ).map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    filter === filterOption.key
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <filterOption.icon className="h-4 w-4 mr-1" />
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div className="flex justify-end space-x-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Selection Header */}
      {bulkActionMode && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={
                  selectedFiles.size === filteredFiles.length &&
                  filteredFiles.length > 0
                }
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-blue-900">
                Select All ({filteredFiles.length} files)
              </span>
            </div>
            <span className="text-sm text-blue-700">
              {selectedFiles.size} selected
            </span>
          </div>
        </div>
      )}

      {/* Files Grid/List */}
      <div className="mt-6">
        {filteredFiles.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <MediaCard
                  key={file.id}
                  file={file}
                  selected={selectedFiles.has(file.id)}
                  bulkMode={bulkActionMode}
                  onSelect={() => toggleFileSelection(file.id)}
                  onDelete={() => deleteFile(file.id, file.originalName)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {bulkActionMode && (
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedFiles.size === filteredFiles.length &&
                            filteredFiles.length > 0
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <MediaRow
                      key={file.id}
                      file={file}
                      selected={selectedFiles.has(file.id)}
                      bulkMode={bulkActionMode}
                      onSelect={() => toggleFileSelection(file.id)}
                      onDelete={() => deleteFile(file.id, file.originalName)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <PhotoIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search || filter !== "all" ? "No files found" : "No media files"}
            </h3>
            <p className="text-gray-500 mb-6">
              {search || filter !== "all"
                ? "Try adjusting your search or filters."
                : "Upload your first media file to get started."}
            </p>
            {!search && filter === "all" && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload Media
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={uploadFiles}
          uploading={uploading}
        />
      )}

      {/* Drag and Drop Overlay */}
      {dragOver && (
        <div
          className="fixed inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center z-50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="bg-white rounded-lg p-8 text-center">
            <CloudArrowUpIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">
              Drop files here to upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Media Card Component for Grid View
function MediaCard({
  file,
  selected,
  bulkMode,
  onSelect,
  onDelete,
}: {
  file: MediaFile;
  selected: boolean;
  bulkMode: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const FileIcon = getFileIcon(file.mimeType);
  const isImage = file.mimeType.startsWith("image/");

  return (
    <div
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
        selected ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200"
      }`}
    >
      {bulkMode && (
        <div className="mb-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      )}

      <div className="aspect-w-1 aspect-h-1 mb-3 bg-gray-100 rounded-lg overflow-hidden">
        {isImage ? (
          <Image
            src={getImageUrl(file.url)}
            alt={file.alt || file.originalName}
            width={100}
            height={100}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center">
            <FileIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3
          className="text-sm font-medium text-gray-900 truncate"
          title={file.originalName}
        >
          {file.originalName}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{getFileTypeLabel(file.mimeType)}</span>
          <span>{formatFileSize(file.size)}</span>
        </div>

        {!bulkMode && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-1">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                title="View file"
              >
                <EyeIcon className="h-4 w-4" />
              </a>
              <a
                href={file.url}
                download={file.originalName}
                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                title="Download file"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
              </a>
            </div>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
              title="Delete file"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Media Row Component for List View
function MediaRow({
  file,
  selected,
  bulkMode,
  onSelect,
  onDelete,
}: {
  file: MediaFile;
  selected: boolean;
  bulkMode: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const FileIcon = getFileIcon(file.mimeType);
  const isImage = file.mimeType.startsWith("image/");

  return (
    <tr className={selected ? "bg-blue-50" : "hover:bg-gray-50"}>
      {bulkMode && (
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {isImage ? (
              <Image
                src={getImageUrl(file.url)}
                alt={file.alt || file.originalName}
                className="h-10 w-10 rounded object-cover"
                width={40}
                height={40}
              />
            ) : (
              <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                <FileIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {file.originalName}
            </div>
            <div className="text-sm text-gray-500">{file.filename}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {getFileTypeLabel(file.mimeType)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatFileSize(file.size)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>{new Date(file.createdAt).toLocaleDateString()}</div>
        <div className="text-xs text-gray-400">
          by {file.uploadedBy.name || file.uploadedBy.email}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {!bulkMode && (
          <div className="flex items-center space-x-2">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-900"
              title="View file"
            >
              <EyeIcon className="h-4 w-4" />
            </a>
            <a
              href={file.url}
              download={file.originalName}
              className="text-green-600 hover:text-green-900"
              title="Download file"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
            </a>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-900"
              title="Delete file"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

// Upload Modal Component
function UploadModal({
  onClose,
  onUpload,
  uploading,
}: {
  onClose: () => void;
  onUpload: (files: FileList) => void;
  uploading: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      onUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onUpload(files);
    }
  };

  const supportedFormats = [
    "Images: JPG, PNG, GIF, WebP, SVG",
    "Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT",
    "Videos: MP4, WebM, AVI, MOV",
    "Audio: MP3, WAV, OGG, M4A",
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Upload Media</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
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
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                  <PlusIcon className="h-4 w-4 mr-2" />
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
              {supportedFormats.map((format, index) => (
                <p key={index} className="text-sm text-gray-600">
                  • {format}
                </p>
              ))}
            </div>
          </div>

          {/* Upload Limits */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <div className="text-sm text-yellow-800">
                <p>
                  <strong>Upload Limits:</strong>
                </p>
                <p>• Maximum file size: 10MB per file</p>
                <p>• Maximum 10 files per upload</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
