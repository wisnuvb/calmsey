import { TemplateDatabase } from "@/lib/template-system/template-database-operations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const templates = await TemplateDatabase.searchTemplateContent(query, {
      limit,
    });
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Search templates error:", error);
    return NextResponse.json(
      { error: "Failed to search templates" },
      { status: 500 }
    );
  }
}
