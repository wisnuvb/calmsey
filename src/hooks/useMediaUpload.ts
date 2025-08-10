import { useState, useCallback } from "react";

interface UseMediaUploadOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useMediaUpload(options: UseMediaUploadOptions = {}) {
  const { onSuccess, onError } = options;
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(
    async (files: FileList) => {
      if (!files.length) return;

      setUploading(true);
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      try {
        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          onSuccess?.();
        } else {
          const error = await response.json();
          const errorMessage = error.error || "Failed to upload files";
          onError?.(errorMessage);
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage = "Failed to upload files";
        onError?.(errorMessage);
        alert(errorMessage);
      } finally {
        setUploading(false);
      }
    },
    [onSuccess, onError]
  );

  return {
    uploading,
    uploadFiles,
  };
}
