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
    if (typeof window !== "undefined") {
      const googleTranslateCode = toGoogleTranslateCode(language);

      // Use translatePage which handles both browser translation and Google Translate fallback
      translatePage({
        targetLanguage: googleTranslateCode,
        sourceLanguage: "en", // Content is always in English
      }).catch((error) => {
        console.error("[LanguageProvider] Translation error:", error);
      });
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
