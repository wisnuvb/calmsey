/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { BrandkitDatabase } from "@/lib/brandkit/database-operations";
import {
  SmartStyleApplication,
  StyleApplicationOptions,
} from "@/lib/brandkit/style-application";
import { PageSection } from "@/types/page-builder";
import { Brandkit } from "@/types/brandkit";

export interface PageBrandkitIntegration {
  pageId: string;
  brandkitId: string;
  appliedAt: Date;
  appliedSections: string[];
  preservedCustomizations: boolean;
}

export interface BrandkitApplicationResult {
  success: boolean;
  pageId: string;
  brandkitId: string;
  appliedSections: number;
  skippedSections: number;
  errors: string[];
  changes: Record<string, string[]>; // sectionId -> changes
}

export class PageBrandkitService {
  /**
   * Apply brandkit to an entire page
   */
  static async applyBrandkitToPage(
    pageId: string,
    brandkitId: string,
    options: StyleApplicationOptions & {
      authorId?: string;
      dryRun?: boolean;
    } = {}
  ): Promise<BrandkitApplicationResult> {
    const { authorId, dryRun = false, ...styleOptions } = options;

    try {
      // Validate page exists and user has permission
      const page = await prisma.page.findFirst({
        where: {
          id: pageId,
          ...(authorId && { authorId }),
        },
        include: {
          sections: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      });

      if (!page) {
        throw new Error("Page not found or access denied");
      }

      // Get brandkit
      const brandkit = await BrandkitDatabase.getBrandkitById(brandkitId);
      if (!brandkit) {
        throw new Error("Brandkit not found");
      }

      // Map database sections to PageSection type
      const sections = page.sections.map(this.mapDbSectionToPageSection);

      // Apply brandkit to sections
      const applicationResult =
        await SmartStyleApplication.applyBrandkitToSections(
          sections,
          brandkit,
          styleOptions
        );

      const result: BrandkitApplicationResult = {
        success: applicationResult.success,
        pageId,
        brandkitId,
        appliedSections: applicationResult.appliedSections.length,
        skippedSections: applicationResult.skippedSections.length,
        errors: applicationResult.errors,
        changes: {},
      };

      // If not dry run, save changes to database
      if (!dryRun && applicationResult.success) {
        await this.saveSectionChanges(
          pageId,
          applicationResult.appliedSections,
          sections
        );

        // Update page timestamp
        await prisma.page.update({
          where: { id: pageId },
          data: {
            updatedAt: new Date(),
          },
        });

        // Record brandkit application
        await this.recordBrandkitApplication(
          pageId,
          brandkitId,
          applicationResult.appliedSections
        );
      }

      return result;
    } catch (error) {
      return {
        success: false,
        pageId,
        brandkitId,
        appliedSections: 0,
        skippedSections: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        changes: {},
      };
    }
  }

  /**
   * Apply brandkit to specific sections of a page
   */
  static async applyBrandkitToPageSections(
    pageId: string,
    sectionIds: string[],
    brandkitId: string,
    options: StyleApplicationOptions & { authorId?: string } = {}
  ): Promise<BrandkitApplicationResult> {
    const { authorId, ...styleOptions } = options;

    try {
      // Get specific sections
      const sections = await prisma.pageSection.findMany({
        where: {
          id: { in: sectionIds },
          pageId,
          isActive: true,
          ...(authorId && {
            page: { authorId },
          }),
        },
      });

      if (sections.length === 0) {
        throw new Error("No sections found or access denied");
      }

      const brandkit = await BrandkitDatabase.getBrandkitById(brandkitId);
      if (!brandkit) {
        throw new Error("Brandkit not found");
      }

      const mappedSections = sections.map(this.mapDbSectionToPageSection);
      const changes: Record<string, string[]> = {};

      let appliedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      // Apply brandkit to each section
      for (const section of mappedSections) {
        try {
          const { section: updatedSection, changes: sectionChanges } =
            SmartStyleApplication.applyBrandkitToSection(
              section,
              brandkit,
              styleOptions
            );

          if (sectionChanges.length > 0) {
            // Save changes to database
            await this.updatePageSection(section.id, updatedSection);
            changes[section.id] = sectionChanges;
            appliedCount++;
          } else {
            skippedCount++;
          }
        } catch (error) {
          errors.push(
            `Section ${section.id}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          skippedCount++;
        }
      }

      // Update page timestamp if all sections were successful
      if (errors.length === 0) {
        await prisma.page.update({
          where: { id: pageId },
          data: {
            updatedAt: new Date(),
          },
        });
      }

      return {
        success: errors.length === 0,
        pageId,
        brandkitId,
        appliedSections: appliedCount,
        skippedSections: skippedCount,
        errors,
        changes,
      };
    } catch (error) {
      return {
        success: false,
        pageId,
        brandkitId,
        appliedSections: 0,
        skippedSections: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        changes: {},
      };
    }
  }

  /**
   * Get page's current brandkit (placeholder - brandkitId not in schema yet)
   */
  static async getPageBrandkit(pageId: string): Promise<Brandkit | null> {
    // TODO: Add brandkitId field to Page model in schema
    return null;
  }

  /**
   * Remove brandkit from page (placeholder - brandkitId not in schema yet)
   */
  static async removeBrandkitFromPage(
    pageId: string,
    authorId?: string
  ): Promise<boolean> {
    // TODO: Add brandkitId field to Page model in schema
    return true;
  }

  /**
   * Get pages using specific brandkit (placeholder - brandkitId not in schema yet)
   */
  static async getPagesUsingBrandkit(brandkitId: string, authorId?: string) {
    // TODO: Add brandkitId field to Page model in schema
    return [];
  }

  /**
   * Get brandkit usage analytics for pages (placeholder - brandkitId not in schema yet)
   */
  static async getBrandkitPageAnalytics(brandkitId: string) {
    // TODO: Add brandkitId field to Page model in schema
    return {
      totalPages: 0,
      publishedPages: 0,
      draftPages: 0,
      recentUsage: [],
    };
  }

  /**
   * Validate brandkit compatibility with page
   */
  static async validateBrandkitCompatibility(
    pageId: string,
    brandkitId: string
  ): Promise<{
    compatible: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    try {
      const [page, brandkit] = await Promise.all([
        prisma.page.findUnique({
          where: { id: pageId },
          include: {
            sections: {
              where: { isActive: true },
            },
          },
        }),
        BrandkitDatabase.getBrandkitById(brandkitId),
      ]);

      if (!page || !brandkit) {
        return {
          compatible: false,
          issues: ["Page or brandkit not found"],
          suggestions: [],
        };
      }

      const sections = page.sections.map(this.mapDbSectionToPageSection);

      // TODO: Implement brandkit compatibility validation
      return {
        compatible: true,
        issues: [],
        suggestions: [],
      };
    } catch (error) {
      return {
        compatible: false,
        issues: [error instanceof Error ? error.message : "Unknown error"],
        suggestions: [],
      };
    }
  }

  /**
   * Create page from template with brandkit
   */
  static async createPageFromTemplate(
    templateId: string,
    brandkitId: string,
    pageData: {
      slug: string;
      authorId: string;
      languageId: string;
      title: string;
      content?: string;
    },
    options: StyleApplicationOptions = {}
  ) {
    try {
      // Get template
      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      const templateData = JSON.parse(template.templateData);
      const brandkit = await BrandkitDatabase.getBrandkitById(brandkitId);

      if (!brandkit) {
        throw new Error("Brandkit not found");
      }

      // Create page
      const page = await prisma.page.create({
        data: {
          slug: pageData.slug,
          status: "DRAFT",
          template: "CUSTOM",
          authorId: pageData.authorId,
          translations: {
            create: {
              title: pageData.title,
              content: pageData.content || "",
              languageId: pageData.languageId,
            },
          },
        },
      });

      // Create sections from template
      const sections: PageSection[] = [];

      if (templateData.sections && Array.isArray(templateData.sections)) {
        for (let i = 0; i < templateData.sections.length; i++) {
          const templateSection = templateData.sections[i];

          // Apply brandkit to section before creating
          const { section: styledSection } =
            SmartStyleApplication.applyBrandkitToSection(
              templateSection,
              brandkit,
              options
            );

          const dbSection = await prisma.pageSection.create({
            data: {
              type: styledSection.type,
              order: i,
              isActive: true,
              pageId: page.id,
              layoutSettings: JSON.stringify(styledSection.layoutSettings),
              styleSettings: JSON.stringify(styledSection.styleSettings),
              responsiveSettings: JSON.stringify(
                styledSection.responsiveSettings
              ),
              animationSettings: JSON.stringify(
                styledSection.animationSettings
              ),
              contentSettings: JSON.stringify(styledSection.contentSettings),
              customSettings: JSON.stringify(styledSection.customSettings),
              translations: {
                create: styledSection.translations.map((trans) => ({
                  languageId: trans.languageId,
                  title: trans.title,
                  subtitle: trans.subtitle,
                  content: trans.content,
                  metadata: trans.metadata
                    ? JSON.stringify(trans.metadata)
                    : null,
                  altText: trans.altText,
                  caption: trans.caption,
                })),
              },
            },
          });

          sections.push(this.mapDbSectionToPageSection(dbSection));
        }
      }

      return {
        page,
        sections,
        appliedBrandkit: brandkit,
      };
    } catch (error) {
      throw new Error(
        `Failed to create page from template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Private helper methods
   */
  private static mapDbSectionToPageSection(dbSection: any): PageSection {
    return {
      id: dbSection.id,
      type: dbSection.type,
      order: dbSection.order,
      isActive: dbSection.isActive,
      layoutSettings: dbSection.layoutSettings
        ? JSON.parse(dbSection.layoutSettings)
        : {},
      styleSettings: dbSection.styleSettings
        ? JSON.parse(dbSection.styleSettings)
        : {},
      responsiveSettings: dbSection.responsiveSettings
        ? JSON.parse(dbSection.responsiveSettings)
        : {},
      animationSettings: dbSection.animationSettings
        ? JSON.parse(dbSection.animationSettings)
        : {},
      contentSettings: dbSection.contentSettings
        ? JSON.parse(dbSection.contentSettings)
        : {},
      customSettings: dbSection.customSettings
        ? JSON.parse(dbSection.customSettings)
        : {},
      translations: dbSection.translations || [],
      createdAt: dbSection.createdAt,
      updatedAt: dbSection.updatedAt,
    };
  }

  private static async updatePageSection(
    sectionId: string,
    section: PageSection
  ): Promise<void> {
    await prisma.pageSection.update({
      where: { id: sectionId },
      data: {
        layoutSettings: JSON.stringify(section.layoutSettings),
        styleSettings: JSON.stringify(section.styleSettings),
        responsiveSettings: JSON.stringify(section.responsiveSettings),
        animationSettings: JSON.stringify(section.animationSettings),
        contentSettings: JSON.stringify(section.contentSettings),
        customSettings: JSON.stringify(section.customSettings),
        updatedAt: new Date(),
      },
    });
  }

  private static async saveSectionChanges(
    pageId: string,
    appliedSectionIds: string[],
    sections: PageSection[]
  ): Promise<void> {
    for (const sectionId of appliedSectionIds) {
      const section = sections.find((s) => s.id === sectionId);
      if (section) {
        await this.updatePageSection(sectionId, section);
      }
    }
  }

  private static async recordBrandkitApplication(
    pageId: string,
    brandkitId: string,
    appliedSections: string[]
  ): Promise<void> {
    // This could be stored in a separate audit table for tracking
    // For now, we'll just update the page's updatedAt timestamp
    await prisma.page.update({
      where: { id: pageId },
      data: { updatedAt: new Date() },
    });
  }
}

/**
 * Template-Brandkit Integration
 */
export class TemplateBrandkitService {
  /**
   * Apply brandkit to template
   */
  static async applyBrandkitToTemplate(
    templateId: string,
    brandkitId: string,
    options: StyleApplicationOptions = {}
  ) {
    try {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      const brandkit = await BrandkitDatabase.getBrandkitById(brandkitId);
      if (!brandkit) {
        throw new Error("Brandkit not found");
      }

      const templateData = JSON.parse(template.templateData);
      const sections: PageSection[] = templateData.sections || [];

      // Apply brandkit to all sections
      const updatedSections = sections.map((section) => {
        const { section: styledSection } =
          SmartStyleApplication.applyBrandkitToSection(
            section,
            brandkit,
            options
          );
        return styledSection;
      });

      // Update template data
      const updatedTemplateData = {
        ...templateData,
        sections: updatedSections,
      };

      // Save updated template
      await prisma.template.update({
        where: { id: templateId },
        data: {
          templateData: JSON.stringify(updatedTemplateData),
          brandkitId,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        templateId,
        brandkitId,
        sectionsUpdated: updatedSections.length,
      };
    } catch (error) {
      throw new Error(
        `Failed to apply brandkit to template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get templates using specific brandkit
   */
  static async getTemplatesUsingBrandkit(
    brandkitId: string,
    authorId?: string
  ) {
    const where: any = { brandkitId };
    if (authorId) {
      where.authorId = authorId;
    }

    return prisma.template.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: true,
        difficulty: true,
        previewImage: true,
        downloadCount: true,
        rating: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}
