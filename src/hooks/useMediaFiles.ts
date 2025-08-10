import { useState, useEffect, useCallback } from "react";

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    name: string;
    email: string;
  };
}

interface MediaStats {
  total: number;
  images: number;
  documents: number;
  videos: number;
  audio: number;
  totalSize: number;
}

type FileFilter = "all" | "images" | "documents" | "videos" | "audio";

interface UseMediaFilesOptions {
  initialSearch?: string;
  initialFilter?: FileFilter;
  autoFetch?: boolean;
}

export function useMediaFiles(options: UseMediaFilesOptions = {}) {
  const {
    initialSearch = "",
    initialFilter = "all",
    autoFetch = true,
  } = options;

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<FileFilter>(initialFilter);
  const [stats, setStats] = useState<MediaStats>({
    total: 0,
    images: 0,
    documents: 0,
    videos: 0,
    audio: 0,
    totalSize: 0,
  });

  const fetchMediaFiles = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        filter: filter === "all" ? "" : filter,
      });

      const response = await fetch(`/api/admin/media?${params}`);
      const data = await response.json();

      if (data.success) {
        setMediaFiles(data.data || []);
        setStats(
          data.stats || {
            total: 0,
            images: 0,
            documents: 0,
            videos: 0,
            audio: 0,
            totalSize: 0,
          }
        );
      } else {
        console.error("Failed to fetch media files:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch media files:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filter]); // Remove stats from dependency array

  // Filter files based on type
  const filteredFiles = mediaFiles.filter((file) => {
    if (filter === "images") return file.mimeType.startsWith("image/");
    if (filter === "documents")
      return (
        !file.mimeType.startsWith("image/") &&
        !file.mimeType.startsWith("video/") &&
        !file.mimeType.startsWith("audio/")
      );
    if (filter === "videos") return file.mimeType.startsWith("video/");
    if (filter === "audio") return file.mimeType.startsWith("audio/");
    return true;
  });

  useEffect(() => {
    if (autoFetch) {
      fetchMediaFiles();
    }
  }, [search, filter, autoFetch, fetchMediaFiles]);

  return {
    // Data
    mediaFiles,
    filteredFiles,
    stats,
    loading,

    // Filters
    search,
    setSearch,
    filter,
    setFilter,

    // Actions
    refreshMediaFiles: fetchMediaFiles,
  };
}
