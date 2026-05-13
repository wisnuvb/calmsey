// Language-related constants (routing memakai tabel `languages` via API + middleware)
// Lihat: `src/lib/dynamic-languages.ts`, `src/lib/middleware-locale-config.ts`

/** Cookie diset middleware + client agar path tanpa prefix bahasa di-rewrite ke locale aktif. */
export const LOCALE_COOKIE_NAME = "ttf-locale";

export type SupportedLanguage = string;

/** Fallback sinkron bila tidak bisa cek DB (prefer `getValidLanguage` async dari `public-api`). */
export const DEFAULT_LANGUAGE = "en";

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
