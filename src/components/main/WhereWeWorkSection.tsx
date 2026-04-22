"use client";

import Image from "next/image";
import { ExternalLink, Download, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useState } from "react";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface DownloadOption {
  label: string;
  fileUrl: string;
}

interface DownloadItem {
  id: string;
  title?: string;
  selectorType: "language" | "country";
  downloadOptions: DownloadOption[] | string;
}

interface WhereWeWorkSectionProps {
  title?: string;
  actionPlansText?: string;
  actionPlansLinkText?: string;
  actionPlansDownloadModalTitle?: string;
  actionPlansDownloadItems?: DownloadItem[];
  explorationText?: string;
  mapImage?: string;
  partnersText?: string;
  partnersLinkText?: string;
  partnersDownloadModalTitle?: string;
  partnersDownloadItems?: DownloadItem[];
  content?: string;
}

function parseDownloadOptions(
  opts: DownloadOption[] | string | unknown
): DownloadOption[] {
  if (Array.isArray(opts)) {
    return opts.filter(
      (o): o is DownloadOption =>
        o && typeof o === "object" && "label" in o && "fileUrl" in o
    );
  }
  if (typeof opts === "string") {
    try {
      const parsed = JSON.parse(opts);
      return parseDownloadOptions(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

export function WhereWeWorkSection({
  title: propTitle,
  actionPlansText: propActionPlansText,
  actionPlansLinkText: propActionPlansLinkText,
  actionPlansDownloadModalTitle: propActionPlansModalTitle,
  actionPlansDownloadItems: propActionPlansItems,
  explorationText: propExplorationText,
  mapImage: propMapImage,
  partnersText: propPartnersText,
  partnersLinkText: propPartnersLinkText,
  partnersDownloadModalTitle: propPartnersModalTitle,
  partnersDownloadItems: propPartnersItems,
}: WhereWeWorkSectionProps = {}) {
  const [imageError, setImageError] = useState(false);
  const [actionPlansModalOpen, setActionPlansModalOpen] = useState(false);
  const [partnersModalOpen, setPartnersModalOpen] = useState(false);

  const { getValue, getContentJSON } = usePageContentHelpers();

  // Get all values with priority: context > props > default
  const title = getValue(
    "whereWeWork.title",
    propTitle,
    "Where Does Turning Tides Work?"
  );

  const actionPlansText = getValue(
    "whereWeWork.actionPlansText",
    propActionPlansText,
    "We have **developed action plans for Latin America and Africa**, and **mobilizing grants** for work in Chile, Honduras, Panama, Costa Rica, Senegal, Uganda."
  );

  const actionPlansLinkText = getValue(
    "whereWeWork.actionPlansLinkText",
    propActionPlansLinkText,
    "See Action Plans"
  );

  const actionPlansModalTitle = getValue(
    "whereWeWork.actionPlansDownloadModalTitle",
    propActionPlansModalTitle,
    "Download action plans"
  );

  const actionPlansDownloadItems = getContentJSON<DownloadItem[]>(
    "whereWeWork.actionPlansDownloadItems",
    propActionPlansItems || []
  );

  const explorationText = getValue(
    "whereWeWork.explorationText",
    propExplorationText,
    "We are also in **the exploration and engagement phase** – Brazil, India, Indonesia, Sri Lanka, Thailand."
  );

  const mapImage = getValue(
    "whereWeWork.mapImage",
    propMapImage,
    "/assets/world-map.jpg"
  );

  // Use getImageUrl with validation built-in
  const imageUrl = getImageUrl(mapImage, "/assets/world-map.jpg");

  const partnersText = getValue(
    "whereWeWork.partnersText",
    propPartnersText,
    'Our **"Partners Piloting"** partners were in Bangladesh, Thailand, Indonesia, Honduras, Senegal.'
  );

  const partnersLinkText = getValue(
    "whereWeWork.partnersLinkText",
    propPartnersLinkText,
    "View Report"
  );

  const partnersModalTitle = getValue(
    "whereWeWork.partnersDownloadModalTitle",
    propPartnersModalTitle,
    "Download Piloting Report"
  );

  const partnersDownloadItems = getContentJSON<DownloadItem[]>(
    "whereWeWork.partnersDownloadItems",
    propPartnersItems || []
  );

  return (
    <section className="bg-white pb-8 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-[38px] font-nunito font-bold text-[#010107]">
            {title}
          </h2>
        </div>

        {/* Legend Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-4 lg:mb-8 max-w-6xl mx-auto">
          {/* Block 1 - Action Plans */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-[#3C62ED] flex-shrink-0 mt-1" />
            <div className="text-base text-gray-900 font-work-sans leading-relaxed">
              <p className="mb-2 p">
                {actionPlansText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                  // Every odd index is the text inside **
                  if (index % 2 === 1) {
                    return <strong key={index}>{part}</strong>;
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>
              <button
                type="button"
                onClick={() =>
                  actionPlansDownloadItems.length > 0 && setActionPlansModalOpen(true)
                }
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span>{actionPlansLinkText}</span>
                <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Block 2 - Exploration Phase */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-[#7db5bb] flex-shrink-0 mt-1" />
            <p className="text-base text-gray-900 font-work-sans leading-relaxed p">
              {explorationText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                // Every odd index is the text inside **
                if (index % 2 === 1) {
                  return <strong key={index}>{part}</strong>;
                }
                return <span key={index}>{part}</span>;
              })}
            </p>
          </div>

          {/* Block 3 - Partners Piloting */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-[#C4B5FD] flex-shrink-0 mt-1" />
            <div className="text-base text-gray-900 font-work-sans leading-relaxed">
              <p className="mb-2 p">
                {partnersText.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                  // Every odd index is the text inside **
                  if (index % 2 === 1) {
                    return <strong key={index}>{part}</strong>;
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>
              <button
                type="button"
                onClick={() =>
                  partnersDownloadItems.length > 0 && setPartnersModalOpen(true)
                }
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span>{partnersLinkText}</span>
                <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* World Map */}
        <div className="relative w-full">
          <div className="relative w-full aspect-[16/9] lg:aspect-[2/1]">
            {!imageError ? (
              <Image
                src={getImageUrl(imageUrl)}
                alt="World Map showing Turning Tides work locations"
                fill
                className="object-contain"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <p className="text-sm">Image not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Plans Download Modal */}
      {actionPlansModalOpen && (
        <DownloadFilesModal
          title={actionPlansModalTitle}
          items={actionPlansDownloadItems}
          downloadButtonText="Download"
          onClose={() => setActionPlansModalOpen(false)}
        />
      )}

      {/* Partners Download Modal */}
      {partnersModalOpen && (
        <DownloadFilesModal
          title={partnersModalTitle}
          items={partnersDownloadItems}
          downloadButtonText="Download Now"
          onClose={() => setPartnersModalOpen(false)}
        />
      )}
    </section>
  );
}

function DownloadFilesModal({
  title,
  items,
  downloadButtonText,
  onClose,
}: {
  title: string;
  items: DownloadItem[];
  downloadButtonText: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {items.map((item) => (
            <DownloadItemRow
              key={item.id}
              item={item}
              downloadButtonText={downloadButtonText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DownloadItemRow({
  item,
  downloadButtonText,
}: {
  item: DownloadItem;
  downloadButtonText: string;
}) {
  const options = parseDownloadOptions(item.downloadOptions);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleDownload = () => {
    const opt = options[selectedIndex];
    if (opt?.fileUrl) {
      const url =
        opt.fileUrl.startsWith("/") || opt.fileUrl.startsWith("http")
          ? opt.fileUrl
          : `https://${opt.fileUrl}`;
      window.open(url, "_blank");
    }
  };

  const selectorPlaceholder =
    item.selectorType === "country" ? "Select Country" : "Select Language";

  const hasTitle = item.title && item.title.trim().length > 0;

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 ${!hasTitle ? "sm:justify-center" : "sm:items-center"}`}
    >
      {hasTitle && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.title}
          </p>
        </div>
      )}
      <div className={`flex gap-2 ${hasTitle ? "flex-shrink-0" : "flex-1 justify-center sm:justify-start"}`}>
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[140px]"
          aria-label={selectorPlaceholder}
        >
          {options.length === 0 ? (
            <option value={0}>{selectorPlaceholder}</option>
          ) : (
            options.map((opt, i) => (
              <option key={i} value={i}>
                {opt.label}
              </option>
            ))
          )}
        </select>
        <button
          type="button"
          onClick={handleDownload}
          disabled={options.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          {downloadButtonText}
        </button>
      </div>
    </div>
  );
}
