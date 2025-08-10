/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useTemplates.ts
import { useState, useEffect } from "react";
import {
  Template,
  TemplateCategory,
  TemplateDifficulty,
} from "@/types/page-builder";

interface UseTemplatesOptions {
  page?: number;
  limit?: number;
  category?: TemplateCategory;
  difficulty?: TemplateDifficulty;
  search?: string;
  featured?: boolean;
  authorId?: string;
}

interface UseTemplatesResult {
  templates: Template[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: Array<{ category: TemplateCategory; count: number }>;
    difficulties: Array<{ difficulty: TemplateDifficulty; count: number }>;
    tags: Array<{ tag: string; count: number }>;
  };
  refetch: () => void;
}

export function useTemplates(
  options: UseTemplatesOptions = {}
): UseTemplatesResult {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    categories: [],
    difficulties: [],
    tags: [],
  });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (options.page) searchParams.set("page", options.page.toString());
      if (options.limit) searchParams.set("limit", options.limit.toString());
      if (options.category) searchParams.set("category", options.category);
      if (options.difficulty)
        searchParams.set("difficulty", options.difficulty);
      if (options.search) searchParams.set("search", options.search);
      if (options.featured) searchParams.set("isFeatured", "true");
      if (options.authorId) searchParams.set("authorId", options.authorId);

      const response = await fetch(
        `/api/admin/templates?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const data = await response.json();
      setTemplates(data.templates);
      setPagination(data.pagination);
      setFilters(data.filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [
    options.page,
    options.limit,
    options.category,
    options.difficulty,
    options.search,
    options.featured,
    options.authorId,
  ]);

  return {
    templates,
    loading,
    error,
    pagination,
    filters,
    refetch: fetchTemplates,
  };
}

// src/hooks/useTemplate.ts
interface UseTemplateResult {
  template: Template | null;
  loading: boolean;
  error: string | null;
  updateTemplate: (updates: Partial<Template>) => Promise<void>;
  deleteTemplate: () => Promise<void>;
  cloneTemplate: (name: string) => Promise<Template>;
  exportTemplate: () => Promise<void>;
}

export function useTemplate(templateId: string): UseTemplateResult {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/templates/${templateId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }

      const data = await response.json();
      setTemplate(data.template);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (updates: Partial<Template>) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update template");
      }

      const data = await response.json();
      setTemplate(data.template);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update template"
      );
    }
  };

  const deleteTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete template"
      );
    }
  };

  const cloneTemplate = async (name: string): Promise<Template> => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to clone template");
      }

      const data = await response.json();
      return data.template;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to clone template"
      );
    }
  };

  const exportTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}/export`);

      if (!response.ok) {
        throw new Error("Failed to export template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template?.name || "template"}_export.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to export template"
      );
    }
  };

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  return {
    template,
    loading,
    error,
    updateTemplate,
    deleteTemplate,
    cloneTemplate,
    exportTemplate,
  };
}

// src/hooks/useTemplateImport.ts
interface UseTemplateImportResult {
  importing: boolean;
  error: string | null;
  progress: number;
  importTemplate: (file: File) => Promise<Template>;
  previewTemplate: (file: File) => Promise<any>;
}

export function useTemplateImport(): UseTemplateImportResult {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const importTemplate = async (file: File): Promise<Template> => {
    try {
      setImporting(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append("template", file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/admin/templates/import", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import template");
      }

      const data = await response.json();
      return data.template;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
      throw err;
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const previewTemplate = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("template", file);

      const response = await fetch("/api/templates/preview", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to preview template");
      }

      const data = await response.json();
      return data.preview;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Preview failed");
    }
  };

  return {
    importing,
    error,
    progress,
    importTemplate,
    previewTemplate,
  };
}

// src/hooks/useTemplateReviews.ts
interface UseTemplateReviewsResult {
  reviews: any[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  addReview: (rating: number, comment?: string) => Promise<void>;
  refetch: () => void;
}

export function useTemplateReviews(
  templateId: string,
  page = 1,
  limit = 10
): UseTemplateReviewsResult {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/admin/templates/${templateId}/reviews?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (rating: number, comment?: string) => {
    try {
      const response = await fetch(
        `/api/admin/templates/${templateId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      // Refetch reviews after adding
      await fetchReviews();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to add review"
      );
    }
  };

  useEffect(() => {
    if (templateId) {
      fetchReviews();
    }
  }, [templateId, page, limit]);

  return {
    reviews,
    loading,
    error,
    pagination,
    addReview,
    refetch: fetchReviews,
  };
}

// src/hooks/useFeaturedTemplates.ts
export function useFeaturedTemplates(limit = 10) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/templates/featured?limit=${limit}`);

        if (!response.ok) {
          throw new Error("Failed to fetch featured templates");
        }

        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTemplates();
  }, [limit]);

  return { templates, loading, error };
}

// src/hooks/usePopularTemplates.ts
export function usePopularTemplates(limit = 10, timeframe = "30d") {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/templates/popular?limit=${limit}&timeframe=${timeframe}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch popular templates");
        }

        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTemplates();
  }, [limit, timeframe]);

  return { templates, loading, error };
}

// src/hooks/useTemplateSearch.ts
export function useTemplateSearch() {
  const [results, setResults] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTemplates = async (query: string, limit = 20) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/templates/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to search templates");
      }

      const data = await response.json();
      setResults(data.templates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    searchTemplates,
    clearResults,
  };
}
