// src/app/api/brandkits/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";
import { BrandkitDatabase } from "@/lib/brandkit/database-operations";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const isPublic = searchParams.get("isPublic");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const options = {
      page,
      limit,
      search,
      isPublic: isPublic ? isPublic === "true" : undefined,
      sortBy: sortBy as "createdAt" | "updatedAt" | "name" | "usageCount",
      sortOrder: sortOrder as "asc" | "desc",
      authorId: session?.user.id,
    };

    const result = await BrandkitDatabase.getBrandkits(options);

    return NextResponse.json({
      success: true,
      brandkits: result.brandkits,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching brandkits:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch brandkits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const body = await request.json();
    const {
      name,
      description,
      colors,
      typography,
      spacing,
      assets,
      isActive = true,
      isPublic = false,
      isDefault = false,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Brandkit name is required" },
        { status: 400 }
      );
    }

    const brandkitData = {
      name: name.trim(),
      description: description?.trim() || "",
      colors,
      typography,
      spacing,
      assets,
      authorId: session?.user.id || "",
      isActive,
      isPublic,
      isDefault,
    };

    const brandkit = await BrandkitDatabase.createBrandkit(brandkitData);

    return NextResponse.json({
      success: true,
      message: "Brandkit created successfully",
      brandkit,
    });
  } catch (error) {
    console.error("Error creating brandkit:", error);
    return NextResponse.json(
      {
        error: "Failed to create brandkit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
