"use client";

import { useState, useMemo, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useLanguage } from "@/components/public/LanguageProvider";
import { getCountryLabelForValue } from "@/lib/countries";
import { LanguageVariantPicker } from "@/components/main/LanguageVariantPicker";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { resolveCountryOptionFlagImgUrl } from "@/lib/country-flag";
import { orderDownloadFilesEnglishFirst } from "@/lib/download-language-order";
import { trackResourceDownload } from "@/lib/track-resource-download";

export type Strategy2030DownloadFile = {
  language: string;
  url: string;
};

/** Sumber unduhan Strategy 2030 di admin (resource_download_submissions). */
export const STRATEGY_2030_DOCUMENT_IDS = {
  ourGoalCard: "goal-strategy-2030",
  homeBanner: "strategy-home-cta",
} as const;

/** Annual Report banner — bedakan Home vs About Us untuk analytics. */
export const ANNUAL_REPORT_DOCUMENT_IDS = {
  home: "annual-report-home",
  aboutUs: "annual-report-about-us",
} as const;

export type ResourceDownloadModalSource =
  | "STRATEGY_2030"
  | "ANNUAL_REPORT"
  | "GUIDING_POLICIES"
  | "FUND_DETAIL";

type Props = {
  title: string;
  subtitle?: string;
  downloadButtonText: string;
  documentTitle?: string;
  documentItemId?: string;
  modalSource?: ResourceDownloadModalSource;
  /** Prefix unik untuk `id` input (mis. `goal-strategy-dl`, `strategy-banner-dl`). */
  formFieldIdPrefix: string;
  /** `id` elemen judul modal (aria-labelledby). */
  headingId: string;
  files: Strategy2030DownloadFile[];
  getLanguageName: (code: string) => string;
  normalizeUrl: (url: string) => string;
  /** How file variants are grouped in the download picker (language vs country). */
  fileSelectorType?: "language" | "country";
  onClose: () => void;
};

/**
 * Modal pemilih bahasa untuk unduhan Strategy 2030 (seragam Our Goal & banner home).
 */
export function Strategy2030DownloadLeadModal({
  title,
  subtitle,
  downloadButtonText,
  documentTitle,
  documentItemId,
  modalSource = "STRATEGY_2030",
  formFieldIdPrefix,
  headingId,
  files,
  getLanguageName,
  normalizeUrl,
  fileSelectorType = "language",
  onClose,
}: Props) {
  const { language: currentLanguage } = useLanguage();
  const [selectedLangIndex, setSelectedLangIndex] = useState(() => {
    const ordered =
      fileSelectorType === "country"
        ? sortFilesByCountryLabel(files)
        : orderDownloadFilesEnglishFirst(files);
    const cur = currentLanguage.trim().toLowerCase();
    const idx = ordered.findIndex(
      (f) => f.language.trim().toLowerCase() === cur,
    );
    return idx >= 0 ? idx : 0;
  });
  const [selectedCountryVariant, setSelectedCountryVariant] = useState("");

  const fileListFingerprint = files
    .map((f) => `${f.language.trim()}:${f.url.trim()}`)
    .join("|");

  const orderedFiles = useMemo(() => {
    if (fileSelectorType === "country") {
      return sortFilesByCountryLabel(files);
    }
    return orderDownloadFilesEnglishFirst(files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileListFingerprint, fileSelectorType]);

  const langOptions = useMemo(
    () =>
      orderedFiles.map((f) => ({
        label: getLanguageName(f.language),
        languageId: f.language,
      })),
    [orderedFiles, getLanguageName],
  );

  const countryFileOptions = useMemo(
    () =>
      orderedFiles.map((f) => ({
        value: f.language,
        label: getCountryLabelForValue(f.language) ?? f.language,
      })),
    [orderedFiles],
  );

  useEffect(() => {
    const ordered =
      fileSelectorType === "country"
        ? sortFilesByCountryLabel(files)
        : orderDownloadFilesEnglishFirst(files);
    if (fileSelectorType === "country") {
      setSelectedCountryVariant(ordered[0]?.language ?? "");
      return;
    }
    const cur = currentLanguage.trim().toLowerCase();
    const idx = ordered.findIndex(
      (f) => f.language.trim().toLowerCase() === cur,
    );
    setSelectedLangIndex(idx >= 0 ? idx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage, fileListFingerprint, fileSelectorType]);

  const handleDownload = () => {
    const file =
      fileSelectorType === "country"
        ? orderedFiles.find((f) => f.language === selectedCountryVariant)
        : orderedFiles[selectedLangIndex];
    if (!file) return;
    const url = normalizeUrl(file.url);
    const selectedOptionLabel =
      fileSelectorType === "country"
        ? getCountryLabelForValue(file.language) ?? file.language
        : getLanguageName(file.language);

    trackResourceDownload({
      modalSource,
      documentItemId: documentItemId?.trim() || null,
      documentTitle: documentTitle?.trim() || title.trim() || null,
      selectorType: fileSelectorType,
      selectedOptionLabel,
      fileUrl: url,
    });

    window.open(url, "_blank");
    onClose();
  };

  const subtitleText = subtitle?.trim() ?? "";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-900 hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8 pb-4 pr-12">
          <h2
            id={headingId}
            className="text-xl sm:text-2xl font-bold text-gray-900 font-nunito leading-tight"
          >
            {title}
          </h2>
          {subtitleText ? (
            <p className="mt-2 text-sm sm:text-base text-[#060726]/80 font-work-sans leading-snug">
              {subtitleText}
            </p>
          ) : null}
        </div>

        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch pt-1">
            <div className="flex shrink-0 justify-center sm:justify-start sm:pt-0">
              {fileSelectorType === "country" ? (
                <SearchableCombobox
                  id={`${formFieldIdPrefix}-country-variant`}
                  value={selectedCountryVariant}
                  onValueChange={setSelectedCountryVariant}
                  options={countryFileOptions}
                  placeholder="Select country"
                  searchPlaceholder="Search country…"
                  listHeightClassName="h-[240px]"
                  className="min-w-[180px]"
                  aria-label="Select country"
                  renderOptionLeading={(option) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveCountryOptionFlagImgUrl(option.value)}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  )}
                />
              ) : (
                <LanguageVariantPicker
                  options={langOptions}
                  selectedIndex={Math.min(
                    selectedLangIndex,
                    Math.max(0, langOptions.length - 1),
                  )}
                  onSelectIndex={setSelectedLangIndex}
                  placeholder="Select language"
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={orderedFiles.length === 0}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#3C62ED] px-5 py-3.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#3558d4] disabled:cursor-not-allowed disabled:opacity-50 font-work-sans"
            >
              <Download className="h-5 w-5 shrink-0" aria-hidden />
              {downloadButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function sortFilesByCountryLabel(files: Strategy2030DownloadFile[]) {
  return [...files].sort((a, b) =>
    (getCountryLabelForValue(a.language) ?? a.language).localeCompare(
      getCountryLabelForValue(b.language) ?? b.language,
      "en",
    ),
  );
}
