// src/components/admin/TranslationTabs.tsx
"use client";

import { useState, useEffect } from "react";
import {
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { TinyMCEEditor } from "./TinyMCEEditor";

interface Language {
  id: string;
  name: string;
  flag?: string;
  isDefault: boolean;
  isActive: boolean;
}

interface Translation {
  languageId: string;
  title: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface TranslationTabsProps {
  translations: Translation[];
  onUpdateTranslation: (languageId: string, data: Partial<Translation>) => void;
  onAddTranslation: (languageId: string) => void;
  onRemoveTranslation: (languageId: string) => void;
  contentType?: "article" | "page" | "category";
  children?: (
    activeLanguage: string,
    translation: Translation | null
  ) => React.ReactNode;
}

export default function TranslationTabs({
  translations,
  onUpdateTranslation,
  onAddTranslation,
  onRemoveTranslation,
  contentType = "article",
  children,
}: TranslationTabsProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    // Set default active language
    if (languages.length > 0 && !activeLanguage) {
      const defaultLang = languages.find((l) => l.isDefault);
      const firstTranslation = translations[0];
      setActiveLanguage(
        defaultLang?.id || firstTranslation?.languageId || languages[0].id
      );
    }
  }, [languages, translations, activeLanguage]);

  const fetchLanguages = async () => {
    try {
      const response = await fetch("/api/admin/languages?limit=200");
      const data = await response.json();
      setLanguages(data.data.filter((lang: Language) => lang.isActive) || []);
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    }
  };

  const getTranslation = (languageId: string) => {
    return translations.find((t) => t.languageId === languageId);
  };

  const getLanguageStatus = (languageId: string) => {
    const translation = getTranslation(languageId);

    if (!translation) return "missing";
    if (!translation.title || !translation.content) return "incomplete";
    return "complete";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "incomplete":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return (
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  const getStatusColor = (languageId: string) => {
    const status = getLanguageStatus(languageId);
    if (languageId === activeLanguage) {
      return status === "complete"
        ? "border-green-500 bg-green-50 text-green-700"
        : status === "incomplete"
        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
        : "border-blue-500 bg-blue-50 text-blue-700";
    }

    return status === "complete"
      ? "border-green-200 text-green-600 hover:border-green-300"
      : status === "incomplete"
      ? "border-yellow-200 text-yellow-600 hover:border-yellow-300"
      : "border-gray-200 text-gray-500 hover:border-gray-300";
  };

  const availableLanguages = languages.filter(
    (lang) => !translations.some((t) => t.languageId === lang.id)
  );

  const activeTranslation = getTranslation(activeLanguage);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Language Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-1">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
            <div className="flex flex-wrap gap-2">
              {translations.map((translation) => {
                const language = languages.find(
                  (l) => l.id === translation.languageId
                );
                if (!language) return null;

                return (
                  <button
                    key={translation.languageId}
                    onClick={() => setActiveLanguage(translation.languageId)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border transition-colors ${getStatusColor(
                      translation.languageId
                    )}`}
                  >
                    {language.flag && (
                      <span className="mr-2">{language.flag}</span>
                    )}
                    <span>{language.name}</span>
                    <span className="ml-2">
                      {getStatusIcon(getLanguageStatus(translation.languageId))}
                    </span>
                    {language.isDefault && (
                      <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                        Default
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Translation Button */}
          {availableLanguages.length > 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Translation
            </button>
          )}
        </div>

        {/* Translation Status Summary */}
        <div className="px-6 py-2 bg-gray-50 text-sm text-gray-600">
          {translations.length} of {languages.length} languages configured
          {translations.length < languages.length && (
            <span className="ml-2 text-yellow-600">
              • {languages.length - translations.length} missing
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTranslation ? (
          children ? (
            children(activeLanguage, activeTranslation)
          ) : (
            <DefaultTranslationForm
              language={languages.find((l) => l.id === activeLanguage)}
              translation={activeTranslation}
              onUpdate={(data) => onUpdateTranslation(activeLanguage, data)}
              onRemove={() => {
                onRemoveTranslation(activeLanguage);
                // Switch to another language if available
                const remainingTranslations = translations.filter(
                  (t) => t.languageId !== activeLanguage
                );
                if (remainingTranslations.length > 0) {
                  setActiveLanguage(remainingTranslations[0].languageId);
                }
              }}
              contentType={contentType}
            />
          )
        ) : (
          <div className="text-center py-12">
            <GlobeAltIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No translation selected
            </h3>
            <p className="text-gray-500">
              Choose a language tab or add a new translation.
            </p>
          </div>
        )}
      </div>

      {/* Add Translation Modal */}
      {showAddModal && (
        <AddTranslationModal
          availableLanguages={availableLanguages}
          onAdd={(languageId) => {
            onAddTranslation(languageId);
            setActiveLanguage(languageId);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

// Default Translation Form
function DefaultTranslationForm({
  language,
  translation,
  onUpdate,
  onRemove,
  contentType,
}: {
  language?: Language;
  translation: Translation;
  onUpdate: (data: Partial<Translation>) => void;
  onRemove: () => void;
  contentType: string;
}) {
  const canRemove = !language?.isDefault; // Can't remove default language translation

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      if (!data.success || !data.data || data.data.length === 0) {
        throw new Error("Upload failed: No file returned");
      }

      return data.data[0].url;
    } catch (err) {
      console.error("Image upload error:", err);
      throw err;
    }
  };

  // console.log(translation);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {language?.flag && (
            <span className="mr-2 text-lg">{language.flag}</span>
          )}
          <h3 className="text-lg font-medium text-gray-900">
            {language?.name} Translation
          </h3>
          {language?.isDefault && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Default Language
            </span>
          )}
        </div>

        {canRemove && (
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Remove Translation
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={translation.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${contentType} title in ${language?.name}`}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <TinyMCEEditor
            value={translation.content || ""}
            onChange={(content) => onUpdate({ content })}
            placeholder={`${contentType} content in ${language?.name}`}
            height={400}
            onImageUpload={handleImageUpload}
          />
        </div>

        {/* Excerpt (for articles/pages) */}
        {contentType !== "category" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={translation.excerpt || ""}
              onChange={(e) => onUpdate({ excerpt: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Brief description in ${language?.name}`}
            />
          </div>
        )}

        {/* SEO Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={translation.seoTitle || ""}
              onChange={(e) => onUpdate({ seoTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SEO optimized title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Description
            </label>
            <input
              type="text"
              value={translation.seoDescription || ""}
              onChange={(e) => onUpdate({ seoDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Meta description for search engines"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Translation Modal
function AddTranslationModal({
  availableLanguages,
  onAdd,
  onClose,
}: {
  availableLanguages: Language[];
  onAdd: (languageId: string) => void;
  onClose: () => void;
}) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter languages based on search query
  const filteredLanguages = availableLanguages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId)
        : [...prev, languageId]
    );
  };

  const handleAddSelected = () => {
    selectedLanguages.forEach((languageId) => {
      onAdd(languageId);
    });
    onClose();
  };

  const handleSelectAll = () => {
    if (selectedLanguages.length === filteredLanguages.length) {
      setSelectedLanguages([]);
    } else {
      setSelectedLanguages(filteredLanguages.map((lang) => lang.id));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add Translation</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Choose one or more languages to add translations:
          </p>

          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Select All Button */}
          {filteredLanguages.length > 0 && (
            <div className="mb-3">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedLanguages.length === filteredLanguages.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          )}

          {/* Language List */}
          <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <label
                  key={language.id}
                  className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={language.id}
                    checked={selectedLanguages.includes(language.id)}
                    onChange={() => handleLanguageToggle(language.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex items-center flex-1">
                    {language.flag && (
                      <span className="mr-2 text-lg">{language.flag}</span>
                    )}
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">
                        {language.name} ({language.id})
                      </span>
                      {/* <span className="text-xs text-gray-500">
                        {language.id}
                      </span> */}
                    </div>
                    {language.isDefault && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">
                  {searchQuery
                    ? "No languages found matching your search."
                    : "No languages available."}
                </p>
              </div>
            )}
          </div>

          {/* Results count and selection info */}
          <div className="mb-4 space-y-2">
            {searchQuery && (
              <div className="text-xs text-gray-500">
                Showing {filteredLanguages.length} of{" "}
                {availableLanguages.length} languages
              </div>
            )}
            {selectedLanguages.length > 0 && (
              <div className="text-xs text-blue-600 font-medium">
                {selectedLanguages.length} language
                {selectedLanguages.length > 1 ? "s" : ""} selected
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSelected}
              disabled={selectedLanguages.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add{" "}
              {selectedLanguages.length > 0
                ? `${selectedLanguages.length} Translation${
                    selectedLanguages.length > 1 ? "s" : ""
                  }`
                : "Translation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
