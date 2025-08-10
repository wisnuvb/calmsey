import { NextResponse } from "next/server";
import { PublicAPI } from "@/lib/public-api";

export async function GET() {
  try {
    const settings = await PublicAPI.getSiteSettings();

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Public settings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
