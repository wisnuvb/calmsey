"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  X,
  FileText,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { H3, P } from "../ui/typography";
import { FundDetailSectionContent } from "./FundDetailSectionContent";
import type { CTA, FundContent } from "@/types/fund-detail";
import { cn } from "@/lib/utils";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";
import { createDownloadLanguageNameResolver } from "@/lib/download-language-labels";
import { Strategy2030DownloadLeadModal } from "@/components/main/Strategy2030DownloadLeadModal";

interface FundDetailContentProps {
  content: FundContent;
  /** URL slug untuk identitas unik dokumen/modal pada halaman ini */
  fundSlug: string;
}

function getPdfDownloadRowsForCta(
  cta: CTA,
): Array<{ language: string; url: string }> {
  const rows: Array<{ language: string; url: string }> = [];
  for (const entry of cta.downloadFiles ?? []) {
    const fr = entry as unknown as Record<string, unknown>;
    const languageRaw = fr.language ?? fr.lang;
    const language =
      typeof languageRaw === "string" ? languageRaw.trim() : "";
    let url = "";
    for (const key of ["url", "href", "fileUrl", "file"] as const) {
      const v = fr[key];
      if (typeof v === "string" && v.trim()) {
        url = v.trim();
        break;
      }
    }
    if (language && url) rows.push({ language, url });
  }
  if (rows.length > 0) return rows;
  const legacy = typeof cta.file === "string" ? cta.file.trim() : "";
  if (legacy.length > 0) return [{ language: "en", url: legacy }];
  return [];
}

function ensureHttpsLikePublicDownloadUrl(url: string): string {
  if (!url || url.trim() === "") return url;
  const trimmedUrl = url.trim();
  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;
  if (trimmedUrl.startsWith("//")) return `https:${trimmedUrl}`;
  if (trimmedUrl.startsWith("/")) return trimmedUrl;
  return `https://${trimmedUrl}`;
}

export function FundDetailContent({ content, fundSlug }: FundDetailContentProps) {
  const [pdfModalCta, setPdfModalCta] = useState<CTA | null>(null);
  const [portalMounted, setPortalMounted] = useState(false);
  const { languages: activeLanguages } = useActiveLanguages();

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const getLanguageName = useMemo(
    () => createDownloadLanguageNameResolver(activeLanguages),
    [activeLanguages],
  );
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "check":
        return (
          <CheckCircle2 className="w-6 h-6 text-[#5ABF87] flex-shrink-0 mt-0.5" />
        );
      case "x":
        return (
          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <X className="w-4 h-4 text-red-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const renderCTA = (cta: typeof content.cta) => {
    if (!cta) return null;

    const baseButtonClasses =
      "inline-flex items-center gap-2 px-8 py-4 rounded-md font-medium transition-colors duration-300";

    if (cta.type === "pdf-download") {
      const rows = getPdfDownloadRowsForCta(cta);
      const canDownload = rows.length > 0;
      return (
        <button
          type="button"
          disabled={!canDownload}
          onClick={(e) => {
            e.preventDefault();
            if (canDownload) setPdfModalCta(cta);
          }}
          className={cn(
            baseButtonClasses,
            "gap-3 rounded-lg bg-[#3C62ED] text-white hover:bg-[#2d4fd6]",
            !canDownload && "opacity-45 cursor-not-allowed hover:bg-[#3C62ED]",
          )}
          aria-label={`Download ${cta.text}`}
        >
          <FileText className="w-5 h-5 flex-shrink-0" aria-hidden />
          <span>{cta.text}</span>
          <Download className="w-5 h-5 flex-shrink-0" aria-hidden />
        </button>
      );
    }

    if (cta.type === "button") {
      const isExternal = cta.link?.startsWith("http") ?? false;
      const showArrow =
        cta.icon === "arrow" || cta.icon === "arrow-external" || isExternal;
      const buttonContent = (
        <>
          {cta.text}
          {showArrow && <ArrowUpRight className="w-5 h-5" />}
        </>
      );
      const buttonClasses = cn(
        baseButtonClasses,
        cta.style === "primary"
          ? "bg-[#3C62ED] text-white hover:bg-[#2d4fd6]"
          : cta.style === "secondary"
            ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
            : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50",
      );
      if (isExternal && cta.link) {
        return (
          <a
            href={cta.link}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses}
          >
            {buttonContent}
          </a>
        );
      }
      return (
        <Link href={cta.link || "#"} className={buttonClasses}>
          {buttonContent}
        </Link>
      );
    }

    return null;
  };

  const pdfModalRows = pdfModalCta ? getPdfDownloadRowsForCta(pdfModalCta) : [];

  const pdfModalSection =
    pdfModalCta && pdfModalRows.length > 0 ? (
      <Strategy2030DownloadLeadModal
        key={pdfModalRows.map((f) => `${f.language}:${f.url}`).join("|")}
        modalSource="FUND_DETAIL"
        title={
          pdfModalCta.downloadModalTitle?.trim() ||
          pdfModalCta.text ||
          "Download"
        }
        subtitle={
          pdfModalCta.downloadModalSubtitle?.trim() ||
          "Enter your details to download. We use this information to understand interest in this document."
        }
        downloadButtonText={
          pdfModalCta.downloadModalButtonText?.trim() || "Download now"
        }
        documentTitle={
          pdfModalCta.downloadDocumentTitle?.trim() ||
          pdfModalCta.text ||
          "Fund document"
        }
        documentItemId={`fund-detail-${fundSlug}`}
        formFieldIdPrefix={`fund-detail-dl-${fundSlug.replace(/[^a-z0-9-]/gi, "-")}`}
        headingId={`fund-detail-download-modal-${fundSlug.replace(/[^a-z0-9-]/gi, "-")}`}
        files={pdfModalRows}
        getLanguageName={getLanguageName}
        normalizeUrl={ensureHttpsLikePublicDownloadUrl}
        onClose={() => setPdfModalCta(null)}
      />
    ) : null;

  /** Portal ke body — hindari stacking/overflow ancestor; Navbar juga z-50 */
  const pdfModalPortal =
    portalMounted &&
    pdfModalSection &&
    typeof document !== "undefined" &&
    document.body
      ? createPortal(pdfModalSection, document.body)
      : pdfModalSection;


  // Render based on content type
  if (content.type === "supported-unsupported") {
    return (
      <>
      <section className="bg-white py-6 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Intro */}
            {content.intro.map((paragraph, index) => (
              <P key={index} style="p1reg" className="text-[#060726CC] p">
                {paragraph}
              </P>
            ))}

            {/* Supported Section */}
            <div className="space-y-6">
              {content.supportedMainHeading && (
                <H3
                  style="h3bold"
                  className="text-[#010107] text-2xl font-bold font-nunito mb-2"
                >
                  {content.supportedMainHeading}
                </H3>
              )}
              <H3
                style="h3bold"
                className="text-[#010107] text-xl font-bold font-nunito mb-6"
              >
                {content.supportedSection.title}
              </H3>
              <ul className="space-y-4">
                {content.supportedSection.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-4">
                    {renderIcon(item.icon)}
                    <div className="flex-1">
                      {item.title && (
                        <h4 className="font-semibold text-[#010107] mb-1 font-nunito">
                          {item.title}:
                        </h4>
                      )}
                      <P style="p1reg" className="text-[#060726CC] p">
                        {item.description}
                      </P>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Unsupported Section */}
            <div className="space-y-6">
              <H3
                style="h3bold"
                className="text-[#010107] text-2xl font-bold font-nunito mb-6"
              >
                {content.unsupportedSection.title}
              </H3>
              <ul className="space-y-4">
                {content.unsupportedSection.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-4">
                    {renderIcon(item.icon)}
                    <P style="p1reg" className="text-[#060726CC] p flex-1">
                      {item.description}
                    </P>
                  </li>
                ))}
              </ul>
              {content.unsupportedConcluding?.map((paragraph, index) => (
                <P key={index} style="p1reg" className="text-[#060726CC] p">
                  {paragraph}
                </P>
              ))}
            </div>

            {/* How to Apply Section */}
            {content.howToApplySection && (
              <div className="space-y-6">
                <H3
                  style="h3bold"
                  className="text-[#010107] text-2xl font-bold font-nunito mb-6"
                >
                  {content.howToApplySection.heading}
                </H3>
                {content.howToApplySection.content.map((paragraph, index) => (
                  <P key={index} style="p1reg" className="text-[#060726CC] p">
                    {paragraph}
                  </P>
                ))}
                {content.howToApplySection.cta && (
                  <div className="pt-2">
                    {renderCTA(content.howToApplySection.cta)}
                  </div>
                )}
              </div>
            )}

            {/* Main fund CTA (e.g. PDF download) — shown after How to apply when both exist */}
            {content.cta && (
              <div className="pt-6">{renderCTA(content.cta)}</div>
            )}
          </div>
        </div>
      </section>
      {pdfModalPortal}
      </>
    );
  }

  if (content.type === "partners-will") {
    return (
      <>
      <section className="bg-white py-6 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Intro */}
            {content.intro.map((paragraph, index) => (
              <P key={index} style="p1reg" className="text-[#060726CC] p">
                {paragraph}
              </P>
            ))}

            {/* Partners Will Section */}
            <div className="space-y-6">
              <H3
                style="h3bold"
                className="text-[#010107] text-2xl font-bold font-nunito mb-6"
              >
                {content.partnersWillSection.title}
              </H3>
              <ul className="space-y-4">
                {content.partnersWillSection.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-4">
                    {renderIcon(item.icon)}
                    <P style="p1reg" className="text-[#060726CC] p flex-1">
                      {item.description}
                    </P>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concluding */}
            {content.concluding.map((paragraph, index) => (
              <P key={index} style="p1reg" className="text-[#060726CC] p">
                {paragraph}
              </P>
            ))}

            {/* CTA */}
            {content.cta && (
              <div className="pt-6">{renderCTA(content.cta)}</div>
            )}
          </div>
        </div>
      </section>
      {pdfModalPortal}
      </>
    );
  }

  const hasHtml = (text: string) => /<a\s|<\/a>|<[a-z][\s\S]*>/i.test(text);

  if (content.type === "custom") {
    return (
      <>
      <section className="bg-white py-6 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {content.sections.map((section) => (
              <div key={section.id} className="space-y-6">
                {section.title && (
                  <H3
                    style="h3bold"
                    className="text-[#010107] text-2xl font-bold font-nunito"
                  >
                    {section.title}
                  </H3>
                )}

                {section.content && (
                  <div className="space-y-4">
                    {Array.isArray(section.content) ? (
                      section.content.map((para, index) =>
                        hasHtml(para) ? (
                          <FundDetailSectionContent
                            key={`content-${index}`}
                            content={para}
                            modalIdPrefix={`fund-detail-${fundSlug}-s${section.id}-c${index}`}
                          />
                        ) : (
                          <P
                            key={index}
                            style="p1reg"
                            className="text-[#060726CC] p"
                          >
                            {para}
                          </P>
                        ),
                      )
                    ) : hasHtml(section.content) ? (
                      <FundDetailSectionContent
                        content={section.content}
                        modalIdPrefix={`fund-detail-${fundSlug}-s${section.id}`}
                      />
                    ) : (
                      <P style="p1reg" className="text-[#060726CC] p">
                        {section.content}
                      </P>
                    )}
                  </div>
                )}

                {section.sectionType === "action-plans" &&
                  section.actionPlanItems && (
                    <ol className="space-y-4 list-none">
                      {section.actionPlanItems.map((item) => (
                        <li
                          key={item.number}
                          className="flex items-center justify-between gap-4 flex-wrap"
                        >
                          <span className="font-nunito font-semibold text-[#010107]">
                            {item.number} {item.title}:
                          </span>
                          {item.status === "link" && item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 rounded-md bg-[#3C62ED] text-white text-sm font-medium hover:bg-[#2d4fd6] transition-colors"
                            >
                              Hyperlink to public version
                            </a>
                          ) : (
                            <span className="inline-flex items-center px-4 py-2 rounded-md bg-gray-200 text-gray-700 text-sm font-medium">
                              In Development via Engagement phase
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}

                {section.items && !section.actionPlanItems && (
                  <div className="border-l-4 border-[#FACC15] pl-6">
                    <ul className="m-0 list-none space-y-4 p-0">
                      {section.items.map((item) => (
                        <li key={item.id} className="flex items-start gap-4">
                          {item.icon ? (
                            renderIcon(item.icon)
                          ) : (
                            <CheckCircle2
                              className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#5ABF87]"
                              aria-hidden
                            />
                          )}
                          <div className="flex-1">
                            {item.title && (
                              <h4 className="mb-1 font-nunito font-semibold text-[#010107]">
                                {item.title}
                              </h4>
                            )}
                            <P style="p1reg" className="text-[#060726CC] p">
                              {item.description}
                            </P>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {/* CTA */}
            {content.cta && (
              <div className="pt-6">{renderCTA(content.cta)}</div>
            )}
          </div>
        </div>
      </section>
      {pdfModalPortal}
      </>
    );
  }

  return null;
}
