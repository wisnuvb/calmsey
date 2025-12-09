/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import type { Session } from "next-auth";

// Role constants for consistency
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  AUTHOR: "AUTHOR",
  VIEWER: "VIEWER",
} as const;

export const ROLE_ADMIN = [ROLES.SUPER_ADMIN, ROLES.ADMIN];

export const ROLE_EDITOR = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR];

export const ROLE_AUTHOR = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.EDITOR,
  ROLES.AUTHOR,
];

export const ROLE_VIEWER = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.EDITOR,
  ROLES.AUTHOR,
  ROLES.VIEWER,
];

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Helper to get session with type safety
export async function getAuthenticatedSession(): Promise<Session | null> {
  try {
    return (await getServerSession(authOptions)) as Session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Helper to check if user has allowed role
export function hasRequiredRole(
  userRole: string,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(userRole as UserRole);
}

// Helper for automatic authorization with response
export async function requireAuth(allowedRoles: UserRole[] = ROLE_VIEWER) {
  const session = await getAuthenticatedSession();

  if (!session?.user) {
    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!hasRequiredRole(session.user.role, allowedRoles)) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return {
    success: true,
    session,
    user: session.user,
  };
}

// Helper to check if user is author of a resource
export function canEditResource(
  userRole: string,
  userId: string,
  resourceAuthorId: string
): boolean {
  if (
    userRole === ROLES.SUPER_ADMIN ||
    userRole === ROLES.ADMIN ||
    userRole === ROLES.EDITOR
  ) {
    return true;
  }

  if (userRole === ROLES.AUTHOR) {
    return userId === resourceAuthorId;
  }

  return false;
}

// Helper for authorization with custom logic
export async function requireAuthWithCustomCheck(
  allowedRoles: UserRole[],
  customCheck?: (
    session: Session
  ) => Promise<{ allowed: boolean; error?: string }>
) {
  const authResult = await requireAuth(allowedRoles);

  if (!authResult.success) {
    return authResult;
  }

  if (customCheck) {
    const customResult = await customCheck(authResult.session!);
    if (!customResult.allowed) {
      return {
        success: false,
        response: NextResponse.json(
          { error: customResult.error || "Access denied" },
          { status: 403 }
        ),
      };
    }
  }

  return authResult;
}

// Helper for middleware pattern that is often used
export async function withAuth<T>(
  handler: (session: Session, ...args: any[]) => Promise<T>,
  allowedRoles: UserRole[] = [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.AUTHOR,
  ]
) {
  return async (...args: any[]) => {
    const authResult = await requireAuth(allowedRoles);

    if (!authResult.success) {
      return authResult.response;
    }

    return handler(authResult.session!, ...args);
  };
}
