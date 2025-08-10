import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";
import { TemplateImportExportEngine } from "@/lib/template-system/import-export-engine";
import { TemplateDatabase } from "@/lib/template-system/template-database-operations";
import { ZipPackageHandler } from "@/lib/template-system/zip-package-handler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const formData = await request.formData();
    const file = formData.get("template") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate ZIP package
    const zipBlob = new Blob([await file.arrayBuffer()]);
    const validation = await ZipPackageHandler.validateZipPackage(zipBlob);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid template package",
          details: validation.errors,
          warnings: validation.warnings,
        },
        { status: 400 }
      );
    }

    // Import template
    const templatePackage = await TemplateImportExportEngine.importTemplate(
      zipBlob,
      {
        securityLevel: "STRICT",
        includeAssets: true,
      }
    );

    // Create template in database
    const template = await TemplateDatabase.createTemplate({
      ...templatePackage.template,
      authorId: session!.user.id,
      status: "DRAFT",
      isPublic: false,
      isFeatured: false,
    });

    return NextResponse.json({
      template,
      importInfo: {
        assetsCount: templatePackage.assets.size,
        screenshotsCount: templatePackage.screenshots.size,
      },
    });
  } catch (error) {
    console.error("Import template error:", error);
    return NextResponse.json(
      { error: "Failed to import template" },
      { status: 500 }
    );
  }
}
