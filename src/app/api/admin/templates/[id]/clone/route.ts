import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";
import { TemplateDatabase } from "@/lib/template-system/template-database-operations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Template name is required" },
        { status: 400 }
      );
    }

    const clonedTemplate = await TemplateDatabase.cloneTemplate(
      id,
      name,
      session!.user.id
    );

    return NextResponse.json({ template: clonedTemplate });
  } catch (error) {
    console.error("Clone template error:", error);
    return NextResponse.json(
      { error: "Failed to clone template" },
      { status: 500 }
    );
  }
}
