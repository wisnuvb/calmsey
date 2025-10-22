// src/types/layout-settings.ts
export interface HeaderSettings {
  enabled: boolean;
  type: "default" | "minimal" | "custom" | "none";
  style: {
    backgroundColor?: string;
    textColor?: string;
    logoUrl?: string;
    logoText?: string;
    sticky?: boolean;
    transparent?: boolean;
    // Advanced styling options
    advanced?: {
      background?: {
        type: "color" | "gradient" | "image";
        color?: string;
        gradient?: {
          direction: string;
          colors: string[];
        };
        image?: string;
        opacity?: number;
      };
      typography?: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: string;
        lineHeight?: number;
        letterSpacing?: number;
      };
      spacing?: {
        padding?: {
          top: number;
          right: number;
          bottom: number;
          left: number;
        };
        margin?: {
          top: number;
          right: number;
          bottom: number;
          left: number;
        };
      };
      border?: {
        width?: number;
        style?: string;
        color?: string;
        radius?: number;
      };
      shadow?: {
        enabled: boolean;
        x: number;
        y: number;
        blur: number;
        spread: number;
        color: string;
      };
      effects?: {
        backdropBlur?: number;
        filter?: string;
      };
    };
  };
  navigation: {
    showMainNav: boolean;
    showLanguageSwitcher: boolean;
    showSearch: boolean;
    customMenuItems?: Array<{
      label: string;
      url: string;
      target?: "_blank" | "_self";
    }>;
  };
  customContent?: string;
}

export interface FooterSettings {
  enabled: boolean;
  type: "default" | "minimal" | "custom" | "none";
  style: {
    backgroundColor?: string;
    textColor?: string;
    showSocialLinks?: boolean;
    showContactInfo?: boolean;
    // Advanced styling options
    advanced?: {
      background?: {
        type: "color" | "gradient" | "image";
        color?: string;
        gradient?: {
          direction: string;
          colors: string[];
        };
        image?: string;
        opacity?: number;
      };
      typography?: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: string;
        lineHeight?: number;
        letterSpacing?: number;
      };
      spacing?: {
        padding?: {
          top: number;
          right: number;
          bottom: number;
          left: number;
        };
        margin?: {
          top: number;
          right: number;
          bottom: number;
          left: number;
        };
      };
      border?: {
        width?: number;
        style?: string;
        color?: string;
        radius?: number;
      };
      shadow?: {
        enabled: boolean;
        x: number;
        y: number;
        blur: number;
        spread: number;
        color: string;
      };
      effects?: {
        backdropBlur?: number;
        filter?: string;
      };
    };
  };
  content: {
    showQuickLinks: boolean;
    showLegalLinks: boolean;
    showSocialLinks: boolean;
    showContactInfo: boolean;
    customSections?: Array<{
      title: string;
      links: Array<{
        label: string;
        url: string;
      }>;
    }>;
  };
  customContent?: string;
}

export interface PageLayoutConfig {
  header: HeaderSettings;
  footer: FooterSettings;
  layout: {
    containerWidth: "full" | "container" | "narrow";
    padding: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
}
