import { useState, useCallback } from "react";

interface UseDragAndDropOptions {
  onDrop?: (files: FileList) => void;
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}) {
  const { onDrop } = options;
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length && onDrop) {
        onDrop(files);
      }
    },
    [onDrop]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  return {
    dragOver,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  };
}
