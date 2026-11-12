import { NextRequest, NextResponse } from "next/server";
import { PublicAPI, getValidLanguage } from "@/lib/public-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = await getValidLanguage(searchParams.get("lang") || "en");

    const categories = await PublicAPI.getCategoryHierarchy(language);

    return NextResponse.json({ categories }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("Public categories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
