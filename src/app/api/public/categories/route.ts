import { NextRequest, NextResponse } from "next/server";
import { PublicAPI, getValidLanguage } from "@/lib/public-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = getValidLanguage(searchParams.get("lang") || "en");

    const categories = await PublicAPI.getCategoryHierarchy(language);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Public categories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
