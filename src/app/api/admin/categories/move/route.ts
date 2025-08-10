import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { categoryId, newParentId } = body;

    // Validate input
    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Prevent circular reference
    if (newParentId === categoryId) {
      return NextResponse.json(
        { error: "Category cannot be its own parent" },
        { status: 400 }
      );
    }

    // Check if newParentId is a child of categoryId (prevent circular reference)
    if (
      newParentId &&
      category.children.some((child) => child.id === newParentId)
    ) {
      return NextResponse.json(
        { error: "Cannot move category under its own child" },
        { status: 400 }
      );
    }

    // If newParentId is provided, verify it exists
    if (newParentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: newParentId },
      });

      if (!parentExists) {
        return NextResponse.json(
          { error: "New parent category not found" },
          { status: 400 }
        );
      }
    }

    // Update category parent
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        parentId: newParentId || null,
      },
    });

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: `Category moved successfully`,
    });
  } catch (error) {
    console.error("Move category error:", error);
    return NextResponse.json(
      { error: "Failed to move category" },
      { status: 500 }
    );
  }
}
