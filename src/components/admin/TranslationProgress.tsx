"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { TranslationManager } from "@/lib/translation-utils";

interface Translation {
  languageId: string;
  title: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface Language {
  id: string;
  name: string;
  flag?: string;
}

interface TranslationProgressProps {
  translations: Translation[];
  languages: Language[];
  className?: string;
}

export default function TranslationProgress({
  translations,
  languages,
  className = "",
}: TranslationProgressProps) {
  const status = TranslationManager.getTranslationStatus(
    translations,
    languages.length
  );
  const missingLanguages = TranslationManager.getMissingLanguages(
    translations,
    languages.map((l) => l.id)
  );

  const getProgressColor = () => {
    if (status.percentage === 100) return "bg-green-500";
    if (status.percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = () => {
    if (status.percentage === 100) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    if (status.percentage >= 50) {
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    }
    return <ClockIcon className="h-5 w-5 text-red-500" />;
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 flex items-center">
          {getStatusIcon()}
          <span className="ml-2">Translation Progress</span>
        </h4>
        <span className="text-sm font-medium text-gray-600">
          {status.percentage}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${status.percentage}%` }}
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="text-center">
          <div className="font-semibold text-green-600">{status.complete}</div>
          <div className="text-gray-500">Complete</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-yellow-600">
            {status.incomplete}
          </div>
          <div className="text-gray-500">Incomplete</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-red-600">{status.missing}</div>
          <div className="text-gray-500">Missing</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600">{languages.length}</div>
          <div className="text-gray-500">Total</div>
        </div>
      </div>

      {/* Missing Languages Alert */}
      {missingLanguages.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h5 className="text-sm font-medium text-yellow-800 mb-1">
            Missing Translations
          </h5>
          <div className="flex flex-wrap gap-1">
            {missingLanguages.map((langId) => {
              const language = languages.find((l) => l.id === langId);
              return (
                <span
                  key={langId}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  {language?.flag && (
                    <span className="mr-1">{language.flag}</span>
                  )}
                  {language?.name || langId}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {status.percentage < 100 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            💡 Tip: Complete all translations to improve SEO and reach more
            audiences
          </p>
        </div>
      )}
    </div>
  );
}
