/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  ROLE_ADMIN,
  ROLE_VIEWER,
  ROLES,
} from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
            media: true,
            sessions: true,
          },
        },
        articles: {
          select: {
            id: true,
            slug: true,
            status: true,
            createdAt: true,
            translations: {
              where: { languageId: "en" },
              select: { title: true },
              take: 1,
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        media: {
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            size: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Admins can't view Super Admin details
    if (session!.user.role === ROLES.ADMIN && user.role === ROLES.SUPER_ADMIN) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
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

    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const body = await request.json();
    const { name, email, role } = body;

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Permission checks
    if (session!.user.role === ROLES.ADMIN) {
      // Admins can't modify Super Admins
      if (targetUser.role === ROLES.SUPER_ADMIN) {
        return NextResponse.json(
          { error: "Cannot modify Super Admin" },
          { status: 403 }
        );
      }

      // Admins can't promote users to Super Admin or Admin
      if (role && ROLE_ADMIN.includes(role)) {
        return NextResponse.json(
          { error: "Cannot assign this role" },
          { status: 403 }
        );
      }
    }

    // Users can't modify themselves for role changes (prevent self-demotion)
    if (session!.user.id === id && role && role !== targetUser.role) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 403 }
      );
    }

    // Validate role if provided
    if (role) {
      const validRoles = ROLE_VIEWER;
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
    }

    // Check email uniqueness if email is being changed
    if (email && email !== targetUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }
    }

    // Update user
    const updateData: any = {};
    if (name !== undefined) updateData.name = name?.trim() || null;
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (role !== undefined) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
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

    const authResult = await requireAuth([ROLES.SUPER_ADMIN]);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Can't delete yourself
    if (session!.user.id === id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 403 }
      );
    }

    // Can't delete other Super Admins (only one Super Admin should remain)
    if (targetUser.role === ROLES.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Cannot delete Super Admin users" },
        { status: 403 }
      );
    }

    // Check if user has content (optional: you might want to reassign content instead)
    const userContent = await prisma.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            articles: true,
            media: true,
          },
        },
      },
    });

    if (
      userContent &&
      (userContent._count.articles > 0 || userContent._count.media > 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete user with existing content. Please reassign or delete their content first.",
          details: {
            articles: userContent._count.articles,
            media: userContent._count.media,
          },
        },
        { status: 409 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
