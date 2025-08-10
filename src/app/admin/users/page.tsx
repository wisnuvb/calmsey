"use client";

import { useState, useEffect } from "react";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";

import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user";
import {
  UserStats,
  UsersFilters,
  UsersTable,
  UserModal,
} from "@/components/admin/users";

export default function UsersPage() {
  const {
    users,
    stats,
    loading,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    refreshUsers,
  } = useUsers();

  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      setCurrentUserRole(session?.user?.role || "");
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const handleBulkUpdateRole = async (newRole: string) => {
    if (selectedUsers.size === 0) return;

    if (!confirm(`Update ${selectedUsers.size} users to ${newRole}?`)) return;

    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUsers),
          role: newRole,
        }),
      });

      if (response.ok) {
        refreshUsers();
        setSelectedUsers(new Set());
        setBulkActionMode(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update users");
      }
    } catch (error) {
      console.error("Bulk update error:", error);
      alert("Failed to update users");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;

    if (
      !confirm(
        `Delete ${selectedUsers.size} selected users? This action cannot be undone.`
      )
    )
      return;

    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUsers),
        }),
      });

      if (response.ok) {
        refreshUsers();
        setSelectedUsers(new Set());
        setBulkActionMode(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete users");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete users");
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUsers(newSet);
  };

  const selectAllUsers = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((user) => user.id)));
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const closeModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage user accounts, roles, and permissions in your CMS.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          {bulkActionMode && selectedUsers.size > 0 && (
            <BulkActions
              selectedCount={selectedUsers.size}
              onUpdateRole={handleBulkUpdateRole}
              onDelete={handleBulkDelete}
              onCancel={() => {
                setBulkActionMode(false);
                setSelectedUsers(new Set());
              }}
            />
          )}

          {!bulkActionMode && currentUserRole === "SUPER_ADMIN" && (
            <>
              <button
                onClick={() => setBulkActionMode(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Bulk Actions
              </button>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add User
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <UserStats stats={stats} />

      {/* Filters */}
      <UsersFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Users Table */}
      <UsersTable
        users={users}
        selectedUsers={selectedUsers}
        bulkActionMode={bulkActionMode}
        currentUserRole={currentUserRole}
        onSelectUser={toggleUserSelection}
        onSelectAll={selectAllUsers}
        onEditUser={openEditModal}
        onRefresh={refreshUsers}
      />

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          currentUserRole={currentUserRole}
          onClose={closeModal}
          onSave={() => {
            refreshUsers();
            closeModal();
          }}
        />
      )}
    </div>
  );
}

// Bulk Actions Component
function BulkActions({
  selectedCount,
  onUpdateRole,
  onDelete,
  onCancel,
}: {
  selectedCount: number;
  onUpdateRole: (role: string) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const roles = [
    { value: "ADMIN", label: "Admin" },
    { value: "EDITOR", label: "Editor" },
    { value: "AUTHOR", label: "Author" },
    { value: "VIEWER", label: "Viewer" },
  ];

  return (
    <>
      <div className="inline-flex rounded-md shadow-sm">
        {roles.map((role, index) => (
          <button
            key={role.value}
            onClick={() => onUpdateRole(role.value)}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 ${
              index === 0
                ? "rounded-l-md"
                : index === roles.length - 1
                ? "rounded-r-md"
                : ""
            } ${index !== 0 ? "border-l-0" : ""}`}
          >
            {role.label}
          </button>
        ))}
      </div>
      <button
        onClick={onDelete}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
      >
        Delete ({selectedCount})
      </button>
      <button
        onClick={onCancel}
        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Cancel
      </button>
    </>
  );
}
