"use client";

import { useEffect, useState } from "react";
import { hexToLightTint } from "@/lib/image-color";

const DEFAULT_FALLBACK = "#e5e7eb";

export interface UseImageDominantColorOptions {
  /** Use light tint (95% lightness) for soft background. Default: true */
  asLightTint?: boolean;
  /** Fallback color when extraction fails. Default: #e5e7eb */
  fallback?: string;
  /** Enable/disable the hook. Default: true when imageUrl is non-empty */
  enabled?: boolean;
}

export interface UseImageDominantColorResult {
  /** Extracted color (hex) or fallback */
  color: string;
  /** True while extracting */
  loading: boolean;
  /** Error message if extraction failed */
  error: string | null;
}

/**
 * Extract dominant color from image URL for use as background.
 * Uses ColorThief (MMCQ algorithm) for accurate color extraction.
 *
 * @example
 * // In a component:
 * const { color, loading } = useImageDominantColor(imageUrl);
 * <div style={{ backgroundColor: color }}>...</div>
 *
 * @example
 * // With raw hex (no light tint):
 * const { color } = useImageDominantColor(imageUrl, { asLightTint: false });
 */
export function useImageDominantColor(
  imageUrl: string | undefined | null,
  options: UseImageDominantColorOptions = {}
): UseImageDominantColorResult {
  const {
    asLightTint = true,
    fallback = DEFAULT_FALLBACK,
    enabled = true,
  } = options;

  const [color, setColor] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl?.trim() || !enabled) {
      setColor(fallback);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const extractColor = async () => {
      try {
        const ColorThief = (await import("colorthief")).default;
        const colorThief = new ColorThief();

        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
          if (cancelled) return;
          try {
            const rgb = colorThief.getColor(img);
            const hexColor = `#${rgb
              .map((x: number) => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
              })
              .join("")}`;
            setColor(asLightTint ? hexToLightTint(hexColor) : hexColor);
          } catch (err) {
            if (!cancelled) {
              setError(err instanceof Error ? err.message : "Extraction failed");
              setColor(fallback);
            }
          } finally {
            if (!cancelled) setLoading(false);
          }
        };

        img.onerror = () => {
          if (!cancelled) {
            setError("Failed to load image");
            setColor(fallback);
            setLoading(false);
          }
        };
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Import failed");
          setColor(fallback);
          setLoading(false);
        }
      }
    };

    extractColor();

    return () => {
      cancelled = true;
    };
  }, [imageUrl, asLightTint, fallback, enabled]);

  return { color, loading, error };
}
