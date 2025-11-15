import { NextRequest, NextResponse } from "next/server";
import { SimpleCMS } from "@/lib/services/simple-cms";

// GET /api/public/pages/[slug] - Get public page by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get("languageId") || "1"; // Default to English

    const page = await SimpleCMS.getPageBySlug(params.slug, languageId);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
