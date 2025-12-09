import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { languageId, title, excerpt, seoTitle, seoDescription } = body;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Create or update translation
    const translation = await prisma.articleTranslation.upsert({
      where: {
        articleId_languageId: {
          articleId: id,
          languageId: languageId,
        },
      },
      update: {
        title,
        excerpt,
        seoTitle,
        seoDescription,
      },
      create: {
        articleId: id,
        languageId,
        title,
        excerpt,
        seoTitle,
        seoDescription,
      },
    });

    return NextResponse.json({ success: true, translation });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Failed to save translation" },
      { status: 500 }
    );
  }
}
