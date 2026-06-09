"use client";

import { useMemo } from "react";
import Image from "next/image";
import { orderDownloadFilesEnglishFirst } from "@/lib/download-language-order";
import { BarChart3 } from "lucide-react";
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
    "inline-flex w-full items-center justify-center rounded-md bg-[#3C62ED] px-6 py-3 font-work-sans text-[15px] font-medium text-white transition-colors hover:bg-[#2d4fd6] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[148px] sm:px-7 sm:py-3.5";

  const ctaButton =
    canDownload && downloadUrl ? (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName}
      >
        {buttonText}
      </a>
    ) : (
      <button type="button" disabled className={buttonClassName}>
        {buttonText}
      </button>
    );

  return (
    <section
      className={`${className ?? ""}`.trim()}
      aria-labelledby={`annual-report-heading-${documentItemId}`}
      id="annualreport"
    >
      <div className="container mx-auto mb-10 px-4 lg:mb-20 lg:px-8">
        <div className="flex flex-col overflow-hidden rounded-xl bg-[#f0f4f8] sm:flex-row sm:items-stretch">
          {thumbnail ? (
            <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-[150px] lg:w-[168px]">
              <Image
                src={getImageUrl(thumbnail)}
                alt={thumbnailAlt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 150px, 168px"
              />
            </div>
          ) : (
            <div
              className="flex h-40 w-full shrink-0 items-center justify-center bg-[#3C62ED] sm:h-auto sm:w-[150px] lg:w-[168px]"
              aria-hidden
            >
              <BarChart3
                className="h-8 w-8 text-white sm:h-10 sm:w-10"
                strokeWidth={2}
              />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-5 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5 sm:pl-6 lg:gap-8 lg:p-6 lg:pl-8">
            <div className="min-w-0 flex-1 space-y-2 sm:space-y-2.5">
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
              <p className="font-work-sans text-sm leading-[1.55] text-[#475569] sm:text-[15px] sm:leading-relaxed">
                {description}
              </p>
            </div>

            <div className="w-full shrink-0 sm:w-auto">{ctaButton}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
