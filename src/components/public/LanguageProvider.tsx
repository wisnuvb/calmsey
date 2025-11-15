"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { SupportedLanguage } from "@/lib/public-api";
import { translatePage, toGoogleTranslateCode } from "@/lib/browser-translate";

interface LanguageContextType {
  language: SupportedLanguage;
  isDefaultLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  language,
}: {
  children: ReactNode;
  language: SupportedLanguage;
}) {
  const value = {
    language,
    isDefaultLanguage: language === "en",
  };

  // Trigger browser translation when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const googleTranslateCode = toGoogleTranslateCode(language);

      // Set HTML lang attribute
      if (typeof document !== 'undefined') {
        document.documentElement.lang = googleTranslateCode;
      }

      // For non-English languages, force Google Translate for auto-translation
      if (language !== 'en') {
        // Dynamic import to avoid SSR issues
        import('@/lib/browser-translate').then(({ initGoogleTranslateWidget }) => {
          // Force Google Translate widget for automatic translation
          initGoogleTranslateWidget(googleTranslateCode);
        });
      } else {
        // Clear translation when switching back to English
        import('@/lib/browser-translate').then(({ clearTranslation }) => {
          clearTranslation();
        });
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
