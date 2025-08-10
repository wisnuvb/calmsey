import { RoleFilter } from "@/types/user";
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  PencilIcon,
  DocumentTextIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface UsersFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (filter: RoleFilter) => void;
}

export default function UsersFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UsersFiltersProps) {
  const filterOptions = [
    { key: "all" as const, label: "All Roles", icon: UserGroupIcon },
    {
      key: "SUPER_ADMIN" as const,
      label: "Super Admins",
      icon: ShieldCheckIcon,
    },
    { key: "ADMIN" as const, label: "Admins", icon: ShieldCheckIcon },
    { key: "EDITOR" as const, label: "Editors", icon: PencilIcon },
    { key: "AUTHOR" as const, label: "Authors", icon: DocumentTextIcon },
    { key: "VIEWER" as const, label: "Viewers", icon: EyeIcon },
  ];

  return (
    <div className="mt-6 bg-white shadow rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role Filter */}
        <div className="flex space-x-2 overflow-x-auto">
          {filterOptions.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => onRoleFilterChange(filterOption.key)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                roleFilter === filterOption.key
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <filterOption.icon className="h-4 w-4 mr-1" />
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
