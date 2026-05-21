import { GLOSSARY_ES } from "./data/es";
import { GLOSSARY_FR } from "./data/fr";
import { GLOSSARY_ID } from "./data/id";
import { GLOSSARY_PT } from "./data/pt";
import type { GlossaryEntry } from "./types";
import { GLOSSARY_LOCALES } from "./types";

const REGISTRY: Record<string, readonly GlossaryEntry[]> = {
  es: GLOSSARY_ES,
  fr: GLOSSARY_FR,
  id: GLOSSARY_ID,
  pt: GLOSSARY_PT,
};

export function hasGlossary(locale: string): boolean {
  return GLOSSARY_LOCALES.includes(locale as (typeof GLOSSARY_LOCALES)[number]);
}

export function getGlossary(locale: string): readonly GlossaryEntry[] {
  return REGISTRY[locale] ?? [];
}
