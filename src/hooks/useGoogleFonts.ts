"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GoogleFont,
  GoogleFontCategory,
  GoogleFontsService,
} from "@/lib/fonts/google-fonts";

interface UseGoogleFontsOptions {
  category?: GoogleFontCategory;
  preloadPopular?: boolean;
  limit?: number;
}

export function useGoogleFonts(options: UseGoogleFontsOptions = {}) {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedFonts, setLoadedFonts] = useState<string[]>([]);

  const { category, preloadPopular = true, limit } = options;

  // Load fonts list
  useEffect(() => {
    const loadFonts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fontList = await GoogleFontsService.getFonts(category);
        const limitedFonts = limit ? fontList.slice(0, limit) : fontList;
        setFonts(limitedFonts);

        // Preload popular fonts
        if (preloadPopular && !category) {
          const popularFonts = limitedFonts.slice(0, 5);
          popularFonts.forEach((font) => {
            GoogleFontsService.preloadFont(font.family, ["400"]);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load fonts");
      } finally {
        setIsLoading(false);
      }
    };

    loadFonts();
  }, [category, preloadPopular, limit]);

  // Load specific font
  const loadFont = useCallback(
    async (
      fontFamily: string,
      weights: string[] = ["400"],
      styles: string[] = ["normal"]
    ) => {
      try {
        await GoogleFontsService.loadFont(fontFamily, weights, styles);
        setLoadedFonts((prev) => [...prev, fontFamily]);
        return true;
      } catch (error) {
        console.error("Failed to load font:", fontFamily, error);
        return false;
      }
    },
    []
  );

  // Check if font is loaded
  const isFontLoaded = useCallback(
    (fontFamily: string) => {
      return (
        loadedFonts.includes(fontFamily) ||
        GoogleFontsService.isFontLoaded(fontFamily)
      );
    },
    [loadedFonts]
  );

  // Get fonts by category
  const getFontsByCategory = useCallback(
    async (targetCategory: GoogleFontCategory) => {
      return GoogleFontsService.getFonts(targetCategory);
    },
    []
  );

  return {
    fonts,
    isLoading,
    error,
    loadedFonts,
    loadFont,
    isFontLoaded,
    getFontsByCategory,
    clearCache: GoogleFontsService.clearCache,
    commonWeights: GoogleFontsService.getCommonWeights(),
    commonStyles: GoogleFontsService.getCommonStyles(),
  };
}
