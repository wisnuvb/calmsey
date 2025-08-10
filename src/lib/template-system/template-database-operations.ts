/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import {
  Template,
  TemplateAsset,
  PageSection,
  TemplateCategory,
  TemplateDifficulty,
  TemplateStatus,
} from "@/types/page-builder";

export interface TemplateCreateInput {
  name: string;
  description?: string;
  category: TemplateCategory;
  subcategory?: string;
  version: string;
  tags: string[];
  difficulty: TemplateDifficulty;
  previewImage?: string;
  previewImages: string[];
  sections: PageSection[];
  globalStyles?: any;
  assets: TemplateAsset[];
  status: TemplateStatus;
  isPublic: boolean;
  isFeatured: boolean;
  authorId: string;
}

export interface TemplateUpdateInput {
  name?: string;
  description?: string;
  category?: TemplateCategory;
  subcategory?: string;
  version?: string;
  tags?: string[];
  difficulty?: TemplateDifficulty;
  previewImage?: string;
  previewImages?: string[];
  sections?: PageSection[];
  globalStyles?: any;
  assets?: TemplateAsset[];
  status?: TemplateStatus;
  isPublic?: boolean;
  isFeatured?: boolean;
}

export interface TemplateQueryOptions {
  page?: number;
  limit?: number;
  category?: TemplateCategory;
  difficulty?: TemplateDifficulty;
  status?: TemplateStatus;
  isPublic?: boolean;
  isFeatured?: boolean;
  authorId?: string;
  tags?: string[];
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "downloadCount" | "rating" | "name";
  sortOrder?: "asc" | "desc";
}

export interface TemplateQueryResult {
  templates: Template[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: Array<{ category: TemplateCategory; count: number }>;
    difficulties: Array<{ difficulty: TemplateDifficulty; count: number }>;
    tags: Array<{ tag: string; count: number }>;
  };
}

export interface TemplateCreateInput {
  name: string;
  description?: string;
  category: TemplateCategory;
  subcategory?: string;
  version: string;
  tags: string[];
  difficulty: TemplateDifficulty;
  previewImage?: string;
  previewImages: string[];
  sections: PageSection[];
  globalStyles?: any;
  assets: TemplateAsset[];
  status: TemplateStatus;
  isPublic: boolean;
  isFeatured: boolean;
  authorId: string;
}

export interface TemplateUpdateInput {
  name?: string;
  description?: string;
  category?: TemplateCategory;
  subcategory?: string;
  version?: string;
  tags?: string[];
  difficulty?: TemplateDifficulty;
  previewImage?: string;
  previewImages?: string[];
  sections?: PageSection[];
  globalStyles?: any;
  assets?: TemplateAsset[];
  status?: TemplateStatus;
  isPublic?: boolean;
  isFeatured?: boolean;
}

export interface TemplateQueryOptions {
  page?: number;
  limit?: number;
  category?: TemplateCategory;
  difficulty?: TemplateDifficulty;
  status?: TemplateStatus;
  isPublic?: boolean;
  isFeatured?: boolean;
  authorId?: string;
  tags?: string[];
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "downloadCount" | "rating" | "name";
  sortOrder?: "asc" | "desc";
}

export interface TemplateQueryResult {
  templates: Template[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: Array<{ category: TemplateCategory; count: number }>;
    difficulties: Array<{ difficulty: TemplateDifficulty; count: number }>;
    tags: Array<{ tag: string; count: number }>;
  };
}

export class TemplateDatabase {
  /**
   * Create a new template
   */
  static async createTemplate(input: TemplateCreateInput): Promise<Template> {
    try {
      // Prepare template data
      const templateData = {
        sections: input.sections,
        globalStyles: input.globalStyles,
        assets: input.assets,
      };

      const dbTemplate = await prisma.template.create({
        data: {
          name: input.name,
          description: input.description,
          category: input.category,
          subcategory: input.subcategory,
          version: input.version,
          tags: JSON.stringify(input.tags),
          difficulty: input.difficulty,
          previewImage: input.previewImage,
          previewImages: JSON.stringify(input.previewImages),
          templateData: JSON.stringify(templateData),
          hasAssets: input.assets.length > 0,
          status: input.status,
          isPublic: input.isPublic,
          isFeatured: input.isFeatured,
          authorId: input.authorId,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          reviews: true,
        },
      });

      return this.mapDbTemplateToTemplate(dbTemplate);
    } catch (error) {
      throw new Error(
        `Failed to create template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(
    id: string,
    includePrivate = false
  ): Promise<Template | null> {
    try {
      const where: any = { id };
      if (!includePrivate) {
        where.OR = [{ isPublic: true }, { status: "PUBLISHED" }];
      }

      const dbTemplate = await prisma.template.findFirst({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          reviews: true,
        },
      });

      if (!dbTemplate) return null;

      // Increment view count
      await prisma.template.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      return this.mapDbTemplateToTemplate(dbTemplate);
    } catch (error) {
      throw new Error(
        `Failed to get template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update template
   */
  static async updateTemplate(
    id: string,
    input: TemplateUpdateInput,
    authorId?: string
  ): Promise<Template> {
    try {
      // Check permissions
      if (authorId) {
        const existing = await prisma.template.findFirst({
          where: { id, authorId },
        });
        if (!existing) {
          throw new Error("Template not found or access denied");
        }
      }

      // Prepare update data
      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.subcategory !== undefined)
        updateData.subcategory = input.subcategory;
      if (input.version !== undefined) updateData.version = input.version;
      if (input.tags !== undefined)
        updateData.tags = JSON.stringify(input.tags);
      if (input.difficulty !== undefined)
        updateData.difficulty = input.difficulty;
      if (input.previewImage !== undefined)
        updateData.previewImage = input.previewImage;
      if (input.previewImages !== undefined)
        updateData.previewImages = JSON.stringify(input.previewImages);
      if (input.status !== undefined) updateData.status = input.status;
      if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;
      if (input.isFeatured !== undefined)
        updateData.isFeatured = input.isFeatured;

      // Update template data if sections, globalStyles, or assets changed
      if (input.sections || input.globalStyles || input.assets) {
        const existing = await this.getTemplateById(id, true);
        if (!existing) throw new Error("Template not found");

        const templateData = {
          sections: input.sections || existing.sections,
          globalStyles: input.globalStyles || existing.globalStyles,
          assets: input.assets || existing.assets,
        };

        updateData.templateData = JSON.stringify(templateData);
        updateData.hasAssets = (input.assets || existing.assets).length > 0;
      }

      const dbTemplate = await prisma.template.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          reviews: true,
        },
      });

      return this.mapDbTemplateToTemplate(dbTemplate);
    } catch (error) {
      throw new Error(
        `Failed to update template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete template
   */
  static async deleteTemplate(id: string, authorId?: string): Promise<void> {
    try {
      const where: any = { id };
      if (authorId) {
        where.authorId = authorId;
      }

      const deleted = await prisma.template.delete({ where });

      if (!deleted) {
        throw new Error("Template not found or access denied");
      }
    } catch (error) {
      throw new Error(
        `Failed to delete template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Query templates with filtering, pagination, and sorting
   */
  static async queryTemplates(
    options: TemplateQueryOptions = {}
  ): Promise<TemplateQueryResult> {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        difficulty,
        status,
        isPublic,
        isFeatured,
        authorId,
        tags,
        search,
        sortBy = "updatedAt",
        sortOrder = "desc",
      } = options;

      // Build where clause
      const where: any = {};

      if (category) where.category = category;
      if (difficulty) where.difficulty = difficulty;
      if (status) where.status = status;
      if (isPublic !== undefined) where.isPublic = isPublic;
      if (isFeatured !== undefined) where.isFeatured = isFeatured;
      if (authorId) where.authorId = authorId;

      if (tags && tags.length > 0) {
        // Search for templates that have any of the specified tags
        where.tags = {
          contains: tags[0], // Simple implementation - could be improved with JSON operations
        };
      }

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { subcategory: { contains: search } },
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [dbTemplates, total] = await Promise.all([
        prisma.template.findMany({
          where,
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
            reviews: true,
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.template.count({ where }),
      ]);

      // Get filter statistics
      const [categoryStats, difficultyStats, tagStats] = await Promise.all([
        this.getCategoryStats(where),
        this.getDifficultyStats(where),
        this.getTagStats(where),
      ]);

      const templates = dbTemplates.map(this.mapDbTemplateToTemplate);

      return {
        templates,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          categories: categoryStats,
          difficulties: difficultyStats,
          tags: tagStats,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to query templates: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get featured templates
   */
  static async getFeaturedTemplates(limit = 10): Promise<Template[]> {
    try {
      const dbTemplates = await prisma.template.findMany({
        where: {
          isFeatured: true,
          isPublic: true,
          status: "PUBLISHED",
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          reviews: true,
        },
        orderBy: { downloadCount: "desc" },
        take: limit,
      });

      return dbTemplates.map(this.mapDbTemplateToTemplate);
    } catch (error) {
      throw new Error(
        `Failed to get featured templates: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get popular templates
   */
  static async getPopularTemplates(
    limit = 10,
    timeframe = "30d"
  ): Promise<Template[]> {
    try {
      const since = new Date();
      switch (timeframe) {
        case "7d":
          since.setDate(since.getDate() - 7);
          break;
        case "30d":
          since.setDate(since.getDate() - 30);
          break;
        case "90d":
          since.setDate(since.getDate() - 90);
          break;
      }

      const dbTemplates = await prisma.template.findMany({
        where: {
          isPublic: true,
          status: "PUBLISHED",
          updatedAt: { gte: since },
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          reviews: true,
        },
        orderBy: [
          { downloadCount: "desc" },
          { viewCount: "desc" },
          { rating: "desc" },
        ],
        take: limit,
      });

      return dbTemplates.map(this.mapDbTemplateToTemplate);
    } catch (error) {
      throw new Error(
        `Failed to get popular templates: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Increment template download count
   */
  static async incrementDownloadCount(id: string): Promise<void> {
    try {
      await prisma.template.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
      });
    } catch (error) {
      console.error("Failed to increment download count:", error);
    }
  }

  /**
   * Add template review
   */
  static async addReview(
    templateId: string,
    userId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    try {
      // Upsert review (update if exists, create if not)
      await prisma.templateReview.upsert({
        where: {
          templateId_userId: { templateId, userId },
        },
        create: {
          templateId,
          userId,
          rating,
          comment,
          isPublic: true,
        },
        update: {
          rating,
          comment,
        },
      });

      // Recalculate template rating
      await this.recalculateTemplateRating(templateId);
    } catch (error) {
      throw new Error(
        `Failed to add review: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get template reviews
   */
  static async getTemplateReviews(templateId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        prisma.templateReview.findMany({
          where: { templateId, isPublic: true },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.templateReview.count({
          where: { templateId, isPublic: true },
        }),
      ]);

      return {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to get reviews: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Search templates by content
   */
  static async searchTemplateContent(
    query: string,
    options: TemplateQueryOptions = {}
  ): Promise<Template[]> {
    try {
      // This is a simplified search - in production you'd use a proper search engine
      const dbTemplates = await prisma.template.findMany({
        where: {
          isPublic: true,
          status: "PUBLISHED",
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { templateData: { contains: query } },
          ],
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          reviews: true,
        },
        take: options.limit || 20,
      });

      return dbTemplates.map(this.mapDbTemplateToTemplate);
    } catch (error) {
      throw new Error(
        `Failed to search templates: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get similar templates
   */
  static async getSimilarTemplates(
    templateId: string,
    limit = 5
  ): Promise<Template[]> {
    try {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template) return [];

      const dbTemplates = await prisma.template.findMany({
        where: {
          id: { not: templateId },
          category: template.category,
          isPublic: true,
          status: "PUBLISHED",
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          reviews: true,
        },
        orderBy: { downloadCount: "desc" },
        take: limit,
      });

      return dbTemplates.map(this.mapDbTemplateToTemplate);
    } catch (error) {
      throw new Error(
        `Failed to get similar templates: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Clone template
   */
  static async cloneTemplate(
    templateId: string,
    newName: string,
    authorId: string
  ): Promise<Template> {
    try {
      const original = await this.getTemplateById(templateId, true);
      if (!original) {
        throw new Error("Template not found");
      }

      const cloneInput: TemplateCreateInput = {
        name: newName,
        description: `Cloned from: ${original.name}`,
        category: original.category,
        subcategory: original.subcategory,
        version: "1.0.0",
        tags: [...original.tags],
        difficulty: original.difficulty,
        previewImage: original.previewImage,
        previewImages: [...original.previewImages],
        sections: JSON.parse(JSON.stringify(original.sections)), // Deep clone
        globalStyles: original.globalStyles
          ? JSON.parse(JSON.stringify(original.globalStyles))
          : undefined,
        assets: JSON.parse(JSON.stringify(original.assets)), // Deep clone
        status: "DRAFT",
        isPublic: false,
        isFeatured: false,
        authorId,
      };

      return await this.createTemplate(cloneInput);
    } catch (error) {
      throw new Error(
        `Failed to clone template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Export template data for backup/migration
   */
  static async exportTemplateData(templateId: string): Promise<any> {
    try {
      const dbTemplate = await prisma.template.findUnique({
        where: { id: templateId },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          reviews: {
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!dbTemplate) {
        throw new Error("Template not found");
      }

      return {
        template: this.mapDbTemplateToTemplate(dbTemplate),
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      };
    } catch (error) {
      throw new Error(
        `Failed to export template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Import template data from backup/migration
   */
  static async importTemplateData(
    templateData: any,
    authorId: string
  ): Promise<Template> {
    try {
      const template = templateData.template;

      const importInput: TemplateCreateInput = {
        name: `${template.name} (Imported)`,
        description: template.description,
        category: template.category,
        subcategory: template.subcategory,
        version: template.version,
        tags: template.tags,
        difficulty: template.difficulty,
        previewImage: template.previewImage,
        previewImages: template.previewImages,
        sections: template.sections,
        globalStyles: template.globalStyles,
        assets: template.assets,
        status: "DRAFT",
        isPublic: false,
        isFeatured: false,
        authorId,
      };

      return await this.createTemplate(importInput);
    } catch (error) {
      throw new Error(
        `Failed to import template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Map database template to application template
   */
  private static mapDbTemplateToTemplate(dbTemplate: any): Template {
    const templateData = JSON.parse(dbTemplate.templateData);

    return {
      id: dbTemplate.id,
      name: dbTemplate.name,
      description: dbTemplate.description,
      category: dbTemplate.category,
      subcategory: dbTemplate.subcategory,
      version: dbTemplate.version,
      tags: JSON.parse(dbTemplate.tags || "[]"),
      difficulty: dbTemplate.difficulty,
      previewImage: dbTemplate.previewImage,
      previewImages: JSON.parse(dbTemplate.previewImages || "[]"),
      sections: templateData.sections || [],
      globalStyles: templateData.globalStyles,
      assets: templateData.assets || [],
      status: dbTemplate.status,
      isPublic: dbTemplate.isPublic,
      isFeatured: dbTemplate.isFeatured,
      downloadCount: dbTemplate.downloadCount,
      viewCount: dbTemplate.viewCount,
      rating: dbTemplate.rating,
      ratingCount: dbTemplate.ratingCount,
      author: {
        id: dbTemplate.author.id,
        name: dbTemplate.author.name || "Anonymous",
        avatar: dbTemplate.author.avatar,
      },
      createdAt: dbTemplate.createdAt,
      updatedAt: dbTemplate.updatedAt,
    };
  }

  /**
   * Recalculate template rating from reviews
   */
  private static async recalculateTemplateRating(
    templateId: string
  ): Promise<void> {
    try {
      const reviews = await prisma.templateReview.findMany({
        where: { templateId },
        select: { rating: true },
      });

      if (reviews.length === 0) {
        await prisma.template.update({
          where: { id: templateId },
          data: { rating: null, ratingCount: 0 },
        });
        return;
      }

      const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

      await prisma.template.update({
        where: { id: templateId },
        data: {
          rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
          ratingCount: reviews.length,
        },
      });
    } catch (error) {
      console.error("Failed to recalculate rating:", error);
    }
  }

  /**
   * Get category statistics
   */
  private static async getCategoryStats(
    baseWhere: any
  ): Promise<Array<{ category: TemplateCategory; count: number }>> {
    try {
      const stats = await prisma.template.groupBy({
        by: ["category"],
        where: baseWhere,
        _count: { category: true },
      });

      return stats.map((stat) => ({
        category: stat.category as TemplateCategory,
        count: stat._count.category,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get difficulty statistics
   */
  private static async getDifficultyStats(
    baseWhere: any
  ): Promise<Array<{ difficulty: TemplateDifficulty; count: number }>> {
    try {
      const stats = await prisma.template.groupBy({
        by: ["difficulty"],
        where: baseWhere,
        _count: { difficulty: true },
      });

      return stats.map((stat) => ({
        difficulty: stat.difficulty,
        count: stat._count.difficulty,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get tag statistics
   */
  private static async getTagStats(
    baseWhere: any
  ): Promise<Array<{ tag: string; count: number }>> {
    try {
      // This is a simplified implementation
      // In production, you'd want to properly parse JSON and aggregate tags
      const templates = await prisma.template.findMany({
        where: baseWhere,
        select: { tags: true },
      });

      const tagCounts = new Map<string, number>();

      templates.forEach((template) => {
        try {
          const tags = JSON.parse(template.tags || "[]");
          tags.forEach((tag: string) => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
          });
        } catch {
          // Skip invalid JSON
        }
      });

      return Array.from(tagCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Top 20 tags
    } catch {
      return [];
    }
  }
}

// ===== TEMPLATE ANALYTICS =====

export class TemplateAnalytics {
  /**
   * Get template analytics dashboard data
   */
  static async getDashboardAnalytics(
    authorId?: string
  ): Promise<TemplateDashboardAnalytics> {
    try {
      const where = authorId ? { authorId } : {};

      const [
        totalTemplates,
        publishedTemplates,
        totalDownloads,
        totalViews,
        averageRating,
        recentActivity,
      ] = await Promise.all([
        prisma.template.count({ where }),
        prisma.template.count({ where: { ...where, status: "PUBLISHED" } }),
        prisma.template.aggregate({
          where,
          _sum: { downloadCount: true },
        }),
        prisma.template.aggregate({
          where,
          _sum: { viewCount: true },
        }),
        prisma.template.aggregate({
          where: { ...where, rating: { not: null } },
          _avg: { rating: true },
        }),
        prisma.template.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          take: 10,
          select: {
            id: true,
            name: true,
            status: true,
            downloadCount: true,
            viewCount: true,
            updatedAt: true,
          },
        }),
      ]);

      return {
        totalTemplates,
        publishedTemplates,
        totalDownloads: totalDownloads._sum.downloadCount || 0,
        totalViews: totalViews._sum.viewCount || 0,
        averageRating: Math.round((averageRating._avg.rating || 0) * 100) / 100,
        recentActivity,
      };
    } catch (error) {
      throw new Error(
        `Failed to get analytics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get template performance metrics
   */
  static async getTemplatePerformance(
    templateId: string,
    days = 30
  ): Promise<TemplatePerformanceMetrics> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      // Note: This would require additional tracking tables in a real implementation
      // For now, we'll return current stats
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        select: {
          downloadCount: true,
          viewCount: true,
          rating: true,
          ratingCount: true,
          updatedAt: true,
        },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      return {
        downloads: template.downloadCount,
        views: template.viewCount,
        rating: template.rating || 0,
        reviews: template.ratingCount,
        lastUpdated: template.updatedAt,
        // These would come from time-series data in a real implementation
        downloadTrend: "up",
        viewTrend: "up",
        popularityScore: this.calculatePopularityScore(template),
      };
    } catch (error) {
      throw new Error(
        `Failed to get performance metrics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Calculate popularity score
   */
  private static calculatePopularityScore(template: any): number {
    const downloads = template.downloadCount || 0;
    const views = template.viewCount || 0;
    const rating = template.rating || 0;
    const reviews = template.ratingCount || 0;

    // Simple popularity formula - can be made more sophisticated
    const downloadScore = Math.min(downloads / 100, 50); // Max 50 points
    const viewScore = Math.min(views / 1000, 25); // Max 25 points
    const ratingScore = rating * 4; // Max 20 points (5 stars * 4)
    const reviewScore = Math.min(reviews / 10, 5); // Max 5 points

    return Math.round(downloadScore + viewScore + ratingScore + reviewScore);
  }
}

// ===== BATCH OPERATIONS =====

export class TemplateBatchOperations {
  /**
   * Bulk update template status
   */
  static async bulkUpdateStatus(
    templateIds: string[],
    status: TemplateStatus,
    authorId?: string
  ): Promise<number> {
    try {
      const where: any = { id: { in: templateIds } };
      if (authorId) {
        where.authorId = authorId;
      }

      const result = await prisma.template.updateMany({
        where,
        data: { status },
      });

      return result.count;
    } catch (error) {
      throw new Error(
        `Failed to bulk update status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Bulk delete templates
   */
  static async bulkDeleteTemplates(
    templateIds: string[],
    authorId?: string
  ): Promise<number> {
    try {
      const where: any = { id: { in: templateIds } };
      if (authorId) {
        where.authorId = authorId;
      }

      const result = await prisma.template.deleteMany({ where });
      return result.count;
    } catch (error) {
      throw new Error(
        `Failed to bulk delete: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Bulk assign category
   */
  static async bulkAssignCategory(
    templateIds: string[],
    category: TemplateCategory,
    authorId?: string
  ): Promise<number> {
    try {
      const where: any = { id: { in: templateIds } };
      if (authorId) {
        where.authorId = authorId;
      }

      const result = await prisma.template.updateMany({
        where,
        data: { category },
      });

      return result.count;
    } catch (error) {
      throw new Error(
        `Failed to bulk assign category: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// ===== INTERFACES =====

export interface TemplateDashboardAnalytics {
  totalTemplates: number;
  publishedTemplates: number;
  totalDownloads: number;
  totalViews: number;
  averageRating: number;
  recentActivity: Array<{
    id: string;
    name: string;
    status: TemplateStatus;
    downloadCount: number;
    viewCount: number;
    updatedAt: Date;
  }>;
}

export interface TemplatePerformanceMetrics {
  downloads: number;
  views: number;
  rating: number;
  reviews: number;
  lastUpdated: Date;
  downloadTrend: "up" | "down" | "stable";
  viewTrend: "up" | "down" | "stable";
  popularityScore: number;
}

// ===== USAGE EXAMPLES =====

/*
// Create a new template
const template = await TemplateDatabase.createTemplate({
  name: "Modern Landing Page",
  description: "A clean, modern landing page template",
  category: "HOMEPAGE",
  version: "1.0.0",
  tags: ["modern", "landing", "business"],
  difficulty: "BEGINNER",
  sections: [...],
  assets: [...],
  status: "PUBLISHED",
  isPublic: true,
  isFeatured: false,
  authorId: "user123"
});

// Query templates with filters
const result = await TemplateDatabase.queryTemplates({
  category: "HOMEPAGE",
  difficulty: "BEGINNER",
  isPublic: true,
  page: 1,
  limit: 10,
  sortBy: "downloadCount",
  sortOrder: "desc"
});

// Get featured templates
const featured = await TemplateDatabase.getFeaturedTemplates(5);

// Add a review
await TemplateDatabase.addReview("template123", "user456", 5, "Great template!");

// Clone a template
const cloned = await TemplateDatabase.cloneTemplate("template123", "My Custom Homepage", "user789");

// Get analytics
const analytics = await TemplateAnalytics.getDashboardAnalytics("user123");
*/
