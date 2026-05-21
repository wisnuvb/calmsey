"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface MicrosoftFormModalProps {
  open: boolean;
  title: string;
  formEmbedUrl: string;
  onClose: () => void;
  titleId?: string;
}

export function MicrosoftFormModal({
  open,
  title,
  formEmbedUrl,
  onClose,
  titleId = "microsoft-form-modal-title",
}: MicrosoftFormModalProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200 px-4 py-3 sm:px-6">
          <h3
            id={titleId}
            className="font-nunito text-lg font-semibold text-[#010107]"
          >
            {title}
          </h3>
          <button
            type="button"
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-[min(72vh,620px)] flex-1 bg-neutral-50">
          <iframe
            title={title}
            src={formEmbedUrl}
            className="h-full min-h-[min(72vh,620px)] w-full border-0"
            allow="clipboard-write; encrypted-media; fullscreen"
          />
        </div>
        <div className="shrink-0 border-t border-neutral-200 px-4 py-2 sm:px-6">
          <p className="text-center text-xs text-neutral-500">
            <a
              href={formEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3C62ED] underline hover:no-underline"
            >
              Open form in new tab
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
