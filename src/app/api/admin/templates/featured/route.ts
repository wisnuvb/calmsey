import { TemplateDatabase } from "@/lib/template-system/template-database-operations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const templates = await TemplateDatabase.getFeaturedTemplates(limit);
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Featured templates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured templates" },
      { status: 500 }
    );
  }
}
