import { NextRequest, NextResponse } from "next/server";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";
import { BrandkitDatabase } from "@/lib/brandkit/database-operations";

export async function POST(
  request: NextRequest,
  { params }: { params: { brandkitId: string } }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { brandkitId } = params;
    const body = await request.json();
    const { name } = body;

    if (!brandkitId) {
      return NextResponse.json(
        { error: "Brandkit ID is required" },
        { status: 400 }
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "New brandkit name is required" },
        { status: 400 }
      );
    }

    const duplicatedBrandkit = await BrandkitDatabase.duplicateBrandkit(
      brandkitId,
      name.trim(),
      session?.user.id || ""
    );

    return NextResponse.json({
      success: true,
      message: "Brandkit duplicated successfully",
      brandkit: duplicatedBrandkit,
    });
  } catch (error) {
    console.error("Error duplicating brandkit:", error);
    return NextResponse.json(
      {
        error: "Failed to duplicate brandkit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
