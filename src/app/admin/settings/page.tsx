"use client";

import { useState, useEffect } from "react";
import {
  CogIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhotoIcon,
  BellIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: "TEXT" | "NUMBER" | "BOOLEAN" | "JSON" | "IMAGE";
}

interface Language {
  id: string;
  name: string;
  flag?: string;
  isDefault: boolean;
  isActive: boolean;
}

interface SettingsData {
  siteSettings: SiteSetting[];
  languages: Language[];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsData>({
    siteSettings: [],
    languages: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: CogIcon },
    { id: "languages", label: "Languages", icon: GlobeAltIcon },
    { id: "security", label: "Security", icon: ShieldCheckIcon },
    { id: "email", label: "Email", icon: EnvelopeIcon },
    { id: "media", label: "Media", icon: PhotoIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "backup", label: "Backup", icon: CloudArrowUpIcon },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setUnsavedChanges(false);
        // Show success message
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      siteSettings: prev.siteSettings.map((setting) =>
        setting.key === key ? { ...setting, value } : setting
      ),
    }));
    setUnsavedChanges(true);
  };

  const getSetting = (key: string): string => {
    const setting = settings.siteSettings.find((s) => s.key === key);
    return setting?.value || "";
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure your CMS settings and preferences.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {unsavedChanges && (
            <div className="flex items-center text-orange-600 text-sm">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              Unsaved changes
            </div>
          )}
          <button
            onClick={saveSettings}
            disabled={saving || !unsavedChanges}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "general" && (
          <GeneralSettings onUpdate={updateSetting} getSetting={getSetting} />
        )}
        {activeTab === "languages" && (
          <LanguageSettings
            languages={settings.languages}
            onUpdate={(languages) =>
              setSettings((prev) => ({ ...prev, languages }))
            }
          />
        )}
        {activeTab === "security" && (
          <SecuritySettings getSetting={getSetting} onUpdate={updateSetting} />
        )}
        {activeTab === "email" && (
          <EmailSettings getSetting={getSetting} onUpdate={updateSetting} />
        )}
        {activeTab === "media" && (
          <MediaSettings getSetting={getSetting} onUpdate={updateSetting} />
        )}
        {activeTab === "notifications" && (
          <NotificationSettings
            getSetting={getSetting}
            onUpdate={updateSetting}
          />
        )}
        {activeTab === "backup" && <BackupSettings />}
      </div>
    </div>
  );
}

// General Settings Component
function GeneralSettings({
  onUpdate,
  getSetting,
}: {
  onUpdate: (key: string, value: string) => void;
  getSetting: (key: string) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Site Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name *
            </label>
            <input
              type="text"
              value={getSetting("site_name")}
              onChange={(e) => onUpdate("site_name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Turning Tides Facility"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Tagline
            </label>
            <input
              type="text"
              value={getSetting("site_tagline")}
              onChange={(e) => onUpdate("site_tagline", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Premier rehabilitation and treatment facility"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <textarea
              value={getSetting("site_description")}
              onChange={(e) => onUpdate("site_description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="A comprehensive rehabilitation facility providing expert care..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={getSetting("contact_phone")}
              onChange={(e) => onUpdate("contact_phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1-555-0123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={getSetting("contact_email")}
              onChange={(e) => onUpdate("contact_email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="info@turningtidesfacility.org"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={getSetting("address")}
              onChange={(e) => onUpdate("address", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Recovery Lane, Hope City, HC 12345"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              value={getSetting("social_facebook")}
              onChange={(e) => onUpdate("social_facebook", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://facebook.com/turningtidesfacility"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              value={getSetting("social_twitter")}
              onChange={(e) => onUpdate("social_twitter", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://twitter.com/turningtides"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              value={getSetting("social_instagram")}
              onChange={(e) => onUpdate("social_instagram", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://instagram.com/turningtidesfacility"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={getSetting("social_linkedin")}
              onChange={(e) => onUpdate("social_linkedin", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/company/turningtidesfacility"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Language Settings Component
function LanguageSettings({
  languages,
  onUpdate,
}: {
  languages: Language[];
  onUpdate: (languages: Language[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleLanguage = (languageId: string) => {
    const updatedLanguages = languages.map((lang) =>
      lang.id === languageId ? { ...lang, isActive: !lang.isActive } : lang
    );
    onUpdate(updatedLanguages);
  };

  const setDefaultLanguage = (languageId: string) => {
    const updatedLanguages = languages.map((lang) => ({
      ...lang,
      isDefault: lang.id === languageId,
    }));
    onUpdate(updatedLanguages);
  };

  const filteredLanguages = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Language Management
        </h3>
      </div>

      {/* Search Field */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Sticky Header */}
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language ID
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLanguages.map((language) => (
                <tr key={language.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{language.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {language.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">
                      {language.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        language.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {language.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {language.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => setDefaultLanguage(language.id)}
                        disabled={language.isDefault}
                        className={`text-sm px-3 py-1 rounded-md transition-colors ${
                          language.isDefault
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                        }`}
                      >
                        Set Default
                      </button>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={language.isActive}
                          onChange={() => toggleLanguage(language.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredLanguages.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No languages found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "No languages available."}
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-2" />
          <div className="text-sm text-blue-800">
            <p>
              <strong>Language Configuration:</strong>
            </p>
            <p>
              • Default language will be used as fallback for missing
              translations
            </p>
            <p>• Inactive languages won&apos; t be available on the frontend</p>
            <p>• At least one language must remain active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings({
  getSetting,
  onUpdate,
}: {
  getSetting: (key: string) => string;
  onUpdate: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Security Configuration
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Maintenance Mode
              </h4>
              <p className="text-sm text-gray-500">
                Temporarily disable public access to the website
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={getSetting("maintenance_mode") === "true"}
                onChange={(e) =>
                  onUpdate("maintenance_mode", e.target.checked.toString())
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={getSetting("session_timeout") || "60"}
              onChange={(e) => onUpdate("session_timeout", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="15"
              max="480"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={getSetting("max_login_attempts") || "5"}
              onChange={(e) => onUpdate("max_login_attempts", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="3"
              max="20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Email Settings Component
function EmailSettings({
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

// Media Settings Component
function MediaSettings({
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

// Notification Settings Component
function NotificationSettings({
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

// Backup Settings Component
function BackupSettings() {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const createBackup = async () => {
    setBackupInProgress(true);
    try {
      const response = await fetch("/api/admin/backup", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
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
