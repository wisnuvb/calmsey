/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  XMarkIcon,
  KeyIcon,
  StarIcon,
  ShieldCheckIcon,
  PencilIcon,
  DocumentTextIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { User, ROLE_LABELS, ROLE_DESCRIPTIONS, RoleFilter } from "@/types/user";

interface UserModalProps {
  user: User | null;
  currentUserRole: string;
  onClose: () => void;
  onSave: () => void;
}

export default function UserModal({
  user,
  currentUserRole,
  onClose,
  onSave,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "VIEWER",
    password: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    if (!user && !formData.password) {
      alert("Password is required for new users");
      return;
    }

    if (!user && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate password strength for new users
    if (!user && formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    setSaving(true);
    try {
      const url = user ? `/api/admin/users/${user.id}` : "/api/admin/users";
      const method = user ? "PUT" : "POST";

      const body: any = {
        name: formData.name.trim() || null,
        email: formData.email.trim(),
        role: formData.role,
      };

      if (!user && formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save user");
      }
    } catch (error) {
      console.error("Save user error:", error);
      alert("Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const availableRoles =
    currentUserRole === "SUPER_ADMIN"
      ? ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "VIEWER"]
      : ["EDITOR", "AUTHOR", "VIEWER"];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {user ? "Edit User" : "Create New User"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as
                    | "SUPER_ADMIN"
                    | "ADMIN"
                    | "EDITOR"
                    | "AUTHOR"
                    | "VIEWER",
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {
                ROLE_DESCRIPTIONS[
                  formData.role as keyof typeof ROLE_DESCRIPTIONS
                ]
              }
            </p>
          </div>

          {!user && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password should be at least 8 characters long and include a
                  mix of letters, numbers, and symbols.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.password &&
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm password"
                  required
                />
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </>
          )}

          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <KeyIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Password changes must be done by the user through their
                    profile settings or password reset.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Role Permission Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Role Permissions:
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center">
                <StarIcon className="h-3 w-3 mr-1 text-purple-500" />
                <span>
                  <strong>Super Admin:</strong> Full system access and user
                  management
                </span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-3 w-3 mr-1 text-red-500" />
                <span>
                  <strong>Admin:</strong> Manage content and users (except Super
                  Admins)
                </span>
              </div>
              <div className="flex items-center">
                <PencilIcon className="h-3 w-3 mr-1 text-blue-500" />
                <span>
                  <strong>Editor:</strong> Create, edit, and publish all content
                </span>
              </div>
              <div className="flex items-center">
                <DocumentTextIcon className="h-3 w-3 mr-1 text-green-500" />
                <span>
                  <strong>Author:</strong> Create and edit own content only
                </span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-3 w-3 mr-1 text-gray-500" />
                <span>
                  <strong>Viewer:</strong> Read-only access to content
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                saving ||
                (!user && formData.password !== formData.confirmPassword)
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></div>
                  {user ? "Updating..." : "Creating..."}
                </>
              ) : user ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
