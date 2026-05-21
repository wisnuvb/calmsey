"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { SupportedLanguage } from "@/lib/public-api";
import {
  translatePage,
  toGoogleTranslateCode,
  scheduleGoogleTranslateWarmup,
} from "@/lib/browser-translate";
import {
  applyGlossaryToDocument,
  hasGlossary,
  removeGlossaryFromDocument,
  scheduleGlossaryReapply,
  stopGlossaryReapply,
} from "@/lib/glossary";

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

  useEffect(() => {
    scheduleGoogleTranslateWarmup();
  }, []);

  // Trigger browser translation when language changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const googleTranslateCode = toGoogleTranslateCode(language);

    let cancelled = false;
    let innerRaf = 0;
    const outerRaf = window.requestAnimationFrame(() => {
      innerRaf = window.requestAnimationFrame(async () => {
        if (cancelled) return;
        removeGlossaryFromDocument();
        stopGlossaryReapply();

        try {
          if (language !== "en" && hasGlossary(language)) {
            applyGlossaryToDocument(language);
          }

          await translatePage({
            targetLanguage: googleTranslateCode,
            sourceLanguage: "en",
          });

          if (!cancelled && language !== "en" && hasGlossary(language)) {
            scheduleGlossaryReapply(language);
          }
        } catch (error) {
          console.error("[LanguageProvider] Translation error:", error);
        }
      });
    });

    return () => {
      cancelled = true;
      stopGlossaryReapply();
      window.cancelAnimationFrame(outerRaf);
      if (innerRaf) window.cancelAnimationFrame(innerRaf);
    };
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
