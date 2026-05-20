import { ISO_3166_1_ALPHA2_CODES } from "@/lib/country-iso-alpha2";

export type CountryOption = {
  /** ISO 3166-1 alpha-2 lowercase, `region-*`, or `other` */
  value: string;
  /** English display name */
  label: string;
};

/** Continental / regional choices (listed after all countries, before Other). */
export const REGION_SELECT_OPTIONS: CountryOption[] = [
  { value: "region-africa", label: "Africa" },
  { value: "region-asia", label: "Asia" },
  { value: "region-europe", label: "Europe" },
  { value: "region-latin-america", label: "Latin America" },
  { value: "region-north-america", label: "North America" },
  { value: "region-oceania", label: "Oceania" },
  { value: "region-antarctica", label: "Antarctica" },
];

let cache: CountryOption[] | null = null;

function isTwoLetterRegion(code: string): boolean {
  return code.length === 2 && /^[A-Z]{2}$/.test(code);
}

/** Countries A–Z, then regions, then Other. */
function assembleCountryAndRegionOptions(
  countries: CountryOption[],
): CountryOption[] {
  const countryOnly = countries
    .filter(
      (o) =>
        o.value !== "other" &&
        !REGION_SELECT_OPTIONS.some((r) => r.value === o.value),
    )
    .sort((a, b) => a.label.localeCompare(b.label, "en"));

  return [
    ...countryOnly,
    ...REGION_SELECT_OPTIONS,
    { value: "other", label: "Other" },
  ];
}

/** Alphabetical A–Z by label; entries with `value === "other"` always last. */
function sortCountryOptionsOtherLast(options: CountryOption[]): CountryOption[] {
  return assembleCountryAndRegionOptions(options);
}

/** Build country options from static ISO codes + `Intl.DisplayNames`. */
function buildCountriesFromIsoCodes(
  codes: readonly string[],
): CountryOption[] {
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    return codes
      .map((code) => {
        const upper = code.toUpperCase();
        const label = dn.of(upper);
        if (!label || label === upper) return null;
        return { value: upper.toLowerCase(), label } satisfies CountryOption;
      })
      .filter((x): x is CountryOption => x !== null);
  } catch {
    return codes.map((code) => ({
      value: code.toLowerCase(),
      label: code.toUpperCase(),
    }));
  }
}

const FALLBACK_COUNTRIES: CountryOption[] = [
  ...buildCountriesFromIsoCodes(ISO_3166_1_ALPHA2_CODES),
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
    if (typeof intl.supportedValuesOf === "function") {
      const codes = intl
        .supportedValuesOf("region")
        .filter(
          (r): r is string => typeof r === "string" && isTwoLetterRegion(r),
        );

      const dn = new Intl.DisplayNames(["en"], { type: "region" });
      const fromIntl = codes
        .map((code) => {
          const label = dn.of(code);
          if (!label || label === code) return null;
          return { value: code.toLowerCase(), label } satisfies CountryOption;
        })
        .filter((x): x is CountryOption => x !== null);

      if (fromIntl.length > 0) {
        return assembleCountryAndRegionOptions(fromIntl);
      }
    }

    return sortCountryOptionsOtherLast([...FALLBACK_COUNTRIES]);
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
