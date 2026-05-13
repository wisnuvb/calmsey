import { prisma } from "@/lib/prisma";
import { PageType } from "@prisma/client";
import { cache } from "react";

export type PageContentMap = Record<string, string>;

type TranslationWithContent = {
  languageId: string;
  pageContent: { key: string; value: string }[];
};

function normalizeLangId(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * Pilih translasi tanpa locale URL (legacy).
 * Urutan: konten non-kosong "en", lalu translasi lain yang punya pageContent, lalu fallback.
 */
function pickPageTranslation(
  translations: TranslationWithContent[],
): TranslationWithContent | null {
  if (translations.length === 0) return null;

  const en = translations.find((t) => normalizeLangId(t.languageId) === "en");
  if (en && en.pageContent.length > 0) return en;

  const withContent = translations.find((t) => t.pageContent.length > 0);
  if (withContent) return withContent;

  return en ?? translations[0];
}

/**
 * Prioritas: locale dari URL (jika ada konten) → EN → pickPageTranslation legacy.
 */
function pickPageTranslationForLocale(
  translations: TranslationWithContent[],
  requestedLanguage: string,
): TranslationWithContent | null {
  if (translations.length === 0) return null;

  const lang = normalizeLangId(requestedLanguage || "en");

  const forLocale = translations.find(
    (t) => normalizeLangId(t.languageId) === lang && t.pageContent.length > 0,
  );
  if (forLocale) return forLocale;

  const en = translations.find(
    (t) => normalizeLangId(t.languageId) === "en" && t.pageContent.length > 0,
  );
  if (en) return en;

  return pickPageTranslation(translations);
}

/**
 * Server-side fetch konten halaman per `pageType` dan locale URL.
 * React `cache()` mem-kunci per `(pageType, language)` dalam satu request.
 */
export const getPageContentServer = cache(
  async (
    pageType: string,
    language: string = "en",
  ): Promise<PageContentMap> => {
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

      const translation = pickPageTranslationForLocale(
        page.translations,
        language,
      );

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
  },
);

/**
 * Prefetch beberapa page type sekaligus untuk locale yang sama.
 */
export async function prefetchPageContents(
  pageTypes: string[],
  language: string = "en",
): Promise<Record<string, PageContentMap>> {
  const results = await Promise.all(
    pageTypes.map(async (pageType) => ({
      pageType,
      content: await getPageContentServer(pageType, language),
    })),
  );

  return results.reduce(
    (acc, { pageType, content }) => {
      acc[pageType] = content;
      return acc;
    },
    {} as Record<string, PageContentMap>,
  );
}
