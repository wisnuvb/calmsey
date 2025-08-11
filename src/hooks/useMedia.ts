import { useMediaFiles } from "./useMediaFiles";
import { useMediaUpload } from "./useMediaUpload";
import { useMediaSelection } from "./useMediaSelection";
import { useMediaDelete } from "./useMediaDelete";
import { useDragAndDrop } from "./useDragAndDrop";
import { useState, useCallback } from "react";

type ViewMode = "grid" | "list";

interface UseMediaOptions {
  initialSearch?: string;
  initialFilter?: "all" | "images" | "documents" | "videos" | "audio";
  initialViewMode?: ViewMode;
  autoFetch?: boolean;
}

export function useMedia(options: UseMediaOptions = {}) {
  const {
    initialSearch = "",
    initialFilter = "all",
    initialViewMode = "grid",
    autoFetch = true,
  } = options;

  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Initialize all hooks
  const mediaFiles = useMediaFiles({
    initialSearch,
    initialFilter,
    autoFetch,
  });

  // Wrap callbacks with useCallback
  const handleUploadSuccess = useCallback(() => {
    mediaFiles.refreshMediaFiles();
    setShowUploadModal(false);
  }, [mediaFiles]);

  const handleDeleteSuccess = useCallback(() => {
    mediaFiles.refreshMediaFiles();
  }, [mediaFiles]);

  const mediaUpload = useMediaUpload({
    onSuccess: handleUploadSuccess,
  });

  const mediaSelection = useMediaSelection();

  const mediaDelete = useMediaDelete({
    onSuccess: handleDeleteSuccess,
  });

  const dragAndDrop = useDragAndDrop({
    onDrop: mediaUpload.uploadFiles,
  });

  // Bulk delete with selected files
  const handleBulkDelete = () => {
    mediaDelete.bulkDeleteFiles(Array.from(mediaSelection.selectedFiles));
    mediaSelection.clearSelection();
  };

  return {
    // Data and state
    ...mediaFiles,
    ...mediaUpload,
    ...mediaSelection,
    ...mediaDelete,
    viewMode,
    setViewMode,
    showUploadModal,
    setShowUploadModal,

    // Actions
    handleBulkDelete,
    ...dragAndDrop,
  };
}
