/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  ROLE_ADMIN,
  ROLE_AUTHOR,
  ROLE_EDITOR,
} from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        translations: true,
        parent: {
          include: {
            translations: {
              where: { languageId: "en" },
              take: 1,
            },
          },
        },
        children: {
          include: {
            translations: {
              where: { languageId: "en" },
              take: 1,
            },
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Format response
    const formattedCategory = {
      id: category.id,
      slug: category.slug,
      parentId: category.parentId,
      order: category.order,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      articleCount: category._count.articles,
      translations: category.translations,
      parent: category.parent
        ? {
            id: category.parent.id,
            name: category.parent.translations[0]?.name || "Untitled",
            slug: category.parent.slug,
          }
        : null,
      children: category.children.map((child) => ({
        id: child.id,
        name: child.translations[0]?.name || "Untitled",
        slug: child.slug,
        articleCount: 0, // Will be loaded separately if needed
      })),
    };

    return NextResponse.json({ category: formattedCategory });
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
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

    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { slug, parentId, order, translations } = body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

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

    // Check slug uniqueness (excluding current category)
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          parentId: parentId || null,
          id: { not: id }, // Exclude current category
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already exists in this category level" },
          { status: 400 }
        );
      }
    }

    // Prevent setting category as its own parent or creating circular reference
    if (parentId) {
      if (parentId === id) {
        return NextResponse.json(
          { error: "Category cannot be its own parent" },
          { status: 400 }
        );
      }

      // Check for circular reference
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (parentCategory?.parentId === id) {
        return NextResponse.json(
          { error: "Cannot create circular reference" },
          { status: 400 }
        );
      }
    }

    // Update category using transaction
    const updatedCategory = await prisma.$transaction(async (tx) => {
      // Update main category
      const category = await tx.category.update({
        where: { id },
        data: {
          slug: slug || existingCategory.slug,
          parentId: parentId || null,
          order: order || 0,
        },
      });

      // Update translations
      // Delete existing translations
      await tx.categoryTranslation.deleteMany({
        where: { categoryId: id },
      });

      // Create new translations
      if (translations.length > 0) {
        await tx.categoryTranslation.createMany({
          data: translations
            .filter((t: any) => t.name && t.name.trim())
            .map((translation: any) => ({
              categoryId: id,
              name: translation.name.trim(),
              description: translation.description?.trim() || null,
              languageId: translation.languageId,
            })),
        });
      }

      return category;
    });

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
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

    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    // Check if category exists and get its relationships
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check for child categories
    if (category.children.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category with subcategories",
          message: "Please delete or move all subcategories first",
        },
        { status: 400 }
      );
    }

    // Use transaction to handle the deletion
    await prisma.$transaction(async (tx) => {
      // First, remove category associations from articles
      await tx.articleCategory.deleteMany({
        where: { categoryId: id },
      });

      // Delete the category (translations will be deleted automatically via cascade)
      await tx.category.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message:
        category._count.articles > 0
          ? `Category deleted and unlinked from ${category._count.articles} articles`
          : "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
