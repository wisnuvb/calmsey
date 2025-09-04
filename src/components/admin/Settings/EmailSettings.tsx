import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function EmailSettings({
  getSetting,
  onUpdate,
}: {
  getSetting: (key: string) => string;
  onUpdate: (key: string, value: string) => void;
}) {
  const [testingEmail, setTestingEmail] = useState(false);

  const sendTestEmail = async () => {
    setTestingEmail(true);
    try {
      const response = await fetch("/api/admin/settings/test-email", {
        method: "POST",
      });

      if (response.ok) {
        alert("Test email sent successfully!");
      } else {
        alert("Failed to send test email");
      }
    } catch {
      alert("Failed to send test email");
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Email Configuration
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={getSetting("smtp_host")}
              onChange={(e) => onUpdate("smtp_host", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              value={getSetting("smtp_port") || "587"}
              onChange={(e) => onUpdate("smtp_port", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email
            </label>
            <input
              type="email"
              value={getSetting("from_email")}
              onChange={(e) => onUpdate("from_email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="noreply@turningtidesfacility.org"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Name
            </label>
            <input
              type="text"
              value={getSetting("from_name")}
              onChange={(e) => onUpdate("from_name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Turning Tides Facility"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={sendTestEmail}
            disabled={testingEmail}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {testingEmail ? (
              <>
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                Sending...
              </>
            ) : (
              <>
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Send Test Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
