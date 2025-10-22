// Language constants for middleware and public API
// Note: These are legacy constants. Use dynamic-languages.ts for database-driven languages

// Legacy constants for backward compatibility
export const SUPPORTED_LANGUAGES = ["en", "id"] as const;
export type SupportedLanguage = string; // Changed to string to support dynamic languages
export const DEFAULT_LANGUAGE = "en"; // Fallback default

// Legacy function for backward compatibility
export function isValidLanguage(lang: string): boolean {
  // This is now a synchronous fallback - use dynamic-languages.ts for full functionality
  return ["en", "id"].includes(lang);
}

export function getValidLanguage(lang?: string): SupportedLanguage {
  if (lang && isValidLanguage(lang)) {
    return lang;
  }
  return DEFAULT_LANGUAGE;
}
