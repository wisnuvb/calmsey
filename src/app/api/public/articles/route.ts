import { NextRequest, NextResponse } from "next/server";
import { PublicAPI, getValidLanguage } from "@/lib/public-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = await getValidLanguage(searchParams.get("lang") || "en");
    const limit = parseInt(searchParams.get("limit") || "10");
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

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Public articles API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
