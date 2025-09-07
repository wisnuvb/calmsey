import { SpacingValue } from "./page-builder";

export interface BrandkitColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // main
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // main
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // main
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  neutral: {
    0: string; // white
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
    1000: string; // black
  };
  semantic: {
    success: {
      light: string;
      main: string;
      dark: string;
    };
    warning: {
      light: string;
      main: string;
      dark: string;
    };
    error: {
      light: string;
      main: string;
      dark: string;
    };
    info: {
      light: string;
      main: string;
      dark: string;
    };
  };
}

export interface ColorPalette {
  0?: string; // white
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;
  950?: string;
  1000?: string; // black
  success?: { light: string; main: string; dark: string };
  warning?: { light: string; main: string; dark: string };
  error?: { light: string; main: string; dark: string };
  info?: { light: string; main: string; dark: string };
}

export interface BrandkitTypography {
  fontFamilies: {
    heading: {
      name: string;
      fallback: string[];
      weights: number[];
      variable?: string; // CSS variable name
      url?: string; // Google Fonts URL or font file
      lineHeight?: string;
    };
    body: {
      name: string;
      fallback: string[];
      weights: number[];
      variable?: string;
      url?: string;
      lineHeight?: string;
    };
    mono: {
      name: string;
      fallback: string[];
      weights: number[];
      variable?: string;
      url?: string;
      lineHeight?: string;
    };
  };
  scales: {
    xs: { fontSize: string; lineHeight: string };
    sm: { fontSize: string; lineHeight: string };
    base: { fontSize: string; lineHeight: string };
    lg: { fontSize: string; lineHeight: string };
    xl: { fontSize: string; lineHeight: string };
    "2xl": { fontSize: string; lineHeight: string };
    "3xl": { fontSize: string; lineHeight: string };
    "4xl": { fontSize: string; lineHeight: string };
    "5xl": { fontSize: string; lineHeight: string };
    "6xl": { fontSize: string; lineHeight: string };
    "7xl": { fontSize: string; lineHeight: string };
    "8xl": { fontSize: string; lineHeight: string };
    "9xl": { fontSize: string; lineHeight: string };
  };
  weights: {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  textStyles: {
    h1: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    h2: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    h3: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    h4: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    h5: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    h6: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    body: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    caption: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    button: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    link: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
    small: {
      fontSize: string | number;
      lineHeight: string | number;
      fontWeight: number;
      letterSpacing: string | number;
      fontFamily?: string;
      textAlign?: string;
      textDecoration?: string;
      textTransform?: string;
      fontStyle?: string;
    };
  };
}

export interface BrandkitSpacing {
  baseUnit: number; // 4 or 8 typically
  scale: {
    0: string | number;
    0.5: string | number;
    1: string | number;
    1.5: string | number;
    2: string | number;
    2.5: string | number;
    3: string | number;
    3.5: string | number;
    4: string | number;
    5: string | number;
    6: string | number;
    7: string | number;
    8: string | number;
    9: string | number;
    10: string | number;
    11: string | number;
    12: string | number;
    14: string | number;
    16: string | number;
    20: string | number;
    24: string | number;
    28: string | number;
    32: string | number;
    36: string | number;
    40: string | number;
    44: string | number;
    48: string | number;
    52: string | number;
    56: string | number;
    60: string | number;
    64: string | number;
    72: string | number;
    80: string | number;
    96: string | number;
  };
  containerSizes: {
    sm: string; // 640px
    md: string; // 768px
    lg: string; // 1024px
    xl: string; // 1280px
    "2xl": string; // 1536px
  };
  components: {
    button: {
      padding: string;
      margin: string;
    };
    card: {
      padding: string;
      margin: string;
    };
    form: {
      padding: string;
      margin: string;
    };
    navigation: {
      padding: string;
      margin: string;
    };
  };
}

export interface BrandkitAssets {
  logos: {
    primary: {
      light: string; // URL to light version
      dark: string; // URL to dark version
      symbol: string; // URL to symbol/icon only
    };
    secondary?: {
      light: string;
      dark: string;
      symbol: string;
    };
  };
  iconLibrary: {
    style: "outline" | "filled" | "duotone" | "custom";
    baseUrl?: string; // If using icon library
    customIcons: Array<{
      name: string;
      url: string;
      category: string;
    }>;
  };
  imageLibrary: Array<{
    id: string;
    name: string;
    url: string;
    category: string; // hero, testimonials, team, etc
    alt: string;
    dimensions: { width: number; height: number };
  }>;
  patterns?: Array<{
    name: string;
    url: string;
    type: "background" | "texture" | "decoration";
  }>;
}

export interface Brandkit {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  isPublic: boolean;
  version: string;
  colors: BrandkitColors;
  typography: BrandkitTypography;
  spacing: BrandkitSpacing;
  assets: BrandkitAssets;
  author: {
    id: string;
    name: string;
  };
  usageCount: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StylePresetData {
  // Layout styles
  layout?: {
    width?: string;
    maxWidth?: string;
    padding?: SpacingValue;
    margin?: SpacingValue;
    alignment?: "left" | "center" | "right" | "justify";
  };

  // Background styles
  background?: {
    type: "none" | "color" | "gradient" | "image";
    color?: string;
    gradient?: {
      type: "linear" | "radial";
      direction?: number;
      stops: Array<{ color: string; position: number }>;
    };
    image?: {
      url: string;
      size: "cover" | "contain" | "auto";
      position: string;
      repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
      overlay?: { color: string; opacity: number };
    };
  };

  // Typography styles
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: "left" | "center" | "right" | "justify";
    textColor?: string;
    textDecoration?: "none" | "underline" | "line-through";
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  };

  // Border & Effects
  border?: {
    width: number;
    style: "solid" | "dashed" | "dotted";
    color: string;
    radius: number;
  };

  boxShadow?: {
    type: "none" | "sm" | "md" | "lg" | "xl" | "custom";
    custom?: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string;
    };
  };

  // Animation
  animations?: {
    hover?: {
      transform?: string;
      transition?: string;
    };
    entrance?: {
      type: string;
      duration: number;
      delay: number;
    };
  };

  // Custom CSS
  customCSS?: string;

  // Styles
  styles?: {
    background?: string;
    textColor?: string;
    borderColor?: string;
    boxShadow?: string;
  };
}

export interface StylePreset {
  name: string;
  description: string;
  styleData: StylePresetData;
}

// interface SpacingValue {
//   top: number | string;
//   right: number | string;
//   bottom: number | string;
//   left: number | string;
//   unit: "px" | "rem" | "em" | "%";
// }

// Default brandkit for new installations
export const DEFAULT_BRANDKIT: Omit<
  Brandkit,
  "id" | "author" | "authorId" | "createdAt" | "updatedAt" | "usageCount"
> = {
  name: "Default Theme",
  description: "Default brandkit for getting started",
  isDefault: true,
  isActive: true,
  isPublic: true,
  version: "1.0.0",
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // main
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b", // main
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },
    accent: {
      50: "#fdf4ff",
      100: "#fae8ff",
      200: "#f5d0fe",
      300: "#f0abfc",
      400: "#e879f9",
      500: "#d946ef", // main
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
      success: {
        light: "#d1fae5",
        main: "#10b981",
        dark: "#065f46",
      },
      warning: {
        light: "#fef3c7",
        main: "#f59e0b",
        dark: "#92400e",
      },
      error: {
        light: "#fee2e2",
        main: "#ef4444",
        dark: "#991b1b",
      },
      info: {
        light: "#dbeafe",
        main: "#3b82f6",
        dark: "#1e40af",
      },
    },
  },
  typography: {
    fontFamilies: {
      heading: {
        name: "Inter",
        fallback: ["system-ui", "sans-serif"],
        weights: [400, 500, 600, 700, 800, 900],
        variable: "--font-heading",
      },
      body: {
        name: "Inter",
        fallback: ["system-ui", "sans-serif"],
        weights: [400, 500, 600],
        variable: "--font-body",
      },
      mono: {
        name: "JetBrains Mono",
        fallback: ["monospace"],
        weights: [400, 500, 600],
        variable: "--font-mono",
      },
    },
    scales: {
      xs: { fontSize: "0.75rem", lineHeight: "1rem" },
      sm: { fontSize: "0.875rem", lineHeight: "1.25rem" },
      base: { fontSize: "1rem", lineHeight: "1.5rem" },
      lg: { fontSize: "1.125rem", lineHeight: "1.75rem" },
      xl: { fontSize: "1.25rem", lineHeight: "1.75rem" },
      "2xl": { fontSize: "1.5rem", lineHeight: "2rem" },
      "3xl": { fontSize: "1.875rem", lineHeight: "2.25rem" },
      "4xl": { fontSize: "2.25rem", lineHeight: "2.5rem" },
      "5xl": { fontSize: "3rem", lineHeight: "1" },
      "6xl": { fontSize: "3.75rem", lineHeight: "1" },
      "7xl": { fontSize: "4.5rem", lineHeight: "1" },
      "8xl": { fontSize: "6rem", lineHeight: "1" },
      "9xl": { fontSize: "8rem", lineHeight: "1" },
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
    textStyles: {
      h1: {
        fontSize: "2.5rem",
        lineHeight: "3rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontSize: "2rem",
        lineHeight: "2.5rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h3: {
        fontSize: "1.5rem",
        lineHeight: "2rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h4: {
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontSize: "1rem",
        lineHeight: "1.5rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h6: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      body: {
        fontSize: "1rem",
        lineHeight: "1.5rem",
        fontWeight: 400,
        letterSpacing: "0.01em",
      },
      caption: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        fontWeight: 400,
        letterSpacing: "0.01em",
      },
      button: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
      },
      link: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
      },
      small: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        fontWeight: 400,
        letterSpacing: "0.01em",
      },
    },
  },
  spacing: {
    baseUnit: 4,
    scale: {
      0: "0px",
      0.5: "0.125rem",
      1: "0.25rem",
      1.5: "0.375rem",
      2: "0.5rem",
      2.5: "0.625rem",
      3: "0.75rem",
      3.5: "0.875rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      9: "2.25rem",
      10: "2.5rem",
      11: "2.75rem",
      12: "3rem",
      14: "3.5rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
      28: "7rem",
      32: "8rem",
      36: "9rem",
      40: "10rem",
      44: "11rem",
      48: "12rem",
      52: "13rem",
      56: "14rem",
      60: "15rem",
      64: "16rem",
      72: "18rem",
      80: "20rem",
      96: "24rem",
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
        padding: "0.5rem 1rem",
        margin: "0.5rem 0",
      },
      card: {
        padding: "0.5rem 1rem",
        margin: "0.5rem 0",
      },
      form: {
        padding: "0.5rem 1rem",
        margin: "0.5rem 0",
      },
      navigation: {
        padding: "0.5rem 1rem",
        margin: "0.5rem 0",
      },
    },
  },
  assets: {
    logos: {
      primary: {
        light: "/brandkit/logo-light.svg",
        dark: "/brandkit/logo-dark.svg",
        symbol: "/brandkit/symbol.svg",
      },
    },
    iconLibrary: {
      style: "outline",
      customIcons: [],
    },
    imageLibrary: [],
  },
};
