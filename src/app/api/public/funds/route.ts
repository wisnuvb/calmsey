import { NextRequest, NextResponse } from "next/server";
import { getAllFundDetails } from "@/lib/fund-details";
import { getValidLanguage } from "@/lib/public-api";

/**
 * GET /api/public/funds
 * Public API to fetch all fund details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = await getValidLanguage(searchParams.get("lang") || "en");

    const funds = await getAllFundDetails(language);

    return NextResponse.json({
      funds,
      total: funds.length,
    });
  } catch (error) {
    console.error("Public funds API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch funds" },
      { status: 500 }
    );
  }
}
