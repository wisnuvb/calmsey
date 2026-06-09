"use client";

import { useMemo } from "react";
import Image from "next/image";
import { orderDownloadFilesEnglishFirst } from "@/lib/download-language-order";
import { BarChart3 } from "lucide-react";
import { H3, P } from "../ui/typography";
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
    "inline-flex w-full items-center justify-center rounded-lg bg-[#3C62ED] px-6 py-3.5 font-work-sans text-base font-normal text-white transition-colors hover:bg-[#2d4fd6] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[160px] sm:px-8 sm:py-4";

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
      <div className="container mx-auto mb-12 px-4 lg:mb-20">
        <div className="flex flex-col overflow-hidden rounded bg-[#f0f4f8] sm:min-h-[168px] sm:flex-row sm:items-stretch lg:min-h-[180px]">
          {thumbnail ? (
            <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-[220px] md:w-[260px] lg:w-[300px]">
              <Image
                src={getImageUrl(thumbnail)}
                alt={thumbnailAlt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 220px, (max-width: 1024px) 260px, 300px"
              />
            </div>
          ) : (
            <div
              className="flex h-52 w-full shrink-0 items-center justify-center bg-[#3C62ED] sm:h-auto sm:w-[220px] md:w-[260px] lg:w-[300px]"
              aria-hidden
            >
              <BarChart3
                className="h-10 w-10 text-white sm:h-12 sm:w-12"
                strokeWidth={2}
              />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-8 sm:py-10 lg:gap-12 lg:px-10 lg:py-12">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <H3
                  id={`annual-report-heading-${documentItemId}`}
                  style="h6bold"
                  className="text-[#010107]"
                >
                  {title}
                </H3>
                {badgeTrimmed ? (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-[#2dd4bf] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white sm:text-xs">
                    {badgeTrimmed}
                  </span>
                ) : null}
              </div>
              <P className="text-[#06072680] p">{description}</P>
            </div>

            <div className="w-full shrink-0 sm:w-auto">{ctaButton}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
