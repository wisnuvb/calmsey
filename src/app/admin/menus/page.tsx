/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import MenuManager from "@/components/admin/MenuManager";

export default function MenusAdminPage() {
  const [activeTab, setActiveTab] = useState("main-navigation");
  const [mainNavItems, setMainNavItems] = useState([]);
  const [footerItems, setFooterItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/admin/menus");
      const data = await response.json();

      const mainNav = data.data.find(
        (menu: any) => menu.key === "main-navigation"
      );
      const footer = data.data.find((menu: any) => menu.key === "footer-links");

      setMainNavItems(mainNav?.items || []);
      setFooterItems(footer?.items || []);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveMenu = async (menuType: string, items: any[]) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/menus/${menuType}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (response.ok) {
        alert("Menu saved successfully!");
        if (menuType === "main-navigation") {
          setMainNavItems(items as never[]);
        } else {
          setFooterItems(items as never[]);
        }
      } else {
        alert("Failed to save menu");
      }
    } catch (error) {
      console.error("Save menu error:", error);
      alert("Failed to save menu");
    } finally {
      setSaving(false);
    }
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Menu Management
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Configure your website navigation menus and footer links.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: "main-navigation", label: "Main Navigation" },
            { key: "footer-links", label: "Footer Links" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Menu Manager */}
      {activeTab === "main-navigation" && (
        <MenuManager
          menuType="main-navigation"
          initialItems={mainNavItems}
          onSave={(items) => saveMenu("main-navigation", items)}
        />
      )}

      {activeTab === "footer-links" && (
        <MenuManager
          menuType="footer-links"
          initialItems={footerItems}
          onSave={(items) => saveMenu("footer-links", items)}
        />
      )}

      {saving && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-center mt-4">Saving menu...</p>
          </div>
        </div>
      )}
    </div>
  );
}
