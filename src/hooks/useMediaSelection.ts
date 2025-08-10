import { useState, useCallback } from "react";

export function useMediaSelection() {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);

  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  }, []);

  const selectAllFiles = useCallback(
    (fileIds: string[]) => {
      if (selectedFiles.size === fileIds.length) {
        setSelectedFiles(new Set());
      } else {
        setSelectedFiles(new Set(fileIds));
      }
    },
    [selectedFiles.size]
  );

  const clearSelection = useCallback(() => {
    setSelectedFiles(new Set());
    setBulkActionMode(false);
  }, []);

  const removeFromSelection = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
  }, []);

  return {
    selectedFiles,
    bulkActionMode,
    setBulkActionMode,
    toggleFileSelection,
    selectAllFiles,
    clearSelection,
    removeFromSelection,
    selectedCount: selectedFiles.size,
  };
}
