import { NextRequest, NextResponse } from "next/server";
import { TemplateBrandkitService } from "@/lib/page-builder/page-brandkit-integration";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { templateId } = params;
    const { brandkitId, options = {} } = await request.json();

    if (!brandkitId) {
      return NextResponse.json(
        { error: "Brandkit ID is required" },
        { status: 400 }
      );
    }

    const result = await TemplateBrandkitService.applyBrandkitToTemplate(
      templateId,
      brandkitId,
      options
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error applying brandkit to template:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to apply brandkit to template",
      },
      { status: 500 }
    );
  }
}
