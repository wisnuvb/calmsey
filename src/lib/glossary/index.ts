export type { GlossaryEntry, GlossaryLocale } from "./types";

export {
  removeGlossaryFromDocument,
  applyGlossaryToDocument,
  scheduleGlossaryReapply,
  stopGlossaryReapply,
} from "./apply-glossary";

export { hasGlossary, getGlossary } from "./registry";
