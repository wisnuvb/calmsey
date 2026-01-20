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

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

type FileFilter = "all" | "images" | "documents" | "videos" | "audio";

interface UseMediaFilesOptions {
  initialSearch?: string;
  initialFilter?: FileFilter;
  autoFetch?: boolean;
  itemsPerPage?: number;
}

export function useMediaFiles(options: UseMediaFilesOptions = {}) {
  const {
    initialSearch = "",
    initialFilter = "all",
    autoFetch = true,
    itemsPerPage = 24,
  } = options;

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<FileFilter>(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: itemsPerPage,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
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
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
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
        // Set pagination info dari response
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        console.error("Failed to fetch media files:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch media files:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filter, currentPage, itemsPerPage]);

  // Handler untuk page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll ke atas saat ganti page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Reset ke page 1 saat search atau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  useEffect(() => {
    if (autoFetch) {
      fetchMediaFiles();
    }
  }, [search, filter, currentPage, autoFetch, fetchMediaFiles]);

  return {
    // Data
    mediaFiles,
    filteredFiles: mediaFiles, // Untuk backward compatibility
    stats,
    loading,
    pagination,

    // Filters
    search,
    setSearch,
    filter,
    setFilter,
    currentPage,
    handlePageChange,

    // Actions
    refreshMediaFiles: fetchMediaFiles,
  };
}
