/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_AUTHOR, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const includeHierarchy = searchParams.get("hierarchy") === "true";
    const includeTranslations = searchParams.get("translations") === "true";
    const parentId = searchParams.get("parentId"); // Filter by parent
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (parentId !== null) {
      where.parentId = parentId === "null" || parentId === "" ? null : parentId;
    }

    if (search) {
      where.translations = {
        some: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      };
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        translations: includeTranslations
          ? true
          : {
              where: { languageId: "en" }, // Default to English for admin
              take: 1,
            },
        parent: includeHierarchy
          ? {
              include: {
                translations: {
                  where: { languageId: "en" },
                  take: 1,
                },
              },
            }
          : false,
        children: includeHierarchy
          ? {
              include: {
                translations: {
                  where: { languageId: "en" },
                  take: 1,
                },
                _count: {
                  select: {
                    articles: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            }
          : false,
        _count: {
          select: {
            articles: true,
            children: true,
          },
        },
      },
      orderBy: [
        { parentId: "asc" }, // Top-level categories first
        { order: "asc" },
        { createdAt: "asc" },
      ],
    });

    // Format response
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.translations[0]?.name || "Untitled Category",
      description: category.translations[0]?.description || "",
      parentId: category.parentId,
      order: category.order,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      articleCount: category._count.articles,
      childrenCount: category._count.children,

      // Include full translations if requested
      translations: includeTranslations ? category.translations : undefined,

      parent: category.parent
        ? {
            id: category.parent.id,
            name: (category.parent as any).translations[0]?.name || "Untitled",
            slug: category.parent.slug,
          }
        : null,

      children:
        includeHierarchy && category.children
          ? category.children.map((child: any) => ({
              id: child.id,
              name: child.translations[0]?.name || "Untitled",
              slug: child.slug,
              articleCount: child._count.articles,
              order: child.order,
            }))
          : undefined,
    }));

    return NextResponse.json({
      data: formattedCategories,
      meta: {
        total: formattedCategories.length,
        rootCategories: formattedCategories.filter((c) => !c.parentId).length,
        withHierarchy: includeHierarchy,
        withTranslations: includeTranslations,
      },
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { slug, parentId, order, translations } = body;

    // Validation
    if (!translations || !translations.length) {
      return NextResponse.json(
        { error: "At least one translation is required" },
        { status: 400 }
      );
    }

    const englishTranslation = translations.find(
      (t: any) => t.languageId === "en"
    );
    if (!englishTranslation || !englishTranslation.name.trim()) {
      return NextResponse.json(
        { error: "English translation with name is required" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug =
      slug ||
      englishTranslation.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

    // Check slug uniqueness within the same parent level
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug: finalSlug,
        parentId: parentId || null,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Slug already exists in this category level" },
        { status: 400 }
      );
    }

    // If parentId is provided, verify parent exists
    if (parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentExists) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    // Create category with translations
    const category = await prisma.category.create({
      data: {
        slug: finalSlug,
        parentId: parentId || null,
        order: order || 0,
        translations: {
          create: translations
            .filter((t: any) => t.name && t.name.trim())
            .map((translation: any) => ({
              name: translation.name.trim(),
              description: translation.description?.trim() || null,
              languageId: translation.languageId,
            })),
        },
      },
      include: {
        translations: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      category: {
        ...category,
        articleCount: category._count.articles,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
