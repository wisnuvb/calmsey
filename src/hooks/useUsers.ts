import { RoleFilter, User, UserStats } from "@/types/user";
import { useState, useEffect, useCallback } from "react";

interface UseUsersOptions {
  initialSearch?: string;
  initialRoleFilter?: RoleFilter;
  autoFetch?: boolean;
}

export function useUsers(options: UseUsersOptions = {}) {
  const {
    initialSearch = "",
    initialRoleFilter = "all",
    autoFetch = true,
  } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    superAdmins: 0,
    admins: 0,
    editors: 0,
    authors: 0,
    viewers: 0,
    verified: 0,
    unverified: 0,
  });
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(initialRoleFilter);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search,
        role: roleFilter === "all" ? "" : roleFilter,
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: {
        success: boolean;
        data?: User[];
        stats?: UserStats;
        error?: string;
      } = await response.json();

      if (data.success) {
        setUsers(data.data || []);
        setStats(data.stats || stats);
      } else {
        throw new Error(data.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter]);

  const createUser = async (userData: {
    name?: string;
    email: string;
    role: string;
    password: string;
  }) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchUsers(); // Refresh the list
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Create user error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create user",
      };
    }
  };

  const updateUser = async (
    userId: string,
    userData: {
      name?: string;
      email?: string;
      role?: string;
    }
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchUsers(); // Refresh the list
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Update user error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchUsers(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
      };
    }
  };

  const bulkUpdateUsers = async (
    userIds: string[],
    updates: { role?: string }
  ) => {
    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, ...updates }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchUsers(); // Refresh the list
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || "Failed to update users");
      }
    } catch (error) {
      console.error("Bulk update error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update users",
      };
    }
  };

  const bulkDeleteUsers = async (userIds: string[]) => {
    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchUsers(); // Refresh the list
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || "Failed to delete users");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete users",
      };
    }
  };

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [search, roleFilter, autoFetch, fetchUsers]);

  return {
    // Data
    users,
    stats,
    loading,
    error,

    // Filters
    search,
    setSearch,
    roleFilter,
    setRoleFilter,

    // Actions
    refreshUsers: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    bulkUpdateUsers,
    bulkDeleteUsers,
  };
}
