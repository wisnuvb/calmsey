/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/fonts/google-fonts.ts
export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: GoogleFontCategory;
  popularity: number;
  lastModified: string;
}

export type GoogleFontCategory =
  | "sans-serif"
  | "serif"
  | "display"
  | "handwriting"
  | "monospace";

export interface FontWeight {
  value: string;
  label: string;
  numeric: number;
}

export interface FontStyle {
  value: string;
  label: string;
}

export interface LoadedFont {
  family: string;
  weights: string[];
  styles: string[];
  isLoaded: boolean;
  loadPromise?: Promise<void>;
}

export class GoogleFontsService {
  private static readonly API_URL = "https://fonts.googleapis.com/css2";
  private static readonly FONTS_API_URL =
    "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity";
  private static readonly CACHE_KEY = "google-fonts-cache";
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MAX_CONCURRENT_FONTS = 3;
  private static readonly MAX_WEIGHTS_PER_FONT = 4;

  private static loadedFonts = new Map<string, LoadedFont>();
  private static loadingQueue = new Set<string>();
  private static fontLoadPromises = new Map<string, Promise<void>>();

  /**
   * Get list of Google Fonts with caching
   */
  static async getFonts(category?: GoogleFontCategory): Promise<GoogleFont[]> {
    try {
      // Try to get from cache first
      const cached = this.getCachedFonts();
      if (cached) {
        return category
          ? cached.filter((font) => font.category === category)
          : cached;
      }

      // Fetch from API
      const response = await fetch(this.FONTS_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch Google Fonts");
      }

      const data = await response.json();
      const fonts: GoogleFont[] = data.items.map(
        (item: any, index: number) => ({
          family: item.family,
          variants: item.variants || [],
          subsets: item.subsets || [],
          category: item.category as GoogleFontCategory,
          popularity: index + 1, // API returns sorted by popularity
          lastModified: item.lastModified,
        })
      );

      // Cache the results
      this.cacheFonts(fonts);

      return category
        ? fonts.filter((font) => font.category === category)
        : fonts;
    } catch (error) {
      console.error("Error fetching Google Fonts:", error);
      // Return fallback popular fonts
      return this.getFallbackFonts(category);
    }
  }

  /**
   * Get popular fonts for each category
   */
  static async getPopularFontsByCategory(): Promise<
    Record<GoogleFontCategory, GoogleFont[]>
  > {
    const allFonts = await this.getFonts();

    const categories: Record<GoogleFontCategory, GoogleFont[]> = {
      "sans-serif": [],
      serif: [],
      display: [],
      handwriting: [],
      monospace: [],
    };

    // Group by category and take top 20 from each
    allFonts.forEach((font) => {
      if (categories[font.category].length < 20) {
        categories[font.category].push(font);
      }
    });

    return categories;
  }

  /**
   * Load a Google Font dynamically
   */
  static async loadFont(
    fontFamily: string,
    weights: string[] = ["400"],
    styles: string[] = ["normal"]
  ): Promise<void> {
    const fontKey = `${fontFamily}-${weights.join(",")}-${styles.join(",")}`;

    // Check if already loaded
    const loadedFont = this.loadedFonts.get(fontKey);
    if (loadedFont?.isLoaded) {
      return;
    }

    // Check if already loading
    if (this.fontLoadPromises.has(fontKey)) {
      return this.fontLoadPromises.get(fontKey);
    }

    // Check concurrent loading limit
    if (this.loadingQueue.size >= this.MAX_CONCURRENT_FONTS) {
      await this.waitForSlot();
    }

    // Limit weights per font
    const limitedWeights = weights.slice(0, this.MAX_WEIGHTS_PER_FONT);

    const loadPromise = this.loadFontInternal(
      fontFamily,
      limitedWeights,
      styles
    );
    this.fontLoadPromises.set(fontKey, loadPromise);
    this.loadingQueue.add(fontKey);

    try {
      await loadPromise;

      // Mark as loaded
      this.loadedFonts.set(fontKey, {
        family: fontFamily,
        weights: limitedWeights,
        styles,
        isLoaded: true,
      });
    } finally {
      this.loadingQueue.delete(fontKey);
      this.fontLoadPromises.delete(fontKey);
    }
  }

  /**
   * Load multiple fonts with smart queuing
   */
  static async loadFonts(
    fonts: Array<{
      family: string;
      weights?: string[];
      styles?: string[];
    }>
  ): Promise<void> {
    const loadPromises = fonts.map((font) =>
      this.loadFont(font.family, font.weights, font.styles)
    );

    await Promise.allSettled(loadPromises);
  }

  /**
   * Preload critical fonts
   */
  static preloadFont(fontFamily: string, weights: string[] = ["400"]): void {
    const fontUrl = this.generateFontUrl(fontFamily, weights, ["normal"]);

    // Create preload link
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = fontUrl;
    link.crossOrigin = "anonymous";

    // Add to head
    document.head.appendChild(link);

    // Load the actual CSS
    this.loadFont(fontFamily, weights).catch(console.error);
  }

  /**
   * Get CSS URL for Google Font
   */
  static generateFontUrl(
    fontFamily: string,
    weights: string[] = ["400"],
    styles: string[] = ["normal"]
  ): string {
    const family = fontFamily.replace(/\s+/g, "+");

    // Generate weight specifications
    const weightSpecs = weights
      .map((weight) => {
        if (styles.includes("italic")) {
          return `0,1,${weight}`;
        }
        return weight;
      })
      .join(";");

    const params = new URLSearchParams({
      family: `${family}:wght@${weightSpecs}`,
      display: "swap",
    });

    return `${this.API_URL}?${params.toString()}`;
  }

  /**
   * Check if font is loaded
   */
  static isFontLoaded(fontFamily: string): boolean {
    // Check document fonts API if available
    if ("fonts" in document) {
      return document.fonts.check(`16px "${fontFamily}"`);
    }

    // Fallback: check our internal tracking
    return Array.from(this.loadedFonts.values()).some(
      (font) => font.family === fontFamily && font.isLoaded
    );
  }

  /**
   * Get all currently loaded fonts
   */
  static getLoadedFonts(): LoadedFont[] {
    return Array.from(this.loadedFonts.values()).filter(
      (font) => font.isLoaded
    );
  }

  /**
   * Clear font cache
   */
  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }

  /**
   * Get available font weights for common use
   */
  static getCommonWeights(): FontWeight[] {
    return [
      { value: "100", label: "Thin", numeric: 100 },
      { value: "200", label: "Extra Light", numeric: 200 },
      { value: "300", label: "Light", numeric: 300 },
      { value: "400", label: "Regular", numeric: 400 },
      { value: "500", label: "Medium", numeric: 500 },
      { value: "600", label: "Semi Bold", numeric: 600 },
      { value: "700", label: "Bold", numeric: 700 },
      { value: "800", label: "Extra Bold", numeric: 800 },
      { value: "900", label: "Black", numeric: 900 },
    ];
  }

  /**
   * Get available font styles
   */
  static getCommonStyles(): FontStyle[] {
    return [
      { value: "normal", label: "Normal" },
      { value: "italic", label: "Italic" },
    ];
  }

  /**
   * Generate font CSS for brandkit
   */
  static generateBrandkitFontCSS(
    fontFamilies: Record<
      string,
      {
        name: string;
        weights: string[];
        styles: string[];
      }
    >
  ): string {
    const imports: string[] = [];
    const declarations: string[] = [];

    Object.entries(fontFamilies).forEach(([key, font]) => {
      // Generate import URL
      const importUrl = this.generateFontUrl(
        font.name,
        font.weights,
        font.styles
      );
      imports.push(`@import url('${importUrl}');`);

      // Generate CSS custom property
      declarations.push(
        `--font-${key}: '${font.name}', system-ui, sans-serif;`
      );
    });

    return `
/* Google Fonts Imports */
${imports.join("\n")}

/* Font Family Variables */
:root {
  ${declarations.join("\n  ")}
}
    `.trim();
  }

  // Private methods

  private static async loadFontInternal(
    fontFamily: string,
    weights: string[],
    styles: string[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const fontUrl = this.generateFontUrl(fontFamily, weights, styles);

      // Create link element
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      link.crossOrigin = "anonymous";

      // Handle load/error events
      link.onload = () => {
        // Use document.fonts API if available for accurate detection
        if ("fonts" in document) {
          const fontFace = `16px "${fontFamily}"`;

          // Check if font is actually loaded
          if (document.fonts.check(fontFace)) {
            resolve();
          } else {
            // Wait for font to be ready
            document.fonts.ready.then(() => {
              if (document.fonts.check(fontFace)) {
                resolve();
              } else {
                reject(new Error(`Font ${fontFamily} failed to load properly`));
              }
            });
          }
        } else {
          // Fallback: assume loaded after link loads
          setTimeout(resolve, 100);
        }
      };

      link.onerror = () => {
        reject(new Error(`Failed to load font: ${fontFamily}`));
      };

      // Add to document
      document.head.appendChild(link);

      // Timeout fallback
      setTimeout(() => {
        reject(new Error(`Font loading timeout: ${fontFamily}`));
      }, 10000);
    });
  }

  private static async waitForSlot(): Promise<void> {
    return new Promise((resolve) => {
      const checkSlot = () => {
        if (this.loadingQueue.size < this.MAX_CONCURRENT_FONTS) {
          resolve();
        } else {
          setTimeout(checkSlot, 100);
        }
      };
      checkSlot();
    });
  }

  private static getCachedFonts(): GoogleFont[] | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached);
      const now = Date.now();

      if (now - data.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      return data.fonts;
    } catch {
      return null;
    }
  }

  private static cacheFonts(fonts: GoogleFont[]): void {
    try {
      const data = {
        fonts,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to cache fonts:", error);
    }
  }

  private static getFallbackFonts(category?: GoogleFontCategory): GoogleFont[] {
    const fallbackFonts: GoogleFont[] = [
      // Sans-serif
      {
        family: "Inter",
        variants: ["400", "500", "600", "700"],
        subsets: ["latin"],
        category: "sans-serif",
        popularity: 1,
        lastModified: "2023-01-01",
      },
      {
        family: "Roboto",
        variants: ["300", "400", "500", "700"],
        subsets: ["latin"],
        category: "sans-serif",
        popularity: 2,
        lastModified: "2023-01-01",
      },
      {
        family: "Open Sans",
        variants: ["400", "600", "700"],
        subsets: ["latin"],
        category: "sans-serif",
        popularity: 3,
        lastModified: "2023-01-01",
      },
      {
        family: "Lato",
        variants: ["400", "700"],
        subsets: ["latin"],
        category: "sans-serif",
        popularity: 4,
        lastModified: "2023-01-01",
      },
      {
        family: "Montserrat",
        variants: ["400", "500", "600", "700"],
        subsets: ["latin"],
        category: "sans-serif",
        popularity: 5,
        lastModified: "2023-01-01",
      },

      // Serif
      {
        family: "Playfair Display",
        variants: ["400", "700"],
        subsets: ["latin"],
        category: "serif",
        popularity: 1,
        lastModified: "2023-01-01",
      },
      {
        family: "Merriweather",
        variants: ["400", "700"],
        subsets: ["latin"],
        category: "serif",
        popularity: 2,
        lastModified: "2023-01-01",
      },
      {
        family: "Lora",
        variants: ["400", "600", "700"],
        subsets: ["latin"],
        category: "serif",
        popularity: 3,
        lastModified: "2023-01-01",
      },

      // Monospace
      {
        family: "JetBrains Mono",
        variants: ["400", "500", "700"],
        subsets: ["latin"],
        category: "monospace",
        popularity: 1,
        lastModified: "2023-01-01",
      },
      {
        family: "Fira Code",
        variants: ["400", "500", "600"],
        subsets: ["latin"],
        category: "monospace",
        popularity: 2,
        lastModified: "2023-01-01",
      },

      // Display
      {
        family: "Bebas Neue",
        variants: ["400"],
        subsets: ["latin"],
        category: "display",
        popularity: 1,
        lastModified: "2023-01-01",
      },
      {
        family: "Oswald",
        variants: ["400", "500", "600", "700"],
        subsets: ["latin"],
        category: "display",
        popularity: 2,
        lastModified: "2023-01-01",
      },
    ];

    return category
      ? fallbackFonts.filter((font) => font.category === category)
      : fallbackFonts;
  }
}
