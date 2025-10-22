/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/public/ConfigurableHeader.tsx
"use client";

import React from "react";
import Link from "next/link";
import { HeaderSettings } from "@/types/layout-settings";
import { PublicAPI, SupportedLanguage } from "@/lib/public-api";
import { Navigation } from "./Navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Image from "next/image";

interface ConfigurableHeaderProps {
  language: SupportedLanguage;
  settings: HeaderSettings;
  siteSettings?: any;
  mainNavigation?: any[];
}

export function ConfigurableHeader({
  language,
  settings,
  siteSettings,
  mainNavigation = [],
}: ConfigurableHeaderProps) {
  if (!settings.enabled || settings.type === "none") {
    return null;
  }

  if (settings.type === "custom" && settings.customContent) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: settings.customContent }}
        className="configurable-header"
      />
    );
  }

  const homeUrl = language === "en" ? "/" : `/${language}`;
  const headerClasses = [
    "configurable-header",
    settings.style.sticky ? "sticky top-0 z-50" : "",
    settings.style.transparent ? "bg-transparent" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const headerStyles = {
    backgroundColor: settings.style.backgroundColor,
    color: settings.style.textColor,
  };

  return (
    <header className={headerClasses} style={headerStyles}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={homeUrl} className="flex items-center space-x-2">
              {settings.style.logoUrl ? (
                <Image
                  src={settings.style.logoUrl}
                  alt={siteSettings?.siteName || "Logo"}
                  className="h-8 w-8"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TT</span>
                </div>
              )}
              <span className="text-xl font-bold">
                {settings.style.logoText ||
                  siteSettings?.siteName ||
                  "Turning Tides"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {settings.navigation.showMainNav && (
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Navigation items={mainNavigation} language={language} />
              {settings.navigation.showLanguageSwitcher && (
                <LanguageSwitcher currentLanguage={language} />
              )}
            </div>
          )}

          {/* Custom Menu Items */}
          {settings.navigation.customMenuItems &&
            settings.navigation.customMenuItems.length > 0 && (
              <div className="hidden md:flex md:items-center md:space-x-4">
                {settings.navigation.customMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    target={item.target || "_self"}
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenuButton navigation={mainNavigation} language={language} />
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile Menu Component
function MobileMenuButton({
  navigation,
  language,
}: {
  navigation: any[];
  language: SupportedLanguage;
}) {
  return (
    <div className="relative">
      <button className="p-2">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
