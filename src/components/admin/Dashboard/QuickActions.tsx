import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

export function QuickActions() {
  const actions = [
    {
      name: "Create New Page",
      description: "Build a new page with page builder",
      icon: PlusIcon,
      href: "/admin/pages/new",
      color: "bg-blue-500",
    },
    {
      name: "Edit Homepage",
      description: "Modify your landing page",
      icon: PencilIcon,
      href: "/admin/pages/landing",
      color: "bg-green-500",
    },
    {
      name: "Preview Site",
      description: "See how your site looks",
      icon: EyeIcon,
      href: "/",
      color: "bg-purple-500",
      external: true,
    },
    {
      name: "Site Settings",
      description: "Configure global settings",
      icon: CogIcon,
      href: "/admin/settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <a
            key={action.name}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <div className={`${action.color} rounded-lg p-2`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {action.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
