import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_ADMIN, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { name } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Check if name already exists (excluding current tag)
    const duplicateTag = await prisma.tag.findFirst({
      where: {
        name: name.trim(),
        id: { not: id },
      },
    });

    if (duplicateTag) {
      return NextResponse.json(
        { error: "Tag name already exists" },
        { status: 400 }
      );
    }

    // Update tag
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json({ success: true, tag });
  } catch (error) {
    console.error("Update tag error:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
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

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Warn if tag is being used
    if (tag._count.articles > 0) {
      // You might want to prevent deletion or ask for confirmation
      console.warn(
        `Deleting tag "${tag.name}" that is used by ${tag._count.articles} articles`
      );
    }

    // Delete tag (will automatically remove from articles via cascade)
    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tag error:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
