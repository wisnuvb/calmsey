"use client";

import Image from "next/image";
import { Download, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useState, useMemo, useCallback } from "react";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import { LanguageVariantPicker } from "@/components/main/LanguageVariantPicker";
import { getCountryLabelForValue } from "@/lib/countries";
import { CountryCombobox } from "@/components/ui/country-combobox";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { getCountrySelectOptions } from "@/lib/countries";
import { orderLanguageLabelsEnglishFirst } from "@/lib/download-language-order";
import { normalizeDownloadLanguageOption } from "@/lib/download-language-labels";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";

interface DownloadOption {
  label: string;
  fileUrl: string;
  /** Opsional: cocokkan ke `languages.id` untuk bendera dari DB. */
  languageId?: string;
}

interface DownloadItem {
  id: string;
  title?: string;
  selectorType: "language" | "country";
  downloadOptions: DownloadOption[] | string;
}

interface WhereWeWorkSectionProps {
  title?: string;
  actionPlansText?: string;
  actionPlansLinkText?: string;
  actionPlansDownloadModalTitle?: string;
  actionPlansDownloadItems?: DownloadItem[];
  explorationText?: string;
  mapImage?: string;
  partnersText?: string;
  partnersLinkText?: string;
  partnersDownloadModalTitle?: string;
  partnersDownloadItems?: DownloadItem[];
  content?: string;
}

function parseDownloadOptions(
  opts: DownloadOption[] | string | unknown,
): DownloadOption[] {
  if (Array.isArray(opts)) {
    return opts
      .filter(
        (o): o is object =>
          o !== null && typeof o === "object" && "label" in o && "fileUrl" in o,
      )
      .map((raw) => {
        const o = raw as Record<string, unknown>;
        const label = o.label;
        const fileUrl = o.fileUrl;
        if (typeof label !== "string" || typeof fileUrl !== "string") {
          return null;
        }
        const out: DownloadOption = { label, fileUrl };
        if (typeof o.languageId === "string" && o.languageId.trim()) {
          out.languageId = o.languageId.trim().toLowerCase();
        }
        return out;
      })
      .filter((x): x is DownloadOption => x !== null);
  }
  if (typeof opts === "string") {
    try {
      const parsed = JSON.parse(opts);
      return parseDownloadOptions(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

export function WhereWeWorkSection({
  title: propTitle,
  actionPlansText: propActionPlansText,
  actionPlansLinkText: propActionPlansLinkText,
  actionPlansDownloadModalTitle: propActionPlansModalTitle,
  actionPlansDownloadItems: propActionPlansItems,
  explorationText: propExplorationText,
  mapImage: propMapImage,
  partnersText: propPartnersText,
  partnersLinkText: propPartnersLinkText,
  partnersDownloadModalTitle: propPartnersModalTitle,
  partnersDownloadItems: propPartnersItems,
}: WhereWeWorkSectionProps = {}) {
  const [imageError, setImageError] = useState(false);
  const [actionPlansModalOpen, setActionPlansModalOpen] = useState(false);
  const [partnersModalOpen, setPartnersModalOpen] = useState(false);

  const { getValue, getContentJSON } = usePageContentHelpers();

  // Get all values with priority: context > props > default
  const title = getValue(
    "whereWeWork.title",
    propTitle,
    "Where Does Turning Tides Work?",
  );

  const actionPlansText = getValue(
    "whereWeWork.actionPlansText",
    propActionPlansText,
    "We have **developed action plans for Latin America and Africa**, and **mobilizing grants** for work in Chile, Honduras, Panama, Costa Rica, Senegal, Uganda.",
  );

  const actionPlansLinkText = getValue(
    "whereWeWork.actionPlansLinkText",
    propActionPlansLinkText,
    "See Action Plans",
  );

  const actionPlansModalTitle = getValue(
    "whereWeWork.actionPlansDownloadModalTitle",
    propActionPlansModalTitle,
    "Download action plans",
  );

  const actionPlansModalSubtitle = getValue(
    "whereWeWork.actionPlansDownloadModalSubtitle",
    undefined,
    "Our approach, risk mitigation, milestones and estimate budget until 2030 ahead",
  );

  const partnersModalSubtitle = getValue(
    "whereWeWork.partnersDownloadModalSubtitle",
    undefined,
    "",
  );

  const actionPlansDownloadItems = getContentJSON<DownloadItem[]>(
    "whereWeWork.actionPlansDownloadItems",
    propActionPlansItems || [],
  );

  const explorationText = getValue(
    "whereWeWork.explorationText",
    propExplorationText,
    "We are also in **the exploration and engagement phase** – Brazil, India, Indonesia, Sri Lanka, Thailand.",
  );

  const mapImage = getValue(
    "whereWeWork.mapImage",
    propMapImage,
    "/assets/world-map.jpg",
  );

  // Use getImageUrl with validation built-in
  const imageUrl = getImageUrl(mapImage, "/assets/world-map.jpg");

  const partnersText = getValue(
    "whereWeWork.partnersText",
    propPartnersText,
    'Our **"Partners Piloting"** partners were in Bangladesh, Thailand, Indonesia, Honduras, Senegal.',
  );

  const partnersLinkText = getValue(
    "whereWeWork.partnersLinkText",
    propPartnersLinkText,
    "View Report",
  );

  const partnersModalTitle = getValue(
    "whereWeWork.partnersDownloadModalTitle",
    propPartnersModalTitle,
    "Download Piloting Report",
  );

  const partnersDownloadItems = getContentJSON<DownloadItem[]>(
    "whereWeWork.partnersDownloadItems",
    propPartnersItems || [],
  );

  return (
    <section className="bg-white pb-8 lg:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-nunito text-[30px] font-bold leading-[120%] text-[#010107] sm:text-[38px]">
            {title}
          </h2>
        </div>

        {/* Legend Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mb-4 lg:mb-8 mx-auto px-3 sm:px-6 lg:px-0">
          <div className="flex items-start gap-4 mx-auto w-full sm:px-1">
            <div className="w-4 h-4 bg-[#3C62ED] flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <p className="mb-2 p">
                {actionPlansText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                  if (index % 2 === 1) {
                    return <strong key={index}>{part}</strong>;
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>
              <button
                type="button"
                onClick={() =>
                  actionPlansDownloadItems.length > 0 &&
                  setActionPlansModalOpen(true)
                }
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span>{actionPlansLinkText}</span>
                <Download
                  className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform"
                  aria-hidden
                />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 mx-auto w-full sm:px-1">
            <div className="w-4 h-4 bg-[#7db5bb] flex-shrink-0 mt-1" />
            <p className="p min-w-0 text-gray-900">
              {explorationText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                if (index % 2 === 1) {
                  return <strong key={index}>{part}</strong>;
                }
                return <span key={index}>{part}</span>;
              })}
            </p>
          </div>

          <div className="flex items-start gap-4 mx-auto w-full sm:px-1">
            <div
              className="mt-1 box-border h-4 w-4 shrink-0 rounded-full border-[2px] border-[#172554] bg-transparent"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="mb-2 p">
                {partnersText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                  if (index % 2 === 1) {
                    return <strong key={index}>{part}</strong>;
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>
              {!!partnersLinkText && (
                <button
                  type="button"
                  onClick={() =>
                    partnersDownloadItems.length > 0 &&
                    setPartnersModalOpen(true)
                  }
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
                >
                  <span>{partnersLinkText}</span>
                  <Download
                    className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform"
                    aria-hidden
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* World Map */}
        <div className="relative w-full">
          <div className="relative w-full aspect-[16/9] lg:aspect-[2/1]">
            {!imageError ? (
              <Image
                src={getImageUrl(imageUrl)}
                alt="World Map showing Turning Tides work locations"
                fill
                className="object-contain"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <p className="text-sm">Image not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Plans Download Modal */}
      {actionPlansModalOpen && (
        <DownloadFilesModal
          title={actionPlansModalTitle}
          subtitle={actionPlansModalSubtitle}
          modalSource="ACTION_PLANS"
          items={actionPlansDownloadItems}
          downloadButtonText="Download Now"
          onClose={() => setActionPlansModalOpen(false)}
        />
      )}

      {/* Partners Download Modal */}
      {partnersModalOpen && (
        <DownloadFilesModal
          title={partnersModalTitle}
          subtitle={partnersModalSubtitle}
          modalSource="PARTNERS"
          items={partnersDownloadItems}
          downloadButtonText="Download Now"
          onClose={() => setPartnersModalOpen(false)}
        />
      )}
    </section>
  );
}

function DownloadFilesModal({
  title,
  subtitle,
  modalSource,
  items,
  downloadButtonText,
  onClose,
}: {
  title: string;
  subtitle?: string;
  modalSource: "ACTION_PLANS" | "PARTNERS";
  items: DownloadItem[];
  downloadButtonText: string;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [formError, setFormError] = useState("");
  const countryOptions = useMemo(() => getCountrySelectOptions(), []);

  const validateLeadForm = (): boolean => {
    setFormError("");
    if (!fullName.trim()) {
      setFormError("Please enter your full name.");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    if (!userCountry.trim()) {
      setFormError("Please select your country.");
      return false;
    }
    return true;
  };

  const getLeadData = useCallback(() => {
    const cc = userCountry.trim().toLowerCase();
    return {
      fullName: fullName.trim(),
      email: email.trim(),
      countryCode: cc,
      countryLabel: getCountryLabelForValue(cc) ?? cc,
    };
  }, [fullName, email, userCountry]);

  const subtitleText = subtitle?.trim() ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
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
            id="download-modal-title"
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

        <div className="px-6 sm:px-8 pb-8 space-y-5">
          <div className="space-y-3">
            <label htmlFor="download-modal-fullname" className="sr-only">
              Full name
            </label>
            <input
              id="download-modal-fullname"
              type="text"
              autoComplete="name"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#3C62ED]"
            />
            <label htmlFor="download-modal-email" className="sr-only">
              Email
            </label>
            <input
              id="download-modal-email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#3C62ED]"
            />
            <label htmlFor="download-modal-country" className="sr-only">
              Country
            </label>
            <CountryCombobox
              id="download-modal-country"
              value={userCountry}
              onValueChange={setUserCountry}
              options={countryOptions}
              placeholder="Select country"
              aria-label="Country"
            />
          </div>

          {formError ? (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="space-y-6 pt-1">
            {items.map((item) => (
              <DownloadItemRow
                key={item.id}
                item={item}
                modalSource={modalSource}
                downloadButtonText={downloadButtonText}
                validateLeadForm={validateLeadForm}
                getLeadData={getLeadData}
                reportError={setFormError}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadItemRow({
  item,
  modalSource,
  downloadButtonText,
  validateLeadForm,
  getLeadData,
  reportError,
}: {
  item: DownloadItem;
  modalSource: "ACTION_PLANS" | "PARTNERS";
  downloadButtonText: string;
  validateLeadForm: () => boolean;
  getLeadData: () => {
    fullName: string;
    email: string;
    countryCode: string;
    countryLabel: string;
  };
  reportError: (message: string) => void;
}) {
  const { languages: activeLanguages } = useActiveLanguages();

  const options = useMemo((): DownloadOption[] => {
    const parsed = parseDownloadOptions(item.downloadOptions);
    if (item.selectorType === "language") {
      const normalized = parsed.map((o) =>
        normalizeDownloadLanguageOption(o, activeLanguages),
      );
      return orderLanguageLabelsEnglishFirst(normalized);
    }
    return parsed;
  }, [item.downloadOptions, item.selectorType, activeLanguages]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const variantOptions = useMemo(
    () =>
      options.map((o, i) => ({
        value: String(i),
        label: o.label,
        languageId: o.languageId,
      })),
    [options],
  );

  const handleDownload = async () => {
    if (!validateLeadForm()) return;
    const opt = options[selectedIndex];
    if (!opt?.fileUrl) return;

    const url =
      opt.fileUrl.startsWith("/") || opt.fileUrl.startsWith("http")
        ? opt.fileUrl
        : `https://${opt.fileUrl}`;

    setIsSubmitting(true);
    reportError("");
    try {
      const lead = getLeadData();
      const res = await fetch("/api/resource-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: lead.fullName,
          email: lead.email,
          countryCode: lead.countryCode,
          countryLabel: lead.countryLabel,
          modalSource,
          documentItemId: item.id,
          documentTitle: item.title?.trim() || null,
          selectorType: item.selectorType,
          selectedOptionLabel: opt.label,
          fileUrl: url,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        reportError(
          data.error ||
            "Could not submit your details. Please try again shortly.",
        );
        return;
      }
      window.open(url, "_blank");
    } catch {
      reportError("Something went wrong. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectorPlaceholder =
    item.selectorType === "country" ? "Select country" : "Select language";

  const hasTitle = item.title && item.title.trim().length > 0;

  return (
    <div className="w-full space-y-3">
      {hasTitle ? (
        <p className="text-sm font-medium text-gray-900">{item.title}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex shrink-0 justify-center sm:justify-start sm:pt-0">
          {item.selectorType === "language" ? (
            <LanguageVariantPicker
              options={options.map((o) => ({
                label: o.label,
                languageId: o.languageId,
              }))}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
              placeholder={selectorPlaceholder}
            />
          ) : options.length === 0 ? (
            <button
              type="button"
              disabled
              className="inline-flex min-h-[48px] w-full min-w-[140px] items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-400 sm:w-[180px]"
            >
              {selectorPlaceholder}
            </button>
          ) : (
            <div className="w-full min-w-[140px] sm:w-[180px]">
              <SearchableCombobox
                id={`download-variant-${item.id}`}
                value={String(Math.min(selectedIndex, options.length - 1))}
                onValueChange={(v) => setSelectedIndex(Number(v))}
                options={variantOptions}
                placeholder={selectorPlaceholder}
                searchPlaceholder="Search…"
                emptyResultsMessage="No matches"
                listboxLabel={selectorPlaceholder}
                listHeightClassName="h-[200px]"
                aria-label={selectorPlaceholder}
                className="min-h-[48px]"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => void handleDownload()}
          disabled={options.length === 0 || isSubmitting}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#3C62ED] px-5 py-3.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#3558d4] disabled:cursor-not-allowed disabled:opacity-50 font-work-sans"
        >
          <Download className="h-5 w-5 shrink-0" aria-hidden />
          {isSubmitting ? "Submitting…" : downloadButtonText}
        </button>
      </div>
    </div>
  );
}
