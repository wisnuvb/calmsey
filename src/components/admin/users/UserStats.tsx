import { UserStats as UserStatsType } from "@/types/user";

interface UserStatsProps {
  stats: UserStatsType;
}

export default function UserStats({ stats }: UserStatsProps) {
  const statItems = [
    { label: "Total Users", value: stats.total, color: "text-gray-900" },
    {
      label: "Super Admins",
      value: stats.superAdmins,
      color: "text-purple-600",
    },
    { label: "Admins", value: stats.admins, color: "text-red-600" },
    { label: "Editors", value: stats.editors, color: "text-blue-600" },
    { label: "Authors", value: stats.authors, color: "text-green-600" },
    { label: "Viewers", value: stats.viewers, color: "text-gray-600" },
    { label: "Verified", value: stats.verified, color: "text-green-600" },
    { label: "Unverified", value: stats.unverified, color: "text-orange-600" },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="bg-white rounded-lg p-4 shadow">
          <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
          <div className="text-sm text-gray-600">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
