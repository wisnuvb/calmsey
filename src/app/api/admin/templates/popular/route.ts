import { TemplateDatabase } from "@/lib/template-system/template-database-operations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const timeframe = searchParams.get("timeframe") || "30d";

    const templates = await TemplateDatabase.getPopularTemplates(
      limit,
      timeframe
    );
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Popular templates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular templates" },
      { status: 500 }
    );
  }
}
