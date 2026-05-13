import { MetadataRoute } from "next";
import {
  getDefaultLanguage,
  getSupportedLanguages,
} from "@/lib/dynamic-languages";
import { PublicAPI } from "@/lib/public-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://calmsey.com"; // Replace with your domain

  const sitemap: MetadataRoute.Sitemap = [];

  const supportedLanguages = await getSupportedLanguages();
  const defaultLang = await getDefaultLanguage();

  // Add homepage for each language
  supportedLanguages.forEach((lang) => {
    sitemap.push({
      url: lang === defaultLang ? baseUrl : `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  // Add articles for each language
  for (const lang of supportedLanguages) {
    try {
      const articles = await PublicAPI.getRecentArticles(lang, 1000); // Get all articles

      articles.forEach((article) => {
        const url =
          lang === defaultLang
            ? `${baseUrl}/articles/${article.slug}`
            : `${baseUrl}/${lang}/articles/${article.slug}`;

        sitemap.push({
          url,
          lastModified: new Date(article.publishedAt),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    } catch (error) {
      console.error(`Failed to generate sitemap for language ${lang}:`, error);
    }
  }

  // Add categories for each language
  for (const lang of supportedLanguages) {
    try {
      const categories = await PublicAPI.getCategoryHierarchy(lang);

      categories.forEach((category) => {
        const url =
          lang === defaultLang
            ? `${baseUrl}/${category.slug}`
            : `${baseUrl}/${lang}/${category.slug}`;

        sitemap.push({
          url,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      });
    } catch (error) {
      console.error(
        `Failed to generate category sitemap for language ${lang}:`,
        error
      );
    }
  }

  // Add static pages
  const staticPages = ["contact", "articles"];
  staticPages.forEach((page) => {
    supportedLanguages.forEach((lang) => {
      const url =
        lang === defaultLang
          ? `${baseUrl}/${page}`
          : `${baseUrl}/${lang}/${page}`;

      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    });
  });

  return sitemap;
}
