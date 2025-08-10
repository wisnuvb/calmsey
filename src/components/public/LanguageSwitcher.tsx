"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SupportedLanguage, SUPPORTED_LANGUAGES } from "@/lib/public-api";

interface LanguageSwitcherProps {
  currentLanguage: SupportedLanguage;
}

export function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const getLanguageUrl = (language: SupportedLanguage) => {
    // Remove current language prefix from pathname
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, "") || "/";

    if (language === "en") {
      return pathWithoutLang === "/" ? "/" : pathWithoutLang;
    }

    return `/${language}${pathWithoutLang}`;
  };

  const languageNames = {
    en: "English",
    id: "Bahasa Indonesia",
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
        <span>{languageNames[currentLanguage]}</span>
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

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-1">
          {SUPPORTED_LANGUAGES.map((language) => (
            <Link
              key={language}
              href={getLanguageUrl(language)}
              className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                language === currentLanguage
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700"
              }`}
            >
              {languageNames[language]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
