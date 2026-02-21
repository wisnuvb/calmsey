"use client";

import Link from "next/link";
import { CheckCircle2, X, FileText, Download, ArrowUpRight } from "lucide-react";
import { H3, P } from "../ui/typography";
import type { FundContent } from "@/types/fund-detail";
import { cn } from "@/lib/utils";

interface FundDetailContentProps {
  content: FundContent;
}

export function FundDetailContent({ content }: FundDetailContentProps) {
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
      return (
        <a
          href={cta.file}
          download
          className={cn(
            baseButtonClasses,
            "bg-[#3C62ED] text-white hover:bg-[#2d4fd6]"
          )}
          aria-label={`Download ${cta.text}`}
        >
          <FileText className="w-5 h-5" />
          <span>{cta.text}</span>
          <Download className="w-4 h-4" />
        </a>
      );
    }

    if (cta.type === "button") {
      const isExternal = cta.link?.startsWith("http") ?? false;
      const showArrow = cta.icon === "arrow" || cta.icon === "arrow-external" || isExternal;
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
          : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
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

  const renderParagraphWithHtml = (text: string, key?: string) => (
    <div
      key={key}
      className="text-[#060726CC] text-lg leading-relaxed font-work-sans [&_a]:text-[#3C62ED] [&_a]:underline [&_a:hover]:text-[#2d4fd6]"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  // Render based on content type
  if (content.type === "supported-unsupported") {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Intro */}
            {content.intro.map((paragraph, index) => (
              <P
                key={index}
                style="p1reg"
                className="text-[#060726CC] text-lg leading-relaxed font-work-sans"
              >
                {paragraph}
              </P>
            ))}

            {/* Supported Section */}
            <div className="space-y-6">
              {content.supportedMainHeading && (
                <H3
                  style="h3bold"
                  className="text-[#010107] text-2xl font-bold font-nunito-sans mb-2"
                >
                  {content.supportedMainHeading}
                </H3>
              )}
              <H3
                style="h3bold"
                className="text-[#010107] text-xl font-bold font-nunito-sans mb-6"
              >
                {content.supportedSection.title}
              </H3>
              <ul className="space-y-4">
                {content.supportedSection.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-4">
                    {renderIcon(item.icon)}
                    <div className="flex-1">
                      {item.title && (
                        <h4 className="font-semibold text-[#010107] mb-1 font-nunito-sans">
                          {item.title}:
                        </h4>
                      )}
                      <P
                        style="p1reg"
                        className="text-[#060726CC] leading-relaxed font-work-sans"
                      >
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
                className="text-[#010107] text-2xl font-bold font-nunito-sans mb-6"
              >
                {content.unsupportedSection.title}
              </H3>
              <ul className="space-y-4">
                {content.unsupportedSection.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-4">
                    {renderIcon(item.icon)}
                    <P
                      style="p1reg"
                      className="text-[#060726CC] leading-relaxed font-work-sans flex-1"
                    >
                      {item.description}
                    </P>
                  </li>
                ))}
              </ul>
              {content.unsupportedConcluding?.map((paragraph, index) => (
                <P
                  key={index}
                  style="p1reg"
                  className="text-[#060726CC] leading-relaxed font-work-sans"
                >
                  {paragraph}
                </P>
              ))}
            </div>

            {/* How to Apply Section */}
            {content.howToApplySection && (
              <div className="space-y-6">
                <H3
                  style="h3bold"
                  className="text-[#010107] text-2xl font-bold font-nunito-sans mb-6"
                >
                  {content.howToApplySection.heading}
                </H3>
                {content.howToApplySection.content.map((paragraph, index) => (
                  <P
                    key={index}
                    style="p1reg"
                    className="text-[#060726CC] text-lg leading-relaxed font-work-sans"
                  >
                    {paragraph}
                  </P>
                ))}
                {content.howToApplySection.cta && (
                  <div className="pt-2">{renderCTA(content.howToApplySection.cta)}</div>
                )}
              </div>
            )}

            {/* CTA (fallback if no how to apply) */}
            {content.cta && !content.howToApplySection && (
              <div className="pt-6">{renderCTA(content.cta)}</div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (content.type === "partners-will") {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Intro */}
            {content.intro.map((paragraph, index) => (
              <P
                key={index}
                style="p1reg"
                className="text-[#060726CC] text-lg leading-relaxed font-work-sans"
              >
                {paragraph}
              </P>
            ))}

            {/* Partners Will Section */}
            <div className="space-y-6">
              <H3
                style="h3bold"
                className="text-[#010107] text-2xl font-bold font-nunito-sans mb-6"
              >
                {content.partnersWillSection.title}
              </H3>
              <ul className="space-y-4">
                {content.partnersWillSection.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-4">
                    {renderIcon(item.icon)}
                    <P
                      style="p1reg"
                      className="text-[#060726CC] leading-relaxed font-work-sans flex-1"
                    >
                      {item.description}
                    </P>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concluding */}
            {content.concluding.map((paragraph, index) => (
              <P
                key={index}
                style="p1reg"
                className="text-[#060726CC] text-lg leading-relaxed font-work-sans"
              >
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
    );
  }

  const hasHtml = (text: string) => /<a\s|<\/a>|<[a-z][\s\S]*>/i.test(text);

  if (content.type === "custom") {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {content.sections.map((section) => (
              <div key={section.id} className="space-y-6">
                {section.title && (
                  <H3
                    style="h3bold"
                    className="text-[#010107] text-2xl font-bold font-nunito-sans"
                  >
                    {section.title}
                  </H3>
                )}

                {section.content && (
                  <div className="space-y-4">
                    {Array.isArray(section.content) ? (
                      section.content.map((para, index) =>
                        hasHtml(para) ? (
                          renderParagraphWithHtml(para, `content-${index}`)
                        ) : (
                          <P
                            key={index}
                            style="p1reg"
                            className="text-[#060726CC] text-lg leading-relaxed font-work-sans"
                          >
                            {para}
                          </P>
                        )
                      )
                    ) : hasHtml(section.content) ? (
                      renderParagraphWithHtml(section.content)
                    ) : (
                      <P
                        style="p1reg"
                        className="text-[#060726CC] text-lg leading-relaxed font-work-sans"
                      >
                        {section.content}
                      </P>
                    )}
                  </div>
                )}

                {section.sectionType === "action-plans" && section.actionPlanItems && (
                  <ol className="space-y-4 list-none">
                    {section.actionPlanItems.map((item) => (
                      <li
                        key={item.number}
                        className="flex items-center justify-between gap-4 flex-wrap"
                      >
                        <span className="font-nunito-sans font-semibold text-[#010107]">
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
                  <ul className="space-y-4">
                    {section.items.map((item) => (
                      <li key={item.id} className="flex items-start gap-4">
                        {item.icon && renderIcon(item.icon)}
                        <div className="flex-1">
                          {item.title && (
                            <h4 className="font-semibold text-[#010107] mb-1 font-nunito-sans">
                              {item.title}
                            </h4>
                          )}
                          <P
                            style="p1reg"
                            className="text-[#060726CC] leading-relaxed font-work-sans"
                          >
                            {item.description}
                          </P>
                        </div>
                      </li>
                    ))}
                  </ul>
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
    );
  }

  return null;
}
