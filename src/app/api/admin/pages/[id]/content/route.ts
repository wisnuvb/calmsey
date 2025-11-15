// src/app/api/admin/pages/[id]/content/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SimpleCMS } from "@/lib/services/simple-cms-fixed";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get("languageId") || "en";

    const page = await SimpleCMS.getPageById(params.id, languageId);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({
      content: page.pageContent,
      metadata: page.metadata,
    });
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { pageContent, languageId = "en" } = body;

    const success = await SimpleCMS.updatePageContent(
      params.id,
      languageId,
      pageContent
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
