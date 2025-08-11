// src/components/admin/Dashboard/DashboardStats.tsx
import React from "react";
import {
  DocumentTextIcon,
  EyeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface DashboardStatsProps {
  stats: {
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    totalViews: number;
    totalUsers: number;
    unreadMessages: number;
    systemAlerts: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      name: "Total Pages",
      value: stats.totalPages,
      change: "+4.75%",
      changeType: "positive",
      icon: DocumentTextIcon,
      href: "/admin/pages",
    },
    {
      name: "Published",
      value: stats.publishedPages,
      change: "+2.02%",
      changeType: "positive",
      icon: CheckCircleIcon,
      href: "/admin/pages?status=published",
    },
    {
      name: "Page Views",
      value: stats.totalViews.toLocaleString(),
      change: "+12.5%",
      changeType: "positive",
      icon: EyeIcon,
      href: "/admin/analytics",
    },
    {
      name: "Users",
      value: stats.totalUsers,
      change: "+1.2%",
      changeType: "positive",
      icon: UserGroupIcon,
      href: "/admin/users",
    },
    {
      name: "Messages",
      value: stats.unreadMessages,
      change: stats.unreadMessages > 0 ? "New" : "None",
      changeType: stats.unreadMessages > 0 ? "warning" : "neutral",
      icon: ChatBubbleLeftRightIcon,
      href: "/admin/contact",
    },
    {
      name: "Alerts",
      value: stats.systemAlerts,
      change: stats.systemAlerts > 0 ? "Action needed" : "All good",
      changeType: stats.systemAlerts > 0 ? "negative" : "positive",
      icon: ExclamationTriangleIcon,
      href: "/admin/system",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => (window.location.href = item.href)}
        >
          <dt>
            <div className="absolute rounded-md bg-blue-500 p-3">
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                item.changeType === "positive"
                  ? "text-green-600"
                  : item.changeType === "negative"
                  ? "text-red-600"
                  : item.changeType === "warning"
                  ? "text-yellow-600"
                  : "text-gray-500"
              }`}
            >
              {item.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}

// src/components/admin/Dashboard/QuickActions.tsx

// src/components/admin/Dashboard/RecentActivity.tsx

// src/components/admin/Dashboard/PageStatusOverview.tsx

// // src/app/admin/page.tsx - Main Dashboard Page
// import { DashboardStats } from "@/components/admin/Dashboard/DashboardStats";
// import { QuickActions } from "@/components/admin/Dashboard/QuickActions";
// import { RecentActivity } from "@/components/admin/Dashboard/RecentActivity";
// import { PageStatusOverview } from "@/components/admin/Dashboard/PageStatusOverview";

// export default async function AdminDashboard() {
//   // Fetch data (implement based on your data layer)
//   const stats = {
//     totalPages: 12,
//     publishedPages: 8,
//     draftPages: 4,
//     totalViews: 15420,
//     totalUsers: 156,
//     unreadMessages: 3,
//     systemAlerts: 0,
//   };

//   const recentActivities = [
//     {
//       id: 1,
//       user: "John Doe",
//       action: "Created new page",
//       description: 'Added "About Us" page',
//       time: "2 minutes ago",
//       icon: PlusIcon,
//     },
//     // Add more activities...
//   ];

//   const pages = [
//     { id: 1, status: "PUBLISHED" },
//     { id: 2, status: "DRAFT" },
//     // Add more pages...
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Welcome back! Here's what's happening with your site.
//         </p>
//       </div>

//       <DashboardStats stats={stats} />

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <QuickActions />
//         <PageStatusOverview pages={pages} />
//       </div>

//       <RecentActivity activities={recentActivities} />
//     </div>
//   );
// }
