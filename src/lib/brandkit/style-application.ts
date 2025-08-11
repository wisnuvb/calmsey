/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/brandkit/style-application.ts
import { Brandkit, StylePreset, StylePresetData } from "@/types/brandkit";
import {
  PageSection,
  StyleSettings,
  LayoutSettings,
  ResponsiveSettings,
  TypographySettings,
  BackgroundSettings,
} from "@/types/page-builder";

export interface StyleApplicationOptions {
  preserveCustomizations?: boolean;
  applyColors?: boolean;
  applyTypography?: boolean;
  applySpacing?: boolean;
  applyResponsive?: boolean;
  targetDevices?: ("desktop" | "tablet" | "mobile")[];
  sectionTypes?: string[];
}

export interface StyleApplicationResult {
  success: boolean;
  appliedSections: string[];
  skippedSections: string[];
  errors: string[];
  warnings: string[];
}

export class SmartStyleApplication {
  /**
   * Apply brandkit to a single page section
   */
  static applyBrandkitToSection(
    section: PageSection,
    brandkit: Brandkit,
    options: StyleApplicationOptions = {}
  ): { section: PageSection; changes: string[] } {
    const {
      preserveCustomizations = true,
      applyColors = true,
      applyTypography = true,
      applySpacing = true,
      applyResponsive = true,
      targetDevices = ["desktop", "tablet", "mobile"],
    } = options;

    const changes: string[] = [];
    const updatedSection = { ...section };

    try {
      // Apply color styles
      if (applyColors) {
        const colorChanges = this.applyBrandkitColors(
          updatedSection.styleSettings,
          brandkit,
          preserveCustomizations
        );
        updatedSection.styleSettings = colorChanges.styles;
        changes.push(...colorChanges.changes);
      }

      // Apply typography
      if (applyTypography) {
        const typographyChanges = this.applyBrandkitTypography(
          updatedSection.styleSettings,
          brandkit,
          section.type,
          preserveCustomizations
        );
        updatedSection.styleSettings = typographyChanges.styles;
        changes.push(...typographyChanges.changes);
      }

      // Apply spacing
      if (applySpacing) {
        const spacingChanges = this.applyBrandkitSpacing(
          updatedSection.layoutSettings,
          brandkit,
          section.type,
          preserveCustomizations
        );
        updatedSection.layoutSettings = spacingChanges.layout;
        changes.push(...spacingChanges.changes);
      }

      // Apply responsive settings
      if (applyResponsive) {
        const responsiveChanges = this.applyBrandkitResponsive(
          updatedSection.responsiveSettings,
          brandkit,
          targetDevices,
          preserveCustomizations
        );
        updatedSection.responsiveSettings = responsiveChanges.responsive;
        changes.push(...responsiveChanges.changes);
      }

      return { section: updatedSection, changes };
    } catch (error) {
      console.error("Error applying brandkit to section:", error);
      return {
        section,
        changes: [
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
      };
    }
  }

  /**
   * Apply brandkit to multiple sections
   */
  static async applyBrandkitToSections(
    sections: PageSection[],
    brandkit: Brandkit,
    options: StyleApplicationOptions = {}
  ): Promise<StyleApplicationResult> {
    const result: StyleApplicationResult = {
      success: true,
      appliedSections: [],
      skippedSections: [],
      errors: [],
      warnings: [],
    };

    const { sectionTypes } = options;

    for (const section of sections) {
      try {
        // Check if section type should be processed
        if (sectionTypes && !sectionTypes.includes(section.type)) {
          result.skippedSections.push(section.id);
          continue;
        }

        const { section: updatedSection, changes } =
          this.applyBrandkitToSection(section, brandkit, options);

        if (changes.length > 0) {
          result.appliedSections.push(section.id);

          // Here you would typically save the updated section to database
          // await updatePageSection(section.id, updatedSection);

          console.log(`Applied brandkit to section ${section.id}:`, changes);
        } else {
          result.skippedSections.push(section.id);
        }
      } catch (error) {
        result.errors.push(
          `Section ${section.id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        result.success = false;
      }
    }

    return result;
  }

  /**
   * Apply style preset to section
   */
  static applyStylePresetToSection(
    section: PageSection,
    preset: StylePreset
  ): { section: PageSection; changes: string[] } {
    const changes: string[] = [];
    const updatedSection = { ...section };

    try {
      const { styleData } = preset;

      // Apply direct styles with proper type conversion
      if (styleData.styles) {
        const convertedStyles = this.convertPresetStylesToStyleSettings(
          styleData.styles
        );
        updatedSection.styleSettings = {
          ...updatedSection.styleSettings,
          ...convertedStyles,
        };
        changes.push("Applied preset styles");
      }

      // Apply background styles
      if (styleData.background) {
        const convertedBackground =
          this.convertPresetBackgroundToBackgroundSettings(
            styleData.background
          );
        updatedSection.styleSettings = {
          ...updatedSection.styleSettings,
          background: convertedBackground,
        };
        changes.push("Applied preset background");
      }

      // Apply typography styles
      if (styleData.typography) {
        const convertedTypography =
          this.convertPresetTypographyToTypographySettings(
            styleData.typography
          );
        updatedSection.styleSettings = {
          ...updatedSection.styleSettings,
          typography: convertedTypography,
        };
        changes.push("Applied preset typography");
      }

      // Apply custom CSS
      if (styleData.customCSS) {
        updatedSection.customSettings = {
          ...updatedSection.customSettings,
          customCSS: styleData.customCSS,
        };
        changes.push("Applied preset custom CSS");
      }

      return { section: updatedSection, changes };
    } catch (error) {
      console.error("Error applying preset to section:", error);
      return {
        section,
        changes: [
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
      };
    }
  }

  /**
   * Generate style preset from section
   */
  static generateStylePresetFromSection(
    section: PageSection,
    presetName: string,
    brandkit?: Brandkit
  ): StylePresetData {
    const styleData: StylePresetData = {
      customCSS: section.customSettings.customCSS,
    };

    // Convert style settings to preset format
    if (section.styleSettings) {
      styleData.background = this.convertStyleSettingsToPresetBackground(
        section.styleSettings
      );
      styleData.typography = this.convertStyleSettingsToPresetTypography(
        section.styleSettings
      );
    }

    // Extract brandkit variable references if brandkit is provided
    if (brandkit) {
      const brandkitVariables = this.extractBrandkitVariables(
        section,
        brandkit
      );
      if (brandkitVariables.length > 0) {
        // Add to customCSS as CSS variables
        styleData.customCSS = `${
          styleData.customCSS || ""
        }\n/* Brandkit Variables */\n${brandkitVariables
          .map((v) => `--${v}: var(--${v});`)
          .join("\n")}`;
      }
    }

    return styleData;
  }

  /**
   * Apply brandkit colors to style settings
   */
  private static applyBrandkitColors(
    styles: StyleSettings,
    brandkit: Brandkit,
    preserveCustomizations: boolean
  ): { styles: StyleSettings; changes: string[] } {
    const changes: string[] = [];
    const updatedStyles = { ...styles };

    // Apply text colors based on context
    if (!preserveCustomizations || this.isDefaultColor(styles.textColor)) {
      updatedStyles.textColor = brandkit.colors.neutral[900];
      changes.push("Updated text color to brandkit neutral");
    }

    // Apply background colors
    if (
      styles.background?.type === "color" ||
      styles.background?.type === "none"
    ) {
      if (
        !preserveCustomizations ||
        this.isDefaultColor(styles.background?.color)
      ) {
        updatedStyles.background = {
          ...styles.background,
          type: "color",
          color: brandkit.colors.neutral[0],
        };
        changes.push("Updated background color to brandkit neutral");
      }
    }

    // Apply border colors
    if (
      styles.border?.enabled &&
      (!preserveCustomizations || this.isDefaultColor(styles.border?.color))
    ) {
      updatedStyles.border = {
        ...styles.border,
        color: brandkit.colors.neutral[300],
        width: styles.border.width || {
          top: 1,
          right: 1,
          bottom: 1,
          left: 1,
          unit: "px",
        },
      };
      changes.push("Updated border color to brandkit neutral");
    }

    // Apply link colors
    if (!preserveCustomizations || this.isDefaultColor(styles.linkColor)) {
      updatedStyles.linkColor = brandkit.colors.primary[600];
      updatedStyles.linkHoverColor = brandkit.colors.primary[700];
      changes.push("Updated link colors to brandkit primary");
    }

    return { styles: updatedStyles, changes };
  }

  /**
   * Apply brandkit typography to style settings
   */
  private static applyBrandkitTypography(
    styles: StyleSettings,
    brandkit: Brandkit,
    sectionType: string,
    preserveCustomizations: boolean
  ): { styles: StyleSettings; changes: string[] } {
    const changes: string[] = [];
    const updatedStyles = { ...styles };

    // Determine appropriate text style based on section type
    const textStyle = this.getTextStyleForSection(sectionType, brandkit);

    if (textStyle && styles.typography) {
      const shouldApply =
        !preserveCustomizations || this.hasDefaultTypography(styles.typography);

      if (shouldApply) {
        updatedStyles.typography = {
          ...styles.typography,
          fontFamily: brandkit.typography.fontFamilies.body.name,
          fontSize: parseInt(textStyle.fontSize),
          fontWeight: textStyle.fontWeight,
          lineHeight: parseFloat(textStyle.lineHeight),
          letterSpacing: parseFloat(textStyle.letterSpacing) || 0,
          textTransform: "none",
          textDecoration: "none",
          textAlign: "left",
          fontStyle: "normal",
        };
        changes.push(
          `Applied ${this.getSectionTypographyName(sectionType)} typography`
        );
      }
    }

    return { styles: updatedStyles, changes };
  }

  /**
   * Apply brandkit spacing to layout settings
   */
  private static applyBrandkitSpacing(
    layout: LayoutSettings,
    brandkit: Brandkit,
    sectionType: string,
    preserveCustomizations: boolean
  ): { layout: LayoutSettings; changes: string[] } {
    const changes: string[] = [];
    const updatedLayout = { ...layout };

    // Apply component-specific spacing if available
    const componentSpacing = this.getSpacingForSection(sectionType, brandkit);

    if (componentSpacing) {
      if (!preserveCustomizations || this.hasDefaultSpacing(layout.padding)) {
        // Convert component spacing to layout padding
        const paddingValue = parseInt(
          componentSpacing.padding || brandkit.spacing.scale[4]
        );
        updatedLayout.padding = {
          top: paddingValue,
          right: paddingValue,
          bottom: paddingValue,
          left: paddingValue,
          unit: "px",
        };
        changes.push("Applied brandkit component padding");
      }

      if (!preserveCustomizations || this.hasDefaultSpacing(layout.margin)) {
        // Apply section spacing as bottom margin
        const marginValue = parseInt(brandkit.spacing.scale[4]);
        updatedLayout.margin = {
          ...layout.margin,
          bottom: marginValue,
        };
        changes.push("Applied brandkit section spacing");
      }
    }

    return { layout: updatedLayout, changes };
  }

  /**
   * Apply brandkit responsive settings
   */
  private static applyBrandkitResponsive(
    responsive: ResponsiveSettings,
    brandkit: Brandkit,
    targetDevices: ("desktop" | "tablet" | "mobile")[],
    preserveCustomizations: boolean
  ): { responsive: ResponsiveSettings; changes: string[] } {
    const changes: string[] = [];
    const updatedResponsive = { ...responsive };

    targetDevices.forEach((device) => {
      if (device === "desktop") return; // Desktop is handled by main styles

      const deviceSettings = responsive[device];
      const shouldApply =
        !preserveCustomizations ||
        this.hasMinimalDeviceSettings(deviceSettings);

      if (shouldApply) {
        // Apply responsive typography scaling
        const scaleFactor = device === "mobile" ? 0.875 : 0.9375; // 14px base for mobile, 15px for tablet

        updatedResponsive[device] = {
          ...deviceSettings,
          fontSize: Math.round((deviceSettings.fontSize || 16) * scaleFactor),
          padding: this.scaleSpacing(deviceSettings.padding, scaleFactor),
          margin: this.scaleSpacing(deviceSettings.margin, scaleFactor),
        };

        changes.push(`Applied responsive scaling for ${device}`);
      }
    });

    return { responsive: updatedResponsive, changes };
  }

  /**
   * Helper methods
   */
  private static isDefaultColor(color?: string): boolean {
    const defaultColors = [
      "#000000",
      "#ffffff",
      "#333333",
      "#666666",
      "black",
      "white",
    ];
    return !color || defaultColors.includes(color.toLowerCase());
  }

  private static hasDefaultTypography(typography: TypographySettings): boolean {
    const defaultFonts = [
      "Arial",
      "Helvetica",
      "Times",
      "serif",
      "sans-serif",
      "system-ui",
    ];
    return defaultFonts.some((font) =>
      typography.fontFamily.toLowerCase().includes(font.toLowerCase())
    );
  }

  private static hasDefaultSpacing(spacing: any): boolean {
    if (typeof spacing === "object") {
      return Object.values(spacing).every(
        (value) => value === 0 || value === 16 || value === 8
      );
    }
    return spacing === 0 || spacing === 16 || spacing === 8;
  }

  private static hasMinimalDeviceSettings(deviceSettings: any): boolean {
    if (!deviceSettings) return true;

    const keys = Object.keys(deviceSettings);
    return keys.length === 0 || (keys.length === 1 && keys[0] === "visibility");
  }

  private static getTextStyleForSection(
    sectionType: string,
    brandkit: Brandkit
  ) {
    const typeMapping: Record<
      string,
      keyof typeof brandkit.typography.textStyles
    > = {
      hero: "h1",
      heading: "h2",
      subheading: "h3",
      title: "h2",
      subtitle: "h4",
      text: "body",
      paragraph: "body",
      content: "body",
      caption: "caption",
      button: "button",
      link: "link",
    };

    const styleKey = typeMapping[sectionType.toLowerCase()] || "body";
    return brandkit.typography.textStyles[styleKey];
  }

  private static getSectionTypographyName(sectionType: string): string {
    const nameMapping: Record<string, string> = {
      hero: "hero heading",
      heading: "heading",
      subheading: "subheading",
      title: "title",
      subtitle: "subtitle",
      text: "body text",
      paragraph: "body text",
      content: "body text",
      caption: "caption",
      button: "button",
      link: "link",
    };

    return nameMapping[sectionType.toLowerCase()] || "body text";
  }

  private static getSpacingForSection(sectionType: string, brandkit: Brandkit) {
    const spacingMapping: Record<
      string,
      keyof typeof brandkit.spacing.components
    > = {
      button: "button",
      card: "card",
      form: "form",
      navigation: "navigation",
    };

    const spacingKey = spacingMapping[sectionType.toLowerCase()];
    return spacingKey ? brandkit.spacing.components[spacingKey] : null;
  }

  private static scaleSpacing(spacing: any, scaleFactor: number): any {
    if (typeof spacing === "number") {
      return Math.round(spacing * scaleFactor);
    }

    if (typeof spacing === "object" && spacing !== null) {
      const scaled: any = {};
      Object.keys(spacing).forEach((key) => {
        if (typeof spacing[key] === "number") {
          scaled[key] = Math.round(spacing[key] * scaleFactor);
        } else {
          scaled[key] = spacing[key];
        }
      });
      return scaled;
    }

    return spacing;
  }

  private static extractBrandkitVariables(
    section: PageSection,
    brandkit: Brandkit
  ): string[] {
    const variables: string[] = [];

    // Extract color variables
    const sectionColors = [
      section.styleSettings.textColor,
      section.styleSettings.background?.color,
      section.styleSettings.border?.color,
      section.styleSettings.linkColor,
      section.styleSettings.linkHoverColor,
    ].filter((color): color is string => Boolean(color));

    sectionColors.forEach((color) => {
      // Find matching brandkit color
      const colorKey = this.findColorInBrandkit(color, brandkit);
      if (colorKey) {
        variables.push(`color.${colorKey}`);
      }
    });

    // Extract typography variables
    const fontFamily = section.styleSettings.typography?.fontFamily;
    if (fontFamily) {
      const fontKey = this.findFontInBrandkit(fontFamily, brandkit);
      if (fontKey) {
        variables.push(`typography.fontFamily.${fontKey}`);
      }
    }

    // Extract spacing variables
    const spacingValues = [
      ...Object.values(section.layoutSettings.padding),
      ...Object.values(section.layoutSettings.margin),
    ].filter((val) => typeof val === "number");

    spacingValues.forEach((value) => {
      const spacingKey = this.findSpacingInBrandkit(value, brandkit);
      if (spacingKey) {
        variables.push(`spacing.${spacingKey}`);
      }
    });

    return [...new Set(variables)]; // Remove duplicates
  }

  private static findColorInBrandkit(
    color: string,
    brandkit: Brandkit
  ): string | null {
    const colorPalettes = {
      primary: brandkit.colors.primary,
      secondary: brandkit.colors.secondary,
      neutral: brandkit.colors.neutral,
      semantic: brandkit.colors.semantic,
    };

    for (const [paletteKey, palette] of Object.entries(colorPalettes)) {
      for (const [shadeKey, paletteColor] of Object.entries(palette)) {
        if (paletteColor === color) {
          return `${paletteKey}.${shadeKey}`;
        }
      }
    }

    return null;
  }

  private static findFontInBrandkit(
    fontFamily: string,
    brandkit: Brandkit
  ): string | null {
    for (const [key, font] of Object.entries(
      brandkit.typography.fontFamilies
    )) {
      if (font.name === fontFamily) {
        return key;
      }
    }
    return null;
  }

  private static findSpacingInBrandkit(
    value: number,
    brandkit: Brandkit
  ): string | null {
    for (const [key, spacing] of Object.entries(brandkit.spacing.scale)) {
      if (parseInt(spacing) === value) {
        return `scale.${key}`;
      }
    }
    return null;
  }

  // Conversion helper methods
  private static convertPresetStylesToStyleSettings(
    presetStyles: any
  ): Partial<StyleSettings> {
    return {
      textColor: presetStyles.textColor,
      linkColor: presetStyles.linkColor,
      linkHoverColor: presetStyles.linkHoverColor,
      opacity: presetStyles.opacity,
      display: presetStyles.display,
    };
  }

  private static convertPresetBackgroundToBackgroundSettings(
    presetBackground: any
  ): BackgroundSettings {
    return {
      type: presetBackground.type || "none",
      color: presetBackground.color,
      gradient: presetBackground.gradient,
      image: presetBackground.image,
      video: presetBackground.video,
      pattern: presetBackground.pattern,
      overlay: presetBackground.overlay,
    };
  }

  private static convertPresetTypographyToTypographySettings(
    presetTypography: any
  ): TypographySettings {
    return {
      fontFamily: presetTypography.fontFamily || "system-ui",
      fontSize: parseInt(presetTypography.fontSize) || 16,
      fontWeight: presetTypography.fontWeight || 400,
      lineHeight: parseFloat(presetTypography.lineHeight) || 1.5,
      letterSpacing: parseFloat(presetTypography.letterSpacing) || 0,
      textAlign: presetTypography.textAlign || "left",
      textDecoration: presetTypography.textDecoration || "none",
      textTransform: presetTypography.textTransform || "none",
      fontStyle: "normal",
    };
  }

  private static convertStyleSettingsToPresetBackground(
    styleSettings: StyleSettings
  ): any {
    return styleSettings.background;
  }

  private static convertStyleSettingsToPresetTypography(
    styleSettings: StyleSettings
  ): any {
    return styleSettings.typography;
  }
}
