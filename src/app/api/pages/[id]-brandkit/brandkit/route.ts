// src/app/api/pages/[pageId]/brandkit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { PageBrandkitService } from "@/lib/page-builder/page-brandkit-integration";
import {
  requireAuth,
  ROLE_AUTHOR,
  ROLE_EDITOR,
  ROLE_VIEWER,
} from "@/lib/auth-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { id: pageId } = await params;
    const body = await request.json();
    const { brandkitId, sectionIds, options = {}, dryRun = false } = body;

    if (!brandkitId) {
      return NextResponse.json(
        { error: "Brandkit ID is required" },
        { status: 400 }
      );
    }

    let result;

    if (sectionIds && Array.isArray(sectionIds)) {
      // Apply to specific sections
      result = await PageBrandkitService.applyBrandkitToPageSections(
        pageId,
        sectionIds,
        brandkitId,
        { ...options, authorId: session?.user.id }
      );
    } else {
      // Apply to entire page
      result = await PageBrandkitService.applyBrandkitToPage(
        pageId,
        brandkitId,
        { ...options, authorId: session?.user.id, dryRun }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error applying brandkit to page:", error);
    return NextResponse.json(
      { error: "Failed to apply brandkit" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(ROLE_VIEWER);
    if (!authResult.success) return authResult.response;

    const { id: pageId } = await params;
    const brandkit = await PageBrandkitService.getPageBrandkit(pageId);

    return NextResponse.json({ brandkit });
  } catch (error) {
    console.error("Error getting page brandkit:", error);
    return NextResponse.json(
      { error: "Failed to get page brandkit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { id: pageId } = await params;
    const success = await PageBrandkitService.removeBrandkitFromPage(
      pageId,
      session?.user.id
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to remove brandkit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing brandkit from page:", error);
    return NextResponse.json(
      { error: "Failed to remove brandkit" },
      { status: 500 }
    );
  }
}
