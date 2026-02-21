import type { FundDetail, FundContent, SupportedUnsupportedContent, PartnersWillContent, CustomContent, CTA, IconType, CTAType, HowToApplySection, ActionPlanItem } from "@/types/fund-detail";
import { getPageContentServer } from "@/lib/page-content-server";
import { getPageSchema } from "@/lib/page-content-schema";

/**
 * Fund Details Data Structure
 * 
 * Fund details are stored in page content (pageType: "OUR_FUND") with the following key pattern:
 * 
 * Required keys:
 * - fund.{slug}.header - JSON string containing FundHeader object
 * - fund.{slug}.content - JSON string containing FundContent object (supported-unsupported, partners-will, or custom)
 * 
 * Optional keys:
 * - fund.{slug}.id - Fund ID (defaults to slug if not provided)
 * 
 * Example structure:
 * {
 *   "fund.rapid-response.header": "{\"smallHeading\":\"...\",\"title\":\"...\",\"subtitle\":\"...\",\"heroImage\":{...}}",
 *   "fund.rapid-response.content": "{\"type\":\"supported-unsupported\",\"intro\":[...],...}",
 *   "fund.rapid-response.id": "rapid-response-fund"
 * }
 * 
 * @see FundHeader and FundContent types in @/types/fund-detail
 */

/**
 * Transform flat fund data from multiple field to FundDetail structure
 */
function transformFundData(fund: Record<string, unknown>): FundDetail | null {
  try {
    // Build header
    const header = {
      smallHeading: String(fund.headerSmallHeading || ""),
      title: String(fund.headerTitle || ""),
      subtitle: fund.headerSubtitle && typeof fund.headerSubtitle === "string" && fund.headerSubtitle.trim()
        ? fund.headerSubtitle.trim()
        : null,
      heroImage: {
        src: String(fund.headerHeroImageSrc || ""),
        alt: String(fund.headerHeroImageAlt || ""),
      },
    };

    if (!header.smallHeading || !header.title || !header.heroImage.src) {
      return null;
    }

    // Build content based on type
    const contentType = (fund.contentType as string) || "supported-unsupported";
    let fundContent: FundContent;

    // Parse intro paragraphs
    const intro: string[] = [];
    if (fund.intro && typeof fund.intro === "string") {
      intro.push(
        ...fund.intro
          .split(/\n\s*\n/)
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0)
      );
    }

    if (contentType === "supported-unsupported") {
      // Parse supported items
      const supportedItems: Array<{ id: string; icon: IconType; title?: string; description: string }> = [];
      if (fund.supportedItems && typeof fund.supportedItems === "string") {
        try {
          const parsed = JSON.parse(fund.supportedItems);
          if (Array.isArray(parsed)) {
            supportedItems.push(...parsed);
          }
        } catch {
          // Skip invalid JSON
        }
      }

      // Parse unsupported items
      const unsupportedItems: Array<{ id: string; icon: IconType; description: string }> = [];
      if (fund.unsupportedItems && typeof fund.unsupportedItems === "string") {
        try {
          const parsed = JSON.parse(fund.unsupportedItems);
          if (Array.isArray(parsed)) {
            unsupportedItems.push(...parsed);
          }
        } catch {
          // Skip invalid JSON
        }
      }

      // Build CTA
      const cta: CTA | undefined = fund.ctaType
        ? {
          type: fund.ctaType as CTAType,
          text: (fund.ctaText as string) || "",
          link: (fund.ctaLink as string) || undefined,
          file: (fund.ctaFile as string) || undefined,
          icon: fund.ctaIcon as IconType | undefined,
          style: ((fund.ctaStyle as string) || "primary") as "primary" | "secondary" | "outline",
        }
        : undefined;

      // Parse unsupported concluding paragraphs
      const unsupportedConcluding: string[] = [];
      if (fund.unsupportedConcluding && typeof fund.unsupportedConcluding === "string") {
        unsupportedConcluding.push(
          ...fund.unsupportedConcluding
            .split(/\n\s*\n/)
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 0)
        );
      }

      // Parse how to apply section
      let howToApplySection: HowToApplySection | undefined;
      if (fund.howToApplyHeading && typeof fund.howToApplyHeading === "string") {
        const howToApplyContent: string[] = [];
        if (fund.howToApplyContent && typeof fund.howToApplyContent === "string") {
          howToApplyContent.push(
            ...fund.howToApplyContent
              .split(/\n\s*\n/)
              .map((p: string) => p.trim())
              .filter((p: string) => p.length > 0)
          );
        }
        howToApplySection = {
          heading: String(fund.howToApplyHeading),
          content: howToApplyContent,
          cta:
            fund.howToApplyCtaType && fund.howToApplyCtaText
              ? {
                  type: (fund.howToApplyCtaType as CTAType) || "button",
                  text: String(fund.howToApplyCtaText),
                  link: fund.howToApplyCtaLink ? String(fund.howToApplyCtaLink) : undefined,
                  icon: "arrow-external" as IconType,
                  style: "primary",
                }
              : undefined,
        };
      }

      fundContent = {
        type: "supported-unsupported",
        intro,
        supportedMainHeading: fund.supportedMainHeading ? String(fund.supportedMainHeading) : undefined,
        supportedSection: {
          title: String(fund.supportedSectionTitle || ""),
          items: supportedItems,
        },
        unsupportedSection: {
          title: String(fund.unsupportedSectionTitle || ""),
          items: unsupportedItems,
        },
        unsupportedConcluding: unsupportedConcluding.length > 0 ? unsupportedConcluding : undefined,
        howToApplySection,
        cta,
      } as SupportedUnsupportedContent;
    } else if (contentType === "partners-will") {
      // Parse partners will items
      const partnersWillItems: Array<{ id: string; icon: IconType; description: string }> = [];
      if (fund.partnersWillItems && typeof fund.partnersWillItems === "string") {
        try {
          const parsed = JSON.parse(fund.partnersWillItems);
          if (Array.isArray(parsed)) {
            partnersWillItems.push(...parsed);
          }
        } catch {
          // Skip invalid JSON
        }
      }

      // Parse concluding paragraphs
      const concluding: string[] = [];
      if (fund.concluding && typeof fund.concluding === "string") {
        concluding.push(
          ...fund.concluding
            .split(/\n\s*\n/)
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 0)
        );
      }

      // Build CTA
      const cta: CTA | undefined = fund.ctaType
        ? {
          type: fund.ctaType as CTAType,
          text: (fund.ctaText as string) || "",
          link: (fund.ctaLink as string) || undefined,
          file: (fund.ctaFile as string) || undefined,
          icon: fund.ctaIcon as IconType | undefined,
          style: ((fund.ctaStyle as string) || "primary") as "primary" | "secondary" | "outline",
        }
        : undefined;

      fundContent = {
        type: "partners-will",
        intro,
        partnersWillSection: {
          title: String(fund.partnersWillSectionTitle || ""),
          items: partnersWillItems,
        },
        concluding,
        cta,
      } as PartnersWillContent;
    } else if (contentType === "custom") {
      // Parse custom sections
      const sections: Array<{ id: string; title?: string; content?: string | string[]; items?: Array<{ id: string; icon?: IconType; title?: string; description: string }>; sectionType?: string; actionPlanItems?: ActionPlanItem[] }> = [];
      if (fund.customSections && typeof fund.customSections === "string") {
        try {
          const parsed = JSON.parse(fund.customSections);
          if (Array.isArray(parsed)) {
            for (const section of parsed) {
              // Parse section content (can be string or array)
              let sectionContent: string | string[] | undefined;
              if (section.content && typeof section.content === "string") {
                const paragraphs = section.content
                  .split(/\n\s*\n/)
                  .map((p: string) => p.trim())
                  .filter((p: string) => p.length > 0);
                sectionContent = paragraphs.length === 1 ? paragraphs[0] : paragraphs;
              }

              // Parse section items
              let sectionItems: Array<{ id: string; icon?: IconType; title?: string; description: string }> = [];
              if (section.items && typeof section.items === "string") {
                try {
                  const parsedItems = JSON.parse(section.items);
                  if (Array.isArray(parsedItems)) {
                    sectionItems = parsedItems;
                  }
                } catch {
                  // Skip invalid JSON
                }
              }

              // Parse action plan items (for sectionType "action-plans")
              let actionPlanItems: ActionPlanItem[] | undefined;
              if (section.actionPlanItems) {
                try {
                  const parsed = typeof section.actionPlanItems === "string"
                    ? JSON.parse(section.actionPlanItems)
                    : section.actionPlanItems;
                  if (Array.isArray(parsed)) {
                    actionPlanItems = parsed;
                  }
                } catch {
                  // Skip invalid JSON
                }
              }

              sections.push({
                id: section.id as string,
                title: (section.title as string) || undefined,
                content: sectionContent,
                items: sectionItems.length > 0 ? sectionItems : undefined,
                sectionType: (section.sectionType as string) || undefined,
                actionPlanItems,
              });
            }
          }
        } catch {
          // Skip invalid JSON
        }
      }

      // Build CTA
      const cta: CTA | undefined = fund.ctaType
        ? {
          type: fund.ctaType as CTAType,
          text: (fund.ctaText as string) || "",
          link: (fund.ctaLink as string) || undefined,
          file: (fund.ctaFile as string) || undefined,
          icon: fund.ctaIcon as IconType | undefined,
          style: ((fund.ctaStyle as string) || "primary") as "primary" | "secondary" | "outline",
        }
        : undefined;

      fundContent = {
        type: "custom",
        sections,
        cta,
      } as CustomContent;
    } else {
      return null;
    }

    return {
      id: String(fund.id || fund.slug || ""),
      slug: String(fund.slug || ""),
      header,
      content: fundContent,
    };
  } catch (error) {
    console.error("Error transforming fund data:", error);
    return null;
  }
}

/**
 * Get fund detail by slug from database
 * Fund details can be stored in multiple formats:
 * 1. New structured format: fundDetails.funds (multiple field with individual fields)
 * 2. Legacy JSON format: fundDetails.funds with header/content as JSON strings
 * 3. Legacy flat format: fund.{slug}.header and fund.{slug}.content (flat keys)
 */
/**
 * Get effective fund details JSON - use schema default when DB has empty array
 */
function getEffectiveFundDetailsJson(
  content: Record<string, string>,
  fundDetailsKey: string
): string {
  let json = content[fundDetailsKey] ?? "";
  const trimmed = (json || "").trim();
  if (!trimmed || trimmed === "[]") {
    const schema = getPageSchema("OUR_FUND");
    const field = schema?.fields.find((f) => f.key === fundDetailsKey);
    if (field?.defaultValue) {
      json = field.defaultValue;
    }
  }
  return json;
}

export async function getFundDetailBySlug(
  slug: string,
  language: string = "en"
): Promise<FundDetail | null> {
  try {
    const content = await getPageContentServer("OUR_FUND", language);

    // Try new structured format first: fundDetails.funds (multiple field with individual fields)
    const fundDetailsKey = "fundDetails.funds";
    const fundDetailsJson = getEffectiveFundDetailsJson(content, fundDetailsKey);

    if (fundDetailsJson) {
      try {
        const fundDetailsArray = JSON.parse(fundDetailsJson);
        if (Array.isArray(fundDetailsArray)) {
          const fund = fundDetailsArray.find(
            (f: { slug?: string }) => f.slug === slug
          );

          if (fund) {
            // Check if it's new structured format (has headerSmallHeading) or legacy JSON format
            if (fund.headerSmallHeading) {
              // New structured format - transform from flat fields
              return transformFundData(fund);
            } else if (fund.header && fund.content) {
              // Legacy JSON format - parse header and content
              const header = typeof fund.header === "string"
                ? JSON.parse(fund.header)
                : fund.header;
              const fundContent = typeof fund.content === "string"
                ? JSON.parse(fund.content)
                : fund.content;

              return {
                id: fund.id || slug,
                slug: fund.slug || slug,
                header,
                content: fundContent,
              };
            }
          }
        }
      } catch (parseError) {
        console.warn("Error parsing fundDetails.funds:", parseError);
      }
    }

    // Fallback to legacy format: fund.{slug}.header and fund.{slug}.content
    const headerKey = `fund.${slug}.header`;
    const contentKey = `fund.${slug}.content`;

    console.log(`Looking for fund keys: ${headerKey}, ${contentKey}`);
    console.log(`Available keys in content:`, Object.keys(content).filter(k => k.startsWith('fund.')));

    const headerJson = content[headerKey];
    const contentJson = content[contentKey];

    if (!headerJson || !contentJson) {
      console.warn(`Fund data not found. Header exists: ${!!headerJson}, Content exists: ${!!contentJson}`);
      return null;
    }

    // Parse JSON strings
    const header = JSON.parse(headerJson);
    const fundContent = JSON.parse(contentJson);

    // Get fund ID and slug from content or use slug as ID
    const idKey = `fund.${slug}.id`;
    const fundId = content[idKey] || slug;

    return {
      id: fundId,
      slug,
      header,
      content: fundContent,
    };
  } catch (error) {
    console.error(`Error fetching fund detail for slug "${slug}" in language "${language}":`, error);
    return null;
  }
}

/**
 * Get all fund details from database
 * Supports both formats:
 * 1. New format: fundDetails.funds (multiple field)
 * 2. Legacy format: fund.{slug}.header and fund.{slug}.content (flat keys)
 */
export async function getAllFundDetails(
  language: string = "en"
): Promise<FundDetail[]> {
  try {
    const content = await getPageContentServer("OUR_FUND", language);
    const funds: FundDetail[] = [];

    // Try new format first: fundDetails.funds (multiple field)
    const fundDetailsKey = "fundDetails.funds";
    const fundDetailsJson = getEffectiveFundDetailsJson(content, fundDetailsKey);

    if (fundDetailsJson) {
      try {
        const fundDetailsArray = JSON.parse(fundDetailsJson);
        if (Array.isArray(fundDetailsArray)) {
          for (const fund of fundDetailsArray) {
            if (!fund.slug) continue;

            try {
              // Check if it's new structured format (has headerSmallHeading) or legacy JSON format
              if (fund.headerSmallHeading) {
                // New structured format - transform from flat fields
                const transformed = transformFundData(fund);
                if (transformed) {
                  funds.push(transformed);
                }
              } else if (fund.header && fund.content) {
                // Legacy JSON format - parse header and content
                const header = typeof fund.header === "string"
                  ? JSON.parse(fund.header)
                  : fund.header;
                const fundContent = typeof fund.content === "string"
                  ? JSON.parse(fund.content)
                  : fund.content;

                funds.push({
                  id: fund.id || fund.slug,
                  slug: fund.slug,
                  header,
                  content: fundContent,
                });
              }
            } catch (parseError) {
              console.error(`Error parsing fund ${fund.slug}:`, parseError);
              continue;
            }
          }
        }
      } catch (parseError) {
        console.warn("Error parsing fundDetails.funds:", parseError);
      }
    }

    // If we found funds in new format, return them
    if (funds.length > 0) {
      return funds;
    }

    // Fallback to legacy format: fund.{slug}.header and fund.{slug}.content
    const fundKeys = Object.keys(content).filter((key) =>
      key.match(/^fund\.(.+)\.header$/)
    );

    for (const headerKey of fundKeys) {
      const match = headerKey.match(/^fund\.(.+)\.header$/);
      if (!match) continue;

      const slug = match[1];
      const contentKey = `fund.${slug}.content`;
      const idKey = `fund.${slug}.id`;

      const headerJson = content[headerKey];
      const contentJson = content[contentKey];

      if (!headerJson || !contentJson) continue;

      try {
        const header = JSON.parse(headerJson);
        const fundContent = JSON.parse(contentJson);
        const fundId = content[idKey] || slug;

        funds.push({
          id: fundId,
          slug,
          header,
          content: fundContent,
        });
      } catch (parseError) {
        console.error(`Error parsing fund ${slug}:`, parseError);
        continue;
      }
    }

    return funds;
  } catch (error) {
    console.error("Error fetching all fund details:", error);
    return [];
  }
}

/**
 * Get fund detail by ID
 */
export async function getFundDetailById(
  id: string,
  language: string = "en"
): Promise<FundDetail | null> {
  const allFunds = await getAllFundDetails(language);
  return allFunds.find((fund) => fund.id === id) || null;
}

/**
 * Get all fund slugs (for static generation)
 */
export async function getAllFundSlugs(
  language: string = "en"
): Promise<string[]> {
  const funds = await getAllFundDetails(language);
  return funds.map((fund) => fund.slug);
}

/**
 * Get all fund IDs
 */
export async function getAllFundIds(
  language: string = "en"
): Promise<string[]> {
  const funds = await getAllFundDetails(language);
  return funds.map((fund) => fund.id);
}
