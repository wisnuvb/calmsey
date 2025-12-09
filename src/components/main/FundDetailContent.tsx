"use client";

import Link from "next/link";
import { CheckCircle2, X, FileText, Download } from "lucide-react";
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
        >
          <FileText className="w-5 h-5" />
          <span>{cta.text}</span>
          <Download className="w-4 h-4" />
        </a>
      );
    }

    if (cta.type === "button") {
      return (
        <Link
          href={cta.link || "#"}
          className={cn(
            baseButtonClasses,
            cta.style === "primary"
              ? "bg-[#3C62ED] text-white hover:bg-[#2d4fd6]"
              : cta.style === "secondary"
              ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
              : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
          )}
        >
          {cta.text}
        </Link>
      );
    }

    return null;
  };

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
              <H3
                style="h3bold"
                className="text-[#010107] text-2xl font-bold font-nunito-sans mb-6"
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
            </div>

            {/* CTA */}
            {content.cta && (
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
                      section.content.map((para, index) => (
                        <P
                          key={index}
                          style="p1reg"
                          className="text-[#060726CC] text-lg leading-relaxed font-work-sans"
                        >
                          {para}
                        </P>
                      ))
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

                {section.items && (
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
