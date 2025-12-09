import { prisma } from "@/lib/prisma";
import { PageType } from "@prisma/client";
import { cache } from "react";

export type PageContentMap = Record<string, string>;

/**
 * Server-side function to fetch page content
 * Uses React cache() for automatic deduplication
 */
export const getPageContentServer = cache(
  async (
    pageType: string,
    language: string = "en"
  ): Promise<PageContentMap> => {
    try {
      // Find page by pageType
      const page = await prisma.page.findFirst({
        where: {
          pageType: pageType as PageType,
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
          `No page content found for ${pageType} in language ${language}`
        );
        return {};
      }

      const translation = page.translations[0];

      // Convert PageContent array to Map
      const contentMap: PageContentMap = {};
      translation.pageContent.forEach((item) => {
        contentMap[item.key] = item.value;
      });

      return contentMap;
    } catch (error) {
      console.error("Error fetching page content:", error);
      return {};
    }
  }
);

/**
 * Prefetch multiple page types at once
 * Useful for pages that need multiple page types
 */
export async function prefetchPageContents(
  pageTypes: string[],
  language: string = "en"
): Promise<Record<string, PageContentMap>> {
  const results = await Promise.all(
    pageTypes.map(async (pageType) => ({
      pageType,
      content: await getPageContentServer(pageType, language),
    }))
  );

  return results.reduce((acc, { pageType, content }) => {
    acc[pageType] = content;
    return acc;
  }, {} as Record<string, PageContentMap>);
}
