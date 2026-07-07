"use client";

import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { createDownloadLanguageNameResolver } from "@/lib/download-language-labels";
import {
  getMicrosoftFormModalUrl,
  isMicrosoftFormModalLink,
} from "@/lib/ms-form-modal";
import {
  getRichTextDownloadModalPayload,
  isRichTextDownloadModalLink,
} from "@/lib/rich-text-download-modal";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";
import { MicrosoftFormModal } from "./MicrosoftFormModal";
import { Strategy2030DownloadLeadModal } from "./Strategy2030DownloadLeadModal";
import type { ResourceDownloadModalSource } from "./Strategy2030DownloadLeadModal";

interface RichTextWithEmbeddedModalsProps {
  html: string;
  className?: string;
  modalTitleIdPrefix?: string;
  modalSource?: ResourceDownloadModalSource;
}

function ensureHttpsUrl(url: string): string {
  if (!url || url.trim() === "") return url;
  const trimmedUrl = url.trim();
  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;
  if (trimmedUrl.startsWith("//")) return `https:${trimmedUrl}`;
  if (trimmedUrl.startsWith("/")) return trimmedUrl;
  return `https://${trimmedUrl}`;
}

export function RichTextWithEmbeddedModals({
  html,
  className,
  modalTitleIdPrefix = "rich-text-modal",
  modalSource = "GUIDING_POLICIES",
}: RichTextWithEmbeddedModalsProps) {
  const { languages: activeLanguages } = useActiveLanguages();
  const [formModal, setFormModal] = useState<{ title: string; url: string } | null>(
    null,
  );
  const [downloadModal, setDownloadModal] = useState<
    NonNullable<ReturnType<typeof getRichTextDownloadModalPayload>>
  | null>(null);

  const getLanguageName = useMemo(
    () => createDownloadLanguageNameResolver(activeLanguages),
    [activeLanguages],
  );

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as Element).closest("a");
    if (!link) return;

    if (isMicrosoftFormModalLink(link)) {
      event.preventDefault();
      setFormModal({
        title: link.textContent?.trim() || "Form",
        url: getMicrosoftFormModalUrl(link),
      });
      return;
    }

    if (isRichTextDownloadModalLink(link)) {
      event.preventDefault();
      const payload = getRichTextDownloadModalPayload(link);
      if (payload) setDownloadModal(payload);
    }
  }, []);

  return (
    <>
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={handleClick}
      />

      <MicrosoftFormModal
        open={formModal !== null}
        title={formModal?.title ?? "Form"}
        formEmbedUrl={formModal?.url ?? ""}
        onClose={() => setFormModal(null)}
        titleId={`${modalTitleIdPrefix}-form`}
      />

      {downloadModal ? (
        <Strategy2030DownloadLeadModal
          title={downloadModal.title}
          subtitle={downloadModal.subtitle || undefined}
          downloadButtonText={downloadModal.downloadButtonText}
          documentTitle={downloadModal.title}
          documentItemId={downloadModal.documentItemId}
          modalSource={modalSource}
          formFieldIdPrefix={`${modalTitleIdPrefix}-download`}
          headingId={`${modalTitleIdPrefix}-download-heading`}
          files={downloadModal.files}
          getLanguageName={getLanguageName}
          normalizeUrl={ensureHttpsUrl}
          fileSelectorType={downloadModal.selectorType}
          onClose={() => setDownloadModal(null)}
        />
      ) : null}
    </>
  );
}

/** @deprecated Use RichTextWithEmbeddedModals */
export const RichTextWithMicrosoftFormModal = RichTextWithEmbeddedModals;
