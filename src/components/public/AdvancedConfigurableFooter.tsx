/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { FooterSettings } from "@/types/layout-settings";
import { SupportedLanguage } from "@/lib/public-api";

interface AdvancedConfigurableFooterProps {
  language: SupportedLanguage;
  settings: FooterSettings;
  siteSettings?: any;
  footerNavigation?: any[];
  categories?: any[];
}

export function AdvancedConfigurableFooter({
  language,
  settings,
  siteSettings,
  footerNavigation = [],
  categories = [],
}: AdvancedConfigurableFooterProps) {
  if (!settings.enabled || settings.type === "none") {
    return null;
  }

  if (settings.type === "custom" && settings.customContent) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: settings.customContent }}
        className="configurable-footer"
      />
    );
  }

  const currentYear = new Date().getFullYear();
  const prefix = language === "en" ? "" : `/${language}`;

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
  const footerStyles = {
    backgroundColor: settings.style.backgroundColor,
    color: settings.style.textColor,
    ...getAdvancedStyles(),
  };

  return (
    <footer className="configurable-footer" style={footerStyles}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-bold">
                {siteSettings?.siteName || "Turning Tides"}
              </span>
            </div>
            <p className="text-sm mb-6 opacity-80">
              {siteSettings?.siteDescription ||
                "Premier rehabilitation and treatment facility"}
            </p>

            {/* Contact Info */}
            {settings.content.showContactInfo && (
              <div className="space-y-2 text-sm opacity-80">
                {siteSettings?.address && (
                  <p className="flex items-start">
                    <span className="w-5 h-5 mr-2 mt-0.5">📍</span>
                    {siteSettings.address}
                  </p>
                )}
                {siteSettings?.contactPhone && (
                  <p className="flex items-center">
                    <span className="w-5 h-5 mr-2">📞</span>
                    {siteSettings.contactPhone}
                  </p>
                )}
                {siteSettings?.contactEmail && (
                  <p className="flex items-center">
                    <span className="w-5 h-5 mr-2">✉️</span>
                    {siteSettings.contactEmail}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          {settings.content.showQuickLinks && (
            <div>
              <h3 className="font-semibold mb-4">
                {language === "en" ? "Quick Links" : "Tautan Cepat"}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`${prefix}/articles`}
                    className="text-sm hover:opacity-80 transition-opacity"
                  >
                    {language === "en" ? "Articles" : "Artikel"}
                  </Link>
                </li>
                {categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`${prefix}/${category.slug}`}
                      className="text-sm hover:opacity-80 transition-opacity"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Navigation */}
          {settings.content.showLegalLinks && (
            <div>
              <h3 className="font-semibold mb-4">
                {language === "en" ? "Legal" : "Legal"}
              </h3>
              <ul className="space-y-2">
                {footerNavigation.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url || "#"}
                      className="text-sm hover:opacity-80 transition-opacity"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Custom Sections */}
          {settings.content.customSections &&
            settings.content.customSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.url}
                        className="text-sm hover:opacity-80 transition-opacity"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-opacity-20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-60">
              © {currentYear}{" "}
              {siteSettings?.siteName || "Turning Tides Facility"}.
              {language === "en"
                ? " All rights reserved."
                : " Semua hak dilindungi."}
            </p>

            {/* Social Links */}
            {settings.content.showSocialLinks && (
              <div className="flex space-x-4 mt-4 md:mt-0">
                {siteSettings?.socialLinks?.facebook && (
                  <a
                    href={siteSettings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
