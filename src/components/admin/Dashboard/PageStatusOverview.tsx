/* eslint-disable @typescript-eslint/no-explicit-any */
export function PageStatusOverview({ pages }: { pages: any[] }) {
  const statusCounts = pages.reduce((acc, page) => {
    acc[page.status] = (acc[page.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = [
    {
      name: "Published",
      count: statusCounts.PUBLISHED || 0,
      color: "bg-green-500",
    },
    { name: "Draft", count: statusCounts.DRAFT || 0, color: "bg-yellow-500" },
    {
      name: "Archived",
      count: statusCounts.ARCHIVED || 0,
      color: "bg-gray-500",
    },
  ];

  const total = pages.length;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Page Status</h3>
      <div className="space-y-3">
        {statusData.map((status) => (
          <div key={status.name} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${status.color} mr-3`}></div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {status.name}
                </span>
                <span className="text-sm text-gray-500">{status.count}</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${status.color}`}
                  style={{
                    width: `${total > 0 ? (status.count / total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
