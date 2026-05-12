/** `en`, `EN`, or BCP47 prefixes like `en-US`. */
export function isEnglishLanguageCode(code: string): boolean {
  const c = code.trim().toLowerCase();
  return c === "en" || c.startsWith("en-");
}

/** Labels such as "English", "English (US)", or leading "en ". */
export function isEnglishLanguageLabel(label: string): boolean {
  const l = label.trim().toLowerCase();
  return (
    l === "en" ||
    /^(english|en)(\b|[\s(-]|$)/.test(l)
  );
}

/** English (`en` / `en-*`) first; other entries keep their relative order. */
export function orderDownloadFilesEnglishFirst<T extends { language: string }>(
  files: T[],
): T[] {
  const en: T[] = [];
  const rest: T[] = [];
  for (const f of files) {
    if (isEnglishLanguageCode(f.language)) en.push(f);
    else rest.push(f);
  }
  return [...en, ...rest];
}

/** English-labelled options first; others keep their relative order. */
export function orderLanguageLabelsEnglishFirst<T extends { label: string }>(
  options: T[],
): T[] {
  const en: T[] = [];
  const rest: T[] = [];
  for (const o of options) {
    if (isEnglishLanguageLabel(o.label)) en.push(o);
    else rest.push(o);
  }
  return [...en, ...rest];
}
