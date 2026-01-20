import { usePageContent } from "@/contexts/PageContentContext";

/**
 * Custom hook untuk helper functions yang sering digunakan
 * untuk mengakses page content dengan fallback ke props/default
 * 
 * Pattern yang digunakan:
 * - getContentValue: Ambil value dari context
 * - getContentJSON: Ambil dan parse JSON dari context
 * - getValue: Priority: context > propValue > defaultValue
 */
export function usePageContentHelpers() {
  // Try to get content from context, fallback to empty object if not available
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

  /**
   * Helper to get value from content
   */
  const getContentValue = (key: string, defaultValue: string = ""): string => {
    return pageContent[key] || defaultValue;
  };

  /**
   * Helper to get JSON value from content
   */
  const getContentJSON = <T,>(key: string, defaultValue: T): T => {
    const value = pageContent[key];
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  };

  /**
   * Helper function to get value with priority: context > propValue > defaultValue
   */
  const getValue = (
    contentKey: string,
    propValue?: string,
    defaultValue: string = ""
  ): string => {
    const contentValue = getContentValue(contentKey, "");
    if (contentValue && contentValue.trim() !== "") {
      return contentValue;
    }
    if (propValue && propValue.trim() !== "") {
      return propValue;
    }
    return defaultValue;
  };

  return {
    pageContent,
    getContentValue,
    getContentJSON,
    getValue,
  };
}
