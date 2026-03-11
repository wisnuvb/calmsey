import { useState, useCallback } from "react";

interface UseMediaUploadOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  enableImageCompression?: boolean;
}

export function useMediaUpload(options: UseMediaUploadOptions = {}) {
  const { onSuccess, onError, enableImageCompression = true } = options;
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(
    async (
      files: FileList,
      overrides?: { enableImageCompression?: boolean }
    ) => {
      if (!files.length) return;

      setUploading(true);
      const formData = new FormData();
      const compress =
        overrides?.enableImageCompression ?? enableImageCompression;
      formData.append("enableImageCompression", String(compress));

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
    [onSuccess, onError, enableImageCompression]
  );

  return {
    uploading,
    uploadFiles,
  };
}
