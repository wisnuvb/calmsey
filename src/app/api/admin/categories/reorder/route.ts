import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { categoryOrders } = body; // Array of { id: string, order: number }

    if (!Array.isArray(categoryOrders)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Update orders using transaction
    await prisma.$transaction(async (tx) => {
      for (const { id, order } of categoryOrders) {
        await tx.category.update({
          where: { id },
          data: { order },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder categories error:", error);
    return NextResponse.json(
      { error: "Failed to reorder categories" },
      { status: 500 }
    );
  }
}
