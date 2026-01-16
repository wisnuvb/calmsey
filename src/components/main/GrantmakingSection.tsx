"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Shield, Flag, Info, FileDown } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { usePageContent } from "@/contexts/PageContentContext";

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
  downloadButtonText?: string;
  downloadButtonUrl?: string;
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
  infoBlockFooter?: string;
  downloadButtonText?: string;
  downloadButtonUrl?: string;
}

interface GrantmakingSectionProps {
  navigationItems?: NavigationItem[];
  activeSectionId?: string;
  onNavigationChange?: (id: string) => void;
  className?: string;
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
    },
  },
];

export function GrantmakingSection({
  navigationItems: propNavigationItems,
  activeSectionId: propActiveSectionId,
  onNavigationChange: propOnNavigationChange,
  className,
}: GrantmakingSectionProps = {}) {
  // Try to get content from context, fallback to empty object if not available
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

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

        // Parse practices (one JSON object per line)
        const practices: { id: string; text: string }[] = [];
        if (item.practices && typeof item.practices === "string") {
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

        // Parse info blocks
        const infoBlocks: InfoBlock[] = [];
        if (item.infoBlocks && typeof item.infoBlocks === "string") {
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

        // Parse numbered list
        const numberedList: NumberedListItem[] = [];
        if (item.numberedList && typeof item.numberedList === "string") {
          const numberedLines = item.numberedList
            .split("\n")
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0);

          numberedLines.forEach((line: string) => {
            try {
              const item = JSON.parse(line);
              if (item.id && item.number && item.text) {
                numberedList.push({
                  id: String(item.id),
                  number: String(item.number),
                  text: String(item.text),
                });
              }
            } catch {
              // Skip invalid JSON lines
            }
          });
        }

        // Parse footer info block
        let infoBlockFooter: InfoBlock | undefined;
        if (item.infoBlockFooter && typeof item.infoBlockFooter === "string") {
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
            ...(item.downloadButtonText && {
              downloadButtonText: String(item.downloadButtonText),
            }),
            ...(item.downloadButtonUrl && {
              downloadButtonUrl: String(item.downloadButtonUrl),
            }),
          },
        };
      });
  };

  // Get navigationItems with priority: context > props > default
  const contextNavigationItemsRaw = getContentJSON<MultipleFieldItem[]>(
    "grantmaking.navigationItems",
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

  return (
    <section className={cn("bg-white py-16 lg:py-24", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Navigation */}
          <aside className="lg:w-[478px] flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-md transition-colors text-xl font-bold font-nunito-sans p-6",
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
                <h1 className="text-3xl sm:text-[38px] font-bold text-[#010107] font-nunito-sans mb-6">
                  {activeContent.title}
                </h1>

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
                          <p
                            key={index}
                            className={cn(
                              "text-lg leading-relaxed text-gray-700"
                              // activeContent.imageSrc
                              //   ? "text-white/90"
                              //   : "text-gray-700"
                            )}
                            dangerouslySetInnerHTML={{
                              __html: paragraph.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              ),
                            }}
                          />
                        ))}
                      </div>
                    )}

                  {/* Practices Section */}
                  {activeContent.practices &&
                    activeContent.practices.length > 0 && (
                      <div className="mb-8">
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
                                <p
                                  className="text-gray-700 text-base leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: block.text
                                      .replace(
                                        /\*\*(.*?)\*\*/g,
                                        "<strong>$1</strong>"
                                      )
                                      .replace(/\\"/g, '"'),
                                  }}
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
                          <p
                            className={cn(
                              "mt-6 text-lg leading-relaxed",
                              activeContent.imageSrc
                                ? "text-white/90"
                                : "text-gray-700"
                            )}
                            dangerouslySetInnerHTML={{
                              __html: activeContent.numberedListFooter.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              ),
                            }}
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
                        <p
                          className="text-white text-base leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: activeContent.infoBlockFooter.text.replace(
                              /\*\*(.*?)\*\*/g,
                              "<strong>$1</strong>"
                            ),
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  {activeContent.downloadButtonText &&
                    activeContent.downloadButtonUrl && (
                      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p
                          className={cn(
                            "text-lg font-bold",
                            activeContent.imageSrc
                              ? "text-white"
                              : "text-gray-900"
                          )}
                        >
                          Read the full-version of our Grantmaking Framework
                        </p>
                        <a
                          href={activeContent.downloadButtonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#3C62ED] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d4fd6] transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <FileDown className="w-5 h-5" />
                          {activeContent.downloadButtonText}
                        </a>
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
  );
}
