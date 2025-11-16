/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaUploadService } from "@/lib/media-upload";
import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all"; // all, images, documents, videos, audio
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        {
          originalName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          filename: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Type filter
    if (filter !== "all") {
      switch (filter) {
        case "images":
          where.mimeType = { startsWith: "image/" };
          break;
        case "documents":
          where.AND = [
            { NOT: { mimeType: { startsWith: "image/" } } },
            { NOT: { mimeType: { startsWith: "video/" } } },
            { NOT: { mimeType: { startsWith: "audio/" } } },
          ];
          break;
        case "videos":
          where.mimeType = { startsWith: "video/" };
          break;
        case "audio":
          where.mimeType = { startsWith: "audio/" };
          break;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [mediaFiles, totalCount] = await Promise.all([
      prisma.media.findMany({
        where,
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);

    // Calculate statistics
    const stats = await prisma.media.aggregate({
      _count: { id: true },
      _sum: { size: true },
    });

    const detailedStats = await Promise.all([
      prisma.media.count({ where: { mimeType: { startsWith: "image/" } } }),
      prisma.media.count({
        where: {
          AND: [
            { NOT: { mimeType: { startsWith: "image/" } } },
            { NOT: { mimeType: { startsWith: "video/" } } },
            { NOT: { mimeType: { startsWith: "audio/" } } },
          ],
        },
      }),
      prisma.media.count({ where: { mimeType: { startsWith: "video/" } } }),
      prisma.media.count({ where: { mimeType: { startsWith: "audio/" } } }),
    ]);

    const [images, documents, videos, audio] = detailedStats;

    return NextResponse.json({
      success: true,
      data: mediaFiles,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
      stats: {
        total: stats._count.id || 0,
        images,
        documents,
        videos,
        audio,
        totalSize: stats._sum.size || 0,
      },
      filters: {
        search,
        filter,
      },
    });
  } catch (error) {
    console.error("Media API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media files" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    // Verify user exists in database
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    // Check if user exists in database
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
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate file count
    if (files.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 files per upload" },
        { status: 400 }
      );
    }

    const uploadResults = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: File size exceeds 10MB limit`);
          continue;
        }

        // Validate file type
        const allowedTypes = [
          // Images
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
          // Documents
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
          // Videos
          "video/mp4",
          "video/webm",
          "video/avi",
          "video/quicktime",
          // Audio
          "audio/mpeg",
          "audio/wav",
          "audio/ogg",
          "audio/mp4",
        ];

        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name}: Unsupported file type`);
          continue;
        }

        // Upload file
        const uploadResult = await MediaUploadService.uploadFile(file, {
          userId: user.id,
          folder: "media",
        });

        // Save to database
        const mediaRecord = await prisma.media.create({
          data: {
            filename: uploadResult.filename,
            originalName: uploadResult.originalName,
            mimeType: uploadResult.mimeType,
            size: uploadResult.size,
            url: uploadResult.url,
            alt: uploadResult.alt || null,
            caption: uploadResult.caption || null,
            uploadedById: user.id, // Use verified user ID
          },
          include: {
            uploadedBy: {
              select: { id: true, name: true, email: true },
            },
          },
        });

        uploadResults.push(mediaRecord);
      } catch (error: any) {
        console.error(`Upload error for ${file.name}:`, error);

        // Provide more specific error messages
        if (error?.code === "P2003") {
          errors.push(
            `${file.name}: Database constraint error - user not found`
          );
        } else if (error?.message) {
          errors.push(`${file.name}: ${error.message}`);
        } else {
          errors.push(`${file.name}: Upload failed`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: uploadResults,
      errors,
      message: `Uploaded ${uploadResults.length} files${
        errors.length > 0 ? ` with ${errors.length} errors` : ""
      }`,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
