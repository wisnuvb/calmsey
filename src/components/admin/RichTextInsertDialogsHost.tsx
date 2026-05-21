"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { File, Plus, Trash2, X } from "lucide-react";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { buildMicrosoftFormModalLinkHtml } from "@/lib/ms-form-modal";
import { getCountrySelectOptions } from "@/lib/countries";
import { resolveCountryOptionFlagImgUrl } from "@/lib/country-flag";
import {
  resolveLanguageVariantFlagImgUrl,
  emojiToTwemoji72Url,
} from "@/lib/language-variant-flag";
import {
  buildRichTextDownloadModalLinkHtml,
  slugifyDocumentItemId,
  type RichTextDownloadFile,
  type RichTextDownloadSelectorType,
} from "@/lib/rich-text-download-modal";

/** Above download insert dialog (`z-[200]`). */
const NESTED_POPOVER_Z = "z-[210]";
const NESTED_MEDIA_OVERLAY_Z = "z-[250]";

type InsertCallback = (html: string) => void;

export type RichTextInsertHostHandle = {
  openFormModalInsert: (
    selectedText: string,
    insert: InsertCallback,
  ) => void;
  openDownloadModalInsert: (
    selectedText: string,
    insert: InsertCallback,
  ) => void;
};

type AdminLanguage = {
  id: string;
  name: string;
  flag: string | null;
};

interface RichTextInsertDialogsHostProps {
  defaultMicrosoftFormUrl?: string;
}

type FormDialogState = {
  selectedText: string;
  insert: InsertCallback;
};

type DownloadDialogState = {
  selectedText: string;
  insert: InsertCallback;
};

function emptyDownloadRow(): RichTextDownloadFile {
  return { language: "", url: "" };
}

function VariantFlagImg({ src, title }: { src: string; title: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      title={title}
      width={28}
      height={28}
      className="h-7 w-7 rounded-full object-cover"
    />
  );
}

export const RichTextInsertDialogsHost = forwardRef<
  RichTextInsertHostHandle,
  RichTextInsertDialogsHostProps
>(function RichTextInsertDialogsHost(
  { defaultMicrosoftFormUrl },
  ref,
) {
  const [formDialog, setFormDialog] = useState<FormDialogState | null>(null);
  const [downloadDialog, setDownloadDialog] =
    useState<DownloadDialogState | null>(null);

  const [formLinkText, setFormLinkText] = useState("");
  const [formUrl, setFormUrl] = useState("");

  const [linkText, setLinkText] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalSubtitle, setModalSubtitle] = useState("");
  const [downloadButtonText, setDownloadButtonText] = useState("Download");
  const [documentItemId, setDocumentItemId] = useState("");
  const [selectorType, setSelectorType] =
    useState<RichTextDownloadSelectorType>("language");
  const [downloadFiles, setDownloadFiles] = useState<RichTextDownloadFile[]>([
    emptyDownloadRow(),
  ]);
  const [downloadError, setDownloadError] = useState("");
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerRowIndex, setMediaPickerRowIndex] = useState<number | null>(
    null,
  );

  const countryOptions = useMemo(() => getCountrySelectOptions(), []);

  const languageVariantOptions = useMemo(
    () =>
      languages.map((lang) => ({
        value: lang.id,
        label: lang.name,
      })),
    [languages],
  );

  const languagesForResolve = useMemo(
    () =>
      languages.map((lang) => ({
        id: lang.id,
        name: lang.name,
        flag: lang.flag,
      })),
    [languages],
  );

  const placeholderFlagSrc = useMemo(
    () => emojiToTwemoji72Url("🌐")!,
    [],
  );

  const renderLanguageLeading = useCallback(
    (option: { value: string; label: string }) => {
      const src =
        languagesLoading && languagesForResolve.length === 0
          ? placeholderFlagSrc
          : resolveLanguageVariantFlagImgUrl(languagesForResolve, {
              label: option.label,
              languageId: option.value,
            });
      return <VariantFlagImg src={src} title={option.label} />;
    },
    [
      languagesForResolve,
      languagesLoading,
      placeholderFlagSrc,
    ],
  );

  const renderCountryLeading = useCallback(
    (option: { value: string; label: string }) => (
      <VariantFlagImg
        src={resolveCountryOptionFlagImgUrl(option.value)}
        title={option.label}
      />
    ),
    [],
  );

  useImperativeHandle(ref, () => ({
    openFormModalInsert: (selectedText, insert) => {
      setFormLinkText(selectedText.trim());
      setFormUrl(defaultMicrosoftFormUrl ?? "");
      setFormDialog({ selectedText, insert });
    },
    openDownloadModalInsert: (selectedText, insert) => {
      const trimmed = selectedText.trim();
      setLinkText(trimmed);
      setModalTitle(trimmed);
      setModalSubtitle("");
      setDownloadButtonText("Download");
      setDocumentItemId(trimmed ? slugifyDocumentItemId(trimmed) : "");
      setSelectorType("language");
      setDownloadFiles([emptyDownloadRow()]);
      setDownloadError("");
      setDownloadDialog({ selectedText, insert });
    },
  }));

  useEffect(() => {
    if (!downloadDialog) return;
    let cancelled = false;

    async function loadLanguages() {
      setLanguagesLoading(true);
      try {
        const res = await fetch(
          "/api/admin/languages?limit=500&isActive=true&sortBy=name&sortOrder=asc",
        );
        const data = (await res.json()) as {
          success?: boolean;
          data?: AdminLanguage[];
        };
        if (!cancelled && data.success && Array.isArray(data.data)) {
          setLanguages(data.data);
        }
      } catch {
        if (!cancelled) setLanguages([]);
      } finally {
        if (!cancelled) setLanguagesLoading(false);
      }
    }

    void loadLanguages();
    return () => {
      cancelled = true;
    };
  }, [downloadDialog]);

  const closeFormDialog = useCallback(() => setFormDialog(null), []);
  const closeDownloadDialog = useCallback(() => setDownloadDialog(null), []);

  const submitFormDialog = useCallback(() => {
    if (!formDialog) return;
    formDialog.insert(
      buildMicrosoftFormModalLinkHtml(formLinkText, formUrl),
    );
    closeFormDialog();
  }, [closeFormDialog, formDialog, formLinkText, formUrl]);

  const updateDownloadFile = useCallback(
    (index: number, key: keyof RichTextDownloadFile, value: string) => {
      setDownloadFiles((prev) =>
        prev.map((row, i) =>
          i === index ? { ...row, [key]: value } : row,
        ),
      );
    },
    [],
  );

  const addDownloadFile = useCallback(() => {
    setDownloadFiles((prev) => [...prev, emptyDownloadRow()]);
  }, []);

  const removeDownloadFile = useCallback((index: number) => {
    setDownloadFiles((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }, []);

  const openMediaPickerForRow = useCallback((index: number) => {
    setMediaPickerRowIndex(index);
    setMediaPickerOpen(true);
  }, []);

  const submitDownloadDialog = useCallback(() => {
    if (!downloadDialog) return;
    setDownloadError("");
    try {
      const html = buildRichTextDownloadModalLinkHtml({
        linkText,
        title: modalTitle,
        subtitle: modalSubtitle,
        downloadButtonText,
        documentItemId,
        selectorType,
        files: downloadFiles,
      });
      downloadDialog.insert(html);
      closeDownloadDialog();
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Could not build download link.",
      );
    }
  }, [
    closeDownloadDialog,
    documentItemId,
    downloadButtonText,
    downloadDialog,
    downloadFiles,
    linkText,
    modalSubtitle,
    modalTitle,
    selectorType,
  ]);

  const variantLabel =
    selectorType === "country" ? "Country / region" : "Language";
  const filesSectionLabel =
    selectorType === "country"
      ? "PDF files by country"
      : "PDF files by language";

  return (
    <>
      {formDialog ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={closeFormDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rich-text-form-insert-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3
                id="rich-text-form-insert-title"
                className="text-lg font-semibold text-gray-900"
              >
                Insert Microsoft Form modal link
              </h3>
              <button
                type="button"
                onClick={closeFormDialog}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Link text
                <input
                  type="text"
                  value={formLinkText}
                  onChange={(e) => setFormLinkText(e.target.value)}
                  placeholder="Give feedback"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Form embed URL
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://forms.cloud.microsoft/r/..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeFormDialog}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitFormDialog}
                className="rounded-lg bg-[#3C62ED] px-4 py-2 text-sm font-medium text-white"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {downloadDialog ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={closeDownloadDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rich-text-download-insert-title"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
              <div>
                <h3
                  id="rich-text-download-insert-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Insert multi-language download link
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Opens a download modal with language or country picker on the
                  public site.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDownloadDialog}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto px-6 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Link text
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Download policy"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Modal title
                  <input
                    type="text"
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    placeholder="Download policy"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Modal subtitle (optional)
                <input
                  type="text"
                  value={modalSubtitle}
                  onChange={(e) => setModalSubtitle(e.target.value)}
                  placeholder="Choose your language to download the PDF."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Download button text
                  <input
                    type="text"
                    value={downloadButtonText}
                    onChange={(e) => setDownloadButtonText(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Document ID (analytics)
                  <input
                    type="text"
                    value={documentItemId}
                    onChange={(e) => setDocumentItemId(e.target.value)}
                    placeholder="grievance-policy-pdf"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-gray-700">
                  Visitor picks file by
                </legend>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="download-selector-type"
                      checked={selectorType === "language"}
                      onChange={() => {
                        setSelectorType("language");
                        setDownloadFiles([emptyDownloadRow()]);
                      }}
                    />
                    Language (Settings → Languages)
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="download-selector-type"
                      checked={selectorType === "country"}
                      onChange={() => {
                        setSelectorType("country");
                        setDownloadFiles([emptyDownloadRow()]);
                      }}
                    />
                    Country / region (all countries)
                  </label>
                </div>
              </fieldset>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {filesSectionLabel}
                  </p>
                  <button
                    type="button"
                    onClick={addDownloadFile}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add {selectorType === "country" ? "country" : "language"}
                  </button>
                </div>

                <div className="space-y-3">
                  {downloadFiles.map((row, index) => (
                    <div
                      key={`download-row-${index}`}
                      className="space-y-3 rounded-lg border border-gray-200 p-3"
                    >
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <div>
                          <p className="mb-1 text-xs font-medium text-gray-600">
                            {variantLabel}
                          </p>
                          {selectorType === "country" ? (
                            <SearchableCombobox
                              id={`rich-text-download-country-${index}`}
                              value={row.language}
                              onValueChange={(value) =>
                                updateDownloadFile(index, "language", value)
                              }
                              options={countryOptions}
                              placeholder="Select country"
                              searchPlaceholder="Search country…"
                              listHeightClassName="h-[240px]"
                              popoverContentClassName={NESTED_POPOVER_Z}
                              renderOptionLeading={renderCountryLeading}
                            />
                          ) : (
                            <SearchableCombobox
                              id={`rich-text-download-language-${index}`}
                              value={row.language}
                              onValueChange={(value) =>
                                updateDownloadFile(index, "language", value)
                              }
                              options={languageVariantOptions}
                              placeholder={
                                languagesLoading
                                  ? "Loading languages…"
                                  : languageVariantOptions.length === 0
                                    ? "No active languages"
                                    : "Select language"
                              }
                              searchPlaceholder="Search language…"
                              listHeightClassName="h-[240px]"
                              disabled={languagesLoading}
                              popoverContentClassName={NESTED_POPOVER_Z}
                              renderOptionLeading={renderLanguageLeading}
                            />
                          )}
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeDownloadFile(index)}
                            disabled={downloadFiles.length <= 1}
                            className="inline-flex h-[42px] items-center justify-center rounded-lg border border-gray-300 px-3 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Remove row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-medium text-gray-600">
                          PDF file
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={row.url}
                            onChange={(e) =>
                              updateDownloadFile(index, "url", e.target.value)
                            }
                            placeholder="/downloads/policy-en.pdf"
                            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => openMediaPickerForRow(index)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#3C62ED] px-3 py-2 text-sm font-medium text-white hover:bg-[#3558d4]"
                          >
                            <File className="h-4 w-4" />
                            Media
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {downloadError ? (
                <p className="text-sm text-red-600" role="alert">
                  {downloadError}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeDownloadDialog}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitDownloadDialog}
                className="rounded-lg bg-[#3C62ED] px-4 py-2 text-sm font-medium text-white"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaPickerRowIndex(null);
        }}
        onSelect={(selectedUrls) => {
          if (mediaPickerRowIndex === null || selectedUrls.length === 0) return;
          updateDownloadFile(mediaPickerRowIndex, "url", selectedUrls[0]);
          setMediaPickerOpen(false);
          setMediaPickerRowIndex(null);
        }}
        mode="single"
        allowedTypes={["documents"]}
        initialFilter="documents"
        overlayClassName={NESTED_MEDIA_OVERLAY_Z}
      />
    </>
  );
});
