"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type LanguageVariantOption = { label: string };

/** Emoji bendera dari label bahasa (untuk picker). */
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

export function LanguageVariantPicker({
  options,
  selectedIndex,
  onSelectIndex,
  placeholder,
}: {
  options: LanguageVariantOption[];
  selectedIndex: number;
  onSelectIndex: (i: number) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options[selectedIndex];

  if (options.length === 0) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-400"
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
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#3C62ED] focus-visible:ring-offset-2"
          aria-label={placeholder}
          aria-expanded={open}
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50 text-base leading-none"
            aria-hidden
          >
            {selected
              ? languageLabelToFlag(selected.label)
              : languageLabelToFlag("English")}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-[200] w-[min(100vw-2rem,16rem)] rounded-lg border border-gray-200 bg-white p-1 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            role="listbox"
            aria-label={placeholder}
            className="max-h-64 overflow-y-auto py-0.5"
          >
            {options.map((opt, i) => (
              <button
                key={`${opt.label}-${i}`}
                type="button"
                role="option"
                aria-selected={i === selectedIndex}
                onClick={() => {
                  onSelectIndex(i);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                  i === selectedIndex
                    ? "bg-indigo-50 font-medium text-indigo-600"
                    : "text-gray-900 hover:bg-gray-50",
                )}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50 text-base leading-none"
                  aria-hidden
                >
                  {languageLabelToFlag(opt.label)}
                </span>
                <span className="min-w-0 flex-1 truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
