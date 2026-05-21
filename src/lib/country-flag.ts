import { emojiToTwemoji72Url } from "@/lib/language-variant-flag";

const REGION_FLAG_EMOJI: Record<string, string> = {
  "region-africa": "🌍",
  "region-asia": "🌏",
  "region-europe": "🇪🇺",
  "region-latin-america": "🌎",
  "region-north-america": "🌎",
  "region-oceania": "🌏",
  "region-antarctica": "🇦🇶",
  other: "🌐",
};

function alpha2ToFlagEmoji(code: string): string | null {
  const c = code.toUpperCase();
  if (c.length !== 2 || !/^[A-Z]{2}$/.test(c)) return null;
  const base = 0x1f1e6;
  return String.fromCodePoint(
    base + (c.charCodeAt(0) - 65),
    base + (c.charCodeAt(1) - 65),
  );
}

/** Emoji bendera untuk opsi negara/wilayah berdasarkan `CountryOption.value`. */
export function getCountryOptionFlagEmoji(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (REGION_FLAG_EMOJI[normalized]) return REGION_FLAG_EMOJI[normalized];
  const flag = alpha2ToFlagEmoji(normalized);
  return flag ?? "🌐";
}

/** URL Twemoji PNG agar bendera konsisten di semua browser/OS. */
export function resolveCountryOptionFlagImgUrl(value: string): string {
  const emoji = getCountryOptionFlagEmoji(value);
  return emojiToTwemoji72Url(emoji) ?? emojiToTwemoji72Url("🌐")!;
}
