import { isEnglishLanguageLabel } from "@/lib/download-language-order";

export type DownloadLanguageRow = {
  id: string;
  name: string;
};

/**
 * Kapital di awal kata, sisanya huruf kecil (mis. "Bahasa Indonesia", "English").
 */
export function formatDownloadLanguageLabel(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return trimmed;

  return trimmed.replace(/[a-zA-ZÀ-ÿ]+/g, (word) => {
    if (word.length <= 1) return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

/** Nama tampilan standar di semua modal unduhan (mengalahkan label CMS / nama DB yang tidak konsisten). */
const DOWNLOAD_LANGUAGE_CANONICAL: Record<string, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  zh: "Chinese",
  hi: "Hindi",
  es: "Spanish",
  ar: "Arabic",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  fr: "French",
  de: "German",
  ko: "Korean",
  tr: "Turkish",
  it: "Italian",
  th: "Thai",
  vi: "Vietnamese",
  pl: "Polish",
  nl: "Dutch",
  uk: "Ukrainian",
  fa: "Persian",
  ms: "Malay",
  tl: "Filipino",
};

/** Tebak kode bahasa dari label bebas (CMS legacy). */
export function inferLanguageIdFromLabel(label: string): string | undefined {
  const l = label.trim().toLowerCase();
  if (!l) return undefined;

  if (isEnglishLanguageLabel(label)) return "en";

  if (
    l === "id" ||
    /^indonesia(n)?$/.test(l) ||
    /^bahasa\s+indonesia(n)?$/.test(l)
  ) {
    return "id";
  }

  if (/^chinese|mandarin|中文|^zh(\b|[-(]|$)/.test(l)) return "zh";
  if (/^hindi|^hi(\b|[-(]|$)/.test(l)) return "hi";
  if (/^spanish|español|^es(\b|[-(]|$)/.test(l)) return "es";
  if (/^arabic|^ar(\b|[-(]|$)/.test(l)) return "ar";
  if (/^português|portuguese|^pt(\b|[-(]|$)/.test(l)) return "pt";
  if (/^russian|^ru(\b|[-(]|$)/.test(l)) return "ru";
  if (/^japanese|日本語|^ja(\b|[-(]|$)/.test(l)) return "ja";
  if (/^french|français|^fr(\b|[-(]|$)/.test(l)) return "fr";
  if (/^german|deutsch|^de(\b|[-(]|$)/.test(l)) return "de";
  if (/^korean|^ko(\b|[-(]|$)/.test(l)) return "ko";

  const twoLetter = l.match(/^([a-z]{2})(?:[-_][a-z]{2})?$/);
  if (twoLetter) return twoLetter[1];

  return undefined;
}

function baseLanguageCode(code: string): string {
  return code.trim().toLowerCase().split(/[-_]/)[0] ?? "";
}

function nameFromActiveLanguages(
  code: string,
  languages: readonly DownloadLanguageRow[],
): string | undefined {
  const base = baseLanguageCode(code);
  const lang =
    languages.find((l) => l.id === code.trim().toLowerCase()) ??
    languages.find((l) => l.id === base);
  return lang?.name;
}

/**
 * Satu label untuk semua modal unduhan: kode bahasa → nama kanonik / DB → CMS → format.
 */
export function resolveDownloadLanguageLabel(
  languageIdOrLabel: string,
  languages: readonly DownloadLanguageRow[] = [],
  cmsLabel?: string,
): string {
  const raw = languageIdOrLabel.trim();
  const cms = cmsLabel?.trim();
  const inferredFromCms = cms ? inferLanguageIdFromLabel(cms) : undefined;
  const inferredFromRaw = inferLanguageIdFromLabel(raw);

  let code = "";
  if (/^[a-z]{2}([-_][a-z]{2})?$/i.test(raw)) {
    code = baseLanguageCode(raw);
  } else if (inferredFromRaw) {
    code = inferredFromRaw;
  } else if (inferredFromCms) {
    code = inferredFromCms;
  }

  const base = code ? baseLanguageCode(code) : "";

  if (base && DOWNLOAD_LANGUAGE_CANONICAL[base]) {
    return DOWNLOAD_LANGUAGE_CANONICAL[base];
  }

  const dbName = code ? nameFromActiveLanguages(code, languages) : undefined;
  if (dbName) {
    if (base === "id" && /^indonesia$/i.test(dbName.trim())) {
      return DOWNLOAD_LANGUAGE_CANONICAL.id;
    }
    return formatDownloadLanguageLabel(dbName);
  }

  if (cms) return formatDownloadLanguageLabel(cms);
  if (raw) return formatDownloadLanguageLabel(raw);

  return "";
}

/** Resolver untuk `Strategy2030DownloadLeadModal` / Grantmaking (`getLanguageName`). */
export function createDownloadLanguageNameResolver(
  languages: readonly DownloadLanguageRow[],
): (langCode: string) => string {
  return (langCode: string) =>
    resolveDownloadLanguageLabel(langCode, languages);
}

/** Normalisasi opsi bahasa dari CMS (Where We Work, dll.). */
export function normalizeDownloadLanguageOption<
  T extends { label: string; languageId?: string },
>(option: T, languages: readonly DownloadLanguageRow[]): T {
  const languageId =
    option.languageId?.trim().toLowerCase() ||
    inferLanguageIdFromLabel(option.label);

  return {
    ...option,
    languageId,
    label: resolveDownloadLanguageLabel(
      languageId ?? option.label,
      languages,
      option.label,
    ),
  };
}
