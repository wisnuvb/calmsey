"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { CheckCircle2, Shield, Flag, Info, FileDown, X, FileText } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { RichText } from "../ui/RichText";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import { useLanguage } from "../public/LanguageProvider";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";
import { CountryCombobox } from "@/components/ui/country-combobox";
import {
  getCountrySelectOptions,
  getCountryLabelForValue,
} from "@/lib/countries";
import { LanguageVariantPicker } from "@/components/main/LanguageVariantPicker";
import { orderDownloadFilesEnglishFirst } from "@/lib/download-language-order";

interface PracticeItem {
  id: string;
  text: string;
}

interface InfoBlock {
  id: string;
  icon: "shield" | "flag" | "info";
  text: string;
}

interface NumberedListItem {
  id: string;
  number: string;
  text: string;
}

interface DownloadFile {
  language: string;
  url: string;
}

interface TabContent {
  id: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  paragraphs?: string[];
  practicesTitle?: string;
  practices?: PracticeItem[];
  infoBlocks?: InfoBlock[];
  numberedListTitle?: string;
  numberedList?: NumberedListItem[];
  numberedListFooter?: string;
  infoBlockFooter?: InfoBlock;
  downloadButtonLabel?: string;
  downloadButtonText?: string;
  downloadButtonUrl?: string; // Legacy support
  downloadFiles?: DownloadFile[]; // New structure for multi-language
  /** Left-column intro in PDF download modal; from CMS `downloadModalIntro`. */
  downloadModalIntro?: string;
  /** Optional hero image for download modal; falls back to `imageSrc`. */
  downloadModalImageSrc?: string;
  downloadModalImageAlt?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  content: TabContent;
}

interface MultipleFieldItem {
  id: string;
  label: string;
  contentTitle: string;
  imageSrc?: string;
  imageAlt?: string;
  paragraphs?: string;
  practicesTitle?: string;
  practices?: string;
  infoBlocks?: string;
  numberedListTitle?: string;
  numberedList?: string;
  numberedListFooter?: string;
  infoBlockFooter?: string; // Old format (JSON string) - kept for backward compatibility
  infoBlockFooterIcon?: string;
  infoBlockFooterText?: string;
  downloadButtonLabel?: string;
  downloadButtonText?: string;
  downloadButtonUrl?: string; // Legacy support
  downloadFiles?: string; // JSON string from multiple field
  downloadModalIntro?: string;
  downloadModalImageSrc?: string;
  downloadModalImageAlt?: string;
}

interface GrantmakingSectionProps {
  navigationItems?: NavigationItem[];
  activeSectionId?: string;
  onNavigationChange?: (id: string) => void;
  className?: string;
  contentKey?: string; // Key to read from pageContent context (e.g., "grantmaking.navigationItems" or "support.navigationItems")
}

const defaultNavigationItems: NavigationItem[] = [
  {
    id: "approach",
    label: "Our approach to Grantmaking",
    content: {
      id: "approach",
      title: "Our approach to Grantmaking",
      imageSrc: "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      imageAlt: "Grantmaking approach",
      paragraphs: [
        "Turning Tides implements and advocates for liberatory approaches to partnership and grantmaking – empowering and centering local communities, small-scale fishers and fish workers, and Indigenous Peoples and their supporting groups, rather than maintaining hierarchical relationships.",
        "We are accountable to our partners and work to change systems that create barriers to tenure security. Our practices include multi-year flexible funding, streamlined processes, and partnership support that extends beyond financial contributions.",
      ],
      practicesTitle: "What we practice",
      practices: [
        {
          id: "1",
          text: "Shared decision-making in strategy and grantmaking",
        },
        {
          id: "2",
          text: "Partner-centered grantmaking processes (language justice, administrative burden shifting, feedback integration)",
        },
        {
          id: "3",
          text: "Rights-based safeguarding and ethical engagement (FPIC, data sovereignty, cultural protocols)",
        },
        {
          id: "4",
          text: "Multi-year flexible funding with partnership support beyond financial contributions",
        },
      ],
    },
  },
  {
    id: "tenure",
    label: "What we understand by tenure",
    content: {
      id: "tenure",
      title: "What we understand by tenure",
      paragraphs: [
        "Tenure refers to the relationship, whether legally or customarily defined, among people with respect to land, water, and resources. It determines who can use what resources, for how long, and under what conditions.",
      ],
    },
  },
  {
    id: "framework",
    label: "Our Grantmaking Framework",
    content: {
      id: "framework",
      title: "Our Grantmaking Framework",
      paragraphs: [
        "Our grantmaking framework is designed to support communities in securing and strengthening their tenure rights through flexible, partner-centered approaches.",
      ],
      downloadModalIntro:
        "We help local communities, small-scale fishers, and Indigenous Peoples secure their rights in caring for lands, waters, and resources to achieve lasting impact. Our Grantmaking Framework guides us to where we can make the most difference.",
      downloadModalImageSrc:
        "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
      downloadModalImageAlt: "Community fishing and livelihoods",
    },
  },
];

/** Only if a tab has no modal intro and no first paragraph (edge case). */
const GRANTMAKING_DOWNLOAD_MODAL_FALLBACK_BLURB =
  "Learn more in our grantmaking framework document.";

function GrantmakingFrameworkDownloadModal({
  open,
  onClose,
  files,
  tabContent,
  getLanguageName,
  normalizeUrl,
}: {
  open: boolean;
  onClose: () => void;
  files: DownloadFile[];
  tabContent: TabContent;
  getLanguageName: (code: string) => string;
  normalizeUrl: (url: string) => string;
}) {
  const { language: currentLanguage } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [selectedLangIndex, setSelectedLangIndex] = useState(0);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const countryOptions = useMemo(() => getCountrySelectOptions(), []);

  const orderedFiles = useMemo(
    () => orderDownloadFilesEnglishFirst(files),
    [files],
  );

  const langOptions = useMemo(
    () => orderedFiles.map((f) => ({ label: getLanguageName(f.language), languageId: f.language })),
    [orderedFiles, getLanguageName],
  );

  useEffect(() => {
    if (!open) return;
    setFullName("");
    setEmail("");
    setUserCountry("");
    setFormError("");
    setIsSubmitting(false);
    const cur = currentLanguage.trim().toLowerCase();
    const idx = orderedFiles.findIndex(
      (f) => f.language.trim().toLowerCase() === cur,
    );
    setSelectedLangIndex(idx >= 0 ? idx : 0);
  }, [open, orderedFiles, currentLanguage]);

  const validateLeadForm = (): boolean => {
    setFormError("");
    if (!fullName.trim()) {
      setFormError("Please enter your full name.");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    if (!userCountry.trim()) {
      setFormError("Please select your country.");
      return false;
    }
    return true;
  };

  const getLeadData = useCallback(() => {
    const cc = userCountry.trim().toLowerCase();
    return {
      fullName: fullName.trim(),
      email: email.trim(),
      countryCode: cc,
      countryLabel: getCountryLabelForValue(cc) ?? cc,
    };
  }, [fullName, email, userCountry]);

  const handleDownload = async () => {
    if (!validateLeadForm()) return;
    const file = orderedFiles[selectedLangIndex];
    if (!file) return;
    const url = normalizeUrl(file.url);

    setIsSubmitting(true);
    setFormError("");
    try {
      const lead = getLeadData();
      const res = await fetch("/api/resource-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: lead.fullName,
          email: lead.email,
          countryCode: lead.countryCode,
          countryLabel: lead.countryLabel,
          modalSource: "GRANTMAKING_FRAMEWORK",
          documentItemId: tabContent.id,
          documentTitle: tabContent.title?.trim() || null,
          selectorType: "language",
          selectedOptionLabel: getLanguageName(file.language),
          fileUrl: url,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setFormError(
          data.error ||
            "Could not submit your details. Please try again shortly.",
        );
        return;
      }
      window.open(url, "_blank");
      onClose();
    } catch {
      setFormError("Something went wrong. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const intro = tabContent.downloadModalIntro?.trim();
  const firstParagraph = tabContent.paragraphs?.[0]?.trim();
  const blurbSource =
    intro ||
    firstParagraph ||
    GRANTMAKING_DOWNLOAD_MODAL_FALLBACK_BLURB;
  const blurbRaw = blurbSource.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>",
  );

  const heroTitle = tabContent.title || "Our Grantmaking Framework";

  const modalHeroSrc = (
    tabContent.downloadModalImageSrc?.trim() ||
    tabContent.imageSrc?.trim() ||
    ""
  );
  const modalHeroAlt =
    tabContent.downloadModalImageAlt?.trim() ||
    tabContent.imageAlt?.trim() ||
    heroTitle;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl lg:max-h-[90vh] lg:flex-row"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="grantmaking-download-modal-title"
      >
        {/* Left: visual + copy */}
        <div className="relative min-h-[220px] w-full shrink-0 lg:min-h-[420px] lg:w-1/2">
          {modalHeroSrc ? (
            <Image
              src={getImageUrl(modalHeroSrc)}
              alt={modalHeroAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#0f172a]"
              aria-hidden
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1220]/95 via-[#0b1220]/35 to-transparent"
            aria-hidden
          />
          <div className="absolute left-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded bg-[#F97316] shadow-md">
            <FileText className="h-6 w-6 text-white" aria-hidden />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 pt-24 lg:p-8">
            <h3 className="text-2xl font-bold leading-tight text-white font-nunito sm:text-3xl">
              {heroTitle}
            </h3>
            <RichText
              className="mt-3 text-sm leading-relaxed text-white/90 font-work-sans sm:text-base [&_strong]:font-semibold"
              content={blurbRaw}
            />
          </div>
        </div>

        {/* Right: form */}
        <div className="relative flex w-full flex-col overflow-y-auto lg:w-1/2">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-md p-1 text-gray-900 transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 pb-4 pr-12 pt-8 sm:p-8">
            <h2
              id="grantmaking-download-modal-title"
              className="text-xl font-bold text-gray-900 font-nunito sm:text-2xl"
            >
              Download Full-PDF
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-work-sans sm:text-base">
              Clarifying funding priorities for stronger tenure rights.
            </p>
          </div>

          <div className="flex flex-1 flex-col px-6 pb-8 sm:px-8">
            <div className="space-y-3">
              <label htmlFor="grantmaking-dl-fullname" className="sr-only">
                Full name
              </label>
              <input
                id="grantmaking-dl-fullname"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#3C62ED]"
              />
              <label htmlFor="grantmaking-dl-email" className="sr-only">
                Email
              </label>
              <input
                id="grantmaking-dl-email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#3C62ED]"
              />
              <label htmlFor="grantmaking-dl-country" className="sr-only">
                Country
              </label>
              <CountryCombobox
                id="grantmaking-dl-country"
                value={userCountry}
                onValueChange={setUserCountry}
                options={countryOptions}
                placeholder="Select country"
                aria-label="Select country"
              />
            </div>

            {formError ? (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <LanguageVariantPicker
                options={langOptions}
                selectedIndex={Math.min(
                  selectedLangIndex,
                  Math.max(0, langOptions.length - 1),
                )}
                onSelectIndex={setSelectedLangIndex}
                placeholder="Language"
              />
              <button
                type="button"
                onClick={handleDownload}
                disabled={isSubmitting || files.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3C62ED] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2d4fd6] disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
              >
                <FileDown className="h-5 w-5 shrink-0" aria-hidden />
                {isSubmitting ? "Please wait…" : "Download Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GrantmakingSection({
  navigationItems: propNavigationItems,
  activeSectionId: propActiveSectionId,
  onNavigationChange: propOnNavigationChange,
  className,
  contentKey = "grantmaking.navigationItems",
}: GrantmakingSectionProps = {}) {
  const { getContentJSON } = usePageContentHelpers();
  const { languages: activeLanguages } = useActiveLanguages();
  const [downloadModal, setDownloadModal] = useState<{
    files: DownloadFile[];
    tab: TabContent;
  } | null>(null);

  // Transform multiple field format to NavigationItem format
  const transformMultipleToNavigationItems = (
    items: MultipleFieldItem[]
  ): NavigationItem[] => {
    if (!Array.isArray(items)) return [];

    return items
      .filter((item) => item && item.id && item.label && item.contentTitle)
      .map((item) => {
        // Parse paragraphs (separated by double newline)
        const paragraphs: string[] = [];
        if (item.paragraphs && typeof item.paragraphs === "string") {
          paragraphs.push(
            ...item.paragraphs
              .split(/\n\s*\n/)
              .map((p: string) => p.trim())
              .filter((p: string) => p.length > 0)
          );
        }

        // Parse practices (JSON array format from multiple field)
        const practices: { id: string; text: string }[] = [];
        if (item.practices && typeof item.practices === "string") {
          try {
            // Try parsing as JSON array first (from multiple field)
            const parsed = JSON.parse(item.practices);
            if (Array.isArray(parsed)) {
              parsed.forEach((practice: unknown) => {
                if (
                  practice &&
                  typeof practice === "object" &&
                  "id" in practice &&
                  "text" in practice
                ) {
                  practices.push({
                    id: String((practice as { id: unknown; text: unknown }).id),
                    text: String((practice as { id: unknown; text: unknown }).text),
                  });
                }
              });
            }
          } catch {
            // Fallback to old format (one JSON object per line)
            const practiceLines = item.practices
              .split("\n")
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0);

            practiceLines.forEach((line: string) => {
              try {
                const practice = JSON.parse(line);
                if (practice.id && practice.text) {
                  practices.push({
                    id: String(practice.id),
                    text: String(practice.text),
                  });
                }
              } catch {
                // Skip invalid JSON lines
              }
            });
          }
        }

        // Parse info blocks (JSON array format from multiple field)
        const infoBlocks: InfoBlock[] = [];
        if (item.infoBlocks && typeof item.infoBlocks === "string") {
          try {
            // Try parsing as JSON array first (from multiple field)
            const parsed = JSON.parse(item.infoBlocks);
            if (Array.isArray(parsed)) {
              parsed.forEach((block: unknown) => {
                if (
                  block &&
                  typeof block === "object" &&
                  "id" in block &&
                  "icon" in block &&
                  "text" in block
                ) {
                  const blockObj = block as {
                    id: unknown;
                    icon: unknown;
                    text: unknown;
                  };
                  infoBlocks.push({
                    id: String(blockObj.id),
                    icon: String(blockObj.icon) as "shield" | "flag" | "info",
                    text: String(blockObj.text),
                  });
                }
              });
            }
          } catch {
            // Fallback to old format (one JSON object per line)
            const infoBlockLines = item.infoBlocks
              .split("\n")
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0);

            infoBlockLines.forEach((line: string) => {
              try {
                const block = JSON.parse(line);
                if (block.id && block.icon && block.text) {
                  infoBlocks.push({
                    id: String(block.id),
                    icon: block.icon as "shield" | "flag" | "info",
                    text: String(block.text),
                  });
                }
              } catch {
                // Skip invalid JSON lines
              }
            });
          }
        }

        // Parse numbered list (JSON array format from multiple field)
        const numberedList: NumberedListItem[] = [];
        if (item.numberedList && typeof item.numberedList === "string") {
          try {
            // Try parsing as JSON array first (from multiple field)
            const parsed = JSON.parse(item.numberedList);
            if (Array.isArray(parsed)) {
              parsed.forEach((listItem: unknown) => {
                if (
                  listItem &&
                  typeof listItem === "object" &&
                  "id" in listItem &&
                  "number" in listItem &&
                  "text" in listItem
                ) {
                  const itemObj = listItem as {
                    id: unknown;
                    number: unknown;
                    text: unknown;
                  };
                  numberedList.push({
                    id: String(itemObj.id),
                    number: String(itemObj.number),
                    text: String(itemObj.text),
                  });
                }
              });
            }
          } catch {
            // Fallback to old format (one JSON object per line)
            const numberedLines = item.numberedList
              .split("\n")
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0);

            numberedLines.forEach((line: string) => {
              try {
                const listItem = JSON.parse(line);
                if (listItem.id && listItem.number && listItem.text) {
                  numberedList.push({
                    id: String(listItem.id),
                    number: String(listItem.number),
                    text: String(listItem.text),
                  });
                }
              } catch {
                // Skip invalid JSON lines
              }
            });
          }
        }

        // Parse footer info block (from separate fields)
        let infoBlockFooter: InfoBlock | undefined;
        if (
          item.infoBlockFooterIcon &&
          item.infoBlockFooterText &&
          typeof item.infoBlockFooterIcon === "string" &&
          typeof item.infoBlockFooterText === "string" &&
          item.infoBlockFooterIcon.trim() &&
          item.infoBlockFooterText.trim()
        ) {
          infoBlockFooter = {
            id: "footer",
            icon: item.infoBlockFooterIcon.trim() as "shield" | "flag" | "info",
            text: String(item.infoBlockFooterText),
          };
        } else if (item.infoBlockFooter && typeof item.infoBlockFooter === "string") {
          // Fallback to old format (JSON object)
          try {
            const footer = JSON.parse(item.infoBlockFooter);
            if (footer.icon && footer.text) {
              infoBlockFooter = {
                id: "footer",
                icon: footer.icon as "shield" | "flag" | "info",
                text: String(footer.text),
              };
            }
          } catch {
            // Skip invalid JSON
          }
        }

        // Parse downloadFiles (JSON array format from multiple field)
        const downloadFiles: DownloadFile[] = [];
        if (item.downloadFiles && typeof item.downloadFiles === "string") {
          try {
            const parsed = JSON.parse(item.downloadFiles);
            if (Array.isArray(parsed)) {
              parsed.forEach((file: unknown) => {
                if (
                  file &&
                  typeof file === "object" &&
                  "language" in file &&
                  "url" in file
                ) {
                  downloadFiles.push({
                    language: String((file as { language: unknown; url: unknown }).language),
                    url: String((file as { language: unknown; url: unknown }).url),
                  });
                }
              });
            }
          } catch {
            // Skip invalid JSON
          }
        }

        // Legacy support: if downloadButtonUrl is provided but no downloadFiles, create one
        const legacyDownloadUrl = item.downloadButtonUrl;
        const finalDownloadFiles =
          downloadFiles.length > 0
            ? downloadFiles
            : legacyDownloadUrl
              ? [{ language: "en", url: String(legacyDownloadUrl) }]
              : [];

        return {
          id: String(item.id),
          label: String(item.label),
          content: {
            id: String(item.id),
            title: String(item.contentTitle),
            ...(item.imageSrc && { imageSrc: String(item.imageSrc) }),
            ...(item.imageAlt && { imageAlt: String(item.imageAlt) }),
            ...(paragraphs.length > 0 && { paragraphs }),
            ...(item.practicesTitle && {
              practicesTitle: String(item.practicesTitle),
            }),
            ...(practices.length > 0 && { practices }),
            ...(infoBlocks.length > 0 && { infoBlocks }),
            ...(item.numberedListTitle && {
              numberedListTitle: String(item.numberedListTitle),
            }),
            ...(numberedList.length > 0 && { numberedList }),
            ...(item.numberedListFooter && {
              numberedListFooter: String(item.numberedListFooter),
            }),
            ...(infoBlockFooter && { infoBlockFooter }),
            ...(typeof item.downloadModalIntro === "string" &&
              item.downloadModalIntro.trim() && {
                downloadModalIntro: item.downloadModalIntro.trim(),
              }),
            ...(typeof item.downloadModalImageSrc === "string" &&
              item.downloadModalImageSrc.trim() && {
                downloadModalImageSrc: item.downloadModalImageSrc.trim(),
              }),
            ...(typeof item.downloadModalImageAlt === "string" &&
              item.downloadModalImageAlt.trim() && {
                downloadModalImageAlt: item.downloadModalImageAlt.trim(),
              }),
            ...(item.downloadButtonLabel && {
              downloadButtonLabel: String(item.downloadButtonLabel),
            }),
            ...(item.downloadButtonText && {
              downloadButtonText: String(item.downloadButtonText),
            }),
            // Legacy support: keep downloadButtonUrl for backward compatibility
            ...(legacyDownloadUrl && {
              downloadButtonUrl: String(legacyDownloadUrl),
            }),
            // New structure: downloadFiles
            ...(finalDownloadFiles.length > 0 && { downloadFiles: finalDownloadFiles }),
          },
        };
      });
  };

  // Get navigationItems with priority: context > props > default
  const contextNavigationItemsRaw = getContentJSON<MultipleFieldItem[]>(
    contentKey,
    []
  );
  const contextNavigationItems = transformMultipleToNavigationItems(
    contextNavigationItemsRaw
  );

  const navigationItems =
    contextNavigationItems.length > 0
      ? contextNavigationItems
      : propNavigationItems || defaultNavigationItems;

  // Use internal state if no external control
  const [internalActiveId, setInternalActiveId] = useState(
    propActiveSectionId || navigationItems[0]?.id || ""
  );

  // const [activeTab, setActiveTab] = useState("approach");

  // Use external activeSectionId if provided, otherwise use internal state
  const activeId =
    propActiveSectionId !== undefined ? propActiveSectionId : internalActiveId;

  // Find active content
  const activeContent = navigationItems.find(
    (item) => item.id === activeId
  )?.content;

  const handleNavClick = (id: string) => {
    if (propOnNavigationChange) {
      propOnNavigationChange(id);
    } else {
      // Use internal state if no external handler
      setInternalActiveId(id);
    }
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

  // Get language name helper
  const getLanguageName = (langCode: string): string => {
    const lang = activeLanguages.find((l) => l.id === langCode);
    return lang?.name || langCode.toUpperCase();
  };

  const handleDownloadClick = (
    e: React.MouseEvent,
    tab: TabContent,
    downloadFiles?: DownloadFile[],
    downloadButtonUrl?: string,
  ) => {
    e.preventDefault();

    const files =
      downloadFiles && downloadFiles.length > 0
        ? downloadFiles
        : downloadButtonUrl
          ? [{ language: "en", url: downloadButtonUrl }]
          : [];

    if (files.length === 0) {
      return;
    }

    setDownloadModal({ files, tab });
  };

  return (
    <div id="our-approach-to-grantmaking">
      <hr className="border-[#C3D7E8] container mx-auto px-4" />
      <section className={cn("bg-white py-16 lg:py-24", className)}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Navigation */}
            <aside className="lg:w-[478px] flex-shrink-0 lg:sticky lg:top-28 lg:self-start">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-md transition-colors text-xl font-bold font-nunito p-6",
                        isActive
                          ? "bg-[#3C62ED] text-white font-medium"
                          : "text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Right Content - Dynamic based on active tab */}
            <div className="flex-1 space-y-8 sm:space-y-11">
              {activeContent ? (
                <>
                  {/* Title */}
                  <h2 className="text-3xl sm:text-[38px] font-bold text-[#010107] font-nunito mb-6">
                    {activeContent.title}
                  </h2>

                  {/* Image */}
                  {activeContent.imageSrc && (
                    <div className="mb-8">
                      <Image
                        src={getImageUrl(activeContent.imageSrc)}
                        alt={activeContent.imageAlt || activeContent.title}
                        width={1200}
                        height={600}
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {/* Content with dark background if image exists */}
                  <div
                    className="!text-gray-700"
                  // className={cn(
                  //   activeContent.imageSrc &&
                  //     "bg-[#010107] text-white p-6 sm:p-8 rounded-lg"
                  // )}
                  >
                    {/* Paragraphs */}
                    {activeContent.paragraphs &&
                      activeContent.paragraphs.length > 0 && (
                        <div className="space-y-6 mb-8">
                          {activeContent.paragraphs.map((paragraph, index) => (
                            <RichText
                              key={index}
                              className={cn(
                                "p text-gray-700 font-work-sans"
                              )}
                              content={paragraph.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              )}
                            />
                          ))}
                        </div>
                      )}

                    {/* Practices Section */}
                    {activeContent.practices &&
                      activeContent.practices.length > 0 && (
                        <div className="mb-8">
                          {/* Practices Title */}
                          {activeContent.practicesTitle && (
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                              {activeContent.practicesTitle}
                            </h3>
                          )}
                          <ul className="space-y-4">
                            {activeContent.practices.map((practice) => (
                              <li
                                key={practice.id}
                                className="flex items-start gap-4"
                              >
                                <CheckCircle2
                                  className={cn(
                                    "w-6 h-6 flex-shrink-0 mt-0.5",
                                    activeContent.imageSrc
                                      ? "text-[#5ABF87]"
                                      : "text-[#5ABF87]"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-lg text-gray-700"
                                    // activeContent.imageSrc
                                    //   ? "text-white/90"
                                    //   : "text-gray-700"
                                  )}
                                >
                                  {practice.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Info Blocks */}
                    {activeContent.infoBlocks &&
                      activeContent.infoBlocks.length > 0 && (
                        <div className="space-y-4 mb-8">
                          {activeContent.infoBlocks.map((block) => {
                            const IconComponent =
                              block.icon === "shield"
                                ? Shield
                                : block.icon === "flag"
                                  ? Flag
                                  : Info;
                            return (
                              <div
                                key={block.id}
                                className="bg-gray-100 rounded-lg p-4 sm:p-6 flex gap-4 items-start"
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-[#3C62ED] rounded-lg flex items-center justify-center">
                                    <IconComponent className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <RichText
                                    className="text-gray-700 text-base leading-relaxed font-work-sans"
                                    content={block.text
                                      .replace(
                                        /\*\*(.*?)\*\*/g,
                                        "<strong>$1</strong>"
                                      )
                                      .replace(/\\"/g, '"')}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {/* Numbered List */}
                    {activeContent.numberedList &&
                      activeContent.numberedList.length > 0 && (
                        <div
                          className={cn(
                            "mb-6",
                            !activeContent.imageSrc && "space-y-6"
                          )}
                        >
                          {/* Numbered List Title/Sub-header */}
                          {activeContent.numberedListTitle && (
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                              {activeContent.numberedListTitle}
                            </h3>
                          )}
                          <ul className="space-y-6">
                            {activeContent.numberedList.map((item) => (
                              <li
                                key={item.id}
                                className="flex gap-4 items-start"
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                                    <span className="text-gray-900 font-bold text-lg">
                                      {item.number}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 pt-2">
                                  <p
                                    className={cn(
                                      "text-lg leading-relaxed",
                                      activeContent.imageSrc
                                        ? "text-white/90"
                                        : "text-gray-700"
                                    )}
                                  >
                                    {item.text}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                          {activeContent.numberedListFooter && (
                            <RichText
                              className={cn(
                                "mt-6 text-lg leading-relaxed font-work-sans",
                                activeContent.imageSrc
                                  ? "text-white/90"
                                  : "text-gray-700"
                              )}
                              content={activeContent.numberedListFooter.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              )}
                            />
                          )}
                        </div>
                      )}

                    {/* Footer Info Block */}
                    {activeContent.infoBlockFooter && (
                      <div className="bg-[#5ABF87] rounded-lg p-4 sm:p-6 flex gap-4 items-start mt-8">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <Info className="w-5 h-5 text-[#5ABF87]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <RichText
                            className="text-white text-base leading-relaxed font-work-sans"
                            content={activeContent.infoBlockFooter.text.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Download Button */}
                    {activeContent.downloadButtonText &&
                      ((activeContent.downloadFiles && activeContent.downloadFiles.length > 0) || activeContent.downloadButtonUrl) && (
                        <div className="mt-8 bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <p
                            className={cn(
                              "text-lg font-bold",
                              activeContent.imageSrc
                                ? "text-white"
                                : "text-gray-900"
                            )}
                          >
                            {activeContent.downloadButtonLabel ||
                              "Read the full-version of our Grantmaking Framework"}
                          </p>
                          <button
                            onClick={(e) =>
                              handleDownloadClick(
                                e,
                                activeContent,
                                activeContent.downloadFiles,
                                activeContent.downloadButtonUrl,
                              )
                            }
                            className="bg-[#3C62ED] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d4fd6] transition-colors flex items-center gap-2 whitespace-nowrap"
                          >
                            <FileDown className="w-5 h-5" />
                            {activeContent.downloadButtonText}
                          </button>
                        </div>
                      )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No content available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {downloadModal ? (
        <GrantmakingFrameworkDownloadModal
          open
          files={downloadModal.files}
          tabContent={downloadModal.tab}
          getLanguageName={getLanguageName}
          normalizeUrl={(url) =>
            url.startsWith("/") ? url : ensureHttpsUrl(url)
          }
          onClose={() => setDownloadModal(null)}
        />
      ) : null}
    </div>
  );
}
