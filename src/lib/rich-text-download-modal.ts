export type RichTextDownloadFile = {
  language: string;
  url: string;
};

export const MS_DOWNLOAD_FILES_ATTR = "data-ms-download-files";
export const MS_DOWNLOAD_TITLE_ATTR = "data-ms-download-title";
export const MS_DOWNLOAD_SUBTITLE_ATTR = "data-ms-download-subtitle";
export const MS_DOWNLOAD_BUTTON_ATTR = "data-ms-download-button";
export const MS_DOWNLOAD_DOC_ID_ATTR = "data-ms-download-doc-id";
export const MS_DOWNLOAD_SELECTOR_TYPE_ATTR = "data-ms-download-selector-type";

export type RichTextDownloadSelectorType = "language" | "country";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}

export function slugifyDocumentItemId(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "policy-download";
}

export function parseRichTextDownloadFiles(
  raw: string | null,
): RichTextDownloadFile[] | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const files = parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const language =
          "language" in item && typeof item.language === "string"
            ? item.language.trim()
            : "";
        const url =
          "url" in item && typeof item.url === "string" ? item.url.trim() : "";
        if (!language || !url) return null;
        return { language, url };
      })
      .filter((item): item is RichTextDownloadFile => item !== null);
    return files.length > 0 ? files : null;
  } catch {
    return null;
  }
}

export function isRichTextDownloadModalLink(
  element: Element | null,
): element is HTMLAnchorElement {
  if (!element || !(element instanceof HTMLAnchorElement)) return false;
  return parseRichTextDownloadFiles(
    element.getAttribute(MS_DOWNLOAD_FILES_ATTR),
  ) !== null;
}

export function getRichTextDownloadModalPayload(link: HTMLAnchorElement): {
  files: RichTextDownloadFile[];
  title: string;
  subtitle: string;
  downloadButtonText: string;
  documentItemId: string;
  selectorType: RichTextDownloadSelectorType;
} | null {
  const files = parseRichTextDownloadFiles(
    link.getAttribute(MS_DOWNLOAD_FILES_ATTR),
  );
  if (!files) return null;

  const linkText = link.textContent?.trim() || "Download";
  const title =
    link.getAttribute(MS_DOWNLOAD_TITLE_ATTR)?.trim() || linkText;
  const subtitle = link.getAttribute(MS_DOWNLOAD_SUBTITLE_ATTR)?.trim() ?? "";
  const downloadButtonText =
    link.getAttribute(MS_DOWNLOAD_BUTTON_ATTR)?.trim() || "Download";
  const documentItemId =
    link.getAttribute(MS_DOWNLOAD_DOC_ID_ATTR)?.trim() ||
    slugifyDocumentItemId(title);
  const selectorTypeRaw = link
    .getAttribute(MS_DOWNLOAD_SELECTOR_TYPE_ATTR)
    ?.trim()
    .toLowerCase();

  return {
    files,
    title,
    subtitle,
    downloadButtonText,
    documentItemId,
    selectorType: selectorTypeRaw === "country" ? "country" : "language",
  };
}

export function buildRichTextDownloadModalLinkHtml({
  linkText,
  title,
  subtitle,
  downloadButtonText,
  documentItemId,
  selectorType = "language",
  files,
}: {
  linkText: string;
  title?: string;
  subtitle?: string;
  downloadButtonText?: string;
  documentItemId?: string;
  selectorType?: RichTextDownloadSelectorType;
  files: RichTextDownloadFile[];
}): string {
  const text = linkText.trim() || "Download";
  const validFiles = files.filter((f) => f.language.trim() && f.url.trim());
  if (validFiles.length === 0) {
    throw new Error(
      selectorType === "country"
        ? "At least one country and file URL is required."
        : "At least one language and file URL is required.",
    );
  }

  const resolvedTitle = title?.trim() || text;
  const filesJson = escapeAttr(JSON.stringify(validFiles));
  const attrs = [
    `href="#"`,
    `${MS_DOWNLOAD_FILES_ATTR}="${filesJson}"`,
    `${MS_DOWNLOAD_TITLE_ATTR}="${escapeAttr(resolvedTitle)}"`,
    `${MS_DOWNLOAD_DOC_ID_ATTR}="${escapeAttr(documentItemId?.trim() || slugifyDocumentItemId(resolvedTitle))}"`,
    `role="button"`,
  ];

  if (selectorType === "country") {
    attrs.push(`${MS_DOWNLOAD_SELECTOR_TYPE_ATTR}="country"`);
  }

  const subtitleValue = subtitle?.trim();
  if (subtitleValue) {
    attrs.push(
      `${MS_DOWNLOAD_SUBTITLE_ATTR}="${escapeAttr(subtitleValue)}"`,
    );
  }

  const buttonText = downloadButtonText?.trim();
  if (buttonText && buttonText !== "Download") {
    attrs.push(
      `${MS_DOWNLOAD_BUTTON_ATTR}="${escapeAttr(buttonText)}"`,
    );
  }

  return `<a ${attrs.join(" ")}>${escapeHtml(text)}</a>`;
}

export const RICH_TEXT_DOWNLOAD_MODAL_ATTRS = [
  MS_DOWNLOAD_FILES_ATTR,
  MS_DOWNLOAD_TITLE_ATTR,
  MS_DOWNLOAD_SUBTITLE_ATTR,
  MS_DOWNLOAD_BUTTON_ATTR,
  MS_DOWNLOAD_DOC_ID_ATTR,
  MS_DOWNLOAD_SELECTOR_TYPE_ATTR,
] as const;
