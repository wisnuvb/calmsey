import {
  getMicrosoftFormModalUrl,
  MS_FORM_MODAL_ATTR,
} from "@/lib/ms-form-modal";
import {
  getRichTextDownloadModalPayload,
  MS_DOWNLOAD_FILES_ATTR,
  type RichTextDownloadFile,
  type RichTextDownloadSelectorType,
} from "@/lib/rich-text-download-modal";

/** TinyMCE editor instance (DOM utils + selection). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TinyEditor = any;

export type FormModalEditInitial = {
  linkText: string;
  formUrl: string;
};

export type DownloadModalEditInitial = {
  linkText: string;
  title: string;
  subtitle: string;
  downloadButtonText: string;
  documentItemId: string;
  selectorType: RichTextDownloadSelectorType;
  files: RichTextDownloadFile[];
};

export function getSelectedDownloadModalLink(
  editor: TinyEditor,
): HTMLAnchorElement | null {
  const el = editor.dom.getParent(
    editor.selection.getStart(),
    `a[${MS_DOWNLOAD_FILES_ATTR}]`,
  );
  return el ?? null;
}

export function getSelectedFormModalLink(
  editor: TinyEditor,
): HTMLAnchorElement | null {
  const el = editor.dom.getParent(
    editor.selection.getStart(),
    `a[${MS_FORM_MODAL_ATTR}]`,
  );
  return el ?? null;
}

export function readDownloadModalEditInitial(
  link: HTMLAnchorElement,
): DownloadModalEditInitial | null {
  const payload = getRichTextDownloadModalPayload(link);
  if (!payload) return null;
  return {
    linkText: link.textContent?.trim() ?? "",
    title: payload.title,
    subtitle: payload.subtitle,
    downloadButtonText: payload.downloadButtonText,
    documentItemId: payload.documentItemId,
    selectorType: payload.selectorType,
    files: payload.files.map((file) => ({ ...file })),
  };
}

export function readFormModalEditInitial(
  link: HTMLAnchorElement,
): FormModalEditInitial {
  return {
    linkText: link.textContent?.trim() ?? "",
    formUrl: getMicrosoftFormModalUrl(link),
  };
}

export function applyModalLinkInEditor(
  editor: TinyEditor,
  html: string,
  attrName: string,
): void {
  const existing = editor.dom.getParent(
    editor.selection.getStart(),
    `a[${attrName}]`,
  );
  if (existing) {
    editor.dom.setOuterHTML(existing, html);
  } else {
    editor.insertContent(html);
  }
}
