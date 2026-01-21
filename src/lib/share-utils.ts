/**
 * Share utilities for sharing content across different platforms
 */

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export interface ShareOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  fallbackToCopy?: boolean;
}

/**
 * Share content using Web Share API or fallback to clipboard
 * @param data - Data to share (title, text, url)
 * @param options - Optional callbacks and settings
 * @returns Promise<boolean> - true if shared successfully, false if user cancelled
 */
export async function shareContent(
  data: ShareData,
  options?: ShareOptions
): Promise<boolean> {
  const { onSuccess, onError, fallbackToCopy = true } = options || {};

  try {
    // Check if Web Share API is available
    if (navigator.share && navigator.canShare?.(data)) {
      await navigator.share(data);
      onSuccess?.();
      return true;
    } else if (fallbackToCopy && data.url) {
      // Fallback: Copy URL to clipboard
      await navigator.clipboard.writeText(data.url);
      onSuccess?.();
      return true;
    } else {
      throw new Error("Share API not available and no fallback URL provided");
    }
  } catch (error) {
    // If user cancels, don't treat as error
    if (error instanceof Error && error.name === "AbortError") {
      return false;
    }

    // Try clipboard fallback on error
    if (fallbackToCopy && data.url) {
      try {
        await navigator.clipboard.writeText(data.url);
        onSuccess?.();
        return true;
      } catch (clipboardError) {
        onError?.(
          clipboardError instanceof Error
            ? clipboardError
            : new Error("Failed to copy to clipboard")
        );
        return false;
      }
    }

    onError?.(
      error instanceof Error ? error : new Error("Failed to share content")
    );
    return false;
  }
}

/**
 * Share current page
 * @param options - Optional callbacks and settings
 * @returns Promise<boolean> - true if shared successfully
 */
export async function shareCurrentPage(
  options?: ShareOptions
): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  const data: ShareData = {
    title: document.title,
    url: window.location.href,
  };

  // Try to get meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    data.text = metaDescription.getAttribute("content") || undefined;
  }

  return shareContent(data, options);
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise<boolean> - true if copied successfully
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Check if Web Share API is supported
 * @returns boolean
 */
export function isShareSupported(): boolean {
  return typeof navigator !== "undefined" && "share" in navigator;
}

/**
 * Check if clipboard API is supported
 * @returns boolean
 */
export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "clipboard" in navigator &&
    "writeText" in navigator.clipboard
  );
}
