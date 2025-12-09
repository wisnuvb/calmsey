import { requireAuth, ROLE_ADMIN, ROLE_EDITOR } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { messageIds, status } = body;

    // Validate input
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { error: "Message IDs array is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["UNREAD", "READ", "RESOLVED", "CLOSED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be one of: " + validStatuses.join(", "),
        },
        { status: 400 }
      );
    }

    // Update multiple messages
    const updateResult = await prisma.contactSubmission.updateMany({
      where: {
        id: {
          in: messageIds,
        },
      },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: {
        updatedCount: updateResult.count,
        status,
      },
      message: `Updated ${
        updateResult.count
      } messages to ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.error("Bulk update contact messages error:", error);
    return NextResponse.json(
      { error: "Failed to update contact messages" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { messageIds } = body;

    // Validate input
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { error: "Message IDs array is required" },
        { status: 400 }
      );
    }

    // Delete multiple messages
    const deleteResult = await prisma.contactSubmission.deleteMany({
      where: {
        id: {
          in: messageIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: deleteResult.count,
      },
      message: `Deleted ${deleteResult.count} messages`,
    });
  } catch (error) {
    console.error("Bulk delete contact messages error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact messages" },
      { status: 500 }
    );
  }
}
