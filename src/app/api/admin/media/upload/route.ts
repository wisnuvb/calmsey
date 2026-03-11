import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaUploadService } from "@/lib/media-upload";
import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";
import { formatFileSize, MEDIA_CONFIG } from "@/lib/media-types";

/**
 * POST /api/admin/media/upload
 * Single file upload (used by PageContentEditor, MultipleField, etc.)
 * Expects formData: file, enableImageCompression (optional, "true"|"false")
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const enableCompression = formData.get("enableImageCompression");
    const compress = enableCompression !== "false";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds ${formatFileSize(MEDIA_CONFIG.MAX_FILE_SIZE)} limit`,
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    const uploadResult = await MediaUploadService.uploadFile(file, {
      userId: user.id,
      folder: "media",
      compress,
    });

    const media = await prisma.media.create({
      data: {
        filename: uploadResult.filename,
        originalName: uploadResult.originalName,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        url: uploadResult.url,
        uploadedById: user.id,
      },
    });

    return NextResponse.json({
      url: media.url,
      id: media.id,
      filename: media.filename,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
