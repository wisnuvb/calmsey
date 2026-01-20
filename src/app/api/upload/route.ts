import { NextRequest, NextResponse } from "next/server";
import { ImageUploadService } from "@/lib/upload";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";
import { formatFileSize, MEDIA_CONFIG } from "@/lib/media-types";

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${formatFileSize(MEDIA_CONFIG.MAX_FILE_SIZE)} limit` },
        { status: 400 }
      );
    }

    // Upload dan compress
    const uploadResult = await ImageUploadService.compressAndUpload(file, {
      quality: 85,
      maxWidth: 1920,
      maxHeight: 1080,
      folder: "cms-uploads",
    });

    // Save ke database
    const media = await prisma.media.create({
      data: {
        filename: uploadResult.filename,
        originalName: uploadResult.originalName,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        url: uploadResult.url,
        uploadedById: session!.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      media: {
        id: media.id,
        url: media.url,
        filename: media.filename,
        originalName: media.originalName,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
