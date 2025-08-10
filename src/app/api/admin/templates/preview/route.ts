import { TemplateImportExportEngine } from "@/lib/template-system/import-export-engine";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("template") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const zipBlob = new Blob([await file.arrayBuffer()]);
    const preview = await TemplateImportExportEngine.previewTemplate(zipBlob);

    return NextResponse.json({ preview });
  } catch (error) {
    console.error("Preview template error:", error);
    return NextResponse.json(
      { error: "Failed to preview template" },
      { status: 500 }
    );
  }
}
