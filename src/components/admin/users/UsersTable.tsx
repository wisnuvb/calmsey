import { UserGroupIcon, PlusIcon } from "@heroicons/react/24/outline";
import { User } from "@/types/user";
import { UserRow } from ".";

interface UsersTableProps {
  users: User[];
  selectedUsers: Set<string>;
  bulkActionMode: boolean;
  currentUserRole: string;
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  onEditUser: (user: User) => void;
  onRefresh: () => void;
}

export default function UsersTable({
  users,
  selectedUsers,
  bulkActionMode,
  currentUserRole,
  onSelectUser,
  onSelectAll,
  onEditUser,
  onRefresh,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="mt-6 text-center py-12 bg-white shadow rounded-lg">
        <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No users found
        </h3>
        <p className="text-gray-500 mb-6">
          No users match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Bulk Selection Header */}
      {bulkActionMode && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={
                  selectedUsers.size === users.length && users.length > 0
                }
                onChange={onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-blue-900">
                Select All ({users.length} users)
              </span>
            </div>
            <span className="text-sm text-blue-700">
              {selectedUsers.size} selected
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {bulkActionMode && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.size === users.length && users.length > 0
                    }
                    onChange={onSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                selected={selectedUsers.has(user.id)}
                bulkMode={bulkActionMode}
                currentUserRole={currentUserRole}
                onSelect={() => onSelectUser(user.id)}
                onEdit={() => onEditUser(user)}
                onRefresh={onRefresh}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
