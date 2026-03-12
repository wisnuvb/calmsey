import { useState, useEffect, useCallback, useRef } from "react";

const SEARCH_DEBOUNCE_MS = 300;

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
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<FileFilter>(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const hasLoadedOnce = useRef(false);
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
      // Only show full-page loading on initial load so search input doesn't unmount on refetch
      if (!hasLoadedOnce.current) {
        setLoading(true);
      }
      const params = new URLSearchParams({
        search: debouncedSearch,
        filter: filter === "all" ? "" : filter,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      const response = await fetch(`/api/admin/media?${params}`);
      const data = await response.json();

      if (data.success) {
        hasLoadedOnce.current = true;
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
  }, [debouncedSearch, filter, currentPage, itemsPerPage]);

  // Debounce search so API isn't called on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  // Handler untuk page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll ke atas saat ganti page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Reset to page 1 when user changes search (input) or filter
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  useEffect(() => {
    if (autoFetch) {
      fetchMediaFiles();
    }
  }, [debouncedSearch, filter, currentPage, autoFetch, fetchMediaFiles]);

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
