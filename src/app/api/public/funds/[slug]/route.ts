import { NextRequest, NextResponse } from "next/server";
import { getFundDetailBySlug } from "@/lib/fund-details";
import { getValidLanguage } from "@/lib/public-api";

/**
 * GET /api/public/funds/[slug]
 * Public API to fetch fund detail by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const language = await getValidLanguage(searchParams.get("lang") || "en");

    const { slug } = await params;
    const fund = await getFundDetailBySlug(slug, language);

    if (!fund) {
      return NextResponse.json(
        { error: "Fund not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ fund });
  } catch (error) {
    console.error("Public fund API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fund" },
      { status: 500 }
    );
  }
}
