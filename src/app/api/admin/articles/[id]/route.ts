/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  ROLE_AUTHOR,
  ROLE_EDITOR,
  ROLES,
  session,
} from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        translations: {
          orderBy: { languageId: "asc" },
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
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check permission for authors
    if (
      session?.user?.role === ROLES.AUTHOR &&
      article.authorId !== session.user?.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Format article data
    const formattedArticle = {
      ...article,
      categories: article.categories.map((ac) => ({
        id: ac.category.id,
        name: ac.category.translations[0]?.name || "Untitled Category",
        slug: ac.category.slug,
      })),
      tags: article.articleTag.map((at) => ({
        id: at.tag.id,
        name: at.tag.name,
      })),
      translationStatus: {
        total: article.translations.length,
        languages: article.translations.map((t) => t.languageId),
        complete: article.translations.filter((t) => t.title && t.content)
          .length,
      },
    };

    return NextResponse.json({ article: formattedArticle });
  } catch (error) {
    console.error("Get article error:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { slug, status, featuredImage, translations, categories, tags } =
      body;

    // Check if article exists and user has permission
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (
      session?.user?.role === ROLES.AUTHOR &&
      existingArticle.authorId !== session.user?.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update article using transaction
    const updatedArticle = await prisma.$transaction(async (tx) => {
      // Update main article
      const article = await tx.article.update({
        where: { id },
        data: {
          slug,
          status,
          featuredImage,
          publishedAt:
            status === "PUBLISHED" && !existingArticle.publishedAt
              ? new Date()
              : existingArticle.publishedAt,
        },
      });

      // Update translations
      if (translations) {
        // Delete existing translations
        await tx.articleTranslation.deleteMany({
          where: { articleId: id },
        });

        // Create new translations
        if (translations.length > 0) {
          await tx.articleTranslation.createMany({
            data: translations
              .filter((t: any) => t.title && t.title.trim())
              .map((translation: any) => ({
                articleId: id,
                title: translation.title,
                content: translation.content || "",
                excerpt: translation.excerpt || null,
                seoTitle: translation.seoTitle || null,
                seoDescription: translation.seoDescription || null,
                languageId: translation.languageId,
              })),
          });
        }
      }

      // Update categories
      if (categories !== undefined) {
        await tx.articleCategory.deleteMany({
          where: { articleId: id },
        });

        if (categories.length > 0) {
          await tx.articleCategory.createMany({
            data: categories.map((categoryId: string) => ({
              articleId: id,
              categoryId,
            })),
          });
        }
      }

      // Update tags
      if (tags !== undefined) {
        await tx.articleTag.deleteMany({
          where: { articleId: id },
        });

        if (tags.length > 0) {
          await tx.articleTag.createMany({
            data: tags.map((tagId: string) => ({
              articleId: id,
              tagId,
            })),
          });
        }
      }

      return article;
    });

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Authors can only delete their own articles
    if (
      session?.user?.role === ROLES.AUTHOR &&
      article.authorId !== session.user?.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete article (will cascade delete translations, categories, tags)
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
