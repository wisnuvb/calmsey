// Language constants for middleware and public API
export const SUPPORTED_LANGUAGES = ["en", "id"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

// Language detection and validation
export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function getValidLanguage(lang?: string): SupportedLanguage {
  if (lang && isValidLanguage(lang)) {
    return lang;
  }
  return DEFAULT_LANGUAGE;
}
