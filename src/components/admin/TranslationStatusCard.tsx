// src/components/admin/TranslationStatusCard.tsx
"use client";

import { worldLanguages } from "@/lib/world-languages.constants";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface TranslationStatus {
  total: number;
  languages: string[];
  complete?: number;
  isComplete?: boolean;
}

interface TranslationStatusCardProps {
  status: TranslationStatus;
  availableLanguages?: number;
  className?: string;
}

export default function TranslationStatusCard({
  status,
  availableLanguages = worldLanguages.length,
  className = "",
}: TranslationStatusCardProps) {
  const completionRate =
    availableLanguages > 0 ? (status.total / availableLanguages) * 100 : 0;

  const getStatusColor = () => {
    if (completionRate === 100)
      return "text-green-600 bg-green-50 border-green-200";
    if (completionRate >= 50)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusIcon = () => {
    if (completionRate === 100) return <CheckCircleIcon className="h-4 w-4" />;
    if (completionRate >= 50)
      return <ExclamationTriangleIcon className="h-4 w-4" />;
    return <XCircleIcon className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (completionRate === 100) return "Complete";
    if (completionRate >= 50) return "Partial";
    return "Missing";
  };

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span className="ml-1">
        {status.total}/{availableLanguages} {getStatusText()}
      </span>
    </div>
  );
}
