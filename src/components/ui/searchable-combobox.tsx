"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type SearchableComboboxOption = {
  value: string;
  label: string;
};

export type SearchableComboboxProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyResultsMessage?: string;
  /** aria-label untuk listbox */
  listboxLabel?: string;
  /** Tinggi area scroll daftar opsi (Tailwind class) */
  listHeightClassName?: string;
  /** Ikon/elemen di kiri label (trigger + setiap opsi) */
  renderOptionLeading?: (option: SearchableComboboxOption) => React.ReactNode;
  disabled?: boolean;
  className?: string;
  /** Extra classes for portaled popover panel (e.g. `z-[210]` when inside another modal). */
  popoverContentClassName?: string;
  "aria-label"?: string;
};

export function SearchableCombobox({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyResultsMessage = "No results found",
  listboxLabel,
  listHeightClassName = "h-[280px]",
  renderOptionLeading,
  disabled = false,
  className,
  popoverContentClassName,
  "aria-label": ariaLabel,
}: SearchableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listboxId = `${id}-listbox`;

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const selectedOption = React.useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const selectedLabel = selectedOption?.label ?? "";

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  const handleSelect = (next: string) => {
    onValueChange(next);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          className={cn(
            "flex w-full items-center justify-between gap-2 border border-gray-300 bg-white px-4 py-3 text-left text-sm outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            !selectedLabel && "text-gray-500",
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {selectedOption && renderOptionLeading
              ? renderOptionLeading(selectedOption)
              : null}
            <span className="truncate">{selectedLabel || placeholder}</span>
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className={cn(
            "z-[100] rounded-lg border border-gray-200 bg-white p-2 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            popoverContentClassName,
          )}
          style={{ width: "var(--radix-popover-trigger-width)" }}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            searchRef.current?.focus();
          }}
        >
          <Input
            ref={searchRef}
            type="search"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2 h-10 rounded-lg border-gray-300 px-3 py-2 text-sm"
            autoComplete="off"
          />
          <ScrollArea
            className={cn(
              "w-full rounded-md border border-gray-100",
              listHeightClassName,
            )}
          >
            <div
              id={listboxId}
              role="listbox"
              aria-label={listboxLabel ?? ariaLabel ?? "Options"}
              className="p-1"
            >
              {filtered.length === 0 ? (
                <p className="px-2 py-3 text-center text-sm text-gray-500">
                  {emptyResultsMessage}
                </p>
              ) : (
                filtered.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    role="option"
                    aria-selected={value === o.value}
                    onClick={() => handleSelect(o.value)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-gray-900 hover:bg-gray-100",
                      value === o.value &&
                        "bg-blue-50 font-medium text-blue-700 hover:bg-blue-50",
                    )}
                  >
                    {renderOptionLeading ? renderOptionLeading(o) : null}
                    <span className="truncate">{o.label}</span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
