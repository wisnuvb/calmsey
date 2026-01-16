/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "./prisma";

// Types for public API responses
export interface PublicArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  location?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  // Story/Partner Story specific fields
  videoUrl?: string;
  posterImage?: string;
  partnerOrganization?: {
    name: string;
    logo: string;
    fullName: string;
  };
  photos?: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  author: {
    name: string;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  tags: {
    id: string;
    name: string;
  }[];
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface PublicCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: PublicCategory[];
  articleCount: number;
}

export interface PublicMenuItem {
  id: string;
  title: string;
  url?: string;
  type: string;
  children?: PublicMenuItem[];
  categorySlug?: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

// Dynamic language support - using database
import {
  getActiveLanguages,
  getDefaultLanguage,
  isValidLanguage as isValidLanguageDB,
  getSupportedLanguages as getSupportedLanguagesDB,
  type DynamicLanguage,
} from "./dynamic-languages";

// Legacy constants for backward compatibility (will be deprecated)
export const SUPPORTED_LANGUAGES = ["en", "id"] as const;
export type SupportedLanguage = string; // Changed to string to support dynamic languages
export const DEFAULT_LANGUAGE = "en"; // Fallback default

// Dynamic language functions
export async function getSupportedLanguages(): Promise<string[]> {
  return await getSupportedLanguagesDB();
}

export async function getDefaultLanguageDynamic(): Promise<string> {
  return await getDefaultLanguage();
}

export async function isValidLanguage(lang: string): Promise<boolean> {
  return await isValidLanguageDB(lang);
}

export async function getValidLanguage(lang?: string): Promise<string> {
  if (lang && (await isValidLanguage(lang))) {
    return lang;
  }
  return await getDefaultLanguageDynamic();
}

// Get active languages with full info
export async function getActiveLanguagesWithInfo(): Promise<DynamicLanguage[]> {
  return await getActiveLanguages();
}

// Public API functions
export class PublicAPI {
  // Get homepage data
  static async getHomepageData(language: SupportedLanguage) {
    try {
      const [recentArticles, siteSettings] = await Promise.all([
        PublicAPI.getRecentArticles(language, 6),
        PublicAPI.getSiteSettings(),
      ]);

      return {
        recentArticles,
        siteSettings,
      };
    } catch (error) {
      console.error("Homepage data fetch error:", error);
      return {
        recentArticles: [],
        siteSettings: null,
      };
    }
  }

  // Get recent articles
  static async getRecentArticles(
    language: SupportedLanguage,
    limit = 10
  ): Promise<PublicArticle[]> {
    try {
      const articles = await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          publishedAt: { not: null },
          translations: {
            some: { languageId: language },
          },
        },
        include: {
          author: { select: { name: true } },
          translations: {
            where: { languageId: language },
            take: 1,
          },
          categories: {
            include: {
              category: {
                include: {
                  translations: {
                    where: { languageId: language },
                    take: 1,
                  },
                },
              },
            },
          },
          articleTag: {
            include: { tag: true },
          },
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
      });

      return articles.map(this.formatArticle);
    } catch (error) {
      console.error("Recent articles fetch error:", error);
      return [];
    }
  }

  // Get article by slug
  static async getArticleBySlug(
    slug: string,
    language: SupportedLanguage
  ): Promise<PublicArticle | null> {
    try {
      const article = await prisma.article.findFirst({
        where: {
          slug,
          status: "PUBLISHED",
          publishedAt: { not: null },
          translations: {
            some: { languageId: language },
          },
        },
        include: {
          author: { select: { name: true } },
          translations: {
            where: { languageId: language },
            take: 1,
          },
          categories: {
            include: {
              category: {
                include: {
                  translations: {
                    where: { languageId: language },
                    take: 1,
                  },
                },
              },
            },
          },
          articleTag: {
            include: { tag: true },
          },
        },
      });

      return article ? this.formatArticle(article) : null;
    } catch (error) {
      console.error("Article fetch error:", error);
      return null;
    }
  }

  // Get articles by category
  static async getArticlesByCategory(
    categorySlug: string,
    language: SupportedLanguage,
    page = 1,
    limit = 12
  ) {
    try {
      const category = await prisma.category.findFirst({
        where: { slug: categorySlug },
        include: {
          translations: {
            where: { languageId: language },
            take: 1,
          },
        },
      });

      if (!category || !category.translations[0]) {
        return null;
      }

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where: {
            status: "PUBLISHED",
            publishedAt: { not: null },
            categories: {
              some: { categoryId: category.id },
            },
            translations: {
              some: { languageId: language },
            },
          },
          include: {
            author: { select: { name: true } },
            translations: {
              where: { languageId: language },
              take: 1,
            },
            categories: {
              include: {
                category: {
                  include: {
                    translations: {
                      where: { languageId: language },
                      take: 1,
                    },
                  },
                },
              },
            },
            articleTag: {
              include: { tag: true },
            },
          },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.article.count({
          where: {
            status: "PUBLISHED",
            publishedAt: { not: null },
            categories: {
              some: { categoryId: category.id },
            },
            translations: {
              some: { languageId: language },
            },
          },
        }),
      ]);

      return {
        category: {
          id: category.id,
          slug: category.slug,
          name: category.translations[0].name,
          description: category.translations[0].description,
        },
        articles: articles.map(this.formatArticle),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Category articles fetch error:", error);
      return null;
    }
  }

  // Get navigation menu
  static async getNavigationMenu(
    menuKey: string,
    language: SupportedLanguage
  ): Promise<PublicMenuItem[]> {
    try {
      const menu = await prisma.menu.findFirst({
        where: { key: menuKey },
        include: {
          items: {
            where: { isActive: true },
            include: {
              translations: {
                where: { languageId: language },
                take: 1,
              },
              category: {
                include: {
                  translations: {
                    where: { languageId: language },
                    take: 1,
                  },
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      });

      if (!menu) return [];

      return this.buildMenuTree(menu.items);
    } catch (error) {
      console.error("Navigation menu fetch error:", error);
      return [];
    }
  }

  // Get site settings
  static async getSiteSettings(): Promise<SiteSettings | null> {
    try {
      const settings = await prisma.siteSetting.findMany();

      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      return {
        siteName: settingsMap.site_name || "Turning Tides Facility",
        siteDescription: settingsMap.site_description || "",
        contactPhone: settingsMap.contact_phone,
        contactEmail: settingsMap.contact_email,
        address: settingsMap.address,
        socialLinks: {
          facebook: settingsMap.social_facebook,
          twitter: settingsMap.social_twitter,
          instagram: settingsMap.social_instagram,
        },
      };
    } catch (error) {
      console.error("Site settings fetch error:", error);
      return null;
    }
  }

  // Get category hierarchy
  static async getCategoryHierarchy(
    language: SupportedLanguage
  ): Promise<PublicCategory[]> {
    try {
      const categories = await prisma.category.findMany({
        include: {
          translations: {
            where: { languageId: language },
            take: 1,
          },
          _count: {
            select: {
              articles: {
                where: {
                  article: {
                    status: "PUBLISHED",
                    publishedAt: { not: null },
                  },
                },
              },
            },
          },
        },
      });

      const formattedCategories = categories
        .filter((cat) => cat.translations[0]) // Only include categories with translations
        .map((cat) => ({
          id: cat.id,
          slug: cat.slug,
          name: cat.translations[0].name,
          description: cat.translations[0].description,
          parentId: cat.parentId,
          articleCount: cat._count.articles,
        }));

      return this.buildCategoryTree(formattedCategories);
    } catch (error) {
      console.error("Category hierarchy fetch error:", error);
      return [];
    }
  }

  // Helper: Format article data
  private static formatArticle(article: any): PublicArticle {
    const translation = article.translations[0];

    // Ensure publishedAt is a Date object
    let publishedAt: Date;
    if (article.publishedAt instanceof Date) {
      publishedAt = article.publishedAt;
    } else if (typeof article.publishedAt === "string") {
      publishedAt = new Date(article.publishedAt);
    } else {
      // Fallback for Prisma serialized dates
      publishedAt = new Date(article.publishedAt);
    }

    // Validate the date
    if (isNaN(publishedAt.getTime())) {
      publishedAt = new Date(); // Fallback to current date if invalid
    }

    // Ensure createdAt and updatedAt are Date objects
    let createdAt: Date;
    if (article.createdAt instanceof Date) {
      createdAt = article.createdAt;
    } else if (typeof article.createdAt === "string") {
      createdAt = new Date(article.createdAt);
    } else {
      createdAt = new Date(article.createdAt);
    }

    let updatedAt: Date;
    if (article.updatedAt instanceof Date) {
      updatedAt = article.updatedAt;
    } else if (typeof article.updatedAt === "string") {
      updatedAt = new Date(article.updatedAt);
    } else {
      updatedAt = new Date(article.updatedAt);
    }

    // Parse JSON fields
    let partnerOrganization:
      | { name: string; logo: string; fullName: string }
      | undefined;
    if (article.partnerOrganization) {
      if (typeof article.partnerOrganization === "string") {
        try {
          partnerOrganization = JSON.parse(article.partnerOrganization);
        } catch {
          partnerOrganization = undefined;
        }
      } else {
        partnerOrganization = article.partnerOrganization as {
          name: string;
          logo: string;
          fullName: string;
        };
      }
    }

    let photos: Array<{ id: string; src: string; alt: string }> | undefined;
    if (article.photos) {
      if (typeof article.photos === "string") {
        try {
          photos = JSON.parse(article.photos);
        } catch {
          photos = undefined;
        }
      } else {
        photos = article.photos as Array<{
          id: string;
          src: string;
          alt: string;
        }>;
      }
    }

    return {
      id: article.id,
      slug: article.slug,
      title: translation?.title || article.title || "Untitled",
      content: translation?.content || article.content || "",
      excerpt: translation?.excerpt || article.excerpt,
      featuredImage: article.featuredImage,
      location: article.location,
      status: article.status,
      publishedAt,
      createdAt,
      updatedAt,
      videoUrl: article.videoUrl,
      posterImage: article.posterImage,
      partnerOrganization,
      photos,
      author: {
        name: article.author.name || "Anonymous",
      },
      categories: article.categories.map((ac: any) => ({
        id: ac.category.id,
        name: ac.category.translations[0]?.name || "Untitled",
        slug: ac.category.slug,
      })),
      tags:
        article.articleTag?.map((at: any) => ({
          id: at.tag.id,
          name: at.tag.name,
        })) || [],
      seo: {
        title: translation?.seoTitle,
        description: translation?.seoDescription,
      },
    };
  }

  // Helper: Build menu tree
  private static buildMenuTree(items: any[]): PublicMenuItem[] {
    const itemMap = new Map();
    const rootItems: PublicMenuItem[] = [];

    // Create formatted items
    items.forEach((item) => {
      const translation = item.translations[0];
      if (!translation) return;

      const formattedItem: PublicMenuItem = {
        id: item.id,
        title: translation.title,
        url: item.url,
        type: item.type,
        children: [],
        categorySlug: item.category?.slug,
      };

      itemMap.set(item.id, formattedItem);

      if (!item.parentId) {
        rootItems.push(formattedItem);
      }
    });

    // Build hierarchy
    items.forEach((item) => {
      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        const child = itemMap.get(item.id);
        if (parent && child) {
          parent.children.push(child);
        }
      }
    });

    return rootItems;
  }

  // Helper: Build category tree
  private static buildCategoryTree(categories: any[]): PublicCategory[] {
    const categoryMap = new Map();
    const rootCategories: PublicCategory[] = [];

    // Create map
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Build hierarchy
    categories.forEach((cat) => {
      const category = categoryMap.get(cat.id);
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  }

  // Route resolution helpers
  static async resolveRoute(
    slugs: string[],
    language: SupportedLanguage
  ): Promise<{ type: "category" | "article" | "notfound"; data?: any }> {
    try {
      // Check if it's an article first
      if (slugs.length === 1) {
        const article = await this.getArticleBySlug(slugs[0], language);
        if (article) {
          return { type: "article", data: article };
        }
      }

      // Check if it's a category
      const categorySlug = slugs[slugs.length - 1];
      const categoryData = await this.getArticlesByCategory(
        categorySlug,
        language
      );
      if (categoryData) {
        return { type: "category", data: categoryData };
      }

      return { type: "notfound" };
    } catch (error) {
      console.error("Route resolution error:", error);
      return { type: "notfound" };
    }
  }
}
