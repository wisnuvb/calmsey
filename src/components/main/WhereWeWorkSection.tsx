"use client";

import Image from "next/image";
import { ArrowUpRight, Download, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useState, useMemo } from "react";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import { LanguageVariantPicker } from "@/components/main/LanguageVariantPicker";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { orderLanguageLabelsEnglishFirst } from "@/lib/download-language-order";
import { normalizeDownloadLanguageOption } from "@/lib/download-language-labels";
import { trackResourceDownload } from "@/lib/track-resource-download";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";
import { RichText } from "@/components/ui/RichText";

const DEFAULT_MAP_IMAGE = "/assets/world-map-work.webp";

const DEFAULT_APPROVED_TITLE = "Approved action plan & active grantmaking";
const DEFAULT_APPROVED_TEXT =
  "Latin America (Brazil, Chile, Columbia, Costa Rica, Honduras, Panama, Regional movement building), Africa (Democratic Republic of Congo, Madagascar, Nigeria, Senegal, South Africa, Uganda, Continent-wide support), South East Asia (Indonesia, Thailand).";

const DEFAULT_INITIAL_TITLE = "Initial engagement through grantmaking";
const DEFAULT_INITIAL_TEXT = "South Asia (India, Sri Lanka, Bangladesh).";

const DEFAULT_GRASSROOTS_TITLE = "Regions where we have Grassroots funding";
const DEFAULT_GRASSROOTS_TEXT =
  "South East Asia (Thailand, Indonesia), South Asia (India, Sri Lanka, Bangladesh), Africa (All the continent), Latin America (All of central America, Colombia, Brazil and Chile)";

const DEFAULT_NOTE =
  "*Turning Tides also support global movements that work towards advancing tenure security for coastal and shoreline communities across geographies";

const CARD_TEXT_CLASS =
  "min-w-0 text-sm leading-[1.65] text-[#3d3d56] [&_p]:m-0 [&_p:not(:last-child)]:mb-2";

/** Warna aksen kartu: sesuai warna pin pada gambar map. */
const CARD_ACCENT = {
  approved: "bg-[#6BB5B8]",
  initial: "bg-[#B57BE4]",
  grassroots: "bg-[#3C62ED]",
} as const;

function normalizeRichTextContent(content: string): string {
  if (!content.trim()) return content;
  if (/<[a-z][\s\S]*>/i.test(content.trim())) {
    return content;
  }
  return content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

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
  approvedTitle?: string;
  approvedText?: string;
  initialTitle?: string;
  initialText?: string;
  grassrootsTitle?: string;
  grassrootsText?: string;
  note?: string;
  actionPlansLinkText?: string;
  actionPlansDownloadModalTitle?: string;
  actionPlansDownloadItems?: DownloadItem[];
  mapImage?: string;
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
  approvedTitle: propApprovedTitle,
  approvedText: propApprovedText,
  initialTitle: propInitialTitle,
  initialText: propInitialText,
  grassrootsTitle: propGrassrootsTitle,
  grassrootsText: propGrassrootsText,
  note: propNote,
  actionPlansLinkText: propActionPlansLinkText,
  actionPlansDownloadModalTitle: propActionPlansModalTitle,
  actionPlansDownloadItems: propActionPlansItems,
  mapImage: propMapImage,
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

  const actionPlansLinkText = getValue(
    "whereWeWork.actionPlansLinkText",
    propActionPlansLinkText,
    "Action Plans",
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

  const mapImage = getValue(
    "whereWeWork.mapImage",
    propMapImage,
    DEFAULT_MAP_IMAGE,
  );

  // Use getImageUrl with validation built-in
  const imageUrl = getImageUrl(mapImage, DEFAULT_MAP_IMAGE);

  const approvedTitle = getValue(
    "whereWeWork.approvedTitle",
    propApprovedTitle,
    DEFAULT_APPROVED_TITLE,
  );
  const approvedText = normalizeRichTextContent(
    getValue(
      "whereWeWork.approvedText",
      propApprovedText,
      DEFAULT_APPROVED_TEXT,
    ),
  );
  const initialTitle = getValue(
    "whereWeWork.initialTitle",
    propInitialTitle,
    DEFAULT_INITIAL_TITLE,
  );
  const initialText = normalizeRichTextContent(
    getValue("whereWeWork.initialText", propInitialText, DEFAULT_INITIAL_TEXT),
  );
  const grassrootsTitle = getValue(
    "whereWeWork.grassrootsTitle",
    propGrassrootsTitle,
    DEFAULT_GRASSROOTS_TITLE,
  );
  const grassrootsText = normalizeRichTextContent(
    getValue(
      "whereWeWork.grassrootsText",
      propGrassrootsText,
      DEFAULT_GRASSROOTS_TEXT,
    ),
  );
  const note = getValue("whereWeWork.note", propNote, DEFAULT_NOTE);

  const partnersLinkText = getValue(
    "whereWeWork.partnersLinkText",
    propPartnersLinkText,
    "Piloting Report",
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

        {/* Region cards */}
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3">
          <RegionCard
            accentClass={CARD_ACCENT.approved}
            title={approvedTitle}
            text={approvedText}
            linkText={actionPlansLinkText}
            onLinkClick={
              actionPlansDownloadItems.length > 0
                ? () => setActionPlansModalOpen(true)
                : undefined
            }
          />
          <RegionCard
            accentClass={CARD_ACCENT.initial}
            title={initialTitle}
            text={initialText}
            linkText={partnersLinkText}
            onLinkClick={
              partnersDownloadItems.length > 0
                ? () => setPartnersModalOpen(true)
                : undefined
            }
          />
          <RegionCard
            accentClass={CARD_ACCENT.grassroots}
            title={grassrootsTitle}
            text={grassrootsText}
          />
        </div>

        {/* Footnote */}
        {!!note.trim() && (
          <div className="mx-auto mt-8 flex max-w-[1200px] items-center gap-6 lg:mt-10">
            <div className="hidden h-px flex-1 bg-[#c9d3e3] md:block" aria-hidden />
            <p className="max-w-[640px] text-center text-base leading-relaxed text-[#3d3d56]">
              {note}
            </p>
            <div className="hidden h-px flex-1 bg-[#c9d3e3] md:block" aria-hidden />
          </div>
        )}

        {/* World Map */}
        <div className="relative mx-auto mt-6 w-full max-w-[1440px] lg:mt-10">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt="World map highlighting the regions where Turning Tides works"
              width={1440}
              height={605}
              sizes="(min-width: 1440px) 1440px, 100vw"
              className="h-auto w-full"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex aspect-[1440/605] w-full items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100">
              <p className="text-sm text-gray-500">Image not available</p>
            </div>
          )}
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

function RegionCard({
  accentClass,
  title,
  text,
  linkText,
  onLinkClick,
}: {
  accentClass: string;
  title: string;
  text: string;
  linkText?: string;
  onLinkClick?: () => void;
}) {
  return (
    <article className="flex flex-col border border-[#c9d3e3] bg-white p-6 sm:p-8">
      <div className={`mb-6 h-2 w-[88px] ${accentClass}`} aria-hidden />
      <h3 className="font-nunito text-xl font-semibold leading-snug text-[#2a2a47]">
        {title}
      </h3>
      <RichText content={text} className={`mt-2 ${CARD_TEXT_CLASS}`} />
      {!!linkText && !!onLinkClick && (
        <button
          type="button"
          onClick={onLinkClick}
          className="mt-auto inline-flex min-h-[44px] items-center gap-1.5 self-start pt-6 text-base text-[#3C62ED] transition-colors hover:text-[#2748c9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C62ED]"
        >
          <span>{linkText}</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </article>
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

        <div className="px-6 sm:px-8 pb-8 space-y-6">
          {items.map((item) => (
            <DownloadItemRow
              key={item.id}
              item={item}
              modalSource={modalSource}
              downloadButtonText={downloadButtonText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DownloadItemRow({
  item,
  modalSource,
  downloadButtonText,
}: {
  item: DownloadItem;
  modalSource: "ACTION_PLANS" | "PARTNERS";
  downloadButtonText: string;
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

  const variantOptions = useMemo(
    () =>
      options.map((o, i) => ({
        value: String(i),
        label: o.label,
        languageId: o.languageId,
      })),
    [options],
  );

  const handleDownload = () => {
    const opt = options[selectedIndex];
    if (!opt?.fileUrl) return;

    const url =
      opt.fileUrl.startsWith("/") || opt.fileUrl.startsWith("http")
        ? opt.fileUrl
        : `https://${opt.fileUrl}`;

    trackResourceDownload({
      modalSource,
      documentItemId: item.id,
      documentTitle: item.title?.trim() || null,
      selectorType: item.selectorType,
      selectedOptionLabel: opt.label,
      fileUrl: url,
    });

    window.open(url, "_blank");
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
          onClick={() => handleDownload()}
          disabled={options.length === 0}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#3C62ED] px-5 py-3.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#3558d4] disabled:cursor-not-allowed disabled:opacity-50 font-work-sans"
        >
          <Download className="h-5 w-5 shrink-0" aria-hidden />
          {downloadButtonText}
        </button>
      </div>
    </div>
  );
}
