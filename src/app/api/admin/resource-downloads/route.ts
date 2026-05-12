/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();
    const modalSource = (searchParams.get("modalSource") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(10, parseInt(searchParams.get("limit") || "30", 10)),
    );
    const skip = (page - 1) * limit;

    const where: any = {};

    if (
      modalSource &&
      ["ACTION_PLANS", "PARTNERS", "GRANTMAKING_FRAMEWORK"].includes(
        modalSource,
      )
    ) {
      where.modalSource = modalSource;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { countryLabel: { contains: search } },
        { selectedOptionLabel: { contains: search } },
        { fileUrl: { contains: search } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.resourceDownloadSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.resourceDownloadSubmission.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error("admin resource-downloads GET:", e);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
