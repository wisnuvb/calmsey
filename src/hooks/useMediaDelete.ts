import { useCallback } from "react";

interface UseMediaDeleteOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useMediaDelete(options: UseMediaDeleteOptions = {}) {
  const { onSuccess, onError } = options;

  const deleteFile = useCallback(
    async (fileId: string, filename: string) => {
      if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

      try {
        const response = await fetch(`/api/admin/media/${fileId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          onSuccess?.();
        } else {
          const error = await response.json();
          const errorMessage = error.error || "Failed to delete file";
          onError?.(errorMessage);
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Delete error:", error);
        const errorMessage = "Failed to delete file";
        onError?.(errorMessage);
        alert(errorMessage);
      }
    },
    [onSuccess, onError]
  );

  const bulkDeleteFiles = useCallback(
    async (fileIds: string[]) => {
      if (fileIds.length === 0) return;

      if (!confirm(`Delete ${fileIds.length} selected files?`)) return;

      try {
        const promises = fileIds.map((fileId) =>
          fetch(`/api/admin/media/${fileId}`, { method: "DELETE" })
        );

        await Promise.all(promises);
        onSuccess?.();
      } catch (error) {
        console.error("Bulk delete error:", error);
        const errorMessage = "Failed to delete some files";
        onError?.(errorMessage);
        alert(errorMessage);
      }
    },
    [onSuccess, onError]
  );

  return {
    deleteFile,
    bulkDeleteFiles,
  };
}
