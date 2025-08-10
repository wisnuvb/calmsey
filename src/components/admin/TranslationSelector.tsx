"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface Language {
  id: string;
  name: string;
  flag?: string;
}

interface Translation {
  languageId: string;
  title: string;
  content: string;
}

interface TranslationSelectorProps {
  translations: Translation[];
  languages: Language[];
  activeLanguage: string;
  onLanguageChange: (languageId: string) => void;
  showAddButton?: boolean;
  onAddTranslation?: () => void;
}

export default function TranslationSelector({
  translations,
  languages,
  activeLanguage,
  onLanguageChange,
  showAddButton = false,
  onAddTranslation,
}: TranslationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeLanguageObj = languages.find((l) => l.id === activeLanguage);
  const availableTranslations = translations
    .map((t) => languages.find((l) => l.id === t.languageId))
    .filter(Boolean);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {activeLanguageObj?.flag && (
          <span className="mr-2">{activeLanguageObj.flag}</span>
        )}
        <span>{activeLanguageObj?.name || "Select Language"}</span>
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            {availableTranslations.map((language) => {
              if (!language) return null;
              const translation = translations.find(
                (t) => t.languageId === language.id
              );
              const isComplete =
                translation && translation.title && translation.content;

              return (
                <button
                  key={language.id}
                  onClick={() => {
                    onLanguageChange(language.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                    activeLanguage === language.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    {language.flag && (
                      <span className="mr-2">{language.flag}</span>
                    )}
                    <span>{language.name}</span>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isComplete ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                </button>
              );
            })}

            {showAddButton && onAddTranslation && (
              <>
                <div className="border-t border-gray-200 my-1" />
                <button
                  onClick={() => {
                    onAddTranslation();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                >
                  + Add Translation
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
