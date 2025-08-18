/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/brandkits/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, ROLE_VIEWER, ROLE_EDITOR } from "@/lib/auth-helpers";
import {
  BrandkitCreateInput,
  BrandkitDatabase,
  BrandkitFilterOptions,
} from "@/lib/brandkit/database-operations";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_VIEWER);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category") || undefined;
    const authorId = searchParams.get("authorId") || undefined;
    const search = searchParams.get("search") || undefined;
    const isPublic = searchParams.get("public") === "true";

    const options: BrandkitFilterOptions = {
      page,
      limit,
      category,
      authorId: authorId || session?.user.id,
      search,
      isPublic,
    };

    const result = await BrandkitDatabase.getBrandkits(options);

    return NextResponse.json(result);
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
      isPublic = false,
      isDefault = false,
    } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Brandkit name is required" },
        { status: 400 }
      );
    }

    if (!colors) {
      return NextResponse.json(
        { error: "Brandkit colors are required" },
        { status: 400 }
      );
    }

    const brandkitData: BrandkitCreateInput = {
      name: name.trim(),
      description: description?.trim(),
      colors: colors,
      typography: typography
        ? typeof typography === "string"
          ? typography
          : JSON.stringify(typography)
        : ({} as any),
      spacing: spacing
        ? typeof spacing === "string"
          ? spacing
          : JSON.stringify(spacing)
        : ({} as any),
      authorId: session?.user.id || "",
      assets: {
        logos: {
          primary: {
            light: "",
            dark: "",
            symbol: "",
          },
        },
        iconLibrary: {
          style: "outline",
          customIcons: [],
        },
        imageLibrary: [],
        patterns: [],
      },
    };

    const brandkit = await BrandkitDatabase.createBrandkit(brandkitData);

    return NextResponse.json(
      {
        success: true,
        brandkit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating brandkit:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "A brandkit with this name already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create brandkit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
