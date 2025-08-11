"use client";

import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface DatabaseConnectionErrorProps {
  error?: string;
}

export default function DatabaseConnectionError({
  error,
}: DatabaseConnectionErrorProps) {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Database Connection Error
        </h1>

        <p className="text-gray-600 mb-6">
          Unable to connect to the database. Please check your database
          configuration and try again.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-300 rounded-md p-4 mb-6">
            <p className="text-sm text-red-700 font-mono">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>

          <div className="text-sm text-gray-500">
            <p>Need help? Check the following:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Database server is running</li>
              <li>Database credentials are correct</li>
              <li>Database exists and is accessible</li>
              <li>Network connectivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
