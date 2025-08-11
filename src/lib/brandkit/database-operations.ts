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
  static async useStylePreset(id: string) {
    try {
      await prisma.stylePreset.update({
        where: { id },
        data: { usageCount: { increment: 1 } },
      });
    } catch (error) {
      console.error("Failed to increment preset usage:", error);
    }
  }
}
