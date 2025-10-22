/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { HeaderSettings } from "@/types/layout-settings";
import { SupportedLanguage } from "@/lib/public-api";
import { Navigation } from "./Navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Image from "next/image";

interface AdvancedConfigurableHeaderProps {
  language: SupportedLanguage;
  settings: HeaderSettings;
  siteSettings?: any;
  mainNavigation?: any[];
}

export function AdvancedConfigurableHeader({
  language,
  settings,
  siteSettings,
  mainNavigation = [],
}: AdvancedConfigurableHeaderProps) {
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

  // Build header classes
  const headerClasses = [
    "configurable-header",
    settings.style.sticky ? "sticky top-0 z-50" : "",
    settings.style.transparent ? "bg-transparent" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Build advanced styles
  const getAdvancedStyles = () => {
    const advanced = settings.style.advanced;
    if (!advanced) return {};

    const styles: React.CSSProperties = {};

    // Background
    if (advanced.background) {
      if (advanced.background.type === "color" && advanced.background.color) {
        styles.backgroundColor = advanced.background.color;
      } else if (
        advanced.background.type === "gradient" &&
        advanced.background.gradient
      ) {
        const { direction, colors } = advanced.background.gradient;
        styles.background = `linear-gradient(${direction}, ${colors.join(
          ", "
        )})`;
      } else if (
        advanced.background.type === "image" &&
        advanced.background.image
      ) {
        styles.backgroundImage = `url(${advanced.background.image})`;
        styles.backgroundSize = "cover";
        styles.backgroundPosition = "center";
      }

      if (advanced.background.opacity !== undefined) {
        styles.opacity = advanced.background.opacity;
      }
    }

    // Typography
    if (advanced.typography) {
      if (advanced.typography.fontFamily) {
        styles.fontFamily = advanced.typography.fontFamily;
      }
      if (advanced.typography.fontSize) {
        styles.fontSize = `${advanced.typography.fontSize}px`;
      }
      if (advanced.typography.fontWeight) {
        styles.fontWeight = advanced.typography.fontWeight;
      }
      if (advanced.typography.lineHeight) {
        styles.lineHeight = advanced.typography.lineHeight;
      }
      if (advanced.typography.letterSpacing) {
        styles.letterSpacing = `${advanced.typography.letterSpacing}px`;
      }
    }

    // Spacing
    if (advanced.spacing) {
      if (advanced.spacing.padding) {
        const { top, right, bottom, left } = advanced.spacing.padding;
        styles.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      }
      if (advanced.spacing.margin) {
        const { top, right, bottom, left } = advanced.spacing.margin;
        styles.margin = `${top}px ${right}px ${bottom}px ${left}px`;
      }
    }

    // Border
    if (advanced.border) {
      if (advanced.border.width) {
        styles.borderWidth = `${advanced.border.width}px`;
        styles.borderStyle = advanced.border.style || "solid";
        if (advanced.border.color) {
          styles.borderColor = advanced.border.color;
        }
      }
      if (advanced.border.radius) {
        styles.borderRadius = `${advanced.border.radius}px`;
      }
    }

    // Shadow
    if (advanced.shadow?.enabled) {
      const { x, y, blur, spread, color } = advanced.shadow;
      styles.boxShadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
    }

    // Effects
    if (advanced.effects) {
      if (advanced.effects.backdropBlur) {
        styles.backdropFilter = `blur(${advanced.effects.backdropBlur}px)`;
      }
      if (advanced.effects.filter) {
        styles.filter = advanced.effects.filter;
      }
    }

    return styles;
  };

  // Combine basic and advanced styles
  const headerStyles = {
    backgroundColor: settings.style.backgroundColor,
    color: settings.style.textColor,
    ...getAdvancedStyles(),
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
