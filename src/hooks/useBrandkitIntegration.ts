"use client";

import { useState, useEffect, useCallback } from "react";
import { Brandkit } from "@/types/brandkit";
import { BrandkitApplicationResult } from "@/lib/page-builder/page-brandkit-integration";

interface UseBrandkitIntegrationProps {
  pageId: string;
}

export function useBrandkitIntegration({
  pageId,
}: UseBrandkitIntegrationProps) {
  const [currentBrandkit, setCurrentBrandkit] = useState<Brandkit | null>(null);
  const [availableBrandkits, setAvailableBrandkits] = useState<Brandkit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] =
    useState<BrandkitApplicationResult | null>(null);

  // Load current brandkit
  const loadCurrentBrandkit = useCallback(async () => {
    if (!pageId) return;

    try {
      const response = await fetch(`/api/pages/${pageId}/brandkit`);
      if (response.ok) {
        const data = await response.json();
        setCurrentBrandkit(data.brandkit);
      }
    } catch (error) {
      console.error("Failed to load current brandkit:", error);
    }
  }, [pageId]);

  // Load available brandkits
  const loadAvailableBrandkits = useCallback(async () => {
    try {
      const response = await fetch("/api/brandkits");
      if (response.ok) {
        const data = await response.json();
        setAvailableBrandkits(data.brandkits || []);
      }
    } catch (error) {
      console.error("Failed to load available brandkits:", error);
    }
  }, []);

  // Apply brandkit to page
  const applyBrandkit = useCallback(
    async (
      brandkitId: string,
      options: {
        sectionIds?: string[];
        preserveCustomizations?: boolean;
        applyColors?: boolean;
        applyTypography?: boolean;
        applySpacing?: boolean;
        applyResponsive?: boolean;
        conflictResolution?: "overwrite" | "merge" | "skip";
        dryRun?: boolean;
      } = {}
    ): Promise<BrandkitApplicationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/pages/${pageId}/brandkit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brandkitId,
            sectionIds: options.sectionIds,
            options: {
              preserveCustomizations: options.preserveCustomizations ?? true,
              applyColors: options.applyColors ?? true,
              applyTypography: options.applyTypography ?? true,
              applySpacing: options.applySpacing ?? true,
              applyResponsive: options.applyResponsive ?? true,
              conflictResolution: options.conflictResolution ?? "merge",
            },
            dryRun: options.dryRun ?? false,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to apply brandkit");
        }

        const result = await response.json();
        setLastResult(result);

        // Reload current brandkit if application was successful and not a dry run
        if (result.success && !options.dryRun) {
          await loadCurrentBrandkit();
        }

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to apply brandkit";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [pageId, loadCurrentBrandkit]
  );

  // Remove brandkit from page
  const removeBrandkit = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pages/${pageId}/brandkit`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove brandkit");
      }

      setCurrentBrandkit(null);
      setLastResult(null);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove brandkit";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  // Validate brandkit compatibility
  const validateCompatibility = useCallback(
    async (brandkitId: string) => {
      try {
        const response = await fetch(`/api/pages/${pageId}/brandkit/validate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandkitId }),
        });

        if (response.ok) {
          return await response.json();
        }

        return {
          compatible: false,
          issues: ["Failed to validate"],
          suggestions: [],
        };
      } catch (error) {
        console.error("Failed to validate compatibility:", error);
        return {
          compatible: false,
          issues: ["Failed to validate"],
          suggestions: [],
        };
      }
    },
    [pageId]
  );

  // Preview brandkit changes
  const previewChanges = useCallback(
    async (
      brandkitId: string,
      options: Parameters<typeof applyBrandkit>[1] = {}
    ): Promise<BrandkitApplicationResult> => {
      return applyBrandkit(brandkitId, { ...options, dryRun: true });
    },
    [applyBrandkit]
  );

  // Load data on mount
  useEffect(() => {
    loadCurrentBrandkit();
    loadAvailableBrandkits();
  }, [loadCurrentBrandkit, loadAvailableBrandkits]);

  return {
    // State
    currentBrandkit,
    availableBrandkits,
    isLoading,
    error,
    lastResult,

    // Actions
    applyBrandkit,
    removeBrandkit,
    validateCompatibility,
    previewChanges,
    refreshBrandkits: loadAvailableBrandkits,
    refreshCurrentBrandkit: loadCurrentBrandkit,
  };
}
