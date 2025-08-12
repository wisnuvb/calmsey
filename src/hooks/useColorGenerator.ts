// src/hooks/useColorGenerator.ts
"use client";

import { useState, useCallback } from "react";
import {
  ColorGenerator,
  AccessibilityInfo,
  ColorHarmony,
} from "@/lib/colors/color-generator";
import { ColorPalette, BrandkitColors } from "@/types/brandkit";

export interface UseColorGeneratorReturn {
  // State
  isGenerating: boolean;
  lastGeneratedPalette: ColorPalette | null;
  lastGeneratedHarmony: ColorHarmony | null;

  // Methods
  generatePalette: (baseColor: string) => ColorPalette;
  generateHarmony: (baseColor: string) => ColorHarmony;
  generateBrandkitColors: (primaryColor: string) => BrandkitColors;
  checkAccessibility: (
    foreground: string,
    background: string
  ) => AccessibilityInfo;
  suggestAccessibleColor: (
    targetColor: string,
    backgroundColor: string,
    targetContrast?: number
  ) => string;

  // Color manipulation
  lighten: (color: string, percentage: number) => string;
  darken: (color: string, percentage: number) => string;
  adjustSaturation: (color: string, percentage: number) => string;
  blendColors: (color1: string, color2: string, ratio?: number) => string;

  // Utilities
  isValidHexColor: (hex: string) => boolean;
  getBestTextColor: (backgroundColor: string) => string;
  getRandomColor: () => string;

  // Async operations
  generatePaletteAsync: (baseColor: string) => Promise<ColorPalette>;
  generateBrandkitColorsAsync: (
    primaryColor: string
  ) => Promise<BrandkitColors>;
}

export function useColorGenerator(): UseColorGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedPalette, setLastGeneratedPalette] =
    useState<ColorPalette | null>(null);
  const [lastGeneratedHarmony, setLastGeneratedHarmony] =
    useState<ColorHarmony | null>(null);

  // Basic color generation methods
  const generatePalette = useCallback((baseColor: string): ColorPalette => {
    const palette = ColorGenerator.generatePalette(baseColor);
    setLastGeneratedPalette(palette);
    return palette;
  }, []);

  const generateHarmony = useCallback((baseColor: string): ColorHarmony => {
    const harmony = ColorGenerator.generateColorHarmony(baseColor);
    setLastGeneratedHarmony(harmony);
    return harmony;
  }, []);

  const generateBrandkitColors = useCallback(
    (primaryColor: string): BrandkitColors => {
      return ColorGenerator.generateBrandkitColors(primaryColor);
    },
    []
  );

  // Accessibility methods
  const checkAccessibility = useCallback(
    (foreground: string, background: string): AccessibilityInfo => {
      return ColorGenerator.checkAccessibility(foreground, background);
    },
    []
  );

  const suggestAccessibleColor = useCallback(
    (
      targetColor: string,
      backgroundColor: string,
      targetContrast: number = 4.5
    ): string => {
      return ColorGenerator.suggestAccessibleColor(
        targetColor,
        backgroundColor,
        targetContrast
      );
    },
    []
  );

  // Color manipulation methods
  const lighten = useCallback((color: string, percentage: number): string => {
    return ColorGenerator.lighten(color, percentage);
  }, []);

  const darken = useCallback((color: string, percentage: number): string => {
    return ColorGenerator.darken(color, percentage);
  }, []);

  const adjustSaturation = useCallback(
    (color: string, percentage: number): string => {
      return ColorGenerator.adjustSaturation(color, percentage);
    },
    []
  );

  const blendColors = useCallback(
    (color1: string, color2: string, ratio: number = 0.5): string => {
      return ColorGenerator.blendColors(color1, color2, ratio);
    },
    []
  );

  // Utility methods
  const isValidHexColor = useCallback((hex: string): boolean => {
    return ColorGenerator.isValidHexColor(hex);
  }, []);

  const getBestTextColor = useCallback((backgroundColor: string): string => {
    return ColorGenerator.getBestTextColor(backgroundColor);
  }, []);

  const getRandomColor = useCallback((): string => {
    return ColorGenerator.getRandomColor();
  }, []);

  // Async operations with loading states
  const generatePaletteAsync = useCallback(
    async (baseColor: string): Promise<ColorPalette> => {
      setIsGenerating(true);

      try {
        // Simulate async operation for better UX
        await new Promise((resolve) => setTimeout(resolve, 100));

        const palette = ColorGenerator.generatePalette(baseColor);
        setLastGeneratedPalette(palette);

        return palette;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const generateBrandkitColorsAsync = useCallback(
    async (primaryColor: string): Promise<BrandkitColors> => {
      setIsGenerating(true);

      try {
        // Simulate async operation for better UX
        await new Promise((resolve) => setTimeout(resolve, 300));

        const brandkitColors =
          ColorGenerator.generateBrandkitColors(primaryColor);

        return brandkitColors;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    // State
    isGenerating,
    lastGeneratedPalette,
    lastGeneratedHarmony,

    // Methods
    generatePalette,
    generateHarmony,
    generateBrandkitColors,
    checkAccessibility,
    suggestAccessibleColor,

    // Color manipulation
    lighten,
    darken,
    adjustSaturation,
    blendColors,

    // Utilities
    isValidHexColor,
    getBestTextColor,
    getRandomColor,

    // Async operations
    generatePaletteAsync,
    generateBrandkitColorsAsync,
  };
}
