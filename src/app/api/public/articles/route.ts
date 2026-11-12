import { NextRequest, NextResponse } from "next/server";
import { PublicAPI, getValidLanguage, clampIntParam } from "@/lib/public-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = await getValidLanguage(searchParams.get("lang") || "en");
    // Max 200: LatestActivitySection requests itemsPerPage * 10 (default 90)
    const limit = clampIntParam(searchParams.get("limit"), 10, 1, 200);
    const category = searchParams.get("category");

    let articles;
    if (category) {
      const result = await PublicAPI.getArticlesByCategory(
        category,
        language,
        1,
        limit
      );
      articles = result?.articles || [];
    } else {
      articles = await PublicAPI.getRecentArticles(language, limit);
    }

    return NextResponse.json({ articles }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("Public articles API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
