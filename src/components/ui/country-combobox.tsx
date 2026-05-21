"use client";

import type { CountryOption } from "@/lib/countries";
import { resolveCountryOptionFlagImgUrl } from "@/lib/country-flag";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";

export type CountryComboboxProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: CountryOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

function CountryFlagIcon({ value }: { value: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Twemoji CDN, ikon kecil
    <img
      src={resolveCountryOptionFlagImgUrl(value)}
      alt=""
      width={20}
      height={20}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="h-5 w-5 shrink-0 rounded-sm object-cover"
    />
  );
}

export function CountryCombobox({
  options,
  placeholder = "Country or region of interest",
  searchPlaceholder = "Search country or region…",
  "aria-label": ariaLabel,
  ...rest
}: CountryComboboxProps) {
  return (
    <SearchableCombobox
      {...rest}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyResultsMessage="No countries or regions found"
      listboxLabel={ariaLabel ?? "Country or region"}
      listHeightClassName="h-[280px]"
      aria-label={ariaLabel}
      renderOptionLeading={(option) => (
        <CountryFlagIcon value={option.value} />
      )}
    />
  );
}
