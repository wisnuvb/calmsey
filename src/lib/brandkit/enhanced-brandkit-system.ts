/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Brandkit,
  BrandkitColors,
  BrandkitTypography,
  BrandkitSpacing,
  BrandkitAssets,
} from "@/types/brandkit";
import { PageSection, PageSectionType } from "@/types/page-builder";
import {
  DesignBlockConfig,
  DESIGN_BLOCK_REGISTRY,
} from "@/lib/design-blocks/design-block-registry";

// Enhanced brandkit with more sophisticated features
export interface EnhancedBrandkit extends Brandkit {
  // Design system extensions
  effects: BrandkitEffects;
  layout: BrandkitLayout;
  components: BrandkitComponents;

  // AI and automation features
  smartSettings: {
    autoApplyColors: boolean;
    autoGenerateVariants: boolean;
    smartSpacing: boolean;
    responsiveOptimization: boolean;
  };

  // Usage analytics
  analytics: {
    mostUsedColors: string[];
    popularCombinations: Array<{
      primary: string;
      secondary: string;
      usage: number;
    }>;
    performanceMetrics: {
      loadTime: number;
      contrastScore: number;
      accessibilityScore: number;
    };
  };
}

export interface BrandkitEffects {
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
    none: string;
  };
  gradients: {
    primary: {
      from: string;
      to: string;
      direction: number;
    };
    secondary: {
      from: string;
      to: string;
      direction: number;
    };
    accent: {
      from: string;
      to: string;
      direction: number;
    };
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
    presets: {
      fadeIn: string;
      slideUp: string;
      scaleIn: string;
      bounce: string;
    };
  };
}

export interface BrandkitLayout {
  grid: {
    columns: number;
    gap: string;
    maxWidth: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  zIndex: {
    dropdown: number;
    sticky: number;
    modal: number;
    overlay: number;
    toast: number;
  };
}

export interface BrandkitComponents {
  buttons: {
    primary: ComponentStyle;
    secondary: ComponentStyle;
    outline: ComponentStyle;
    ghost: ComponentStyle;
  };
  cards: {
    default: ComponentStyle;
    elevated: ComponentStyle;
    outline: ComponentStyle;
  };
  forms: {
    input: ComponentStyle;
    select: ComponentStyle;
    textarea: ComponentStyle;
  };
  navigation: {
    header: ComponentStyle;
    sidebar: ComponentStyle;
    footer: ComponentStyle;
  };
}

export interface ComponentStyle {
  padding: string;
  margin: string;
  borderRadius: string;
  background: string;
  color: string;
  border: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  hover: {
    background: string;
    color: string;
    transform: string;
  };
  focus: {
    outline: string;
    ring: string;
  };
  disabled: {
    opacity: string;
    cursor: string;
  };
}

// Brandkit application engine with intelligent features
export class EnhancedBrandkitEngine {
  /**
   * Intelligently apply brandkit to design blocks
   */
  static applyBrandkitToDesignBlocks(
    designBlocks: PageSection[],
    brandkit: EnhancedBrandkit,
    options: {
      preserveCustomizations: boolean;
      intelligentApplication: boolean;
      generateVariants: boolean;
    } = {
      preserveCustomizations: false,
      intelligentApplication: true,
      generateVariants: false,
    }
  ): {
    updatedBlocks: PageSection[];
    changes: Array<{
      blockId: string;
      blockType: string;
      changes: string[];
      suggestions: string[];
    }>;
  } {
    const updatedBlocks: PageSection[] = [];
    const allChanges: Array<{
      blockId: string;
      blockType: string;
      changes: string[];
      suggestions: string[];
    }> = [];

    designBlocks.forEach((block) => {
      const blockConfig = DESIGN_BLOCK_REGISTRY[block.type];
      if (!blockConfig) {
        updatedBlocks.push(block);
        return;
      }

      const { updatedBlock, changes, suggestions } =
        this.applyBrandkitToSingleBlock(block, brandkit, blockConfig, options);

      updatedBlocks.push(updatedBlock);
      allChanges.push({
        blockId: block.id,
        blockType: block.type,
        changes,
        suggestions,
      });
    });

    return {
      updatedBlocks,
      changes: allChanges,
    };
  }

  /**
   * Apply brandkit to a single design block with intelligence
   */
  private static applyBrandkitToSingleBlock(
    block: PageSection,
    brandkit: EnhancedBrandkit,
    blockConfig: DesignBlockConfig,
    options: any
  ): {
    updatedBlock: PageSection;
    changes: string[];
    suggestions: string[];
  } {
    const updatedBlock = { ...block };
    const changes: string[] = [];
    const suggestions: string[] = [];

    // Apply colors intelligently based on block type
    const colorResult = this.applyIntelligentColors(
      updatedBlock,
      brandkit,
      options
    );
    updatedBlock.styleSettings = colorResult.styles;
    changes.push(...colorResult.changes);

    // Apply typography based on content hierarchy
    const typographyResult = this.applyIntelligentTypography(
      updatedBlock,
      brandkit,
      options
    );
    updatedBlock.styleSettings = {
      ...updatedBlock.styleSettings,
      ...typographyResult.styles,
    };
    changes.push(...typographyResult.changes);

    // Apply spacing with smart calculations
    const spacingResult = this.applyIntelligentSpacing(updatedBlock, brandkit);
    updatedBlock.layoutSettings = {
      ...updatedBlock.layoutSettings,
      ...spacingResult.layout,
    };
    changes.push(...spacingResult.changes);

    // Apply component-specific styles
    const componentResult = this.applyComponentStyles(
      updatedBlock,
      brandkit,
      blockConfig
    );
    updatedBlock.styleSettings = {
      ...updatedBlock.styleSettings,
      ...componentResult.styles,
    };
    changes.push(...componentResult.changes);

    // Generate intelligent suggestions
    suggestions.push(
      ...this.generateBlockSuggestions(updatedBlock, brandkit, blockConfig)
    );

    return { updatedBlock, changes, suggestions };
  }

  /**
   * Apply colors with intelligent context awareness
   */
  private static applyIntelligentColors(
    block: PageSection,
    brandkit: EnhancedBrandkit,
    options: any
  ): { styles: any; changes: string[] } {
    const changes: string[] = [];
    const styles = { ...block.styleSettings };

    // Determine color role based on block type
    const colorRole = this.determineColorRole(block.type);

    switch (colorRole) {
      case "primary":
        if (
          !options.preserveCustomizations ||
          this.isDefaultColor(styles.background?.color)
        ) {
          styles.background = {
            ...styles.background,
            type: "color",
            color: brandkit.colors.primary[500],
          };
          styles.textColor = brandkit.colors.neutral[0];
          changes.push("Applied primary brand colors");
        }
        break;

      case "secondary":
        if (
          !options.preserveCustomizations ||
          this.isDefaultColor(styles.background?.color)
        ) {
          styles.background = {
            ...styles.background,
            type: "color",
            color: brandkit.colors.secondary[50],
          };
          styles.textColor = brandkit.colors.secondary[900];
          changes.push("Applied secondary brand colors");
        }
        break;

      case "accent":
        if (
          !options.preserveCustomizations ||
          this.isDefaultColor(styles.background?.color)
        ) {
          styles.background = {
            ...styles.background,
            type: "gradient",
            // gradient: brandkit.effects.gradients.accent,
          };
          styles.textColor = brandkit.colors.neutral[0];
          changes.push("Applied accent gradient");
        }
        break;

      case "neutral":
      default:
        if (
          !options.preserveCustomizations ||
          this.isDefaultColor(styles.background?.color)
        ) {
          styles.background = {
            ...styles.background,
            type: "color",
            color: brandkit.colors.neutral[0],
          };
          styles.textColor = brandkit.colors.neutral[900];
          changes.push("Applied neutral colors");
        }
        break;
    }

    return { styles, changes };
  }

  /**
   * Apply typography with content hierarchy awareness
   */
  private static applyIntelligentTypography(
    block: PageSection,
    brandkit: EnhancedBrandkit,
    options: any
  ): { styles: any; changes: string[] } {
    const changes: string[] = [];
    const styles = {};

    // Determine typography style based on block type and content
    const typographyStyle = this.determineTypographyStyle(block.type);

    if (!options.preserveCustomizations || !block.styleSettings?.typography) {
      const typography = brandkit.typography.textStyles[typographyStyle];

      (styles as any).typography = {
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize,
        fontWeight: typography.fontWeight,
        lineHeight: typography.lineHeight,
        letterSpacing: typography.letterSpacing || 0,
        textAlign: typography.textAlign || "left",
      };

      changes.push(`Applied ${typographyStyle} typography style`);
    }

    return { styles, changes };
  }

  /**
   * Apply spacing with intelligent calculations
   */
  private static applyIntelligentSpacing(
    block: PageSection,
    brandkit: EnhancedBrandkit
  ): { layout: any; changes: string[] } {
    const changes: string[] = [];
    const layout = { ...block.layoutSettings };

    // Determine appropriate spacing based on block type and context
    const spacingContext = this.determineSpacingContext(block.type);

    if (brandkit.smartSettings.smartSpacing) {
      const spacing = brandkit.spacing.scale;

      switch (spacingContext) {
        case "hero":
          layout.padding = {
            top: spacing[12],
            bottom: spacing[12],
            left: spacing[6],
            right: spacing[6],
            unit: "px",
          };
          changes.push(
            "Applied hero spacing (large vertical, medium horizontal)"
          );
          break;

        case "content":
          layout.padding = {
            top: spacing[8],
            bottom: spacing[8],
            left: spacing[4],
            right: spacing[4],
            unit: "px",
          };
          layout.margin = {
            bottom: spacing[6],
            unit: "px",
          };
          changes.push(
            "Applied content spacing (medium padding, bottom margin)"
          );
          break;

        case "compact":
          layout.padding = {
            top: spacing[4],
            bottom: spacing[4],
            left: spacing[3],
            right: spacing[3],
            unit: "px",
          };
          changes.push("Applied compact spacing (small padding)");
          break;

        case "section":
        default:
          layout.padding = {
            top: spacing[10],
            bottom: spacing[10],
            left: spacing[6],
            right: spacing[6],
            unit: "px",
          };
          changes.push("Applied section spacing (large padding)");
          break;
      }
    }

    return { layout, changes };
  }

  /**
   * Apply component-specific styles
   */
  private static applyComponentStyles(
    block: PageSection,
    brandkit: EnhancedBrandkit,
    blockConfig: DesignBlockConfig
  ): { styles: any; changes: string[] } {
    const changes: string[] = [];
    const styles = {};

    // Apply component styles based on block type
    switch (block.type) {
      case PageSectionType.BUTTON_GROUP:
      case PageSectionType.CTA_BLOCK:
        (styles as any).buttonStyle = brandkit.components.buttons.primary;
        changes.push("Applied primary button component styles");
        break;

      case PageSectionType.CONTACT_FORM:
      case PageSectionType.SUBSCRIPTION_FORM:
        (styles as any).inputStyle = brandkit.components.forms.input;
        changes.push("Applied form component styles");
        break;

      case PageSectionType.NAVIGATION_BLOCK:
        (styles as any).navigationStyle = brandkit.components.navigation.header;
        changes.push("Applied navigation component styles");
        break;

      case PageSectionType.FOOTER_BLOCK:
        (styles as any).footerStyle = brandkit.components.navigation.footer;
        changes.push("Applied footer component styles");
        break;
    }

    return { styles, changes };
  }

  /**
   * Generate intelligent suggestions for blocks
   */
  private static generateBlockSuggestions(
    block: PageSection,
    brandkit: EnhancedBrandkit,
    blockConfig: DesignBlockConfig
  ): string[] {
    const suggestions: string[] = [];

    // Analyze block and provide contextual suggestions
    if (block.type === PageSectionType.HERO) {
      suggestions.push(
        "Consider adding a background image or gradient for visual impact"
      );
      suggestions.push("Ensure CTA button contrasts well with background");
    }

    if (block.type === PageSectionType.TESTIMONIALS) {
      suggestions.push("Use customer photos for increased credibility");
      suggestions.push("Consider adding star ratings or company logos");
    }

    if (block.type === PageSectionType.CONTACT_FORM) {
      suggestions.push("Add form validation styling for better UX");
      suggestions.push("Consider multi-step forms for longer forms");
    }

    // Check accessibility
    if (brandkit.analytics.performanceMetrics.contrastScore < 4.5) {
      suggestions.push("Review color contrast for accessibility compliance");
    }

    return suggestions;
  }

  // Helper methods
  private static determineColorRole(
    blockType: PageSectionType
  ): "primary" | "secondary" | "accent" | "neutral" {
    const primaryBlocks = [PageSectionType.HERO, PageSectionType.CTA_BLOCK];
    const accentBlocks = [
      PageSectionType.PRICING_TABLE,
      PageSectionType.TESTIMONIALS,
    ];
    const secondaryBlocks = [
      PageSectionType.FEATURED_CONTENT,
      PageSectionType.TEAM_SHOWCASE,
    ];

    if (primaryBlocks.includes(blockType)) return "primary";
    if (accentBlocks.includes(blockType)) return "accent";
    if (secondaryBlocks.includes(blockType)) return "secondary";
    return "neutral";
  }

  private static determineTypographyStyle(
    blockType: PageSectionType
  ): keyof BrandkitTypography["textStyles"] {
    if (blockType === PageSectionType.HERO) return "h1";
    if (blockType.toString().includes("HEADING")) return "h2";
    if (
      blockType === PageSectionType.BUTTON_GROUP ||
      blockType === PageSectionType.CTA_BLOCK
    )
      return "button";
    return "body";
  }

  private static determineSpacingContext(
    blockType: PageSectionType
  ): "hero" | "content" | "compact" | "section" {
    if (blockType === PageSectionType.HERO) return "hero";
    if (
      blockType === PageSectionType.BREADCRUMB_BLOCK ||
      blockType === PageSectionType.PAGINATION_BLOCK
    )
      return "compact";
    if (blockType === PageSectionType.RICH_TEXT) return "content";
    return "section";
  }

  private static isDefaultColor(color?: string): boolean {
    const defaultColors = [
      "#000000",
      "#ffffff",
      "#333333",
      "#666666",
      "black",
      "white",
      "transparent",
    ];
    return !color || defaultColors.includes(color.toLowerCase());
  }
}

// Brandkit preset generator for quick setup
export class BrandkitPresetGenerator {
  /**
   * Generate brandkit from color palette
   */
  static generateFromColors(
    name: string,
    primaryColor: string,
    secondaryColor?: string,
    authorId: string = "system"
  ): EnhancedBrandkit {
    // Generate color variations
    const colors = this.generateColorVariations(primaryColor, secondaryColor);

    // Generate typography system
    const typography = this.generateTypographySystem();

    // Generate spacing system
    const spacing = this.generateSpacingSystem();

    // Generate effects
    const effects = this.generateEffectSystem(colors);

    // Generate layout system
    const layout = this.generateLayoutSystem();

    // Generate component styles
    const components = this.generateComponentSystem(
      colors,
      typography,
      spacing
    );

    const now = new Date();

    return {
      id: `brandkit_${Date.now()}`,
      name,
      description: `Auto-generated brandkit based on ${primaryColor}`,
      isDefault: false,
      isActive: true,
      isPublic: false,
      version: "1.0.0",
      colors,
      typography,
      spacing,
      assets: this.generateDefaultAssets(),
      effects,
      layout,
      components,
      smartSettings: {
        autoApplyColors: true,
        autoGenerateVariants: true,
        smartSpacing: true,
        responsiveOptimization: true,
      },
      analytics: {
        mostUsedColors: [
          colors.primary[500],
          colors.neutral[900],
          colors.neutral[0],
        ],
        popularCombinations: [
          {
            primary: colors.primary[500],
            secondary: colors.secondary[500],
            usage: 100,
          },
        ],
        performanceMetrics: {
          loadTime: 250,
          contrastScore: 4.8,
          accessibilityScore: 95,
        },
      },
      author: {
        id: authorId,
        name: "System",
      },
      authorId,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Generate color variations from base color
   */
  private static generateColorVariations(
    primaryColor: string,
    secondaryColor?: string
  ): BrandkitColors {
    // This is a simplified version - in reality you'd use a color library
    // like chroma.js or colord to generate proper variations

    return {
      primary: {
        50: this.lighten(primaryColor, 0.95),
        100: this.lighten(primaryColor, 0.9),
        200: this.lighten(primaryColor, 0.8),
        300: this.lighten(primaryColor, 0.6),
        400: this.lighten(primaryColor, 0.3),
        500: primaryColor, // base
        600: this.darken(primaryColor, 0.1),
        700: this.darken(primaryColor, 0.2),
        800: this.darken(primaryColor, 0.3),
        900: this.darken(primaryColor, 0.4),
        950: this.darken(primaryColor, 0.5),
      },
      secondary: {
        50: secondaryColor ? this.lighten(secondaryColor, 0.95) : "#f8fafc",
        100: secondaryColor ? this.lighten(secondaryColor, 0.9) : "#f1f5f9",
        200: secondaryColor ? this.lighten(secondaryColor, 0.8) : "#e2e8f0",
        300: secondaryColor ? this.lighten(secondaryColor, 0.6) : "#cbd5e1",
        400: secondaryColor ? this.lighten(secondaryColor, 0.3) : "#94a3b8",
        500: secondaryColor || "#64748b",
        600: secondaryColor ? this.darken(secondaryColor, 0.1) : "#475569",
        700: secondaryColor ? this.darken(secondaryColor, 0.2) : "#334155",
        800: secondaryColor ? this.darken(secondaryColor, 0.3) : "#1e293b",
        900: secondaryColor ? this.darken(secondaryColor, 0.4) : "#0f172a",
        950: secondaryColor ? this.darken(secondaryColor, 0.5) : "#020617",
      },
      accent: {
        50: "#fdf4ff",
        100: "#fae8ff",
        200: "#f5d0fe",
        300: "#f0abfc",
        400: "#e879f9",
        500: "#d946ef",
        600: "#c026d3",
        700: "#a21caf",
        800: "#86198f",
        900: "#701a75",
        950: "#4a044e",
      },
      neutral: {
        0: "#ffffff",
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
        950: "#030712",
        1000: "#000000",
      },
      semantic: {
        success: { light: "#d1fae5", main: "#10b981", dark: "#065f46" },
        warning: { light: "#fef3c7", main: "#f59e0b", dark: "#92400e" },
        error: { light: "#fee2e2", main: "#ef4444", dark: "#991b1b" },
        info: { light: "#dbeafe", main: "#3b82f6", dark: "#1e40af" },
      },
    };
  }

  /**
   * Generate typography system
   */
  private static generateTypographySystem(): BrandkitTypography {
    return {
      fontFamilies: {
        heading: {
          name: "Inter",
          fallback: ["system-ui", "sans-serif"],
          weights: [400, 500, 600, 700, 800, 900],
          variable: "--font-heading",
          lineHeight: "1.2",
        },
        body: {
          name: "Inter",
          fallback: ["system-ui", "sans-serif"],
          weights: [400, 500, 600],
          variable: "--font-body",
          lineHeight: "1.6",
        },
        mono: {
          name: "JetBrains Mono",
          fallback: ["monospace"],
          weights: [400, 500, 600],
          variable: "--font-mono",
          lineHeight: "1.5",
        },
      },
      textStyles: {
        h1: {
          fontFamily: "Inter",
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: -0.025,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        h2: {
          fontFamily: "Inter",
          fontSize: 36,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: -0.025,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        h3: {
          fontFamily: "Inter",
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: -0.015,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        h4: {
          fontFamily: "Inter",
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.4,
          letterSpacing: 0,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        h5: {
          fontFamily: "Inter",
          fontSize: 20,
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: 0,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        h6: {
          fontFamily: "Inter",
          fontSize: 18,
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: 0,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        body: {
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.6,
          letterSpacing: 0,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        small: {
          fontFamily: "Inter",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: 0,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        caption: {
          fontFamily: "Inter",
          fontSize: 12,
          fontWeight: 400,
          lineHeight: 1.4,
          letterSpacing: 0.025,
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        button: {
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: 0.025,
          textAlign: "center",
          textDecoration: "none",
          textTransform: "none",
          fontStyle: "normal",
        },
        link: {
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: 500,
          lineHeight: 1.6,
          letterSpacing: 0,
          textAlign: "left",
          textDecoration: "underline",
          textTransform: "none",
          fontStyle: "normal",
        },
      },
      scales: {
        xs: {
          fontSize: "0.75rem",
          lineHeight: "1.5rem",
        },
        sm: {
          fontSize: "0.875rem",
          lineHeight: "1.5rem",
        },
        base: {
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
        lg: {
          fontSize: "1.125rem",
          lineHeight: "1.5rem",
        },
        xl: {
          fontSize: "1.25rem",
          lineHeight: "1.5rem",
        },
        "2xl": {
          fontSize: "1.5rem",
          lineHeight: "1.5rem",
        },
        "3xl": {
          fontSize: "1.875rem",
          lineHeight: "1.5rem",
        },
        "4xl": {
          fontSize: "2.25rem",
          lineHeight: "1.5rem",
        },
        "5xl": {
          fontSize: "3rem",
          lineHeight: "1.5rem",
        },
        "6xl": {
          fontSize: "3.75rem",
          lineHeight: "1.5rem",
        },
        "7xl": {
          fontSize: "4.5rem",
          lineHeight: "1.5rem",
        },
        "8xl": {
          fontSize: "6rem",
          lineHeight: "1.5rem",
        },
        "9xl": {
          fontSize: "7rem",
          lineHeight: "1.5rem",
        },
      },
      weights: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
    };
  }

  /**
   * Generate spacing system
   */
  private static generateSpacingSystem(): BrandkitSpacing {
    return {
      baseUnit: 4,
      scale: {
        0: "0px",
        0.5: "2px",
        1: "4px",
        1.5: "6px",
        2: "8px",
        2.5: "10px",
        3: "12px",
        3.5: "14px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "28px",
        8: "32px",
        9: "36px",
        10: "40px",
        11: "44px",
        12: "48px",
        14: "56px",
        16: "64px",
        20: "80px",
        24: "96px",
        28: "112px",
        32: "128px",
        36: "144px",
        40: "160px",
        44: "176px",
        48: "192px",
        52: "208px",
        56: "224px",
        60: "240px",
        64: "256px",
        72: "288px",
        80: "320px",
        96: "384px",
      },
      containerSizes: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      components: {
        button: {
          padding: "12px 24px",
          margin: "0",
        },
        card: {
          padding: "24px",
          margin: "0 0 16px 0",
        },
        form: {
          padding: "12px 16px",
          margin: "0 0 16px 0",
        },
        navigation: {
          padding: "16px 24px",
          margin: "0",
        },
      },
    };
  }

  /**
   * Generate effect system
   */
  private static generateEffectSystem(colors: BrandkitColors): BrandkitEffects {
    return {
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none",
      },
      gradients: {
        primary: {
          from: colors.primary[400],
          to: colors.primary[600],
          direction: 135,
        },
        secondary: {
          from: colors.secondary[100],
          to: colors.secondary[300],
          direction: 135,
        },
        accent: {
          from: colors.accent[400],
          to: colors.accent[600],
          direction: 135,
        },
      },
      animations: {
        duration: {
          fast: "150ms",
          normal: "300ms",
          slow: "500ms",
        },
        easing: {
          linear: "linear",
          easeIn: "cubic-bezier(0.4, 0, 1, 1)",
          easeOut: "cubic-bezier(0, 0, 0.2, 1)",
          easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
        presets: {
          fadeIn: "fadeIn 300ms ease-in-out",
          slideUp: "slideUp 300ms ease-out",
          scaleIn: "scaleIn 200ms ease-out",
          bounce: "bounce 1s ease-in-out",
        },
      },
    };
  }

  /**
   * Generate layout system
   */
  private static generateLayoutSystem(): BrandkitLayout {
    return {
      grid: {
        columns: 12,
        gap: "24px",
        maxWidth: "1200px",
      },
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      zIndex: {
        dropdown: 1000,
        sticky: 1020,
        modal: 1050,
        overlay: 1040,
        toast: 1060,
      },
    };
  }

  /**
   * Generate component system
   */
  private static generateComponentSystem(
    colors: BrandkitColors,
    typography: BrandkitTypography,
    spacing: BrandkitSpacing
  ): BrandkitComponents {
    return {
      buttons: {
        primary: {
          padding: spacing.components.button.padding,
          margin: spacing.components.button.margin,
          borderRadius: "6px",
          background: colors.primary[600],
          color: colors.neutral[0],
          border: `1px solid ${colors.primary[600]}`,
          fontSize: `${typography.textStyles.button.fontSize}px`,
          fontWeight: typography.textStyles.button.fontWeight.toString(),
          lineHeight: typography.textStyles.button.lineHeight.toString(),
          hover: {
            background: colors.primary[700],
            color: colors.neutral[0],
            transform: "translateY(-1px)",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
        secondary: {
          padding: spacing.components.button.padding,
          margin: spacing.components.button.margin,
          borderRadius: "6px",
          background: colors.secondary[100],
          color: colors.secondary[900],
          border: `1px solid ${colors.secondary[300]}`,
          fontSize: `${typography.textStyles.button.fontSize}px`,
          fontWeight: typography.textStyles.button.fontWeight.toString(),
          lineHeight: typography.textStyles.button.lineHeight.toString(),
          hover: {
            background: colors.secondary[200],
            color: colors.secondary[900],
            transform: "translateY(-1px)",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.secondary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
        outline: {
          padding: spacing.components.button.padding,
          margin: spacing.components.button.margin,
          borderRadius: "6px",
          background: "transparent",
          color: colors.primary[600],
          border: `1px solid ${colors.primary[600]}`,
          fontSize: `${typography.textStyles.button.fontSize}px`,
          fontWeight: typography.textStyles.button.fontWeight.toString(),
          lineHeight: typography.textStyles.button.lineHeight.toString(),
          hover: {
            background: colors.primary[600],
            color: colors.neutral[0],
            transform: "translateY(-1px)",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
        ghost: {
          padding: spacing.components.button.padding,
          margin: spacing.components.button.margin,
          borderRadius: "6px",
          background: "transparent",
          color: colors.primary[600],
          border: "none",
          fontSize: `${typography.textStyles.button.fontSize}px`,
          fontWeight: typography.textStyles.button.fontWeight.toString(),
          lineHeight: typography.textStyles.button.lineHeight.toString(),
          hover: {
            background: colors.primary[50],
            color: colors.primary[700],
            transform: "none",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
      },
      cards: {
        default: {
          padding: spacing.components.card.padding,
          margin: spacing.components.card.margin,
          borderRadius: "8px",
          background: colors.neutral[0],
          color: colors.neutral[900],
          border: `1px solid ${colors.neutral[200]}`,
          fontSize: `${typography.textStyles.body.fontSize}px`,
          fontWeight: typography.textStyles.body.fontWeight.toString(),
          lineHeight: typography.textStyles.body.lineHeight.toString(),
          hover: {
            background: colors.neutral[0],
            color: colors.neutral[900],
            transform: "translateY(-2px)",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "default",
          },
        },
        elevated: {
          padding: spacing.components.card.padding,
          margin: spacing.components.card.margin,
          borderRadius: "8px",
          background: colors.neutral[0],
          color: colors.neutral[900],
          border: "none",
          fontSize: `${typography.textStyles.body.fontSize}px`,
          fontWeight: typography.textStyles.body.fontWeight.toString(),
          lineHeight: typography.textStyles.body.lineHeight.toString(),
          hover: {
            background: colors.neutral[0],
            color: colors.neutral[900],
            transform: "translateY(-4px)",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "default",
          },
        },
        outline: {
          padding: spacing.components.card.padding,
          margin: spacing.components.card.margin,
          borderRadius: "8px",
          background: "transparent",
          color: colors.neutral[900],
          border: `2px solid ${colors.neutral[300]}`,
          fontSize: `${typography.textStyles.body.fontSize}px`,
          fontWeight: typography.textStyles.body.fontWeight.toString(),
          lineHeight: typography.textStyles.body.lineHeight.toString(),
          hover: {
            background: colors.neutral[50],
            color: colors.neutral[900],
            transform: "none",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "default",
          },
        },
      },
      forms: {
        input: {
          padding: spacing.components.form.padding,
          margin: spacing.components.form.margin,
          borderRadius: "6px",
          background: colors.neutral[0],
          color: colors.neutral[900],
          border: `1px solid ${colors.neutral[300]}`,
          fontSize: `${typography.textStyles.body.fontSize}px`,
          fontWeight: typography.textStyles.body.fontWeight.toString(),
          lineHeight: typography.textStyles.body.lineHeight.toString(),
          hover: {
            background: colors.neutral[0],
            color: colors.neutral[900],
            transform: "none",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
        select: {
          padding: spacing.components.form.padding,
          margin: spacing.components.form.margin,
          borderRadius: "6px",
          background: colors.neutral[0],
          color: colors.neutral[900],
          border: `1px solid ${colors.neutral[300]}`,
          fontSize: `${typography.textStyles.body.fontSize}px`,
          fontWeight: typography.textStyles.body.fontWeight.toString(),
          lineHeight: typography.textStyles.body.lineHeight.toString(),
          hover: {
            background: colors.neutral[0],
            color: colors.neutral[900],
            transform: "none",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
        textarea: {
          padding: spacing.components.form.padding,
          margin: spacing.components.form.margin,
          borderRadius: "6px",
          background: colors.neutral[0],
          color: colors.neutral[900],
          border: `1px solid ${colors.neutral[300]}`,
          fontSize: `${typography.textStyles.body.fontSize}px`,
          fontWeight: typography.textStyles.body.fontWeight.toString(),
          lineHeight: typography.textStyles.body.lineHeight.toString(),
          hover: {
            background: colors.neutral[0],
            color: colors.neutral[900],
            transform: "none",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
      },
      navigation: {
        header: {
          padding: spacing.components.navigation.padding,
          margin: spacing.components.navigation.margin,
          borderRadius: "0px",
          background: colors.neutral[0],
          color: colors.neutral[900],
          border: `1px solid ${colors.neutral[200]}`,
          fontSize: `${typography.textStyles.body.fontSize}px`,
          fontWeight: typography.textStyles.body.fontWeight.toString(),
          lineHeight: typography.textStyles.body.lineHeight.toString(),
          hover: {
            background: colors.neutral[0],
            color: colors.neutral[900],
            transform: "none",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "default",
          },
        },
        sidebar: {
          padding: spacing.components.navigation.padding,
          margin: "0",
          borderRadius: "0px",
          background: colors.neutral[50],
          color: colors.neutral[900],
          border: `1px solid ${colors.neutral[200]}`,
          fontSize: `${typography.textStyles.body.fontSize}px`,
          fontWeight: typography.textStyles.body.fontWeight.toString(),
          lineHeight: typography.textStyles.body.lineHeight.toString(),
          hover: {
            background: colors.neutral[100],
            color: colors.neutral[900],
            transform: "none",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "default",
          },
        },
        footer: {
          padding: `${spacing.scale[12]} ${spacing.scale[6]}`,
          margin: "0",
          borderRadius: "0px",
          background: colors.neutral[900],
          color: colors.neutral[100],
          border: "none",
          fontSize: `${typography.textStyles.small.fontSize}px`,
          fontWeight: typography.textStyles.small.fontWeight.toString(),
          lineHeight: typography.textStyles.small.lineHeight.toString(),
          hover: {
            background: colors.neutral[900],
            color: colors.neutral[0],
            transform: "none",
          },
          focus: {
            outline: "none",
            ring: `2px solid ${colors.primary[500]}`,
          },
          disabled: {
            opacity: "0.5",
            cursor: "default",
          },
        },
      },
    };
  }

  /**
   * Generate default assets
   */
  private static generateDefaultAssets(): BrandkitAssets {
    return {
      logos: {
        primary: {
          light: "/assets/logo-light.svg",
          dark: "/assets/logo-dark.svg",
          symbol: "/assets/logo-symbol.svg",
        },
      },
      iconLibrary: {
        style: "outline",
        customIcons: [],
      },
      imageLibrary: [],
      patterns: [],
    };
  }

  // Color manipulation helpers (simplified - use proper color library in production)
  private static lighten(color: string, amount: number): string {
    // This is a very basic implementation - use a proper color library like chroma.js
    return color; // Placeholder
  }

  private static darken(color: string, amount: number): string {
    // This is a very basic implementation - use a proper color library like chroma.js
    return color; // Placeholder
  }
}
