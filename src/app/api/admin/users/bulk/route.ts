import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  ROLE_ADMIN,
  ROLE_VIEWER,
  ROLES,
} from "@/lib/auth-helpers";

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { userIds, role } = body;

    const { session } = authResult;

    // Validation
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs array is required" },
        { status: 400 }
      );
    }

    const validRoles = ROLE_VIEWER;
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Permission checks
    if (session!.user.role === ROLES.ADMIN && ROLE_ADMIN.includes(role)) {
      return NextResponse.json(
        { error: "Cannot assign this role" },
        { status: 403 }
      );
    }

    // Get target users to check permissions
    const targetUsers = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, role: true },
    });

    // Check if any target users are Super Admins (and current user is not Super Admin)
    if (session!.user.role === ROLES.ADMIN) {
      const hasSuperAdmin = targetUsers.some(
        (user) => user.role === ROLES.SUPER_ADMIN
      );
      if (hasSuperAdmin) {
        return NextResponse.json(
          { error: "Cannot modify Super Admin users" },
          { status: 403 }
        );
      }
    }

    // Prevent users from modifying themselves
    if (userIds.includes(session!.user.id)) {
      return NextResponse.json(
        { error: "Cannot modify your own role" },
        { status: 403 }
      );
    }

    // Update users
    const updateResult = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
        // Additional safety: ensure Admins can't accidentally update Super Admins
        ...(session!.user.role === ROLES.ADMIN
          ? { role: { not: ROLES.SUPER_ADMIN } }
          : {}),
      },
      data: { role },
    });

    return NextResponse.json({
      success: true,
      data: {
        updatedCount: updateResult.count,
        role,
      },
      message: `Updated ${updateResult.count} users to ${role}`,
    });
  } catch (error) {
    console.error("Bulk update users error:", error);
    return NextResponse.json(
      { error: "Failed to update users" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth([ROLES.SUPER_ADMIN]);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const body = await request.json();
    const { userIds } = body;

    // Validation
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs array is required" },
        { status: 400 }
      );
    }

    // Prevent deleting yourself
    if (userIds.includes(session!.user.id)) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 403 }
      );
    }

    // Get target users
    const targetUsers = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        role: true,
        _count: {
          select: {
            articles: true,
            media: true,
          },
        },
      },
    });

    // Check for Super Admins
    const superAdminIds = targetUsers
      .filter((user) => user.role === ROLES.SUPER_ADMIN)
      .map((user) => user.id);
    if (superAdminIds.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete Super Admin users" },
        { status: 403 }
      );
    }

    // Check for users with content
    const usersWithContent = targetUsers.filter(
      (user) => user._count.articles > 0 || user._count.media > 0
    );

    if (usersWithContent.length > 0) {
      return NextResponse.json(
        {
          error: "Some users have existing content and cannot be deleted",
          details: usersWithContent.map((user) => ({
            id: user.id,
            articles: user._count.articles,
            media: user._count.media,
          })),
        },
        { status: 409 }
      );
    }

    // Delete users
    const deleteResult = await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
        role: { not: ROLES.SUPER_ADMIN }, // Extra safety
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: deleteResult.count,
      },
      message: `Deleted ${deleteResult.count} users`,
    });
  } catch (error) {
    console.error("Bulk delete users error:", error);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
