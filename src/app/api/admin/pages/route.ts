import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { SimpleCMS } from "@/lib/services/simple-cms";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/admin/pages - Get all pages
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get("languageId") || "en"; // Default to English

    const pages = await SimpleCMS.getPages(languageId);
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, content, excerpt, featuredImage, languageId } = body;

    if (!slug || !title || !content || !languageId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const page = await SimpleCMS.createPage({
      slug,
      title,
      content,
      excerpt,
      featuredImage,
      languageId,
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
