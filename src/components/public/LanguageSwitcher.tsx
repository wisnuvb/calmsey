"use client";

import { LOCALE_COOKIE_NAME } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { SupportedLanguage } from "@/lib/public-api";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";
import { cn } from "@/lib/utils";
import { scheduleGoogleTranslateWarmup } from "@/lib/browser-translate";
import { getLanguageDisplayCode } from "@/lib/language-variant-flag";

interface LanguageSwitcherProps {
  currentLanguage: SupportedLanguage;
  isDark: boolean;
  /** Full-width trigger + menu for mobile drawer */
  variant?: "navbar" | "drawer";
}

export function LanguageSwitcher({
  currentLanguage,
  isDark,
  variant = "navbar",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { languages, loading, error } = useActiveLanguages();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const handleLanguageChange = (languageId: string, url: string) => {
    setOpen(false);
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(
      languageId
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
    // Reload dokumen penuh: state Google Translate + widget tidak reliable setelah
    // beberapa kali navigasi klien; reload memastikan locale & GT bersih setiap ganti bahasa.
    //
    // Di prod, middleware sering memakai URL tanpa prefix (rewrite ke /{locale}/...).
    // Beralih ke bahasa default menghasilkan href yang sama dengan pathname browser
    // (mis. tetap `/about-us`). `assign` ke URL identik sering tidak memicu fetch —
    // cookie sudah berubah tapi halaman tidak reload. Paksa reload bila path sama.
    const targetPath = new URL(url, window.location.origin).pathname;
    const currentPath = window.location.pathname;
    const norm = (p: string) =>
      p === "/" ? "/" : p.replace(/\/+$/, "") || "/";
    if (norm(targetPath) === norm(currentPath)) {
      window.location.reload();
    } else {
      window.location.assign(url);
    }
  };

  const getLanguageUrl = (languageId: string) => {
    const activeLanguageIds = languages.map((lang) => lang.id);

    const currentLangInPath = activeLanguageIds.find(
      (langId) =>
        pathname.startsWith(`/${langId}/`) || pathname === `/${langId}`
    );

    let pathWithoutLang = pathname;
    if (currentLangInPath) {
      pathWithoutLang = pathname.replace(`/${currentLangInPath}`, "");
    }

    if (pathWithoutLang === "") {
      pathWithoutLang = "/";
    }

    if (languageId === "en") {
      return pathWithoutLang === "/" ? "/" : pathWithoutLang;
    }

    const cleanPath = pathWithoutLang === "/" ? "" : pathWithoutLang;
    return `/${languageId}${cleanPath}`;
  };

  const currentLanguageInfo = languages.find(
    (lang) => lang.id === currentLanguage
  );

  const currentLanguageId = currentLanguageInfo?.id || currentLanguage;

  if (loading) {
    return (
      <div className="flex items-center space-x-1 text-gray-500 px-3 py-2 text-sm font-medium">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-1 text-red-500 px-3 py-2 text-sm font-medium">
        <span>Error loading languages</span>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative group notranslate",
        variant === "drawer" && "w-full",
      )}
      translate="no"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          scheduleGoogleTranslateWarmup();
          setOpen((o) => !o);
        }}
        className={cn(
          "flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md",
          variant === "drawer" &&
            "w-full justify-center bg-white text-[#3C62ED] hover:bg-white/90",
          variant !== "drawer" &&
            (isDark
              ? "text-white hover:text-gray-100"
              : "text-gray-700 hover:text-gray-600"),
        )}
      >
        <span className="uppercase">{currentLanguageId}</span>
        <svg
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={cn(
          "absolute mt-2 bg-white rounded-md shadow-lg transition-all duration-200 z-[60] border border-gray-200",
          variant === "navbar" && "right-0 w-48",
          variant === "drawer" && "left-0 right-0 w-auto",
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
        )}
      >
        <div className="py-1" role="listbox">
          {languages.map((language) => {
            const languageUrl = getLanguageUrl(language.id);
            return (
              <button
                key={language.id}
                type="button"
                role="option"
                aria-selected={language.id === currentLanguage}
                onClick={() => handleLanguageChange(language.id, languageUrl)}
                className={`w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 ${
                  language.id === currentLanguage
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-flex min-w-[2rem] shrink-0 text-xs font-semibold uppercase text-gray-500 notranslate"
                    aria-hidden
                  >
                    {getLanguageDisplayCode(language.id)}
                  </span>
                  <span>{language.name}</span>
                  {language.isDefault && (
                    <span className="text-xs text-gray-500">(Default)</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
