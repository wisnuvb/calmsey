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
  let pageContent: Record<string, string> = {};
  let language = "en";
  try {
    const context = usePageContent();
    pageContent = context.content;
    language = context.language;
  } catch {
    // Not in PageContentProvider, use defaults
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
    language,
    getContentValue,
    getContentJSON,
    getValue,
  };
}
