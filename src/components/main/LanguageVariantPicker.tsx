"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type LanguageVariantOption = {
  label: string;
  /** Cocokkan ke `languages.id` di DB untuk kolom `flag` (emoji/URL). */
  languageId?: string;
};

/** Re-export untuk kompatibilitas impor lama. */
export { languageLabelToFlag } from "@/lib/language-variant-flag";

export function LanguageVariantPicker({
  options,
  selectedIndex,
  onSelectIndex,
  placeholder,
  className,
}: {
  options: LanguageVariantOption[];
  selectedIndex: number;
  onSelectIndex: (i: number) => void;
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const selected = options[selectedIndex];
  const safeIndex = Math.min(
    selectedIndex,
    Math.max(0, options.length - 1),
  );

  if (options.length === 0) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex min-h-[48px] min-w-[180px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-400",
          className,
        )}
      >
        {placeholder}
      </button>
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex min-h-[48px] min-w-[180px] w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#3C62ED] focus-visible:ring-offset-2",
            className,
          )}
          aria-label={placeholder}
          aria-expanded={open}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-[200] w-[var(--radix-popover-trigger-width)] rounded-lg border border-gray-200 bg-white p-1 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            role="listbox"
            aria-label={placeholder}
            className="max-h-64 overflow-y-auto py-0.5"
          >
            {options.map((opt, i) => (
              <button
                key={`${opt.label}-${i}-${opt.languageId ?? ""}`}
                type="button"
                role="option"
                aria-selected={i === safeIndex}
                onClick={() => {
                  onSelectIndex(i);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                  i === safeIndex
                    ? "bg-indigo-50 font-medium text-indigo-600"
                    : "text-gray-900 hover:bg-gray-50",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
