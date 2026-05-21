/**
 * Bendera varian bahasa untuk UI unduhan: sumber utama kolom `languages.flag`
 * (emoji atau URL), dengan fallback Twemoji PNG agar konsisten di browser yang
 * tidak merender regional indicator sebagai bendera (mis. tampil "GB").
 */

export type ActiveLanguageLike = {
  id: string;
  name: string;
  flag: string | null;
};

const ENGLISH_REGIONAL_FLAGS = new Set(["🇺🇸", "🇬🇧", "EN", "GB", "US"]);

/** Bendera UK untuk picker unduhan (Twemoji PNG — bukan teks "GB"). */
export const ENGLISH_VARIANT_FLAG_EMOJI = "🇬🇧";

/** Kode dua huruf untuk UI (en → EN, bukan GB dari emoji 🇬🇧). */
export function getLanguageDisplayCode(languageId: string): string {
  return languageId.trim().toUpperCase();
}

function isRegionalIndicatorEmoji(value: string): boolean {
  const trimmed = value.trim();
  const cps: number[] = [];
  for (let i = 0; i < trimmed.length; ) {
    const cp = trimmed.codePointAt(i)!;
    cps.push(cp);
    i += cp > 0xffff ? 2 : 1;
  }
  if (cps.length !== 2) return false;
  return cps.every((cp) => cp >= 0x1f1e6 && cp <= 0x1f1ff);
}

/** True bila emoji bendera akan tampil sebagai huruf (mis. 🇬🇧 → "GB") di OS lama. */
export function languageFlagRendersAsLetters(
  languageId: string,
  flag: string | null | undefined,
): boolean {
  const normalized = flag?.trim();
  if (!normalized) return languageId === "en";
  if (languageId === "en" && ENGLISH_REGIONAL_FLAGS.has(normalized)) {
    return true;
  }
  return isRegionalIndicatorEmoji(normalized);
}

/**
 * English never uses 🇬🇧/🇺🇸 in stored flag — those render as "GB"/"US" on some devices.
 * UI should use {@link getLanguageDisplayCode} ("EN") instead.
 */
export function normalizeLanguageFlag(
  languageId: string,
  flag: string | null | undefined,
): string | null {
  const trimmed = flag?.trim();
  if (languageId === "en") {
    if (
      !trimmed ||
      ENGLISH_REGIONAL_FLAGS.has(trimmed) ||
      isRegionalIndicatorEmoji(trimmed)
    ) {
      return null;
    }
    return trimmed;
  }
  return trimmed ?? null;
}

/** Emoji bendera dari label bahasa (heuristik bila tidak ada baris DB). */
export function languageLabelToFlag(label: string): string {
  const l = label.trim().toLowerCase();
  if (/^(english|en)(\b|\s|$)/.test(l) || l === "en") return ENGLISH_VARIANT_FLAG_EMOJI;
  if (/español|spanish|^es(\b|\s|$)/.test(l)) return "🇪🇸";
  if (/indonesia|indonesian|bahasa(\s|-)?indonesia|^id(\b|\s|$)/.test(l))
    return "🇮🇩";
  if (/français|french|^fr(\b|\s|$)/.test(l)) return "🇫🇷";
  if (/chinese|中文|mandarin|中文（|简体|繁体|^zh(\b|\s|$)/.test(l)) return "🇨🇳";
  if (/deutsch|german|^de(\b|\s|$)/.test(l)) return "🇩🇪";
  if (/português|portuguese|^pt(\b|\s|$)/.test(l)) return "🇵🇹";
  if (/日本語|japanese|^ja(\b|\s|$)/.test(l)) return "🇯🇵";
  return "🌐";
}

function iso3166Alpha2ToRegionalEmoji(alpha2: string): string | null {
  const c = alpha2.toUpperCase();
  if (c.length !== 2 || !/^[A-Z]{2}$/.test(c)) return null;
  const base = 0x1f1e6;
  return String.fromCodePoint(
    base + (c.charCodeAt(0) - 65),
    base + (c.charCodeAt(1) - 65),
  );
}

/** Twemoji PNG (72px) untuk satu atau beberapa codepoint emoji. */
export function emojiToTwemoji72Url(emoji: string): string | null {
  const trimmed = emoji.trim();
  if (!trimmed) return null;
  const parts: string[] = [];
  for (let i = 0; i < trimmed.length; ) {
    const cp = trimmed.codePointAt(i);
    if (cp === undefined) break;
    parts.push(cp.toString(16));
    i += cp > 0xffff ? 2 : 1;
  }
  if (parts.length === 0) return null;
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/72x72/${parts.join("-")}.png`;
}

export function getEnglishVariantFlagImgUrl(): string {
  return emojiToTwemoji72Url(ENGLISH_VARIANT_FLAG_EMOJI)!;
}

/**
 * URL gambar bendera untuk picker: prioritas `languages.flag` (URL atau emoji),
 * lalu kode wilayah dua huruf pada label, lalu heuristik nama bahasa.
 */
export function resolveLanguageVariantFlagImgUrl(
  languages: readonly ActiveLanguageLike[],
  opt: { label: string; languageId?: string },
): string {
  const rawLabel = opt.label.trim();
  const idFromOpt = opt.languageId?.trim().toLowerCase();

  const lang =
    (idFromOpt && languages.find((l) => l.id === idFromOpt)) ||
    languages.find((l) => l.id === rawLabel.toLowerCase()) ||
    languages.find((l) => l.name.toLowerCase() === rawLabel.toLowerCase());

  if (idFromOpt === "en" || lang?.id === "en") {
    return getEnglishVariantFlagImgUrl();
  }

  const flagField = lang
    ? normalizeLanguageFlag(lang.id, lang.flag)
    : null;

  if (flagField?.startsWith("http")) {
    return flagField;
  }

  if (flagField && /[^\u0000-\u007f]/.test(flagField)) {
    const u = emojiToTwemoji72Url(flagField);
    if (u) return u;
  }

  if (/^[a-z]{2}$/i.test(rawLabel)) {
    const reg = iso3166Alpha2ToRegionalEmoji(rawLabel);
    if (reg) {
      const u = emojiToTwemoji72Url(reg);
      if (u) return u;
    }
  }

  const fallbackEmoji = languageLabelToFlag(rawLabel);
  const u = emojiToTwemoji72Url(fallbackEmoji);
  if (u) return u;
  return emojiToTwemoji72Url("🌐")!;
}
