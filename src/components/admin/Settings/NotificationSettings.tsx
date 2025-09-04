export function NotificationSettings({
  getSetting,
  onUpdate,
}: {
  getSetting: (key: string) => string;
  onUpdate: (key: string, value: string) => void;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Notification Preferences
      </h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              New Contact Form Submissions
            </h4>
            <p className="text-sm text-gray-500">
              Get notified when someone submits the contact form
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={getSetting("notify_contact_submissions") !== "false"}
              onChange={(e) =>
                onUpdate(
                  "notify_contact_submissions",
                  e.target.checked.toString()
                )
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              New User Registrations
            </h4>
            <p className="text-sm text-gray-500">
              Get notified when new users are created
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={getSetting("notify_new_users") !== "false"}
              onChange={(e) =>
                onUpdate("notify_new_users", e.target.checked.toString())
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Article Published
            </h4>
            <p className="text-sm text-gray-500">
              Get notified when articles are published
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={getSetting("notify_article_published") !== "false"}
              onChange={(e) =>
                onUpdate(
                  "notify_article_published",
                  e.target.checked.toString()
                )
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Email for Notifications
          </label>
          <input
            type="email"
            value={getSetting("admin_notification_email")}
            onChange={(e) =>
              onUpdate("admin_notification_email", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@turningtidesfacility.org"
          />
        </div>
      </div>
    </div>
  );
}
