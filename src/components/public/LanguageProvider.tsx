"use client";

import { createContext, useContext, ReactNode } from "react";
import { SupportedLanguage } from "@/lib/public-api";

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
