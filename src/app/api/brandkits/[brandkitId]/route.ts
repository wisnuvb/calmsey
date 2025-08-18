// src/app/api/brandkits/[brandkitId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, ROLE_VIEWER, ROLE_EDITOR } from "@/lib/auth-helpers";
import {
  BrandkitDatabase,
  BrandkitUpdateInput,
} from "@/lib/brandkit/database-operations";

export async function GET(
  request: NextRequest,
  { params }: { params: { brandkitId: string } }
) {
  try {
    const authResult = await requireAuth(ROLE_VIEWER);
    if (!authResult.success) return authResult.response;

    const { brandkitId } = params;

    if (!brandkitId) {
      return NextResponse.json(
        { error: "Brandkit ID is required" },
        { status: 400 }
      );
    }

    const brandkit = await BrandkitDatabase.getBrandkitById(brandkitId);

    if (!brandkit) {
      return NextResponse.json(
        { error: "Brandkit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ brandkit });
  } catch (error) {
    console.error("Error fetching brandkit:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch brandkit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { brandkitId: string } }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { brandkitId } = params;
    const body = await request.json();

    if (!brandkitId) {
      return NextResponse.json(
        { error: "Brandkit ID is required" },
        { status: 400 }
      );
    }

    // Check if brandkit exists and user has permission
    const existingBrandkit = await BrandkitDatabase.getBrandkitById(brandkitId);

    if (!existingBrandkit) {
      return NextResponse.json(
        { error: "Brandkit not found or access denied" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: BrandkitUpdateInput = {
      name: body.name?.trim() || "",
      description: body.description?.trim() || null,
      colors: body.colors,
      typography: body.typography,
      spacing: body.spacing,
    };

    if (body.name?.trim()) {
      updateData.name = body.name.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    if (body.colors) {
      updateData.colors =
        typeof body.colors === "string"
          ? body.colors
          : JSON.stringify(body.colors);
    }

    if (body.typography !== undefined) {
      updateData.typography = body.typography
        ? typeof body.typography === "string"
          ? body.typography
          : JSON.stringify(body.typography)
        : null;
    }

    if (body.spacing !== undefined) {
      updateData.spacing = body.spacing
        ? typeof body.spacing === "string"
          ? body.spacing
          : JSON.stringify(body.spacing)
        : null;
    }

    // if (typeof body.isPublic === "boolean") {
    //   updateData.isPublic = body.isPublic;
    // }

    // if (typeof body.isDefault === "boolean") {
    //   updateData.isDefault = body.isDefault;
    // }

    const updatedBrandkit = await BrandkitDatabase.updateBrandkit(
      brandkitId,
      updateData,
      session?.user.id
    );

    return NextResponse.json({
      success: true,
      brandkit: updatedBrandkit,
    });
  } catch (error) {
    console.error("Error updating brandkit:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "A brandkit with this name already exists" },
          { status: 409 }
        );
      }

      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Brandkit not found or access denied" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to update brandkit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { brandkitId: string } }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { brandkitId } = params;

    if (!brandkitId) {
      return NextResponse.json(
        { error: "Brandkit ID is required" },
        { status: 400 }
      );
    }

    // Check if brandkit exists and user has permission
    const existingBrandkit = await BrandkitDatabase.getBrandkitById(brandkitId);

    if (!existingBrandkit) {
      return NextResponse.json(
        { error: "Brandkit not found or access denied" },
        { status: 404 }
      );
    }

    // Prevent deletion of default brandkits
    if (existingBrandkit.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete default brandkits" },
        { status: 403 }
      );
    }

    await BrandkitDatabase.deleteBrandkit(brandkitId, session?.user.id);

    return NextResponse.json({
      success: true,
      message: "Brandkit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brandkit:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          {
            error:
              "Cannot delete brandkit - it is currently being used by pages or templates",
            code: "BRANDKIT_IN_USE",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to delete brandkit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
