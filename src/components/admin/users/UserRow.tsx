// src/components/admin/users/UserRow.tsx
import {
  UserIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  StarIcon, // Using StarIcon instead of CrownIcon
} from "@heroicons/react/24/outline";
import { User, ROLE_LABELS } from "@/types/user";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface UserRowProps {
  user: User;
  selected: boolean;
  bulkMode: boolean;
  currentUserRole: string;
  onSelect: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}

export default function UserRow({
  user,
  selected,
  bulkMode,
  currentUserRole,
  onSelect,
  onEdit,
  onRefresh,
}: UserRowProps) {
  const canManageUser = (targetUserRole: string, targetUserId: string) => {
    // Can't manage yourself for role changes
    if (targetUserId === "current-user-id") return false; // You'd get this from session

    // Super Admins can manage everyone except other Super Admins
    if (currentUserRole === "SUPER_ADMIN") {
      return targetUserRole !== "SUPER_ADMIN";
    }

    // Admins can manage Editors, Authors, and Viewers
    if (currentUserRole === "ADMIN") {
      return ["EDITOR", "AUTHOR", "VIEWER"].includes(targetUserRole);
    }

    return false;
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update user role");
      }
    } catch (error) {
      console.error("Update role error:", error);
      alert("Failed to update user role");
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Failed to delete user");
    }
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      SUPER_ADMIN: StarIcon, // Changed from CrownIcon to StarIcon
      ADMIN: ShieldCheckIcon,
      EDITOR: PencilIcon,
      AUTHOR: DocumentTextIcon,
      VIEWER: EyeIcon,
    };
    return icons[role as keyof typeof icons] || UserIcon;
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      SUPER_ADMIN: "bg-purple-100 text-purple-800",
      ADMIN: "bg-red-100 text-red-800",
      EDITOR: "bg-blue-100 text-blue-800",
      AUTHOR: "bg-green-100 text-green-800",
      VIEWER: "bg-gray-100 text-gray-800",
    };
    return badges[role as keyof typeof badges] || badges.VIEWER;
  };

  const RoleIcon = getRoleIcon(user.role);
  const isVerified = !!user.emailVerified;

  return (
    <tr className={selected ? "bg-blue-50" : "hover:bg-gray-50"}>
      {bulkMode && (
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </td>
      )}

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.image ? (
              <Image
                src={getImageUrl(user.image)}
                alt={user.name || "User"}
                className="h-10 w-10 rounded-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-600" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.name || "No name"}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <RoleIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(
              user.role
            )}`}
          >
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {isVerified ? (
            <div className="flex items-center text-green-600">
              <CheckIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">Verified</span>
            </div>
          ) : (
            <div className="flex items-center text-orange-600">
              <XMarkIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">Unverified</span>
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          {user._count && (
            <>
              <div className="flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                <span>{user._count.articles} articles</span>
              </div>
              <div className="flex items-center">
                <PhotoIcon className="h-4 w-4 mr-1" />
                <span>{user._count.media} media</span>
              </div>
            </>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {!bulkMode && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
              title="View user"
            >
              <EyeIcon className="h-4 w-4" />
            </button>

            {canManageUser(user.role, user.id) && (
              <>
                <button
                  onClick={onEdit}
                  className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                  title="Edit role"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>

                {currentUserRole === "SUPER_ADMIN" && (
                  <button
                    onClick={() =>
                      deleteUser(user.id, user.name || user.email || "Unknown")
                    }
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete user"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

// Alternative: Custom Crown Icon Component (if you want to use crown specifically)
// You can create this as a separate component

export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12l4-7 3 7 3-7 4 7v7H5v-7z"
      />
    </svg>
  );
}

// If you want to use the custom crown icon, update the getRoleIcon function:
/*
const getRoleIcon = (role: string) => {
  const icons = {
    SUPER_ADMIN: CrownIcon, // Use custom crown icon
    ADMIN: ShieldCheckIcon,
    EDITOR: PencilIcon,
    AUTHOR: DocumentTextIcon,
    VIEWER: EyeIcon,
  };
  return icons[role as keyof typeof icons] || UserIcon;
};
*/
