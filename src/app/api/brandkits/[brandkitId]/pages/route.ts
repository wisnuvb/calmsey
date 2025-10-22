import { NextRequest, NextResponse } from "next/server";
import { PageBrandkitService } from "@/lib/page-builder/page-brandkit-integration";
import { requireAuth, ROLE_VIEWER } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandkitId: string }> }
) {
  try {
    const authResult = await requireAuth(ROLE_VIEWER);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { brandkitId } = await params;
    const { searchParams } = new URL(request.url);
    const includeAnalytics = searchParams.get("analytics") === "true";

    const [pages, analytics] = await Promise.all([
      PageBrandkitService.getPagesUsingBrandkit(brandkitId, session?.user.id),
      includeAnalytics
        ? PageBrandkitService.getBrandkitPageAnalytics(brandkitId)
        : null,
    ]);

    return NextResponse.json({
      pages,
      ...(analytics && { analytics }),
    });
  } catch (error) {
    console.error("Error getting pages using brandkit:", error);
    return NextResponse.json(
      { error: "Failed to get pages using brandkit" },
      { status: 500 }
    );
  }
}
