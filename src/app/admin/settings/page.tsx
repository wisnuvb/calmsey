"use client";

import { useState, useEffect } from "react";
import {
  CogIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { GeneralSettings } from "@/components/admin/Settings/GeneralSettings";
import { Language, SettingsData } from "@/components/admin/Settings/type";
import { LanguageSettings } from "@/components/admin/Settings/LanguageSettings";
import { EmailSettings } from "@/components/admin/Settings/EmailSettings";
import { MediaSettings } from "@/components/admin/Settings/MediaSettings";
import { NotificationSettings } from "@/components/admin/Settings/NotificationSettings";
import { SecuritySettings } from "@/components/admin/Settings/SecuritySettings";
import { BackupSettings } from "@/components/admin/Settings/BackupSettings";

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
    // { id: "email", label: "Email", icon: EnvelopeIcon },
    { id: "media", label: "Media", icon: PhotoIcon },
    // { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "backup", label: "Backup", icon: CloudArrowUpIcon },
  ];

  useEffect(() => {
    fetchSettings();
    fetchLayoutConfig();
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

  const updateLanguages = async (updatedLanguages: Language[]) => {
    setSettings((prev) => ({ ...prev, languages: updatedLanguages }));
    setUnsavedChanges(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteSettings: settings.siteSettings,
          languages: updatedLanguages,
        }),
      });

      if (response.ok) {
        setUnsavedChanges(false);
      } else {
        console.error("Failed to update languages in database");
      }
    } catch (error) {
      console.error("Error updating languages:", error);
    }
  };

  // Add this function
  const fetchLayoutConfig = async () => {
    try {
      const response = await fetch("/api/admin/settings/layout");
      await response.json();
    } catch {
      console.error("Failed to fetch layout config");
    }
  };

  // Add this function

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
            onUpdate={updateLanguages}
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
