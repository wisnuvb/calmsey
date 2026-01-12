import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export interface StoryArticle {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  type: "video" | "article";
  url: string;
  categorySlug?: string;
}

export interface GetStoriesOptions {
  maxStories?: number;
  sortOrder?: "Latest" | "Oldest" | "A-Z" | "Z-A";
  filterCategories?: string[];
  defaultCategory?: string;
  language?: string;
}

/**
 * Fetch articles for stories page with filtering and sorting options
 */
export async function getStories(
  options: GetStoriesOptions = {}
): Promise<StoryArticle[]> {
  const {
    maxStories,
    sortOrder = "Latest",
    filterCategories = [],
    defaultCategory,
    language = "en",
  } = options;

  try {
    // Build where clause
    const where: Prisma.ArticleWhereInput = {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(), // Only published articles
      },
    };

    // Filter by categories if specified
    if (filterCategories.length > 0 || defaultCategory) {
      const categoryFilter = defaultCategory
        ? [defaultCategory]
        : filterCategories;

      where.categories = {
        some: {
          category: {
            slug: {
              in: categoryFilter,
            },
          },
        },
      };
    }

    // Build orderBy clause
    let orderBy: Prisma.ArticleOrderByWithRelationInput = {
      publishedAt: "desc",
    };
    switch (sortOrder) {
      case "Latest":
        orderBy = { publishedAt: "desc" };
        break;
      case "Oldest":
        orderBy = { publishedAt: "asc" };
        break;
      case "A-Z":
        orderBy = { title: "asc" };
        break;
      case "Z-A":
        orderBy = { title: "desc" };
        break;
      default:
        orderBy = { publishedAt: "desc" };
    }

    // Fetch articles
    const articles = await prisma.article.findMany({
      where,
      orderBy,
      take: maxStories || undefined,
      include: {
        translations: {
          where: {
            languageId: language,
          },
        },
        categories: {
          include: {
            category: {
              include: {
                translations: {
                  where: {
                    languageId: language,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Transform to StoryArticle format
    const stories: StoryArticle[] = articles.map((article) => {
      // Get localized title and excerpt (fallback to default if not available)
      const translation = article.translations?.[0];
      const title = translation?.title || article.title;
      const excerpt = translation?.excerpt || article.excerpt || "";

      // Get primary category for display
      const primaryCategory = article.categories?.[0]?.category;
      const categoryTranslation = primaryCategory?.translations?.[0];
      const location =
        categoryTranslation?.name || primaryCategory?.slug || "Global";

      // Format date
      const date = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";

      // Build URL
      const slug = translation?.slug || article.slug;
      const url = `/${language}/stories/${slug}`;

      return {
        id: article.id,
        title,
        location,
        date,
        description:
          excerpt.length > 250 ? excerpt.slice(0, 247) + "..." : excerpt,
        thumbnail: article.featuredImage || "/assets/demo/placeholder.png",
        thumbnailAlt: title,
        type: "article" as const, // You can add a field in Article model to distinguish video/article
        url,
        categorySlug: primaryCategory?.slug,
      };
    });

    return stories;
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
}

/**
 * Get all available categories for stories filtering
 */
export async function getStoriesCategories(
  language: string = "en"
): Promise<Array<{ slug: string; name: string }>> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        translations: {
          where: {
            languageId: language,
          },
        },
        _count: {
          select: {
            articles: {
              where: {
                article: {
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
      },
      where: {
        articles: {
          some: {
            article: {
              status: "PUBLISHED",
            },
          },
        },
      },
    });

    return categories
      .filter((cat) => cat._count.articles > 0)
      .map((cat) => ({
        slug: cat.slug,
        name: cat.translations?.[0]?.name || cat.slug,
      }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
