// src/app/api/admin/pages/[id]/content/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SimpleCMS } from "@/lib/services/simple-cms";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

const PAGE_ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get("languageId") || "en";

    const { id } = await params;
    if (!PAGE_ID_REGEX.test(id)) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
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
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { pageContent, languageId = "en" } = body ?? {};

    if (
      typeof pageContent !== "object" ||
      pageContent === null ||
      Array.isArray(pageContent) ||
      typeof languageId !== "string"
    ) {
      return NextResponse.json(
        { error: "pageContent must be an object" },
        { status: 400 }
      );
    }

    const { id } = await params;
    if (!PAGE_ID_REGEX.test(id)) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
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
