import { prisma } from "@/lib/prisma";
import { PageType } from "@prisma/client";
import { cache } from "react";

export type PageContentMap = Record<string, string>;

type TranslationWithContent = {
  languageId: string;
  pageContent: { key: string; value: string }[];
};

/**
 * Pilih satu PageTranslation untuk konten CMS: tidak memakai locale dari URL.
 * Urutan: konten non-kosong dengan languageId "en", lalu translasi lain yang punya pageContent, lalu en atau baris pertama.
 */
function pickPageTranslation(
  translations: TranslationWithContent[]
): TranslationWithContent | null {
  if (translations.length === 0) return null;

  const en = translations.find((t) => t.languageId === "en");
  if (en && en.pageContent.length > 0) return en;

  const withContent = translations.find((t) => t.pageContent.length > 0);
  if (withContent) return withContent;

  return en ?? translations[0];
}

/**
 * Server-side fetch konten halaman (satu sumber kanonik per pageType, bukan per bahasa URL).
 * Menggunakan React cache() untuk deduplikasi dalam satu request.
 */
export const getPageContentServer = cache(
  async (pageType: string): Promise<PageContentMap> => {
    try {
      const page = await prisma.page.findFirst({
        where: {
          pageType: pageType as PageType,
        },
        include: {
          translations: {
            include: {
              pageContent: true,
            },
          },
        },
      });

      if (!page) {
        console.warn(`No page found for ${pageType}`);
        return {};
      }

      const translation = pickPageTranslation(page.translations);

      if (!translation) {
        console.warn(`No page content translation for ${pageType}`);
        return {};
      }

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
 * Prefetch beberapa page type sekaligus
 */
export async function prefetchPageContents(
  pageTypes: string[]
): Promise<Record<string, PageContentMap>> {
  const results = await Promise.all(
    pageTypes.map(async (pageType) => ({
      pageType,
      content: await getPageContentServer(pageType),
    }))
  );

  return results.reduce(
    (acc, { pageType, content }) => {
      acc[pageType] = content;
      return acc;
    },
    {} as Record<string, PageContentMap>
  );
}
