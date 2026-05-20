"use client";

import { useMemo, useState } from "react";
import { createDownloadLanguageNameResolver } from "@/lib/download-language-labels";
import { Download } from "lucide-react";
import { P } from "../ui/typography";
import { useLanguage } from "../public/LanguageProvider";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import {
  STRATEGY_2030_DOCUMENT_IDS,
  Strategy2030DownloadLeadModal,
} from "@/components/main/Strategy2030DownloadLeadModal";

interface DownloadFile {
  language: string;
  url: string;
}

interface StrategyDownloadSectionProps {
  description?: string;
  downloadUrl?: string; // Legacy support
  downloadFiles?: DownloadFile[]; // New structure
  downloadButtonText?: string;
  learnMoreButtonText?: string;
  learnMoreButtonUrl?: string;
  withBorderTop?: boolean;
}

export function StrategyDownloadSection({
  description: propDescription,
  downloadUrl: propDownloadUrl,
  downloadFiles: propDownloadFiles,
  downloadButtonText: propDownloadButtonText,
  learnMoreButtonText: propLearnMoreButtonText,
  learnMoreButtonUrl: propLearnMoreButtonUrl,
  withBorderTop,
}: StrategyDownloadSectionProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language: currentLanguage } = useLanguage();
  const { languages: activeLanguages } = useActiveLanguages();

  const { getValue, getContentJSON } = usePageContentHelpers()

  // Helper function to ensure URL has https:// protocol
  const ensureHttpsUrl = (url: string): string => {
    if (!url || url.trim() === "") {
      return url;
    }

    const trimmedUrl = url.trim();

    // Jika sudah memiliki protokol (http:// atau https://), return as-is
    if (/^https?:\/\//i.test(trimmedUrl)) {
      return trimmedUrl;
    }

    // Jika dimulai dengan // (protocol-relative), tambahkan https:
    if (trimmedUrl.startsWith("//")) {
      return `https:${trimmedUrl}`;
    }

    if (trimmedUrl.startsWith("/")) {
      return trimmedUrl;
    }

    return `https://${trimmedUrl}`;
  };

  // Get all values with priority: context > props > default
  const description = getValue(
    "strategy.description",
    propDescription,
    "Our approach, values, risk mitigation, milestones and budget estimates are in our Strategy to 2030."
  );

  // Get download files - new structure
  const contextDownloadFiles = getContentJSON<DownloadFile[]>(
    "strategy.downloadFiles",
    []
  );
  const downloadFiles =
    contextDownloadFiles.length > 0
      ? contextDownloadFiles
      : propDownloadFiles || [];

  // Legacy support: if downloadUrl is provided but no downloadFiles, create one
  const legacyDownloadUrl = getValue(
    "strategy.downloadUrl",
    propDownloadUrl,
    ""
  );
  const finalDownloadFiles =
    downloadFiles.length > 0
      ? downloadFiles
      : legacyDownloadUrl
        ? [{ language: "en", url: legacyDownloadUrl }]
        : [{ language: "en", url: "/downloads/strategy-2030.pdf" }];

  const downloadButtonText = getValue(
    "strategy.buttonText",
    propDownloadButtonText,
    "Download Our Strategy 2030"
  );

  const learnMoreButtonText = getValue(
    "strategy.learnMoreButtonText",
    propLearnMoreButtonText,
    "Our Funds"
  );

  const learnMoreButtonUrl = getValue(
    "strategy.learnMoreButtonUrl",
    propLearnMoreButtonUrl,
    "/our-fund"
  );

  const strategyDownloadModalTitle = getValue(
    "strategy.downloadModalTitle",
    undefined,
    "Download Strategy to 2030",
  );

  const strategyDownloadModalSubtitle = getValue(
    "strategy.downloadModalSubtitle",
    undefined,
    "Enter your details to download. We use this information to understand interest in our strategy document.",
  );

  const strategyDownloadModalButtonText = getValue(
    "strategy.downloadModalButtonText",
    undefined,
    "Download now",
  );

  const strategyDownloadDocumentTitle = getValue(
    "strategy.downloadDocumentTitle",
    undefined,
    "Strategy to 2030",
  );

  const getLanguageName = useMemo(
    () => createDownloadLanguageNameResolver(activeLanguages),
    [activeLanguages],
  );

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (finalDownloadFiles.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <section className="bg-[#3C62ED]">
      <div className="container mx-auto px-4">
        {withBorderTop && <div className="border border-[#FFFFFF80]" />}
        <div className="py-8 sm:py-11 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left - Text Content */}
          <P
            style="h5regular"
            className="text-white text-lg sm:text-2xl leading-[140%] tracking-normal max-w-[466px]"
          >
            {description}
          </P>

          {/* Right - CTA Buttons */}
          <div className="flex flex-col items-center justify-center shrink-0 font-normal font-nunito-sans text-base gap-3">
            <button
              onClick={handleDownloadClick}
              className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl w-full sm:w-[310px]"
            >
              <Download className="w-5 h-5" />
              {downloadButtonText}
            </button>
            <a
              href={learnMoreButtonUrl.startsWith("/") ? `/${currentLanguage}${learnMoreButtonUrl}` : learnMoreButtonUrl}
              className="py-5 px-8 border border-white rounded w-full sm:w-[310px] text-white hover:bg-white/10 transition-colors text-center"
              aria-label={learnMoreButtonText}
            >
              {learnMoreButtonText}
            </a>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Strategy2030DownloadLeadModal
          key={finalDownloadFiles
            .map((f) => `${f.language.trim()}:${f.url.trim()}`)
            .join("|")}
          title={strategyDownloadModalTitle}
          subtitle={strategyDownloadModalSubtitle}
          downloadButtonText={strategyDownloadModalButtonText}
          documentTitle={strategyDownloadDocumentTitle}
          documentItemId={STRATEGY_2030_DOCUMENT_IDS.homeBanner}
          formFieldIdPrefix="strategy-banner-dl"
          headingId="strategy-banner-download-modal-title"
          files={finalDownloadFiles}
          getLanguageName={getLanguageName}
          normalizeUrl={ensureHttpsUrl}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
