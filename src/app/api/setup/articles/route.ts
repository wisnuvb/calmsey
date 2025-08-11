/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("lang") || "en";
    const limit = parseInt(searchParams.get("limit") || "6");
    const category = searchParams.get("category");

    const where: any = {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    };

    // Add category filter if specified
    if (category) {
      where.category = { slug: category };
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        translations: {
          where: { languageId: language },
          select: {
            title: true,
            excerpt: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    // Format articles for public API
    const formattedArticles = articles
      .filter((article) => article.translations.length > 0)
      .map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.translations[0]?.title || "Untitled",
        excerpt: article.translations[0]?.excerpt || "",
        featuredImage: article.featuredImage,
        publishedAt: article.publishedAt,
        author: article.author.name,
      }));

    return NextResponse.json({
      articles: formattedArticles,
      total: formattedArticles.length,
    });
  } catch (error) {
    console.error("Public articles API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
