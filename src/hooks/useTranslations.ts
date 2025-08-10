import { useState, useCallback } from "react";

interface Translation {
  languageId: string;
  title: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export function useTranslations(initialTranslations: Translation[] = []) {
  const [translations, setTranslations] = useState<Translation[]>(
    initialTranslations.length > 0
      ? initialTranslations
      : [
          {
            languageId: "en",
            title: "",
            content: "",
            excerpt: "",
            seoTitle: "",
            seoDescription: "",
          },
        ]
  );

  const updateTranslation = useCallback(
    (languageId: string, data: Partial<Translation>) => {
      setTranslations((prev) =>
        prev.map((t) => (t.languageId === languageId ? { ...t, ...data } : t))
      );
    },
    []
  );

  const addTranslation = useCallback((languageId: string) => {
    const newTranslation: Translation = {
      languageId,
      title: "",
      content: "",
      excerpt: "",
      seoTitle: "",
      seoDescription: "",
    };
    setTranslations((prev) => [...prev, newTranslation]);
  }, []);

  const removeTranslation = useCallback((languageId: string) => {
    if (languageId === "en") {
      alert("Cannot remove the default language translation");
      return;
    }
    setTranslations((prev) => prev.filter((t) => t.languageId !== languageId));
  }, []);

  const getTranslation = useCallback(
    (languageId: string) => {
      return translations.find((t) => t.languageId === languageId);
    },
    [translations]
  );

  const hasValidTranslations = useCallback(() => {
    return translations.some((t) => t.title.trim() && t.content.trim());
  }, [translations]);

  return {
    translations,
    updateTranslation,
    addTranslation,
    removeTranslation,
    getTranslation,
    hasValidTranslations,
    setTranslations,
  };
}
