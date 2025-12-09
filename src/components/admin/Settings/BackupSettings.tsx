import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export function BackupSettings() {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const createBackup = async () => {
    setBackupInProgress(true);
    try {
      const response = await fetch("/api/admin/backup", {
        method: "POST",
      });

      if (response.ok) {
        await response.json();
        setLastBackup(new Date().toISOString());
        alert("Backup created successfully!");
      } else {
        alert("Failed to create backup");
      }
    } catch {
      alert("Failed to create backup");
    } finally {
      setBackupInProgress(false);
    }
  };

  const downloadBackup = async () => {
    try {
      const response = await fetch("/api/admin/backup/download");

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `backup-${new Date().toISOString().split("T")[0]}.sql`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to download backup");
      }
    } catch {
      alert("Failed to download backup");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Database Backup
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Manual Backup
              </h4>
              <p className="text-sm text-gray-500">
                Create a backup of your database and files
              </p>
              {lastBackup && (
                <p className="text-xs text-green-600 mt-1">
                  Last backup: {new Date(lastBackup).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={createBackup}
                disabled={backupInProgress}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {backupInProgress ? (
                  <>
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                    Create Backup
                  </>
                )}
              </button>
              <button
                onClick={downloadBackup}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <div className="text-sm text-yellow-800">
                <p>
                  <strong>Backup Recommendations:</strong>
                </p>
                <ul className="mt-2 space-y-1">
                  <li>• Create regular backups before making major changes</li>
                  <li>• Store backups in a secure, off-site location</li>
                  <li>• Test backup restoration procedures periodically</li>
                  <li>• Keep multiple backup versions for disaster recovery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">CMS Version:</span>
              <span className="text-sm font-medium text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Database:</span>
              <span className="text-sm font-medium text-gray-900">
                MySQL 8.0
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Node.js:</span>
              <span className="text-sm font-medium text-gray-900">
                v18.17.0
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Next.js:</span>
              <span className="text-sm font-medium text-gray-900">15.4.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Prisma:</span>
              <span className="text-sm font-medium text-gray-900">5.22.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Last Updated:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
