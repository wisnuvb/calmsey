import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/page-content";
import { PageType } from "@prisma/client";

/**
 * GET /api/public/page-content/[pageType]
 * Public API to fetch page content by pageType
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageType: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";

    const { pageType: pageTypeParam } = await params;
    const pageType = pageTypeParam.toUpperCase() as PageType;

    // Validate pageType
    if (!Object.values(PageType).includes(pageType)) {
      return NextResponse.json({ error: "Invalid page type" }, { status: 400 });
    }

    const contentMap = await getPageContent(pageType, language);

    // Convert Map to object for JSON response
    const content: Record<string, string> = {};
    contentMap.forEach((value, key) => {
      content[key] = value;
    });

    return NextResponse.json({
      pageType,
      language,
      content,
    });
  } catch (error) {
    console.error("Error fetching public page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
