import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requireAuth, ROLE_ADMIN, ROLE_EDITOR } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const contactMessage = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!contactMessage) {
      return NextResponse.json(
        { error: "Contact message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contactMessage,
    });
  } catch (error) {
    console.error("Get contact message error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact message" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { status } = body;

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

    // Check if message exists
    const existingMessage = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return NextResponse.json(
        { error: "Contact message not found" },
        { status: 404 }
      );
    }

    // Update message status
    const updatedMessage = await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updatedMessage,
      message: `Message status updated to ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.error("Update contact message error:", error);
    return NextResponse.json(
      { error: "Failed to update contact message" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    // Check if message exists
    const existingMessage = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return NextResponse.json(
        { error: "Contact message not found" },
        { status: 404 }
      );
    }

    // Delete message
    await prisma.contactSubmission.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact message" },
      { status: 500 }
    );
  }
}
