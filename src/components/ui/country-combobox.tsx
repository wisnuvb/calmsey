"use client";

import type { CountryOption } from "@/lib/countries";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";

export type CountryComboboxProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: CountryOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function CountryCombobox({
  options,
  placeholder = "Select country",
  "aria-label": ariaLabel,
  ...rest
}: CountryComboboxProps) {
  return (
    <SearchableCombobox
      {...rest}
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Search country…"
      emptyResultsMessage="No countries found"
      listboxLabel={ariaLabel ?? "Countries"}
      listHeightClassName="h-[280px]"
      aria-label={ariaLabel}
    />
  );
}
