import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getPageContentObject,
  savePageContent,
  deletePageContent,
} from "@/lib/page-content";
import { PageType } from "@prisma/client";

/**
 * GET /api/admin/page-content/[pageType]
 * Fetch page content for editing
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageType: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";

    const { pageType: pageTypeParam } = await params;
    const pageType = pageTypeParam.toUpperCase() as PageType;

    // Validate pageType
    if (!Object.values(PageType).includes(pageType)) {
      return NextResponse.json({ error: "Invalid page type" }, { status: 400 });
    }

    const content = await getPageContentObject(pageType, language);

    return NextResponse.json({
      pageType,
      language,
      content,
    });
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/page-content/[pageType]
 * Save page content
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pageType: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role - at least EDITOR
    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "EDITOR"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { pageType: pageTypeParam } = await params;
    const pageType = pageTypeParam.toUpperCase() as PageType;

    // Validate pageType
    if (!Object.values(PageType).includes(pageType)) {
      return NextResponse.json({ error: "Invalid page type" }, { status: 400 });
    }

    const body = await request.json();
    const { language = "en", content } = body;

    if (!content || typeof content !== "object") {
      return NextResponse.json(
        { error: "Invalid content format" },
        { status: 400 }
      );
    }

    const result = await savePageContent(
      pageType,
      language,
      content,
      session.user.id
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to save content" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Page content saved successfully",
      pageType,
      language,
    });
  } catch (error) {
    console.error("Error saving page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/page-content/[pageType]
 * Delete page content
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pageType: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role - at least ADMIN
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";

    const { pageType: pageTypeParam } = await params;
    const pageType = pageTypeParam.toUpperCase() as PageType;

    // Validate pageType
    if (!Object.values(PageType).includes(pageType)) {
      return NextResponse.json({ error: "Invalid page type" }, { status: 400 });
    }

    const result = await deletePageContent(pageType, language);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to delete content" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Page content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
