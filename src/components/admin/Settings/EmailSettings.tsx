import { EnvelopeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { GMAIL_PASSWORD_MASK } from "@/lib/email/constants";

export function EmailSettings({
  getSetting,
  onUpdate,
}: {
  getSetting: (key: string) => string;
  onUpdate: (key: string, value: string) => void;
}) {
  const [testingEmail, setTestingEmail] = useState(false);
  const passwordConfigured =
    getSetting("gmail_app_password") === GMAIL_PASSWORD_MASK ||
    getSetting("gmail_app_password").length > 0;

  const sendTestEmail = async () => {
    setTestingEmail(true);
    try {
      const response = await fetch("/api/admin/settings/test-email", {
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert(data.message || "Test email sent successfully!");
      } else {
        alert(data.error || "Failed to send test email");
      }
    } catch {
      alert("Failed to send test email");
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <InformationCircleIcon className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Free Gmail (App Password)</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Enable 2-Step Verification on your Google account</li>
            <li>
              Go to Google Account → Security → App passwords → create a
              password for &quot;Mail&quot;
            </li>
            <li>Copy the 16-character token into the App Password field below</li>
          </ol>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Gmail — Server Alerts
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gmail address
              </label>
              <input
                type="email"
                value={getSetting("gmail_address")}
                onChange={(e) => onUpdate("gmail_address", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="alerts@gmail.com"
                autoComplete="off"
              />
              <p className="mt-1 text-xs text-gray-500">
                Sender Gmail account (smtp.gmail.com)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gmail App Password
              </label>
              <input
                type="password"
                value={
                  getSetting("gmail_app_password") === GMAIL_PASSWORD_MASK
                    ? ""
                    : getSetting("gmail_app_password")
                }
                onChange={(e) => onUpdate("gmail_app_password", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  passwordConfigured
                    ? "Leave blank to keep current password"
                    : "xxxx xxxx xxxx xxxx"
                }
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-gray-500">
                16-character token from Google (not your regular login password)
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert recipient emails (comma-separated)
              </label>
              <input
                type="text"
                value={getSetting("server_alert_emails")}
                onChange={(e) =>
                  onUpdate("server_alert_emails", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com, dev@example.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                Server down, auto-restart, and recovery notifications are sent
                to all of these addresses
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender name
              </label>
              <input
                type="text"
                value={getSetting("from_name") || "Turning Tides Facility"}
                onChange={(e) => onUpdate("from_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Turning Tides Facility"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={sendTestEmail}
              disabled={testingEmail}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {testingEmail ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                  Sending...
                </>
              ) : (
                <>
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Send test email
                </>
              )}
            </button>
            <p className="text-xs text-gray-500">
              Save changes first, then send a test email to alert recipients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
