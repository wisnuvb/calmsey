import { NextRequest, NextResponse } from "next/server";
import { TemplateBrandkitService } from "@/lib/page-builder/page-brandkit-integration";
import { requireAuth, ROLE_VIEWER } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { brandkitId: string } }
) {
  try {
    const authResult = await requireAuth(ROLE_VIEWER);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { brandkitId } = params;
    const templates = await TemplateBrandkitService.getTemplatesUsingBrandkit(
      brandkitId,
      session?.user.id
    );

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error getting templates using brandkit:", error);
    return NextResponse.json(
      { error: "Failed to get templates using brandkit" },
      { status: 500 }
    );
  }
}
