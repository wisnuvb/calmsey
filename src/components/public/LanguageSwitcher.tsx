"use client";

import { usePathname } from "next/navigation";
import { SupportedLanguage } from "@/lib/public-api";
import { useActiveLanguages } from "@/hooks/useActiveLanguages";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLanguage: SupportedLanguage;
  isDark: boolean;
}

export function LanguageSwitcher({
  currentLanguage,
  isDark,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { languages, loading, error } = useActiveLanguages();

  // Handle language change with page reload for stability
  const handleLanguageChange = (languageId: string, url: string) => {
    // Use full page reload to ensure LanguageProvider triggers correctly
    // This ensures Google Translate is properly initialized with the new language
    window.location.href = url;
  };

  const getLanguageUrl = (languageId: string) => {
    // Get all active language IDs
    const activeLanguageIds = languages.map((lang) => lang.id);

    // Find the current language in the pathname
    const currentLangInPath = activeLanguageIds.find(
      (langId) =>
        pathname.startsWith(`/${langId}/`) || pathname === `/${langId}`
    );

    // Remove current language from pathname
    let pathWithoutLang = pathname;
    if (currentLangInPath) {
      pathWithoutLang = pathname.replace(`/${currentLangInPath}`, "");
    }

    // Clean up path - handle empty string case
    if (pathWithoutLang === "") {
      pathWithoutLang = "/";
    }

    if (languageId === "en") {
      return pathWithoutLang === "/" ? "/" : pathWithoutLang;
    }

    // Handle trailing slash issue
    const cleanPath = pathWithoutLang === "/" ? "" : pathWithoutLang;
    return `/${languageId}${cleanPath}`;
  };

  // Find current language info
  const currentLanguageInfo = languages.find(
    (lang) => lang.id === currentLanguage
  );

  const currentLanguageId = currentLanguageInfo?.id || currentLanguage;

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center space-x-1 text-gray-500 px-3 py-2 text-sm font-medium">
        <span>Loading...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center space-x-1 text-red-500 px-3 py-2 text-sm font-medium">
        <span>Error loading languages</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        className={cn(
          "flex items-center space-x-1 px-3 py-2 text-sm font-medium",
          isDark
            ? "text-white hover:text-gray-100"
            : "text-gray-700 hover:text-gray-600"
        )}
      >
        <span className="uppercase">{currentLanguageId}</span>
        <svg
          className="h-4 w-4"
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
          "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
        )}
      >
        <div className="py-1">
          {languages.map((language) => {
            const languageUrl = getLanguageUrl(language.id);
            return (
              <button
                key={language.id}
                onClick={() => handleLanguageChange(language.id, languageUrl)}
                className={`w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 ${
                  language.id === currentLanguage
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {language.flag && (
                    <span className="text-lg">{language.flag}</span>
                  )}
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
