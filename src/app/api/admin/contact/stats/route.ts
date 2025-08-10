/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    // Get date range from query params (optional)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Basic stats
    const [totalStats, recentStats, dailyStats] = await Promise.all([
      // Total stats
      Promise.all([
        prisma.contactSubmission.count(),
        prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
        prisma.contactSubmission.count({ where: { status: "READ" } }),
        prisma.contactSubmission.count({ where: { status: "RESOLVED" } }),
        prisma.contactSubmission.count({ where: { status: "CLOSED" } }),
      ]),

      // Recent stats (last X days)
      Promise.all([
        prisma.contactSubmission.count({
          where: { createdAt: { gte: startDate } },
        }),
        prisma.contactSubmission.count({
          where: {
            createdAt: { gte: startDate },
            status: "UNREAD",
          },
        }),
      ]),

      // Daily breakdown for chart
      prisma.contactSubmission.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: { gte: startDate },
        },
        _count: {
          id: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    const [total, unread, read, resolved, closed] = totalStats;
    const [recentTotal, recentUnread] = recentStats;

    // Process daily stats for chart
    const dailyData = dailyStats.reduce((acc: any, stat: any) => {
      const date = stat.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + stat._count.id;
      return acc;
    }, {});

    // Calculate response rate (resolved + closed / total)
    const responseRate =
      total > 0 ? (((resolved + closed) / total) * 100).toFixed(1) : "0";

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total,
          unread,
          read,
          resolved,
          closed,
          responseRate: parseFloat(responseRate),
        },
        recent: {
          total: recentTotal,
          unread: recentUnread,
          days,
        },
        chart: {
          daily: dailyData,
          period: `Last ${days} days`,
        },
        trends: {
          averagePerDay: total > 0 ? (recentTotal / days).toFixed(1) : "0",
          unreadPercentage:
            total > 0 ? ((unread / total) * 100).toFixed(1) : "0",
        },
      },
    });
  } catch (error) {
    console.error("Contact stats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact statistics" },
      { status: 500 }
    );
  }
}
