/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/templates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { TemplateDatabase } from "@/lib/template-system/template-database-operations";
import { TemplateValidator } from "@/lib/template-system/template-validator";
import { sanitizeTemplateData } from "@/lib/template-system/template-validator";
import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const options = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      category: searchParams.get("category") as any,
      difficulty: searchParams.get("difficulty") as any,
      status: searchParams.get("status") as any,
      isPublic: searchParams.get("isPublic") === "true",
      isFeatured: searchParams.get("isFeatured") === "true",
      authorId: searchParams.get("authorId") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "updatedAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
    };

    const result = await TemplateDatabase.queryTemplates(options);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Templates API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const body = await request.json();

    // Validate template data
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

    // Sanitize template data
    const sanitizedTemplate = await sanitizeTemplateData(body, "STRICT");

    const template = await TemplateDatabase.createTemplate({
      ...sanitizedTemplate,
      authorId: session!.user.id,
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Create template error:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
