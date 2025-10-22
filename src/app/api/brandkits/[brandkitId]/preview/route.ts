import { NextRequest, NextResponse } from "next/server";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";
import { BrandkitDatabase } from "@/lib/brandkit/database-operations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandkitId: string }> }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { brandkitId } = await params;

    if (!brandkitId) {
      return NextResponse.json(
        { error: "Brandkit ID is required" },
        { status: 400 }
      );
    }

    const brandkit = await BrandkitDatabase.getBrandkitById(brandkitId);

    if (!brandkit) {
      return NextResponse.json(
        { error: "Brandkit not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brandkit,
    });
  } catch (error) {
    console.error("Error fetching brandkit preview:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch brandkit preview",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
