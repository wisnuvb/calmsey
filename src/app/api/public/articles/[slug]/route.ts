import { NextRequest, NextResponse } from "next/server";
import { PublicAPI, getValidLanguage } from "@/lib/public-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const language = getValidLanguage(searchParams.get("lang") || "en");

    const article = await PublicAPI.getArticleBySlug(slug, language);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Public article API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
