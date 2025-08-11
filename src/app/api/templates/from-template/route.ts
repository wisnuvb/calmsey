import { NextRequest, NextResponse } from "next/server";
import { PageBrandkitService } from "@/lib/page-builder/page-brandkit-integration";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const body = await request.json();
    const { templateId, brandkitId, pageData, options = {} } = body;

    if (!templateId || !brandkitId || !pageData) {
      return NextResponse.json(
        { error: "Template ID, brandkit ID, and page data are required" },
        { status: 400 }
      );
    }

    // Validate required page data fields
    if (!pageData.slug || !pageData.title || !pageData.languageId) {
      return NextResponse.json(
        { error: "Page slug, title, and language ID are required" },
        { status: 400 }
      );
    }

    const result = await PageBrandkitService.createPageFromTemplate(
      templateId,
      brandkitId,
      {
        ...pageData,
        authorId: session?.user.id,
      },
      options
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating page from template:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create page from template",
      },
      { status: 500 }
    );
  }
}
