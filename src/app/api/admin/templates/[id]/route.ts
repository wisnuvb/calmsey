import { TemplateDatabase } from "@/lib/template-system/template-database-operations";
import {
  TemplateValidator,
  sanitizeTemplateData,
} from "@/lib/template-system/template-validator";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, ROLE_AUTHOR, ROLES } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const template = await TemplateDatabase.getTemplateById(id, true);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Get template error:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const body = await request.json();

    // Validate if updating content
    if (body.sections || body.globalStyles) {
      const validationResult = await TemplateValidator.validateTemplate(body);
      if (!validationResult.isValid) {
        return NextResponse.json(
          {
            error: "Template validation failed",
            details: validationResult.errors,
            securityIssues: validationResult.securityIssues,
          },
          { status: 400 }
        );
      }

      // Sanitize if updating content
      const sanitized = await sanitizeTemplateData(body, "STRICT");
      Object.assign(body, sanitized);
    }

    const template = await TemplateDatabase.updateTemplate(
      id,
      body,
      session?.user.role === ROLES.AUTHOR ? session!.user.id : undefined
    );

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Update template error:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    await TemplateDatabase.deleteTemplate(
      id,
      session?.user.role === ROLES.AUTHOR ? session!.user.id : undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete template error:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
