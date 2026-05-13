"use client";

import { useState, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";
import {
  resolveLanguageVariantFlagImgUrl,
  emojiToTwemoji72Url,
} from "@/lib/language-variant-flag";

export type LanguageVariantOption = {
  label: string;
  /** Cocokkan ke `languages.id` di DB untuk kolom `flag` (emoji/URL). */
  languageId?: string;
};

/** Re-export untuk kompatibilitas impor lama. */
export { languageLabelToFlag } from "@/lib/language-variant-flag";

function VariantFlagImg({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Twemoji CDN, ikon kecil
    <img
      src={src}
      alt=""
      title={title}
      width={50}
      height={50}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="h-12 w-12 select-none object-cover"
    />
  );
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
  const { languages, loading } = useActiveLanguages();

  const selected = options[selectedIndex];

  const languagesForResolve = useMemo(
    () =>
      languages.map((l) => ({
        id: l.id,
        name: l.name,
        flag: l.flag,
      })),
    [languages],
  );

  const placeholderSrc = useMemo(
    () => emojiToTwemoji72Url("🌐")!,
    [],
  );

  const selectedFlagSrc = useMemo(() => {
    if (!selected) return placeholderSrc;
    if (loading && languagesForResolve.length === 0) return placeholderSrc;
    return resolveLanguageVariantFlagImgUrl(languagesForResolve, {
      label: selected.label,
      languageId: selected.languageId,
    });
  }, [
    selected,
    languagesForResolve,
    loading,
    placeholderSrc,
  ]);

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
            className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-50 ring-1 ring-gray-100"
            aria-hidden
          >
            <VariantFlagImg src={selectedFlagSrc} title={selected.label} />
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
            {options.map((opt, i) => {
              const rowSrc =
                loading && languagesForResolve.length === 0
                  ? placeholderSrc
                  : resolveLanguageVariantFlagImgUrl(languagesForResolve, {
                      label: opt.label,
                      languageId: opt.languageId,
                    });
              return (
                <button
                  key={`${opt.label}-${i}-${opt.languageId ?? ""}`}
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
                    className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-50 ring-1 ring-gray-100"
                    aria-hidden
                  >
                    <VariantFlagImg src={rowSrc} title={opt.label} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
