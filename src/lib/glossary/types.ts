export interface GlossaryEntry {
  readonly source: string;
  readonly target: string;
}

export const GLOSSARY_LOCALES = ["es", "fr", "id", "pt"] as const;

export type GlossaryLocale = (typeof GLOSSARY_LOCALES)[number];
