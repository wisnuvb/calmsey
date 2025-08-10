import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_AUTHOR, ROLES } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const mediaFile = await prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: "Media file not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mediaFile,
    });
  } catch (error) {
    console.error("Get media file error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media file" },
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

    const { session } = authResult;

    const body = await request.json();
    const { alt, caption } = body;

    // Find media file
    const mediaFile = await prisma.media.findUnique({
      where: { id },
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: "Media file not found" },
        { status: 404 }
      );
    }

    // Check permission (authors can only edit their own uploads)
    if (
      session!.user.role === ROLES.AUTHOR &&
      mediaFile.uploadedById !== session!.user.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update media file
    const updatedMediaFile = await prisma.media.update({
      where: { id },
      data: {
        alt: alt || null,
        caption: caption || null,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedMediaFile,
      message: "Media file updated successfully",
    });
  } catch (error) {
    console.error("Update media file error:", error);
    return NextResponse.json(
      { error: "Failed to update media file" },
      { status: 500 }
    );
  }
}
