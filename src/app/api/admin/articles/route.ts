/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_AUTHOR, ROLES } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    // Role-based filtering
    if (session!.user.role === ROLES.AUTHOR) {
      where.authorId = session!.user.id;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          translations: {
            select: {
              languageId: true,
              title: true,
              excerpt: true,
            },
          },
          categories: {
            include: {
              category: {
                include: {
                  translations: {
                    where: { languageId: "en" },
                    take: 1,
                  },
                },
              },
            },
          },
          articleTag: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    // Format response with translation status
    const formattedArticles = articles.map((article) => {
      // Get English translation for primary display
      const englishTranslation = article.translations.find(
        (t) => t.languageId === "en"
      );

      return {
        id: article.id,
        slug: article.slug,
        status: article.status,
        featuredImage: article.featuredImage,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        author: article.author,

        // Primary content (English)
        title: englishTranslation?.title || "Untitled",
        excerpt: englishTranslation?.excerpt || "",

        // Translation status
        translationStatus: {
          total: article.translations.length,
          languages: article.translations.map((t) => t.languageId),
          isComplete: article.translations.every(
            (t) => t.title && t.title.trim()
          ),
        },

        // Categories and tags
        categories: article.categories.map((ac) => ({
          id: ac.category.id,
          name: ac.category.translations[0]?.name || "Untitled Category",
        })),
        tags: article.articleTag.map((at) => ({
          id: at.tag.id,
          name: at.tag.name,
        })),
      };
    });

    return NextResponse.json({
      data: formattedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Articles API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const body = await request.json();
    const {
      slug,
      status,
      featuredImage,
      location,
      translations,
      categories,
      tags,
    } = body;

    // Validation
    if (!translations || translations.length === 0) {
      return NextResponse.json(
        { error: "At least one translation is required" },
        { status: 400 }
      );
    }

    const englishTranslation = translations.find(
      (t: any) => t.languageId === "en"
    );
    if (!englishTranslation || !englishTranslation.title.trim()) {
      return NextResponse.json(
        { error: "English translation with title is required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    if (slug) {
      const existingArticle = await prisma.article.findUnique({
        where: { slug },
      });
      if (existingArticle) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // HYBRID APPROACH: Store English content in Article model, SEO fields in translations
    const article = await prisma.article.create({
      data: {
        slug: slug || `article-${Date.now()}`,
        status: status || "DRAFT",
        featuredImage: featuredImage || null,
        location: location || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: session!.user.id,

        // Store English content directly in Article (for browser translation)
        title: englishTranslation.title,
        content: englishTranslation.content || "",
        excerpt: englishTranslation.excerpt || null,

        // Create translations (SEO fields only)
        translations: {
          create: translations
            .filter((t: any) => t.title && t.title.trim()) // Only create translations with titles
            .map((translation: any) => ({
              title: translation.title,
              slug:
                translation.languageId === "en"
                  ? null
                  : translation.slug || null, // Localized slug for non-English
              excerpt: translation.excerpt || null,
              seoTitle: translation.seoTitle || null,
              seoDescription: translation.seoDescription || null,
              languageId: translation.languageId,
              // NOTE: content field removed - uses Article.content + browser translation
            })),
        },

        // Link categories
        categories:
          categories && categories.length > 0
            ? {
                create: categories.map((categoryId: string) => ({
                  categoryId,
                })),
              }
            : undefined,

        // Link tags
        articleTag:
          tags && tags.length > 0
            ? {
                create: tags.map((tagId: string) => ({
                  tagId,
                })),
              }
            : undefined,
      },
      include: {
        translations: true,
        categories: {
          include: {
            category: {
              include: {
                translations: true,
              },
            },
          },
        },
        articleTag: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      article: {
        ...article,
        translationCount: article.translations.length,
      },
    });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
