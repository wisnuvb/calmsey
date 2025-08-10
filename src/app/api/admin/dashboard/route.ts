import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    // Fetch statistics
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalMedia,
      totalUsers,
      unreadContacts,
      recentArticles,
      recentContacts,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.media.count(),
      prisma.user.count(),
      prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          translations: {
            where: { languageId: "en" },
            take: 1,
          },
        },
      }),
      prisma.contactSubmission.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const stats = {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalMedia,
      totalUsers,
      unreadContacts,
    };

    // Format recent activities
    const recentActivities = [
      ...recentArticles.map((article) => ({
        id: article.id,
        type: "article" as const,
        title: `New article: ${article.translations[0]?.title || "Untitled"}`,
        description: `Created by ${
          article.author.name || article.author.email
        }`,
        createdAt: article.createdAt.toISOString(),
      })),
      ...recentContacts.map((contact) => ({
        id: contact.id,
        type: "contact" as const,
        title: `New message from ${contact.name}`,
        description: contact.message.substring(0, 100) + "...",
        createdAt: contact.createdAt.toISOString(),
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      stats,
      recentActivities: recentActivities.slice(0, 10),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
