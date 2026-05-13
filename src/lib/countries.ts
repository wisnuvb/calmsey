export type CountryOption = {
  /** ISO 3166-1 alpha-2 lowercase, or "other" */
  value: string;
  /** English display name */
  label: string;
};

let cache: CountryOption[] | null = null;

function isTwoLetterRegion(code: string): boolean {
  return code.length === 2 && /^[A-Z]{2}$/.test(code);
}

/** Alphabetical A–Z by label; entries with `value === "other"` always last. */
function sortCountryOptionsOtherLast(options: CountryOption[]): CountryOption[] {
  const others = options.filter((o) => o.value === "other");
  const rest = options
    .filter((o) => o.value !== "other")
    .sort((a, b) => a.label.localeCompare(b.label, "en"));
  return [...rest, ...others];
}

const FALLBACK_COUNTRIES: CountryOption[] = [
  { value: "id", label: "Indonesia" },
  { value: "ph", label: "Philippines" },
  { value: "my", label: "Malaysia" },
  { value: "th", label: "Thailand" },
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "other", label: "Other" },
];

/**
 * Bangun daftar negara dari `Intl` (tanpa cache). Dipakai di server (API) dan
 * oleh `getCountrySelectOptions()` setelah cache miss.
 * Fallback singkat hanya jika `Intl` tidak mendukung atau error.
 */
export function buildCountrySelectOptions(): CountryOption[] {
  try {
    const intl = Intl as typeof Intl & {
      supportedValuesOf?: (key: string) => string[];
    };
    if (typeof intl.supportedValuesOf !== "function") {
      return sortCountryOptionsOtherLast([...FALLBACK_COUNTRIES]);
    }

    const codes = intl
      .supportedValuesOf("region")
      .filter((r): r is string => typeof r === "string" && isTwoLetterRegion(r));

    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    const fromIntl = codes
      .map((code) => {
        const label = dn.of(code);
        if (!label || label === code) return null;
        return { value: code.toLowerCase(), label } satisfies CountryOption;
      })
      .filter((x): x is CountryOption => x !== null)
      .sort((a, b) => a.label.localeCompare(b.label, "en"));

    const withoutOther = fromIntl.filter((o) => o.value !== "other");
    return [...withoutOther, { value: "other", label: "Other" }];
  } catch {
    return sortCountryOptionsOtherLast([...FALLBACK_COUNTRIES]);
  }
}

/**
 * Country list for <select>: sama dengan `buildCountrySelectOptions()` dengan
 * cache modul (server / validasi API). Di browser form, prefer fetch
 * `GET /api/public/countries` agar daftar penuh tidak bergantung pada dukungan Intl di klien.
 */
export function getCountrySelectOptions(): CountryOption[] {
  if (cache) return cache;
  cache = buildCountrySelectOptions();
  return cache;
}

/** Label to send to webhook / automation (country name, not code). */
export function getCountryLabelForValue(value: string): string | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  const opts = getCountrySelectOptions();
  const found = opts.find((o) => o.value === normalized);
  return found?.label ?? null;
}

export function isAllowedCountryValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return getCountrySelectOptions().some((o) => o.value === normalized);
}
