/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, ROLE_ADMIN, ROLE_AUTHOR } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);

    // Filter parameters
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const isDefault = searchParams.get("isDefault");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    // ✅ FIX: Search filter dengan proper field names
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    // Active filter
    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true";
    }

    // Default filter
    if (isDefault !== null && isDefault !== undefined && isDefault !== "") {
      where.isDefault = isDefault === "true";
    }

    // Validate sortBy field
    const allowedSortFields = [
      "id",
      "name",
      "isActive",
      "isDefault",
      "createdAt",
      "updatedAt",
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    // Validate sortOrder
    const validSortOrder = sortOrder === "asc" ? "asc" : "desc";

    // Build orderBy clause
    const orderBy = {
      [validSortBy]: validSortOrder,
    };

    // Execute query with pagination
    const [languages, totalCount] = await Promise.all([
      prisma.language.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          flag: true,
          isDefault: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              articleTranslations: true,
              categoryTranslations: true,
              menuItemTranslations: true,
            },
          },
        },
      }),
      prisma.language.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: languages,
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
        isActive:
          isActive !== null && isActive !== "" ? isActive === "true" : null,
        isDefault:
          isDefault !== null && isDefault !== "" ? isDefault === "true" : null,
        sortBy: validSortBy,
        sortOrder: validSortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch languages", // ✅ FIX: Use English for consistency
        message:
          error instanceof Error
            ? error.message
            : "Internal server error occurred",
      },
      { status: 500 }
    );
  }
}

// POST method untuk menambah bahasa baru
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { id, name, flag, isDefault, isActive } = body;

    // ✅ IMPROVE: Better validation
    if (!id || !name) {
      return NextResponse.json(
        {
          success: false,
          error: "Language ID and name are required",
          details: {
            id: !id ? "Language ID is required" : null,
            name: !name ? "Language name is required" : null,
          },
        },
        { status: 400 }
      );
    }

    // ✅ ADD: Validate language ID format (2-3 lowercase letters)
    const languageIdPattern = /^[a-z]{2,3}$/;
    if (!languageIdPattern.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid language ID format",
          message:
            "Language ID must be 2-3 lowercase letters (e.g., 'en', 'id', 'zh')",
        },
        { status: 400 }
      );
    }

    // ✅ IMPROVE: Check if language already exists first
    const existingLanguage = await prisma.language.findUnique({
      where: { id },
    });

    if (existingLanguage) {
      return NextResponse.json(
        {
          success: false,
          error: "Language ID already exists",
          message: `Language with ID '${id}' already exists`,
        },
        { status: 409 }
      );
    }

    // ✅ FIX: Use transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // If this language will be default, set all other languages to non-default
      if (isDefault) {
        await tx.language.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      // ✅ ADD: If no default language exists and this is the first language, make it default
      if (!isDefault) {
        const defaultLanguageExists = await tx.language.findFirst({
          where: { isDefault: true },
        });

        const languageCount = await tx.language.count();

        // If no default exists and this is the first language, make it default
        if (!defaultLanguageExists && languageCount === 0) {
          return await tx.language.create({
            data: {
              id: id.toLowerCase(),
              name: name.trim(),
              flag: flag?.trim() || null,
              isDefault: true, // Force first language to be default
              isActive: isActive !== undefined ? isActive : true,
            },
          });
        }
      }

      return await tx.language.create({
        data: {
          id: id.toLowerCase(),
          name: name.trim(),
          flag: flag?.trim() || null,
          isDefault: isDefault || false,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Language added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating language:", error);

    // ✅ IMPROVE: Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          {
            success: false,
            error: "Language ID already exists",
            message: "A language with this ID already exists in the system",
          },
          { status: 409 }
        );
      }

      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid reference",
            message: "Referenced data does not exist",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to add language",
        message:
          error instanceof Error
            ? error.message
            : "Internal server error occurred",
      },
      { status: 500 }
    );
  }
}
