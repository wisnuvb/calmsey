// src/app/api/admin/pages/[id]/content/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SimpleCMS } from "@/lib/services/simple-cms";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get("languageId") || "en";

    const { id } = await params;
    const page = await SimpleCMS.getPageById(id, languageId);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { pageContent, languageId = "en" } = body;

    const { id } = await params;
    const success = await SimpleCMS.updatePageContent(
      id,
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
