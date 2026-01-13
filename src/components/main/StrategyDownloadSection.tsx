"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import { H5 } from "../ui/typography";
import { usePageContent } from "@/contexts/PageContentContext";
import { useLanguage } from "../public/LanguageProvider";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";

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

  // Try to get content from context, fallback to empty object if not available
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

  // Helper to get value from content
  const getContentValue = (key: string, defaultValue: string = ""): string => {
    return pageContent[key] || defaultValue;
  };

  // Helper to get JSON value from content
  const getContentJSON = <T,>(key: string, defaultValue: T): T => {
    const value = pageContent[key];
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  };

  // Helper function to get value with priority: context > props > default
  const getValue = (
    contentKey: string,
    propValue?: string,
    defaultValue: string = ""
  ): string => {
    const contentValue = getContentValue(contentKey, "");
    if (contentValue && contentValue.trim() !== "") {
      return contentValue;
    }
    if (propValue && propValue.trim() !== "") {
      return propValue;
    }
    return defaultValue;
  };

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

    // Jika tidak ada protokol, tambahkan https://
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
    "Learn Our Funds"
  );

  const learnMoreButtonUrl = getValue(
    "strategy.learnMoreButtonUrl",
    propLearnMoreButtonUrl,
    "/our-fund"
  );

  // Get language name helper
  const getLanguageName = (langCode: string): string => {
    const lang = activeLanguages.find((l) => l.id === langCode);
    return lang?.name || langCode.toUpperCase();
  };

  // Handle download click
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (finalDownloadFiles.length === 1) {
      // If only one file, download directly
      const file = finalDownloadFiles[0];
      const url = file.url.startsWith("/")
        ? file.url
        : ensureHttpsUrl(file.url);
      window.open(url, "_blank");
    } else {
      // Show modal to select language
      setIsModalOpen(true);
    }
  };

  // Handle language selection
  const handleLanguageSelect = (file: DownloadFile) => {
    const url = file.url.startsWith("/") ? file.url : ensureHttpsUrl(file.url);
    window.open(url, "_blank");
    setIsModalOpen(false);
  };

  return (
    <section className="bg-[#3C62ED]">
      <div className="container mx-auto px-4">
        {withBorderTop && <div className="border border-[#FFFFFF80]" />}
        <div className="py-8 sm:py-11 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left - Text Content */}
          <H5
            style="h5regular"
            className="text-white text-lg sm:text-2xl leading-[140%] tracking-normal max-w-[466px]"
          >
            {description}
          </H5>

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
              href={learnMoreButtonUrl}
              className="py-5 px-8 border border-white rounded w-full sm:w-[310px] text-white hover:bg-white/10 transition-colors text-center"
            >
              {learnMoreButtonText}
            </a>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Select Language
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Choose your preferred language to download the strategy document:
            </p>
            <div className="space-y-2">
              {finalDownloadFiles.map((file) => (
                <button
                  key={file.language}
                  onClick={() => handleLanguageSelect(file)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    file.language === currentLanguage
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {getLanguageName(file.language)}
                    </span>
                    {file.language === currentLanguage && (
                      <span className="text-xs text-blue-600">(Current)</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
