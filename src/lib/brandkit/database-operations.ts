/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import {
  Brandkit,
  BrandkitColors,
  BrandkitTypography,
  BrandkitSpacing,
  BrandkitAssets,
  StylePresetData,
  DEFAULT_BRANDKIT,
} from "@/types/brandkit";
import { BrandkitAssetType, PresetCategory } from "@prisma/client";

export interface BrandkitCreateInput {
  name: string;
  description?: string;
  colors: BrandkitColors;
  typography: BrandkitTypography;
  spacing: BrandkitSpacing;
  assets: BrandkitAssets;
  authorId: string;
  isDefault?: boolean;
  isPublic?: boolean;
  isActive?: boolean;
}

export interface BrandkitUpdateInput {
  name?: string;
  description?: string;
  colors?: BrandkitColors;
  typography?: BrandkitTypography;
  spacing?: BrandkitSpacing;
  assets?: BrandkitAssets;
  isActive?: boolean;
  isPublic?: boolean;
  isDefault?: boolean;
}

export interface StylePresetCreateInput {
  name: string;
  description?: string;
  category: PresetCategory;
  sectionType?: string;
  styleData: StylePresetData;
  brandkitId?: string;
  templateId?: string;
  authorId: string;
}

export interface BrandkitQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  authorId?: string;
  search?: string;
  isPublic?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name" | "usageCount";
  sortOrder?: "asc" | "desc";
}

export interface BrandkitAssetCreateInput {
  name: string;
  description?: string;
  type: BrandkitAssetType;
  category: string;
  url: string;
  thumbnailUrl?: string;
  metadata: Record<string, any>;
  tags: string[];
  brandkitId: string;
  authorId: string;
}

export interface BrandkitFilterOptions {
  authorId?: string;
  isPublic?: boolean;
  category?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface BrandkitQueryResult {
  brandkits: Brandkit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class BrandkitDatabase {
  /**
   * Create new brandkit
   */
  static async createBrandkit(data: BrandkitCreateInput): Promise<Brandkit> {
    try {
      const brandkit = await prisma.brandkit.create({
        data: {
          name: data.name,
          description: data.description,
          colors: JSON.stringify(data.colors),
          typography: JSON.stringify(data.typography),
          spacing: JSON.stringify(data.spacing),
          isPublic: data.isPublic || false,
          isDefault: data.isDefault || false,
          authorId: data.authorId,
          assets: JSON.stringify(data.assets),
          isActive: data.isActive || true,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              pages: true,
            },
          },
        },
      });

      return this.transformDbBrandkit(brandkit);
    } catch (error) {
      throw new Error(
        `Failed to create brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get all brandkits with filtering and pagination
   */
  static async getBrandkits(
    options: BrandkitQueryOptions = {}
  ): Promise<BrandkitQueryResult> {
    const {
      page = 1,
      limit = 20,
      authorId,
      search,
      isPublic,
      sortBy = "updatedAt",
      sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (authorId) {
      where.authorId = authorId;
    }

    if (typeof isPublic === "boolean") {
      where.isPublic = isPublic;
    }

    if (search?.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    // Build order clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    try {
      const [brandkits, total] = await Promise.all([
        prisma.brandkit.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                pages: true,
              },
            },
          },
        }),
        prisma.brandkit.count({ where }),
      ]);

      const transformedBrandkits: Brandkit[] = brandkits.map(
        this.mapDbBrandkitToBrandkit
      );

      return {
        brandkits: transformedBrandkits,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch brandkits: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get brandkit by ID
   */
  static async getBrandkitById(id: string): Promise<Brandkit | null> {
    try {
      const dbBrandkit = await prisma.brandkit.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      });

      if (!dbBrandkit) return null;

      return this.mapDbBrandkitToBrandkit(dbBrandkit);
    } catch (error) {
      throw new Error(
        `Failed to get brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get default brandkit
   */
  static async getDefaultBrandkit(): Promise<Brandkit | null> {
    try {
      const dbBrandkit = await prisma.brandkit.findFirst({
        where: {
          isDefault: true,
          isActive: true,
        },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      });

      if (!dbBrandkit) return null;

      return this.mapDbBrandkitToBrandkit(dbBrandkit);
    } catch (error) {
      console.error("Failed to get default brandkit:", error);
      return null;
    }
  }

  /**
   * List all brandkits
   */
  static async listBrandkits(authorId?: string): Promise<Brandkit[]> {
    try {
      const where = authorId
        ? { authorId, isActive: true }
        : { isActive: true };

      const dbBrandkits = await prisma.brandkit.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      });

      return dbBrandkits.map(this.mapDbBrandkitToBrandkit);
    } catch (error) {
      throw new Error(
        `Failed to list brandkits: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update brandkit
   */
  static async updateBrandkit(
    id: string,
    input: BrandkitUpdateInput,
    authorId?: string
  ): Promise<Brandkit> {
    try {
      // Check ownership if authorId provided
      if (authorId) {
        const existing = await prisma.brandkit.findFirst({
          where: { id, authorId },
        });
        if (!existing) {
          throw new Error("Brandkit not found or access denied");
        }
      }

      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.colors !== undefined)
        updateData.colors = JSON.stringify(input.colors);
      if (input.typography !== undefined)
        updateData.typography = JSON.stringify(input.typography);
      if (input.spacing !== undefined)
        updateData.spacing = JSON.stringify(input.spacing);
      if (input.assets !== undefined)
        updateData.assets = JSON.stringify(input.assets);
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      const dbBrandkit = await prisma.brandkit.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      });

      return this.mapDbBrandkitToBrandkit(dbBrandkit);
    } catch (error) {
      throw new Error(
        `Failed to update brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete brandkit
   */
  static async deleteBrandkit(id: string, authorId?: string): Promise<void> {
    try {
      const where: any = { id };
      if (authorId) {
        where.authorId = authorId;
      }

      // Don't allow deleting default brandkit
      const brandkit = await prisma.brandkit.findUnique({
        where: { id },
        select: { isDefault: true },
      });

      if (brandkit?.isDefault) {
        throw new Error("Cannot delete default brandkit");
      }

      await prisma.brandkit.delete({ where });
    } catch (error) {
      throw new Error(
        `Failed to delete brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Set brandkit as default
   */
  static async setDefaultBrandkit(id: string): Promise<void> {
    try {
      await prisma.$transaction([
        // Unset all defaults
        prisma.brandkit.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        }),
        // Set new default
        prisma.brandkit.update({
          where: { id },
          data: { isDefault: true },
        }),
      ]);
    } catch (error) {
      throw new Error(
        `Failed to set default brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get default brandkits
   */
  static async getDefaultBrandkits(): Promise<Brandkit[]> {
    try {
      const brandkits = await prisma.brandkit.findMany({
        where: { isDefault: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              pages: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return brandkits.map(this.transformDbBrandkit);
    } catch (error) {
      throw new Error(
        `Failed to fetch default brandkits: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get user's brandkits
   */
  static async getUserBrandkits(userId: string): Promise<Brandkit[]> {
    try {
      const brandkits = await prisma.brandkit.findMany({
        where: { authorId: userId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              pages: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return brandkits.map(this.transformDbBrandkit);
    } catch (error) {
      throw new Error(
        `Failed to fetch user brandkits: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Duplicate brandkit
   */
  static async duplicateBrandkit(
    brandkitId: string,
    newName: string,
    userId: string
  ): Promise<Brandkit> {
    try {
      const original = await this.getBrandkitById(brandkitId);

      if (!original) {
        throw new Error("Brandkit not found or access denied");
      }

      const duplicated = await prisma.brandkit.create({
        data: {
          name: newName,
          description: `Copy of ${original.name}`,
          colors:
            typeof original.colors === "string"
              ? original.colors
              : JSON.stringify(original.colors),
          typography: original.typography
            ? typeof original.typography === "string"
              ? original.typography
              : JSON.stringify(original.typography)
            : "",
          spacing: original.spacing
            ? typeof original.spacing === "string"
              ? original.spacing
              : JSON.stringify(original.spacing)
            : "",
          isPublic: false, // Duplicates are private by default
          isDefault: false, // Duplicates are never default
          authorId: userId,
          assets: JSON.stringify(original.assets),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              pages: true,
            },
          },
        },
      });

      return this.transformDbBrandkit(duplicated);
    } catch (error) {
      throw new Error(
        `Failed to duplicate brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Search brandkits
   */
  static async searchBrandkits(
    query: string,
    userId?: string,
    limit: number = 10
  ): Promise<Brandkit[]> {
    try {
      const where: any = {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      };

      // Include user's own brandkits and public ones
      if (userId) {
        where.AND = {
          OR: [{ authorId: userId }, { isPublic: true }],
        };
      } else {
        where.isPublic = true;
      }

      const brandkits = await prisma.brandkit.findMany({
        where,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              pages: true,
            },
          },
        },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      });

      return brandkits.map(this.transformDbBrandkit);
    } catch (error) {
      throw new Error(
        `Failed to search brandkits: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get brandkit usage statistics
   */
  static async getBrandkitStats(brandkitId: string): Promise<{
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    lastUsed?: Date;
  }> {
    try {
      const stats = await prisma.page.aggregate({
        where: { brandkitId },
        _count: {
          id: true,
        },
      });

      const publishedCount = await prisma.page.count({
        where: {
          brandkitId,
          status: "PUBLISHED",
        },
      });

      const lastUsedPage = await prisma.page.findFirst({
        where: { brandkitId },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      });

      return {
        totalPages: stats._count.id,
        publishedPages: publishedCount,
        draftPages: stats._count.id - publishedCount,
        lastUsed: lastUsedPage?.updatedAt,
      };
    } catch (error) {
      throw new Error(
        `Failed to get brandkit stats: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Transform database brandkit to application brandkit
   */
  private static transformDbBrandkit(dbBrandkit: any): Brandkit {
    return {
      id: dbBrandkit.id,
      name: dbBrandkit.name,
      description: dbBrandkit.description,
      colors:
        typeof dbBrandkit.colors === "string"
          ? JSON.parse(dbBrandkit.colors)
          : dbBrandkit.colors,
      typography: dbBrandkit.typography
        ? typeof dbBrandkit.typography === "string"
          ? JSON.parse(dbBrandkit.typography)
          : dbBrandkit.typography
        : undefined,
      spacing: dbBrandkit.spacing
        ? typeof dbBrandkit.spacing === "string"
          ? JSON.parse(dbBrandkit.spacing)
          : dbBrandkit.spacing
        : undefined,
      isPublic: dbBrandkit.isPublic,
      isDefault: dbBrandkit.isDefault,
      authorId: dbBrandkit.authorId,
      author: dbBrandkit.author,
      usageCount: dbBrandkit._count?.pages || 0,
      isActive: dbBrandkit.isActive,
      version: dbBrandkit.version,
      assets: JSON.parse(dbBrandkit.assets),
      createdAt: dbBrandkit.createdAt,
      updatedAt: dbBrandkit.updatedAt,
    };
  }

  /**
   * Create default brandkits for new installations
   */
  static async createDefaultBrandkits(
    adminUserId: string
  ): Promise<Brandkit[]> {
    const defaultBrandkits = [
      {
        name: "Default Blue",
        description: "Clean and professional blue color scheme",
        colors: JSON.stringify({
          primary: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
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
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            950: "#020617",
          },
          success: {
            500: "#10b981",
            600: "#059669",
            700: "#047857",
          },
          warning: {
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
          },
          error: {
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
          },
          info: {
            500: "#06b6d4",
            600: "#0891b2",
            700: "#0e7490",
          },
          neutral: {
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
          },
          background: {
            primary: "#ffffff",
            secondary: "#f8fafc",
            tertiary: "#f1f5f9",
            inverse: "#0f172a",
          },
          text: {
            primary: "#111827",
            secondary: "#6b7280",
            tertiary: "#9ca3af",
            inverse: "#ffffff",
            link: "#2563eb",
          },
        }),
        typography: JSON.stringify({
          fontFamily: {
            sans: ["Inter", "system-ui", "sans-serif"],
            serif: ["Georgia", "serif"],
            mono: ["Monaco", "monospace"],
          },
          fontSize: {
            xs: "0.75rem",
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
            "4xl": "2.25rem",
          },
          fontWeight: {
            normal: "400",
            medium: "500",
            semibold: "600",
            bold: "700",
          },
        }),
        spacing: JSON.stringify({
          xs: "0.5rem",
          sm: "1rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "3rem",
          "2xl": "4rem",
        }),
        assets: JSON.stringify({
          logos: [],
          icons: [],
          images: [],
          fonts: [],
        }),
      },
      {
        name: "Modern Green",
        description: "Fresh and modern green color palette",
        colors: JSON.stringify({
          primary: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            950: "#052e16",
          },
          // ... similar structure for other colors
        }),
        typography: JSON.stringify({
          fontFamily: {
            sans: ["Inter", "system-ui", "sans-serif"],
            serif: ["Georgia", "serif"],
            mono: ["Monaco", "monospace"],
          },
          fontSize: {
            xs: "0.75rem",
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
            "4xl": "2.25rem",
          },
          fontWeight: {
            normal: "400",
            medium: "500",
            semibold: "600",
            bold: "700",
          },
        }),
        spacing: JSON.stringify({
          xs: "0.5rem",
          sm: "1rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "3rem",
          "2xl": "4rem",
        }),
        assets: JSON.stringify({
          logos: [],
          icons: [],
          images: [],
          fonts: [],
        }),
      },
    ];

    const createdBrandkits: Brandkit[] = [];

    for (const brandkitData of defaultBrandkits) {
      try {
        const brandkit = await this.createBrandkit({
          name: brandkitData.name,
          description: brandkitData.description,
          colors: JSON.parse(brandkitData.colors),
          typography: JSON.parse(brandkitData.typography),
          spacing: JSON.parse(brandkitData.spacing),
          assets: JSON.parse(brandkitData.assets),
          isPublic: true,
          isDefault: true,
          authorId: adminUserId,
        });
        createdBrandkits.push(brandkit);
      } catch (error) {
        console.error(
          `Failed to create default brandkit ${brandkitData.name}:`,
          error
        );
      }
    }

    return createdBrandkits;
  }

  /**
   * Create style preset
   */
  static async createStylePreset(input: StylePresetCreateInput) {
    try {
      const dbPreset = await prisma.stylePreset.create({
        data: {
          name: input.name,
          description: input.description,
          category: input.category,
          sectionType: input.sectionType,
          styleData: JSON.stringify(input.styleData),
          brandkitId: input.brandkitId,
          templateId: input.templateId,
          authorId: input.authorId,
        },
        include: {
          author: {
            select: { id: true, name: true },
          },
          brandkit: {
            select: { id: true, name: true },
          },
        },
      });

      return this.mapDbStylePresetToStylePreset(dbPreset);
    } catch (error) {
      throw new Error(
        `Failed to create style preset: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get style presets
   */
  static async getStylePresets(
    filters: {
      brandkitId?: string;
      templateId?: string;
      category?: PresetCategory;
      sectionType?: string;
      authorId?: string;
    } = {}
  ) {
    try {
      const where: any = {};

      if (filters.brandkitId) where.brandkitId = filters.brandkitId;
      if (filters.templateId) where.templateId = filters.templateId;
      if (filters.category) where.category = filters.category;
      if (filters.sectionType) where.sectionType = filters.sectionType;
      if (filters.authorId) where.authorId = filters.authorId;

      const dbPresets = await prisma.stylePreset.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true },
          },
          brandkit: {
            select: { id: true, name: true },
          },
        },
        orderBy: [{ usageCount: "desc" }, { updatedAt: "desc" }],
      });

      return dbPresets.map(this.mapDbStylePresetToStylePreset);
    } catch (error) {
      throw new Error(
        `Failed to get style presets: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Use style preset (increment usage count)
   */
  static async useStylePreset(id: string): Promise<void> {
    try {
      await prisma.stylePreset.update({
        where: { id },
        data: { usageCount: { increment: 1 } },
      });
    } catch (error) {
      console.error("Failed to increment preset usage:", error);
    }
  }

  /**
   * Create brandkit asset
   */
  static async createBrandkitAsset(input: BrandkitAssetCreateInput) {
    try {
      const dbAsset = await prisma.brandkitAsset.create({
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
          category: input.category,
          url: input.url,
          thumbnailUrl: input.thumbnailUrl,
          metadata: JSON.stringify(input.metadata),
          tags: JSON.stringify(input.tags),
          brandkitId: input.brandkitId,
          authorId: input.authorId,
        },
        include: {
          author: {
            select: { id: true, name: true },
          },
          brandkit: {
            select: { id: true, name: true },
          },
        },
      });

      return this.mapDbBrandkitAssetToBrandkitAsset(dbAsset);
    } catch (error) {
      throw new Error(
        `Failed to create brandkit asset: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get brandkit assets
   */
  static async getBrandkitAssets(
    filters: {
      brandkitId?: string;
      type?: BrandkitAssetType;
      category?: string;
      tags?: string[];
      authorId?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    try {
      const { limit = 20, offset = 0, ...whereFilters } = filters;
      const where: any = {};

      if (whereFilters.brandkitId) where.brandkitId = whereFilters.brandkitId;
      if (whereFilters.type) where.type = whereFilters.type;
      if (whereFilters.category) where.category = whereFilters.category;
      if (whereFilters.authorId) where.authorId = whereFilters.authorId;

      // Note: Tags filtering would require JSON operations in Prisma

      const [dbAssets, total] = await Promise.all([
        prisma.brandkitAsset.findMany({
          where,
          include: {
            author: {
              select: { id: true, name: true },
            },
            brandkit: {
              select: { id: true, name: true },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.brandkitAsset.count({ where }),
      ]);

      return {
        assets: dbAssets.map(this.mapDbBrandkitAssetToBrandkitAsset),
        total,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      throw new Error(
        `Failed to get brandkit assets: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete brandkit asset
   */
  static async deleteBrandkitAsset(
    id: string,
    authorId?: string
  ): Promise<void> {
    try {
      const where: any = { id };
      if (authorId) {
        where.authorId = authorId;
      }

      await prisma.brandkitAsset.delete({ where });
    } catch (error) {
      throw new Error(
        `Failed to delete brandkit asset: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get brandkit usage analytics
   */
  static async getBrandkitAnalytics(brandkitId: string) {
    try {
      const [templateUsage, presetUsage, assetUsage] = await Promise.all([
        prisma.template.count({
          where: { brandkitId },
        }),
        prisma.stylePreset.count({
          where: { brandkitId },
        }),
        prisma.brandkitAsset.count({
          where: { brandkitId },
        }),
      ]);

      return {
        templateUsage,
        presetUsage,
        assetUsage,
        totalUsage: templateUsage + presetUsage,
      };
    } catch (error) {
      throw new Error(
        `Failed to get brandkit analytics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Map database brandkit to Brandkit type
   */
  private static mapDbBrandkitToBrandkit(dbBrandkit: any): Brandkit {
    return {
      id: dbBrandkit.id,
      name: dbBrandkit.name,
      description: dbBrandkit.description,
      isDefault: dbBrandkit.isDefault,
      isActive: dbBrandkit.isActive,
      colors: JSON.parse(dbBrandkit.colors),
      typography: JSON.parse(dbBrandkit.typography),
      spacing: JSON.parse(dbBrandkit.spacing),
      assets: JSON.parse(dbBrandkit.assets),
      authorId: dbBrandkit.authorId,
      author: dbBrandkit.author,
      version: dbBrandkit.version,
      isPublic: dbBrandkit.isPublic,
      usageCount: dbBrandkit._count?.pages || 0,
      createdAt: dbBrandkit.createdAt,
      updatedAt: dbBrandkit.updatedAt,
    };
  }

  /**
   * Map database style preset to StylePreset type
   */
  private static mapDbStylePresetToStylePreset(dbPreset: any): any {
    return {
      id: dbPreset.id,
      name: dbPreset.name,
      description: dbPreset.description,
      category: dbPreset.category,
      sectionType: dbPreset.sectionType,
      styleData: JSON.parse(dbPreset.styleData),
      brandkitId: dbPreset.brandkitId,
      templateId: dbPreset.templateId,
      authorId: dbPreset.authorId,
      author: dbPreset.author,
      brandkit: dbPreset.brandkit,
      usageCount: dbPreset.usageCount,
      createdAt: dbPreset.createdAt,
      updatedAt: dbPreset.updatedAt,
    };
  }

  /**
   * Map database brandkit asset to BrandkitAsset type
   */
  private static mapDbBrandkitAssetToBrandkitAsset(dbAsset: any) {
    return {
      id: dbAsset.id,
      name: dbAsset.name,
      description: dbAsset.description,
      type: dbAsset.type,
      category: dbAsset.category,
      url: dbAsset.url,
      thumbnailUrl: dbAsset.thumbnailUrl,
      metadata: JSON.parse(dbAsset.metadata || "{}"),
      tags: JSON.parse(dbAsset.tags || "[]"),
      brandkitId: dbAsset.brandkitId,
      authorId: dbAsset.authorId,
      author: dbAsset.author,
      brandkit: dbAsset.brandkit,
      createdAt: dbAsset.createdAt,
      updatedAt: dbAsset.updatedAt,
    };
  }

  /**
   * Initialize default brandkit if none exists
   */
  static async initializeDefaultBrandkit(authorId: string): Promise<Brandkit> {
    try {
      const existingDefault = await this.getDefaultBrandkit();
      if (existingDefault) {
        return existingDefault;
      }

      return this.createBrandkit({
        ...DEFAULT_BRANDKIT,
        authorId,
        isDefault: true,
      });
    } catch (error) {
      throw new Error(
        `Failed to initialize default brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Apply brandkit to template sections
   */
  static async applyBrandkitToTemplate(
    brandkitId: string,
    templateId: string
  ): Promise<void> {
    try {
      const brandkit = await this.getBrandkitById(brandkitId);
      if (!brandkit) {
        throw new Error("Brandkit not found");
      }

      // This would involve updating template sections with brandkit values
      // Implementation would depend on how template sections are structured
      // For now, we'll just mark the template as using this brandkit

      await prisma.template.update({
        where: { id: templateId },
        data: { brandkitId },
      });
    } catch (error) {
      throw new Error(
        `Failed to apply brandkit to template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Export brandkit to JSON
   */
  static async exportBrandkit(id: string): Promise<object> {
    try {
      const brandkit = await this.getBrandkitById(id);
      if (!brandkit) {
        throw new Error("Brandkit not found");
      }

      const { ...exportData } = brandkit;

      return {
        ...exportData,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      };
    } catch (error) {
      throw new Error(
        `Failed to export brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Import brandkit from JSON
   */
  static async importBrandkit(
    data: any,
    authorId: string,
    name?: string
  ): Promise<Brandkit> {
    try {
      // Validate imported data structure
      if (!data.colors || !data.typography || !data.spacing || !data.assets) {
        throw new Error("Invalid brandkit data structure");
      }

      return this.createBrandkit({
        name: name || data.name || "Imported Brandkit",
        description: data.description,
        colors: data.colors,
        typography: data.typography,
        spacing: data.spacing,
        assets: data.assets,
        authorId,
        isDefault: false,
      });
    } catch (error) {
      throw new Error(
        `Failed to import brandkit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
