/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentType } from "@prisma/client";
import { prisma } from "../prisma";

export interface DynamicPageContent {
  [key: string]: {
    value: any;
    type: ContentType;
    description?: string;
    isRequired?: boolean;
  };
}

export interface SimplePage {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Dynamic content
  pageContent: DynamicPageContent;
  metadata?: Record<string, any>;
}

export interface CreatePageData {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  languageId: string;
}

export interface UpdatePageData {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
}

export class SimpleCMS {
  /**
   * Get all pages
   */
  static async getPages(languageId: string): Promise<SimplePage[]> {
    const pages = await prisma.page.findMany({
      where: {
        translations: {
          some: {
            languageId: languageId,
          },
        },
      },
      include: {
        translations: {
          where: {
            languageId: languageId,
          },
          include: {
            pageContent: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return pages.map((page) => ({
      id: page.id,
      slug: page.slug,
      title: page.translations[0]?.title || "",
      excerpt: page.translations[0]?.excerpt || undefined,
      featuredImage: page.featuredImage || undefined,
      publishedAt: page.publishedAt || undefined,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      pageContent: this.parseDynamicContent(
        page.translations[0]?.pageContent || []
      ),
    }));
  }

  /**
   * Parse dynamic content dari database ke format yang mudah digunakan
   */
  private static parseDynamicContent(contents: any[]): DynamicPageContent {
    const result: DynamicPageContent = {};

    contents.forEach((content) => {
      let parsedValue = content.value;

      // Parse berdasarkan type
      switch (content.type) {
        case "JSON":
          try {
            parsedValue = JSON.parse(content.value);
          } catch {
            parsedValue = content.value;
          }
          break;
        case "NUMBER":
          parsedValue = parseFloat(content.value);
          break;
        case "BOOLEAN":
          parsedValue = content.value === "true";
          break;
        case "DATE":
          parsedValue = new Date(content.value);
          break;
        default:
          parsedValue = content.value;
      }

      result[content.key] = {
        value: parsedValue,
        type: content.type as ContentType,
        description: content.description,
        isRequired: content.isRequired,
      };
    });

    return result;
  }

  /**
   * Get page by slug
   */
  static async getPageBySlug(
    slug: string,
    languageId: string
  ): Promise<SimplePage | null> {
    // Normalize languageId
    const normalizedLanguageId = languageId === "1" ? "en" : languageId;

    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        translations: {
          where: {
            languageId: normalizedLanguageId,
          },
          include: {
            pageContent: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!page || !page.translations[0]) {
      return null;
    }

    return {
      id: page.id,
      slug: page.slug,
      title: page.translations[0].title,
      pageContent: this.parseDynamicContent(
        page.translations[0]?.pageContent || []
      ),
      excerpt: page.translations[0].excerpt || undefined,
      featuredImage: page.featuredImage || undefined,
      publishedAt: page.publishedAt || undefined,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  /**
   * Create new page
   */
  static async createPage(data: CreatePageData): Promise<SimplePage> {
    // Normalize languageId (convert "1" to "en" if needed)
    const normalizedLanguageId =
      data.languageId === "1" ? "en" : data.languageId;

    // Verify language exists
    const language = await prisma.language.findUnique({
      where: { id: normalizedLanguageId },
    });

    if (!language) {
      throw new Error(
        `Language with id "${normalizedLanguageId}" does not exist. Please ensure the language is created first.`
      );
    }

    const page = await prisma.page.create({
      data: {
        slug: data.slug,
        pageType: "CUSTOM",
        status: "PUBLISHED",
        featuredImage: data.featuredImage,
        publishedAt: new Date(),
        authorId: "admin",
        translations: {
          create: {
            title: data.title,
            // content field tidak ada di schema, gunakan PageContent untuk dynamic content
            excerpt: data.excerpt,
            languageId: normalizedLanguageId,
          },
        },
      },
      include: {
        translations: {
          include: {
            pageContent: true,
          },
        },
      },
    });

    return {
      id: page.id,
      slug: page.slug,
      title: page.translations[0].title,
      pageContent: this.parseDynamicContent(
        page.translations[0]?.pageContent || []
      ),
      excerpt: page.translations[0].excerpt || undefined,
      featuredImage: page.featuredImage || undefined,
      publishedAt: page.publishedAt || undefined,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  /**
   * Update dynamic content
   */
  static async updatePageContent(
    pageId: string,
    languageId: string,
    content: DynamicPageContent
  ): Promise<boolean> {
    try {
      // Get page translation
      const pageTranslation = await prisma.pageTranslation.findUnique({
        where: {
          pageId_languageId: {
            pageId,
            languageId,
          },
        },
      });

      if (!pageTranslation) {
        return false;
      }

      // Update atau create content entries
      for (const [key, contentData] of Object.entries(content)) {
        const value =
          typeof contentData.value === "object"
            ? JSON.stringify(contentData.value)
            : String(contentData.value);

        await prisma.pageContent.upsert({
          where: {
            pageTranslationId_key: {
              pageTranslationId: pageTranslation.id,
              key,
            },
          },
          update: {
            value,
            type: contentData.type,
            description: contentData.description,
            isRequired: contentData.isRequired,
          },
          create: {
            key,
            value,
            type: contentData.type,
            description: contentData.description,
            isRequired: contentData.isRequired,
            pageTranslationId: pageTranslation.id,
          },
        });
      }

      return true;
    } catch (error) {
      console.error("Error updating page content:", error);
      return false;
    }
  }

  /**
   * Update page
   */
  static async updatePage(
    pageId: string,
    data: UpdatePageData,
    languageId: string
  ): Promise<SimplePage | null> {
    // Normalize languageId
    const normalizedLanguageId = languageId === "1" ? "en" : languageId;

    const page = await prisma.page.update({
      where: { id: pageId },
      data: {
        featuredImage: data.featuredImage,
        translations: {
          updateMany: {
            where: {
              languageId: normalizedLanguageId,
            },
            data: {
              title: data.title,
              // content field tidak ada di schema, gunakan PageContent untuk dynamic content
              excerpt: data.excerpt,
            },
          },
        },
      },
      include: {
        translations: {
          where: {
            languageId: normalizedLanguageId,
          },
          include: {
            pageContent: true,
          },
        },
      },
    });

    if (!page.translations[0]) {
      return null;
    }

    return {
      id: page.id,
      slug: page.slug,
      title: page.translations[0].title,
      pageContent: this.parseDynamicContent(
        page.translations[0]?.pageContent || []
      ),
      excerpt: page.translations[0].excerpt || undefined,
      featuredImage: page.featuredImage || undefined,
      publishedAt: page.publishedAt || undefined,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  /**
   * Delete page
   */
  static async deletePage(pageId: string): Promise<boolean> {
    try {
      await prisma.page.delete({
        where: { id: pageId },
      });
      return true;
    } catch (error) {
      console.error("Error deleting page:", error);
      return false;
    }
  }

  /**
   * Get page by ID
   */
  static async getPageById(
    pageId: string,
    languageId: string
  ): Promise<SimplePage | null> {
    // Normalize languageId
    const normalizedLanguageId = languageId === "1" ? "en" : languageId;

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        translations: {
          where: {
            languageId: normalizedLanguageId,
          },
          include: {
            pageContent: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!page || !page.translations[0]) {
      return null;
    }

    return {
      id: page.id,
      slug: page.slug,
      title: page.translations[0].title,
      pageContent: this.parseDynamicContent(
        page.translations[0]?.pageContent || []
      ),
      excerpt: page.translations[0].excerpt || undefined,
      featuredImage: page.featuredImage || undefined,
      publishedAt: page.publishedAt || undefined,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }
}
