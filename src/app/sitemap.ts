import { MetadataRoute } from "next";
import { PublicAPI, SUPPORTED_LANGUAGES } from "@/lib/public-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://turningtidesfacility.org"; // Replace with your domain

  const sitemap: MetadataRoute.Sitemap = [];

  // Add homepage for each language
  SUPPORTED_LANGUAGES.forEach((lang) => {
    sitemap.push({
      url: lang === "en" ? baseUrl : `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  // Add articles for each language
  for (const lang of SUPPORTED_LANGUAGES) {
    try {
      const articles = await PublicAPI.getRecentArticles(lang, 1000); // Get all articles

      articles.forEach((article) => {
        const url =
          lang === "en"
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
  for (const lang of SUPPORTED_LANGUAGES) {
    try {
      const categories = await PublicAPI.getCategoryHierarchy(lang);

      categories.forEach((category) => {
        const url =
          lang === "en"
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
    SUPPORTED_LANGUAGES.forEach((lang) => {
      const url =
        lang === "en" ? `${baseUrl}/${page}` : `${baseUrl}/${lang}/${page}`;

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
