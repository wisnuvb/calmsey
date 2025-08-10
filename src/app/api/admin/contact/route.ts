/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          message: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Status filter
    if (status) {
      where.status = status.toUpperCase();
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [contactMessages, totalCount] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: [
          { status: "asc" }, // Unread first
          { createdAt: "desc" }, // Newest first within same status
        ],
        skip,
        take: limit,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    // Calculate statistics
    const stats = await Promise.all([
      prisma.contactSubmission.count(), // total
      prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
      prisma.contactSubmission.count({ where: { status: "READ" } }),
      prisma.contactSubmission.count({ where: { status: "RESOLVED" } }),
      prisma.contactSubmission.count({ where: { status: "CLOSED" } }),
    ]);

    const [total, unread, read, resolved, closed] = stats;

    return NextResponse.json({
      success: true,
      data: contactMessages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
      stats: {
        total,
        unread,
        read,
        resolved,
        closed,
      },
      filters: {
        search,
        status,
      },
    });
  } catch (error) {
    console.error("Contact messages API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}
