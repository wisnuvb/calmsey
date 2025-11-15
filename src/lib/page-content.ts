/**
 * Page Content Helper Functions
 * Utilities for fetching and saving page content from/to database
 */

import { prisma } from '@/lib/prisma';
import { ContentType, PageType } from '@prisma/client';

/**
 * Content Map for easy access to page content
 */
export class PageContentMap extends Map<string, string> {
  /**
   * Get content with fallback to default value
   */
  getString(key: string, defaultValue: string = ''): string {
    return this.get(key) || defaultValue;
  }

  /**
   * Get number content
   */
  getNumber(key: string, defaultValue: number = 0): number {
    const value = this.get(key);
    if (!value) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Get boolean content
   */
  getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = this.get(key);
    if (!value) return defaultValue;
    return value === 'true' || value === '1';
  }

  /**
   * Get JSON content
   */
  getJSON<T = any>(key: string, defaultValue: T | null = null): T | null {
    const value = this.get(key);
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }
}

/**
 * Get page content by page type or slug
 */
export async function getPageContent(
  pageIdentifier: string,
  language: string = 'en'
): Promise<PageContentMap> {
  const contentMap = new PageContentMap();

  try {
    // Find page by slug or pageType
    const page = await prisma.page.findFirst({
      where: {
        OR: [
          { slug: pageIdentifier },
          { pageType: pageIdentifier as PageType },
        ],
      },
      include: {
        translations: {
          where: { languageId: language },
          include: {
            pageContent: true,
          },
        },
      },
    });

    if (!page || !page.translations[0]) {
      console.warn(
        `No page content found for ${pageIdentifier} in language ${language}`
      );
      return contentMap;
    }

    const translation = page.translations[0];

    // Convert PageContent array to Map
    translation.pageContent.forEach((item) => {
      contentMap.set(item.key, item.value);
    });

    return contentMap;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return contentMap;
  }
}

/**
 * Save page content
 */
export async function savePageContent(
  pageType: PageType,
  languageId: string,
  content: Record<string, string>,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find or create page
    const page = await prisma.page.upsert({
      where: {
        pageType_slug: {
          pageType,
          slug: pageType.toLowerCase().replace(/_/g, '-'),
        },
      },
      create: {
        pageType,
        slug: pageType.toLowerCase().replace(/_/g, '-'),
        status: 'PUBLISHED',
        authorId: userId,
      },
      update: {
        updatedAt: new Date(),
      },
    });

    // Find or create translation
    const translation = await prisma.pageTranslation.upsert({
      where: {
        pageId_languageId: {
          pageId: page.id,
          languageId,
        },
      },
      create: {
        pageId: page.id,
        languageId,
        title: content['hero.title'] || pageType,
        seoTitle: content['hero.title'] || pageType,
      },
      update: {
        title: content['hero.title'] || pageType,
        seoTitle: content['hero.title'] || pageType,
        updatedAt: new Date(),
      },
    });

    // Delete existing page content for this translation
    await prisma.pageContent.deleteMany({
      where: { pageTranslationId: translation.id },
    });

    // Create new page content entries
    const contentEntries = Object.entries(content)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => ({
        pageTranslationId: translation.id,
        key,
        value: String(value),
        type: inferContentType(key, value),
      }));

    if (contentEntries.length > 0) {
      await prisma.pageContent.createMany({
        data: contentEntries,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving page content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Infer ContentType from key and value
 */
function inferContentType(key: string, value: string): ContentType {
  // Check by key patterns
  if (
    key.includes('Image') ||
    key.includes('image') ||
    key.includes('logo') ||
    key.includes('photo')
  ) {
    return 'IMAGE';
  }

  if (
    key.includes('Link') ||
    key.includes('Url') ||
    key.includes('url') ||
    key.includes('href')
  ) {
    return 'LINK';
  }

  if (key.includes('email')) {
    return 'TEXT'; // Could add EMAIL type if needed
  }

  if (key.includes('phone')) {
    return 'TEXT'; // Could add PHONE type if needed
  }

  if (key.includes('color') || key.includes('Color')) {
    return 'TEXT'; // Could add COLOR type if needed
  }

  // Check value patterns
  if (!value) {
    return 'TEXT';
  }

  // Check if it's a number
  if (!isNaN(Number(value)) && value.trim() !== '') {
    return 'NUMBER';
  }

  // Check if it's boolean
  if (value === 'true' || value === 'false') {
    return 'BOOLEAN';
  }

  // Check if it's JSON
  if (
    (value.startsWith('{') && value.endsWith('}')) ||
    (value.startsWith('[') && value.endsWith(']'))
  ) {
    try {
      JSON.parse(value);
      return 'JSON';
    } catch {
      // Not valid JSON
    }
  }

  // Check if it's HTML
  if (value.includes('<') && value.includes('>')) {
    return 'HTML';
  }

  // Check if it's a long text
  if (value.length > 500) {
    return 'RICH_TEXT';
  }

  // Default
  return 'TEXT';
}

/**
 * Get all pages with their content
 */
export async function getAllPagesContent(
  language: string = 'en'
): Promise<
  Array<{
    pageType: PageType;
    slug: string;
    content: PageContentMap;
  }>
> {
  try {
    const pages = await prisma.page.findMany({
      include: {
        translations: {
          where: { languageId: language },
          include: {
            pageContent: true,
          },
        },
      },
    });

    return pages.map((page) => {
      const contentMap = new PageContentMap();

      if (page.translations[0]) {
        page.translations[0].pageContent.forEach((item) => {
          contentMap.set(item.key, item.value);
        });
      }

      return {
        pageType: page.pageType,
        slug: page.slug,
        content: contentMap,
      };
    });
  } catch (error) {
    console.error('Error fetching all pages content:', error);
    return [];
  }
}

/**
 * Check if page content exists
 */
export async function pageContentExists(
  pageType: PageType,
  language: string = 'en'
): Promise<boolean> {
  try {
    const count = await prisma.page.count({
      where: {
        pageType,
        translations: {
          some: {
            languageId: language,
            pageContent: {
              some: {},
            },
          },
        },
      },
    });

    return count > 0;
  } catch (error) {
    console.error('Error checking page content exists:', error);
    return false;
  }
}

/**
 * Delete page content
 */
export async function deletePageContent(
  pageType: PageType,
  language: string = 'en'
): Promise<{ success: boolean; error?: string }> {
  try {
    const page = await prisma.page.findFirst({
      where: { pageType },
      include: {
        translations: {
          where: { languageId: language },
        },
      },
    });

    if (!page || !page.translations[0]) {
      return { success: false, error: 'Page content not found' };
    }

    await prisma.pageContent.deleteMany({
      where: { pageTranslationId: page.translations[0].id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting page content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get page content as plain object (for API responses)
 */
export async function getPageContentObject(
  pageIdentifier: string,
  language: string = 'en'
): Promise<Record<string, string>> {
  const contentMap = await getPageContent(pageIdentifier, language);
  const obj: Record<string, string> = {};

  contentMap.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}
