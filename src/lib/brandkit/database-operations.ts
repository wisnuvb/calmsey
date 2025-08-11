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
import { BrandkitAssetType, PresetCategory, StylePreset } from "@prisma/client";

export interface BrandkitCreateInput {
  name: string;
  description?: string;
  colors: BrandkitColors;
  typography: BrandkitTypography;
  spacing: BrandkitSpacing;
  assets: BrandkitAssets;
  authorId: string;
  isDefault?: boolean;
}

export interface BrandkitUpdateInput {
  name?: string;
  description?: string;
  colors?: BrandkitColors;
  typography?: BrandkitTypography;
  spacing?: BrandkitSpacing;
  assets?: BrandkitAssets;
  isActive?: boolean;
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
  limit?: number;
  offset?: number;
}

export class BrandkitDatabase {
  /**
   * Create a new brandkit
   */
  static async createBrandkit(input: BrandkitCreateInput): Promise<Brandkit> {
    try {
      // If this is being set as default, unset other defaults
      if (input.isDefault) {
        await prisma.brandkit.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const dbBrandkit = await prisma.brandkit.create({
        data: {
          name: input.name,
          description: input.description,
          isDefault: input.isDefault || false,
          colors: JSON.stringify(input.colors),
          typography: JSON.stringify(input.typography),
          spacing: JSON.stringify(input.spacing),
          assets: JSON.stringify(input.assets),
          authorId: input.authorId,
        },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      });

      return this.mapDbBrandkitToBrandkit(dbBrandkit);
    } catch (error) {
      throw new Error(
        `Failed to create brandkit: ${
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
