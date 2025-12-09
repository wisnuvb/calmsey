/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Delay function for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Get valid image URL with validation and fallback to placeholder
 * @param url - The image URL (can be relative path, absolute URL, or empty)
 * @param placeholder - Optional placeholder URL (default: "/assets/world-map.png")
 * @returns Valid image URL or placeholder if URL is invalid
 */
export function getImageUrl(
  url: string,
  placeholder: string = "/assets/world-map.png"
): string {
  // Handle empty, null, or undefined
  if (!url || url.trim() === "") {
    return placeholder;
  }

  const trimmedUrl = url.trim();

  // If it's already a valid absolute URL (http/https), validate and return
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    try {
      new URL(trimmedUrl);
      return trimmedUrl;
    } catch {
      // Invalid URL format, return placeholder
      return placeholder;
    }
  }

  // If it's a local path (starts with /), return as is
  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl;
  }

  // Try to create a valid URL with https:// prefix
  try {
    const fullUrl = `https://${trimmedUrl}`;
    new URL(fullUrl);
    return fullUrl;
  } catch {
    // Invalid URL, return placeholder
    return placeholder;
  }
}
