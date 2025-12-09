import { useState, useCallback } from "react";

/**
 * Custom hook to handle image loading errors and prevent infinite loops
 * @returns Object with imageError state and handleError function
 */
export function useImageError() {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleError = useCallback((imageId: string) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  }, []);

  const hasError = useCallback(
    (imageId: string) => {
      return imageErrors.has(imageId);
    },
    [imageErrors]
  );

  return {
    imageErrors,
    handleError,
    hasError,
  };
}
