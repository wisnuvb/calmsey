"use client";

import type { CountryOption } from "@/lib/countries";
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
    />
  );
}
