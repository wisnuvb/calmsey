// src/lib/colors/color-generator.ts
import { ColorPalette, BrandkitColors } from "@/types/brandkit";

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ColorHarmony {
  primary: string;
  complementary: string;
  analogous: string[];
  triadic: string[];
  splitComplementary: string[];
  tetradic: string[];
}

export interface AccessibilityInfo {
  contrastRatio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  recommendation: "pass" | "warning" | "fail";
}

export class ColorGenerator {
  /**
   * Generate a complete color palette from a single color (Tailwind-style)
   */
  static generatePalette(baseColor: string): ColorPalette {
    const hsl = this.hexToHSL(baseColor);

    return {
      50: this.generateShade(hsl, 95),
      100: this.generateShade(hsl, 90),
      200: this.generateShade(hsl, 80),
      300: this.generateShade(hsl, 70),
      400: this.generateShade(hsl, 60),
      500: baseColor, // Base color
      600: this.generateShade(hsl, 45),
      700: this.generateShade(hsl, 35),
      800: this.generateShade(hsl, 25),
      900: this.generateShade(hsl, 15),
      950: this.generateShade(hsl, 10),
    };
  }

  /**
   * Generate color harmonies from base color
   */
  static generateColorHarmony(baseColor: string): ColorHarmony {
    const hsl = this.hexToHSL(baseColor);

    return {
      primary: baseColor,
      complementary: this.HSLToHex({
        h: (hsl.h + 180) % 360,
        s: hsl.s,
        l: hsl.l,
      }),
      analogous: [
        this.HSLToHex({ h: (hsl.h - 30 + 360) % 360, s: hsl.s, l: hsl.l }),
        this.HSLToHex({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l }),
      ],
      triadic: [
        this.HSLToHex({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }),
        this.HSLToHex({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l }),
      ],
      splitComplementary: [
        this.HSLToHex({ h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l }),
        this.HSLToHex({ h: (hsl.h + 210) % 360, s: hsl.s, l: hsl.l }),
      ],
      tetradic: [
        this.HSLToHex({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }),
        this.HSLToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
        this.HSLToHex({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l }),
      ],
    };
  }

  /**
   * Generate complete brandkit colors from primary color
   */
  static generateBrandkitColors(primaryColor: string): BrandkitColors {
    const harmony = this.generateColorHarmony(primaryColor);
    const primaryPalette = this.generatePalette(primaryColor);

    // Generate secondary color (analogous to primary)
    const secondaryColor = harmony.analogous[0];
    const secondaryPalette = this.generatePalette(secondaryColor);

    // Generate semantic colors with appropriate hues
    // const successColor = this.HSLToHex({ h: 142, s: 70, l: 45 }); // Green
    // const warningColor = this.HSLToHex({ h: 38, s: 92, l: 50 }); // Orange
    // const errorColor = this.HSLToHex({ h: 0, s: 84, l: 60 }); // Red
    // const infoColor = this.HSLToHex({ h: 200, s: 94, l: 86 }); // Blue

    return {
      primary: primaryPalette as BrandkitColors["primary"],
      secondary: secondaryPalette as BrandkitColors["secondary"],
      neutral: this.generateNeutralPalette() as BrandkitColors["neutral"],
      accent: this.generatePalette("#000000") as BrandkitColors["accent"],
      semantic: {
        success: { light: "#d1fae5", main: "#10b981", dark: "#065f46" },
        warning: { light: "#fef3c7", main: "#f59e0b", dark: "#92400e" },
        error: { light: "#fee2e2", main: "#ef4444", dark: "#991b1b" },
        info: { light: "#dbeafe", main: "#3b82f6", dark: "#1e40af" },
      },
    };
  }

  /**
   * Check color accessibility (WCAG compliance)
   */
  static checkAccessibility(
    foreground: string,
    background: string
  ): AccessibilityInfo {
    const contrastRatio = this.getContrastRatio(foreground, background);

    return {
      contrastRatio: Math.round(contrastRatio * 100) / 100,
      wcagAA: contrastRatio >= 4.5,
      wcagAAA: contrastRatio >= 7,
      recommendation:
        contrastRatio >= 7 ? "pass" : contrastRatio >= 4.5 ? "warning" : "fail",
    };
  }

  /**
   * Get contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Generate accessible color pairs
   */
  static generateAccessiblePairs(baseColor: string): Array<{
    foreground: string;
    background: string;
    accessibility: AccessibilityInfo;
  }> {
    const palette = this.generatePalette(baseColor);
    const pairs: Array<{
      foreground: string;
      background: string;
      accessibility: AccessibilityInfo;
    }> = [];

    // Test various combinations
    const backgrounds = [
      palette[50],
      palette[100],
      palette[900],
      palette[950],
      "#ffffff",
      "#000000",
    ];
    const foregrounds = [
      palette[500],
      palette[600],
      palette[700],
      palette[800],
      palette[900],
      "#ffffff",
      "#000000",
    ];

    backgrounds.forEach((bg) => {
      foregrounds.forEach((fg) => {
        if (bg !== fg) {
          const accessibility = this.checkAccessibility(
            fg as string,
            bg as string
          );
          if (accessibility.wcagAA) {
            pairs.push({
              foreground: fg as string,
              background: bg as string,
              accessibility,
            });
          }
        }
      });
    });

    return pairs.sort(
      (a, b) => b.accessibility.contrastRatio - a.accessibility.contrastRatio
    );
  }

  /**
   * Suggest color improvements for accessibility
   */
  static suggestAccessibleColor(
    targetColor: string,
    backgroundColor: string,
    targetContrast: number = 4.5
  ): string {
    // const bgHSL = this.hexToHSL(backgroundColor);
    const targetHSL = this.hexToHSL(targetColor);

    // Determine if we need to lighten or darken
    const bgLuminance = this.getLuminance(backgroundColor);
    const shouldLighten = bgLuminance < 0.5;

    const adjustedHSL = { ...targetHSL };

    // Binary search for optimal lightness
    let low = shouldLighten ? targetHSL.l : 0;
    let high = shouldLighten ? 100 : targetHSL.l;
    let bestColor = targetColor;
    let bestContrast = this.getContrastRatio(targetColor, backgroundColor);

    for (let i = 0; i < 20; i++) {
      // Max 20 iterations
      const mid = (low + high) / 2;
      adjustedHSL.l = mid;

      const testColor = this.HSLToHex(adjustedHSL);
      const contrast = this.getContrastRatio(testColor, backgroundColor);

      if (contrast >= targetContrast && contrast > bestContrast) {
        bestColor = testColor;
        bestContrast = contrast;
      }

      if (contrast < targetContrast) {
        if (shouldLighten) {
          low = mid;
        } else {
          high = mid;
        }
      } else {
        if (shouldLighten) {
          high = mid;
        } else {
          low = mid;
        }
      }
    }

    return bestColor;
  }

  // Color conversion utilities

  static hexToHSL(hex: string): HSLColor {
    const rgb = this.hexToRGB(hex);
    return this.RGBToHSL(rgb);
  }

  static hexToRGB(hex: string): RGBColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  static RGBToHSL(rgb: RGBColor): HSLColor {
    const { r, g, b } = rgb;

    // Convert RGB to 0-1 range
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;

    // Calculate lightness
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (diff !== 0) {
      // Calculate saturation
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      // Calculate hue
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / diff + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / diff + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  static HSLToHex(hsl: HSLColor): string {
    const rgb = this.HSLToRGB(hsl);
    return this.RGBToHex(rgb);
  }

  static HSLToRGB(hsl: HSLColor): RGBColor {
    const { h, s, l } = hsl;

    // Convert to 0-1 range
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;

    if (sNorm === 0) {
      // Achromatic (grey)
      const val = Math.round(lNorm * 255);
      return { r: val, g: val, b: val };
    }

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;

    const r = hue2rgb(p, q, hNorm + 1 / 3);
    const g = hue2rgb(p, q, hNorm);
    const b = hue2rgb(p, q, hNorm - 1 / 3);

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  static RGBToHex(rgb: RGBColor): string {
    const { r, g, b } = rgb;

    const toHex = (n: number): string => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Helper methods

  /**
   * Generate a specific shade from HSL color
   */
  private static generateShade(hsl: HSLColor, lightness: number): string {
    return this.HSLToHex({
      h: hsl.h,
      s: hsl.s,
      l: lightness,
    });
  }

  /**
   * Get luminance of a color for accessibility calculations
   */
  private static getLuminance(hex: string): number {
    const rgb = this.hexToRGB(hex);

    // Convert to sRGB
    const toLinear = (val: number): number => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    };

    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);

    // Calculate relative luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Generate neutral color palette
   */
  private static generateNeutralPalette(): ColorPalette {
    return {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    };
  }

  /**
   * Generate background colors from primary palette
   */
  private static generateBackgroundColors(primaryPalette: ColorPalette): {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  } {
    return {
      primary: "#ffffff",
      secondary: primaryPalette[50] as string,
      tertiary: primaryPalette[100] as string,
      inverse: primaryPalette[900] as string,
    };
  }

  /**
   * Generate text colors from primary palette
   */
  private static generateTextColors(primaryPalette: ColorPalette): {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    link: string;
  } {
    return {
      primary: "#111827",
      secondary: "#6b7280",
      tertiary: "#9ca3af",
      inverse: "#ffffff",
      link: primaryPalette[600] as string,
    };
  }

  // Utility methods for working with colors

  /**
   * Blend two colors together
   */
  static blendColors(
    color1: string,
    color2: string,
    ratio: number = 0.5
  ): string {
    const rgb1 = this.hexToRGB(color1);
    const rgb2 = this.hexToRGB(color2);

    const blended = {
      r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
      g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
      b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio),
    };

    return this.RGBToHex(blended);
  }

  /**
   * Lighten a color by a percentage
   */
  static lighten(color: string, percentage: number): string {
    const hsl = this.hexToHSL(color);
    return this.HSLToHex({
      ...hsl,
      l: Math.min(100, hsl.l + percentage),
    });
  }

  /**
   * Darken a color by a percentage
   */
  static darken(color: string, percentage: number): string {
    const hsl = this.hexToHSL(color);
    return this.HSLToHex({
      ...hsl,
      l: Math.max(0, hsl.l - percentage),
    });
  }

  /**
   * Adjust saturation of a color
   */
  static adjustSaturation(color: string, percentage: number): string {
    const hsl = this.hexToHSL(color);
    return this.HSLToHex({
      ...hsl,
      s: Math.max(0, Math.min(100, hsl.s + percentage)),
    });
  }

  /**
   * Get a random color
   */
  static getRandomColor(): string {
    const hsl: HSLColor = {
      h: Math.floor(Math.random() * 360),
      s: Math.floor(Math.random() * 50) + 50, // 50-100% saturation
      l: Math.floor(Math.random() * 40) + 30, // 30-70% lightness
    };

    return this.HSLToHex(hsl);
  }

  /**
   * Check if a color is light or dark
   */
  static isLightColor(color: string): boolean {
    const luminance = this.getLuminance(color);
    return luminance > 0.5;
  }

  /**
   * Get the best text color (black or white) for a background
   */
  static getBestTextColor(backgroundColor: string): string {
    return this.isLightColor(backgroundColor) ? "#000000" : "#ffffff";
  }

  /**
   * Validate hex color format
   */
  static isValidHexColor(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  /**
   * Convert short hex to long hex
   */
  static expandHex(hex: string): string {
    if (hex.length === 4) {
      return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex;
  }
}
