/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { PublicAPI, SupportedLanguage } from "@/lib/public-api";
import { Navigation } from "./Navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface PublicHeaderProps {
  language: SupportedLanguage;
}

export async function PublicHeader({ language }: PublicHeaderProps) {
  const [siteSettings, mainNavigation] = await Promise.all([
    PublicAPI.getSiteSettings(),
    PublicAPI.getNavigationMenu("main-navigation", language),
  ]);

  const homeUrl = language === "en" ? "/" : `/${language}`;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={homeUrl} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {siteSettings?.siteName || "Turning Tides"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Navigation items={mainNavigation} language={language} />
            <LanguageSwitcher currentLanguage={language} />
          </div>

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
      {/* This would be implemented with state management for mobile menu */}
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
