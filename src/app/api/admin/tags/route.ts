/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_AUTHOR, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);

    // Query parameters
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const filter = searchParams.get("filter") || "all"; // all, used, unused
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Usage filter
    if (filter === "used") {
      where.articles = {
        some: {},
      };
    } else if (filter === "unused") {
      where.articles = {
        none: {},
      };
    }

    // Validate sort parameters
    const allowedSortFields = ["name", "articleCount", "createdAt"];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const validSortOrder = sortOrder === "desc" ? "desc" : "asc";

    // Build orderBy clause
    let orderBy: any = {};
    if (validSortBy === "articleCount") {
      // For article count, we need to order by the count of related articles
      orderBy = {
        articles: {
          _count: validSortOrder,
        },
      };
    } else {
      orderBy[validSortBy] = validSortOrder;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [tags, totalCount] = await Promise.all([
      prisma.tag.findMany({
        where,
        include: {
          _count: {
            select: {
              articles: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.tag.count({ where }),
    ]);

    // Format response
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      articleCount: tag._count.articles,
      createdAt: new Date(), // Default since Tag model doesn't have createdAt
      updatedAt: new Date(), // Default since Tag model doesn't have updatedAt
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calculate statistics
    const stats = {
      total: totalCount,
      used: await prisma.tag.count({
        where: {
          ...where,
          articles: { some: {} },
        },
      }),
      unused: await prisma.tag.count({
        where: {
          ...where,
          articles: { none: {} },
        },
      }),
    };

    return NextResponse.json({
      success: true,
      data: formattedTags,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        search,
        sortBy: validSortBy,
        sortOrder: validSortOrder,
        filter,
      },
      stats,
    });
  } catch (error) {
    console.error("Tags API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { name, names } = body; // Support single name or batch names

    // Handle batch creation
    if (names && Array.isArray(names)) {
      const createdTags = [];
      const errors = [];

      for (const tagName of names) {
        try {
          const trimmedName = tagName.trim();
          if (!trimmedName) continue;

          // Check if tag already exists
          const existingTag = await prisma.tag.findUnique({
            where: { name: trimmedName },
          });

          if (existingTag) {
            errors.push(`Tag "${trimmedName}" already exists`);
            continue;
          }

          const tag = await prisma.tag.create({
            data: { name: trimmedName },
            include: {
              _count: {
                select: {
                  articles: true,
                },
              },
            },
          });

          createdTags.push({
            id: tag.id,
            name: tag.name,
            articleCount: tag._count.articles,
          });
        } catch (error) {
          errors.push(`Failed to create tag "${tagName}"`);
        }
      }

      return NextResponse.json({
        success: true,
        data: createdTags,
        errors,
        message: `Created ${createdTags.length} tags${
          errors.length > 0 ? ` with ${errors.length} errors` : ""
        }`,
      });
    }

    // Handle single tag creation
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Tag name is required and must be a string" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return NextResponse.json(
        { error: "Tag name cannot be empty" },
        { status: 400 }
      );
    }

    // Validate tag name length
    if (trimmedName.length > 50) {
      return NextResponse.json(
        { error: "Tag name must be 50 characters or less" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: trimmedName },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag with this name already exists" },
        { status: 409 }
      );
    }

    // Create new tag
    const tag = await prisma.tag.create({
      data: { name: trimmedName },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: tag.id,
        name: tag.name,
        articleCount: tag._count.articles,
      },
      message: "Tag created successfully",
    });
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
