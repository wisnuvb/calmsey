"use client";

import { useMemo } from "react";
import Image from "next/image";
import { orderDownloadFilesEnglishFirst } from "@/lib/download-language-order";
import { BarChart3, Download } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface DownloadFile {
  language: string;
  url: string;
}

export interface AnnualReportSectionProps {
  /** Bedakan Home vs About untuk pelacakan admin (`documentItemId`). */
  documentItemId: string;
  className?: string;
}

function ensureHttpsUrl(url: string): string {
  if (!url || url.trim() === "") return url;
  const trimmedUrl = url.trim();
  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;
  if (trimmedUrl.startsWith("//")) return `https:${trimmedUrl}`;
  if (trimmedUrl.startsWith("/")) return trimmedUrl;
  return `https://${trimmedUrl}`;
}

export function AnnualReportSection({
  documentItemId,
  className,
}: AnnualReportSectionProps) {
  const { getValue, getContentJSON, language } = usePageContentHelpers();

  const title = getValue(
    "annualReport.title",
    undefined,
    "Turning Tides 2025 Annual Report",
  );
  const badgeText = getValue(
    "annualReport.badgeText",
    undefined,
    "COMING SOON",
  );
  const description = getValue(
    "annualReport.description",
    undefined,
    "Learn more about Turning Tides' accomplishments, initiatives, and organizational growth throughout the year. The upcoming report highlights our dedication to accountability and sustainable impact.",
  );
  const buttonText = getValue("annualReport.buttonText", undefined, "Download");
  const thumbnail = getValue("annualReport.thumbnail", undefined, "").trim();
  const thumbnailAlt = getValue(
    "annualReport.thumbnailAlt",
    undefined,
    "Annual report",
  );

  const contextDownloadFiles = getContentJSON<DownloadFile[]>(
    "annualReport.downloadFiles",
    [],
  );
  const finalDownloadFiles = contextDownloadFiles.filter(
    (f) => f?.language?.trim() && f?.url?.trim(),
  );

  const downloadUrl = useMemo(() => {
    if (finalDownloadFiles.length === 0) return null;
    const ordered = orderDownloadFilesEnglishFirst(finalDownloadFiles);
    const cur = language.trim().toLowerCase();
    const match = ordered.find(
      (f) => f.language.trim().toLowerCase() === cur,
    );
    const file = match ?? ordered[0];
    return ensureHttpsUrl(file.url);
  }, [finalDownloadFiles, language]);

  const badgeTrimmed = badgeText.trim();
  const canDownload = Boolean(downloadUrl);

  const buttonClassName =
    "inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#e2e8f0] bg-white px-5 py-3.5 font-work-sans text-[15px] font-medium text-[#1e293b] shadow-none transition-colors hover:border-[#cbd5e1] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[148px] sm:px-6 sm:py-4";

  return (
    <section
      className={`${className ?? ""}`.trim()}
      aria-labelledby={`annual-report-heading-${documentItemId}`}
      id="annualreport"
    >
      <div className="bg-[#f0f4f8] container mx-auto px-4 py-8 sm:py-9 lg:py-10 lg:px-8 mb-10 lg:mb-20">
        <div className="flex flex-col gap-8 sm:gap-9 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-7 lg:items-start">
            {thumbnail ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg shadow-sm sm:h-20 sm:w-20">
                <Image
                  src={getImageUrl(thumbnail)}
                  alt={thumbnailAlt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ) : (
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3C62ED] shadow-sm sm:h-11 sm:w-11"
                aria-hidden
              >
                <BarChart3
                  className="h-[22px] w-[22px] text-white sm:h-6 sm:w-6"
                  strokeWidth={2}
                />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-2.5 sm:space-y-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2
                  id={`annual-report-heading-${documentItemId}`}
                  className="font-nunito text-lg font-bold leading-snug tracking-tight text-[#0f172a] sm:text-xl lg:text-[1.375rem]"
                >
                  {title}
                </h2>
                {badgeTrimmed ? (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-[#2dd4bf] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white sm:text-xs">
                    {badgeTrimmed}
                  </span>
                ) : null}
              </div>
              <p className="max-w-4xl font-work-sans text-sm leading-[1.55] text-[#475569] sm:text-[15px] sm:leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="flex w-full shrink-0 justify-stretch sm:justify-start lg:w-auto lg:justify-end">
            {canDownload && downloadUrl ? (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName}
              >
                <Download
                  className="h-[18px] w-[18px] shrink-0 text-[#64748b] sm:h-5 sm:w-5"
                  aria-hidden
                />
                {buttonText}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className={buttonClassName}
              >
                <Download
                  className="h-[18px] w-[18px] shrink-0 text-[#64748b] sm:h-5 sm:w-5"
                  aria-hidden
                />
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
