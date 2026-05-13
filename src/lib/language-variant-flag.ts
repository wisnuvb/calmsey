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

/** Emoji bendera dari label bahasa (heuristik bila tidak ada baris DB). */
export function languageLabelToFlag(label: string): string {
  const l = label.trim().toLowerCase();
  if (/^(english|en)(\b|\s|$)/.test(l) || l === "en") return "🇬🇧";
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

  const flagField = lang?.flag?.trim();
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
