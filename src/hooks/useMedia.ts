import { useMediaFiles } from "./useMediaFiles";
import { useMediaUpload } from "./useMediaUpload";
import { useMediaSelection } from "./useMediaSelection";
import { useMediaDelete } from "./useMediaDelete";
import { useDragAndDrop } from "./useDragAndDrop";
import { useState } from "react";

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

  const mediaUpload = useMediaUpload({
    onSuccess: () => {
      mediaFiles.refreshMediaFiles();
      setShowUploadModal(false);
    },
  });

  const mediaSelection = useMediaSelection();

  const mediaDelete = useMediaDelete({
    onSuccess: () => {
      mediaFiles.refreshMediaFiles();
      // Remove this line that's causing the infinite loop
      // mediaSelection.removeFromSelection;
    },
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
