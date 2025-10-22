"use client";

import { useState, useEffect } from "react";

export interface ActiveLanguage {
  id: string;
  name: string;
  flag: string | null;
  isDefault: boolean;
}

interface UseActiveLanguagesReturn {
  languages: ActiveLanguage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useActiveLanguages(): UseActiveLanguagesReturn {
  const [languages, setLanguages] = useState<ActiveLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/public/languages");
      const data = await response.json();

      if (data.success) {
        setLanguages(data.data);
      } else {
        setError(data.error || "Failed to fetch languages");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return {
    languages,
    loading,
    error,
    refetch: fetchLanguages,
  };
}
