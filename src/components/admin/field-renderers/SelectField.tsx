"use client";

import { useEffect, useMemo, useState } from "react";
import type { FieldDefinition } from "@/lib/page-content-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

type LangRow = { id: string; name: string; flag?: string | null };

export function SelectField({ field, value, onChange, error }: SelectFieldProps) {
  const staticOptions = field.options || [];
  const optionsFrom = field.optionsFrom;

  const [langOptions, setLangOptions] = useState<
    Array<{ value: string; label: string }> | null
  >(optionsFrom === "languages" ? null : []);

  useEffect(() => {
    if (optionsFrom !== "languages") return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          "/api/admin/languages?limit=500&isActive=true&sortBy=name&sortOrder=asc",
        );
        const json = (await res.json()) as {
          success?: boolean;
          data?: LangRow[];
        };
        if (cancelled || !json.success || !Array.isArray(json.data)) {
          if (!cancelled) setLangOptions([]);
          return;
        }
        const opts = json.data.map((l) => ({
          value: l.id,
          label: [l.flag?.trim(), l.name, `(${l.id})`]
            .filter(Boolean)
            .join(" ")
            .trim(),
        }));
        if (!cancelled) setLangOptions(opts);
      } catch {
        if (!cancelled) setLangOptions([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [optionsFrom]);

  const options = useMemo(() => {
    if (optionsFrom === "languages") {
      const base = langOptions ?? [];
      const v = value?.trim();
      if (v && !base.some((o) => o.value === v)) {
        return [{ value: v, label: `${v} (inactive / legacy)` }, ...base];
      }
      return base;
    }
    return staticOptions;
  }, [optionsFrom, langOptions, staticOptions, value]);

  const loadingLanguages =
    optionsFrom === "languages" && langOptions === null;

  const optionValues = useMemo(() => new Set(options.map((o) => o.value)), [options]);
  const selectValue =
    value && optionValues.has(value) ? value : undefined;

  if (loadingLanguages) {
    return (
      <div
        className={`w-full rounded-md border px-3 py-2 text-sm text-gray-500 ${error ? "border-red-500" : "border-gray-300"
          }`}
      >
        Loading languages…
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div
        className={`w-full rounded-md border px-3 py-2 text-sm text-amber-800 bg-amber-50 ${error ? "border-red-500" : "border-amber-200"
          }`}
      >
        {optionsFrom === "languages"
          ? "No active languages found. Add languages under Settings → Languages."
          : "No options configured for this field."}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Select value={selectValue} onValueChange={onChange}>
        <SelectTrigger
          className={`w-full ${error ? "border-red-500" : ""
            }`}
        >
          <SelectValue placeholder={field.placeholder || "Select an option…"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: { value: string; label: string }) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
