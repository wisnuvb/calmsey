import { NextRequest, NextResponse } from "next/server";
import { PublicAPI, getValidLanguage } from "@/lib/public-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ menuKey: string }> }
) {
  try {
    const { menuKey } = await params;
    const { searchParams } = new URL(request.url);
    const language = getValidLanguage(searchParams.get("lang") || "en");

    const navigation = await PublicAPI.getNavigationMenu(menuKey, language);

    return NextResponse.json({ navigation });
  } catch (error) {
    console.error("Public navigation API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}
