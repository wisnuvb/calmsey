export function MediaSettings({
  getSetting,
  onUpdate,
}: {
  getSetting: (key: string) => string;
  onUpdate: (key: string, value: string) => void;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Media Configuration
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={getSetting("max_file_size") || "10"}
              onChange={(e) => onUpdate("max_file_size", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Quality (1-100)
            </label>
            <input
              type="number"
              value={getSetting("image_quality") || "85"}
              onChange={(e) => onUpdate("image_quality", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allowed File Types
          </label>
          <textarea
            value={
              getSetting("allowed_file_types") ||
              "jpg,jpeg,png,gif,pdf,doc,docx"
            }
            onChange={(e) => onUpdate("allowed_file_types", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="jpg,jpeg,png,gif,pdf,doc,docx"
          />
          <p className="text-sm text-gray-500 mt-1">
            Comma-separated list of allowed file extensions
          </p>
        </div>
      </div>
    </div>
  );
}
