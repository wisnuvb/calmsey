import { NextRequest, NextResponse } from "next/server";
import { PageBrandkitService } from "@/lib/page-builder/page-brandkit-integration";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { id: pageId } = params;
    const { brandkitId } = await request.json();

    if (!brandkitId) {
      return NextResponse.json(
        { error: "Brandkit ID is required" },
        { status: 400 }
      );
    }

    const validation = await PageBrandkitService.validateBrandkitCompatibility(
      pageId,
      brandkitId
    );

    return NextResponse.json(validation);
  } catch (error) {
    console.error("Error validating brandkit compatibility:", error);
    return NextResponse.json(
      { error: "Failed to validate brandkit compatibility" },
      { status: 500 }
    );
  }
}
