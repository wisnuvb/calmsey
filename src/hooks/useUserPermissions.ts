import { User } from "@/types/user";

type UserRole = User["role"];

const canUserManageRole = (
  managerRole: UserRole,
  targetRole: UserRole
): boolean => {
  const hierarchy = {
    SUPER_ADMIN: 5,
    ADMIN: 4,
    EDITOR: 3,
    AUTHOR: 2,
    VIEWER: 1,
  };

  return hierarchy[managerRole] > hierarchy[targetRole];
};

export function useUserPermissions(currentUserRole?: UserRole) {
  const canCreateUser = (targetRole: UserRole): boolean => {
    if (!currentUserRole) return false;

    // Super Admins can create any role except other Super Admins
    if (currentUserRole === "SUPER_ADMIN") {
      return true;
    }

    // Admins can create lower-level roles
    if (currentUserRole === "ADMIN") {
      return canUserManageRole(currentUserRole, targetRole);
    }

    return false;
  };

  const canEditUser = (
    targetUserRole: UserRole,
    targetUserId: string,
    currentUserId: string
  ): boolean => {
    if (!currentUserRole) return false;

    // Can't edit yourself for role changes
    if (targetUserId === currentUserId) return false;

    // Super Admins can edit everyone except other Super Admins
    if (currentUserRole === "SUPER_ADMIN") {
      return targetUserRole !== "SUPER_ADMIN";
    }

    // Admins can edit lower-level roles
    if (currentUserRole === "ADMIN") {
      return canUserManageRole(currentUserRole, targetUserRole);
    }

    return false;
  };

  const canDeleteUser = (
    targetUserRole: UserRole,
    targetUserId: string,
    currentUserId: string
  ): boolean => {
    if (!currentUserRole) return false;

    // Can't delete yourself
    if (targetUserId === currentUserId) return false;

    // Only Super Admins can delete users
    if (currentUserRole === "SUPER_ADMIN") {
      return targetUserRole !== "SUPER_ADMIN"; // Can't delete other Super Admins
    }

    return false;
  };

  const canBulkEdit = (): boolean => {
    return currentUserRole === "SUPER_ADMIN" || currentUserRole === "ADMIN";
  };

  const getAvailableRoles = (): UserRole[] => {
    if (!currentUserRole) return [];

    if (currentUserRole === "SUPER_ADMIN") {
      return ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "VIEWER"];
    }

    if (currentUserRole === "ADMIN") {
      return ["EDITOR", "AUTHOR", "VIEWER"];
    }

    return [];
  };

  return {
    canCreateUser,
    canEditUser,
    canDeleteUser,
    canBulkEdit,
    getAvailableRoles,
  };
}
