import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";
import { TemplateImportExportEngine } from "@/lib/template-system/import-export-engine";
import { TemplateDatabase } from "@/lib/template-system/template-database-operations";
import { NextRequest, NextResponse } from "next/server";

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

    // Export template as ZIP
    const zipBlob = await TemplateImportExportEngine.exportTemplate(template, {
      includeAssets: true,
      includeAuthorEmail: false,
    });

    // Increment download count
    await TemplateDatabase.incrementDownloadCount(id);

    const arrayBuffer = await zipBlob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${template.name.replace(
          /[^a-z0-9]/gi,
          "_"
        )}_template.zip"`,
      },
    });
  } catch (error) {
    console.error("Export template error:", error);
    return NextResponse.json(
      { error: "Failed to export template" },
      { status: 500 }
    );
  }
}
