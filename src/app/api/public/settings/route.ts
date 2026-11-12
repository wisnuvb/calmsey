import { NextResponse } from "next/server";
import { PublicAPI } from "@/lib/public-api";

// Never prerender at build time: data comes from the DB.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await PublicAPI.getSiteSettings();

    return NextResponse.json(
      { settings },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (error) {
    console.error("Public settings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
