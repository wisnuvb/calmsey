export const MS_FORM_MODAL_ATTR = "data-ms-form-url";

export const DEFAULT_MS_FORM_EMBED_URL =
  "https://forms.cloud.microsoft/r/TjvKdyuTdH";

export function isMicrosoftFormModalLink(
  element: Element | null,
): element is HTMLAnchorElement {
  if (!element || !(element instanceof HTMLAnchorElement)) return false;
  const url = element.getAttribute(MS_FORM_MODAL_ATTR);
  return typeof url === "string" && url.trim() !== "";
}

export function getMicrosoftFormModalUrl(link: HTMLAnchorElement): string {
  return link.getAttribute(MS_FORM_MODAL_ATTR)?.trim() ?? "";
}

export function buildMicrosoftFormModalLinkHtml(
  linkText: string,
  formUrl: string,
): string {
  const text = linkText.trim() || "Open form";
  const url = formUrl.trim() || DEFAULT_MS_FORM_EMBED_URL;
  const escapedUrl = url
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
  const escapedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<a href="#" ${MS_FORM_MODAL_ATTR}="${escapedUrl}" role="button">${escapedText}</a>`;
}
