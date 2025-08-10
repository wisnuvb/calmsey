/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  requireAuth,
  ROLE_ADMIN,
  ROLE_VIEWER,
  ROLES,
} from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
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
      ];
    }

    // Role filter
    if (role) {
      where.role = role;
    }

    // Role-based filtering (Admins can't see Super Admins)
    if (session!.user.role === ROLES.ADMIN) {
      where.role = {
        not: ROLES.SUPER_ADMIN,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
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
        },
        orderBy: [
          { role: "asc" }, // Super Admins first, then by hierarchy
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Calculate statistics
    const baseStatsWhere: any =
      session!.user.role === ROLES.ADMIN
        ? { role: { not: ROLES.SUPER_ADMIN } }
        : {};

    const stats = await Promise.all([
      prisma.user.count({ where: baseStatsWhere }), // total
      prisma.user.count({
        where: { ...baseStatsWhere, role: ROLES.SUPER_ADMIN },
      }),
      prisma.user.count({ where: { ...baseStatsWhere, role: ROLES.ADMIN } }),
      prisma.user.count({ where: { ...baseStatsWhere, role: ROLES.EDITOR } }),
      prisma.user.count({ where: { ...baseStatsWhere, role: ROLES.AUTHOR } }),
      prisma.user.count({ where: { ...baseStatsWhere, role: ROLES.VIEWER } }),
      prisma.user.count({
        where: {
          ...baseStatsWhere,
          emailVerified: { not: null },
        },
      }),
      prisma.user.count({
        where: {
          ...baseStatsWhere,
          emailVerified: null,
        },
      }),
    ]);

    const [
      total,
      superAdmins,
      admins,
      editors,
      authors,
      viewers,
      verified,
      unverified,
    ] = stats;

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
      stats: {
        total: session!.user.role === ROLES.ADMIN ? total : total,
        superAdmins: session!.user.role === ROLES.ADMIN ? 0 : superAdmins, // Hide from admins
        admins,
        editors,
        authors,
        viewers,
        verified,
        unverified,
      },
      filters: {
        search,
        role,
      },
    });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    const body = await request.json();
    const { name, email, role, password } = body;

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Validate role permissions
    const validRoles = ROLE_VIEWER;
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Only Super Admins can create Super Admins and Admins
    if (
      (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) &&
      session!.user.role !== ROLES.SUPER_ADMIN
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions to create this role" },
        { status: 403 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: email.toLowerCase().trim(),
        role,
        emailVerified: new Date(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // TODO: Send welcome email to the new user with temporary password
    // You can integrate with email service here

    return NextResponse.json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
