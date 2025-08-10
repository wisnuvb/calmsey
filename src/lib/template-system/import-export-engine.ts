// src/lib/template-system/import-export-engine.ts
import JSZip from "jszip";
import { Template, TemplateAsset } from "@/types/page-builder";
import { sanitizeTemplateData, TemplateValidator } from "./template-validator";

export interface TemplatePackage {
  manifest: TemplateManifest;
  template: Template;
  assets: Map<string, File | ArrayBuffer>;
  screenshots: Map<string, File | ArrayBuffer>;
}

export interface TemplateManifest {
  version: string;
  name: string;
  description?: string;
  author: {
    name: string;
    email?: string;
    website?: string;
  };
  created: string;
  templateVersion: string;
  compatibility: {
    minVersion: string;
    maxVersion?: string;
  };
  assets: TemplateAssetManifest[];
  dependencies?: string[];
  license?: string;
  tags: string[];
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export interface TemplateAssetManifest {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document" | "font" | "icon";
  path: string;
  size: number;
  mimeType: string;
  checksum?: string;
}

export class TemplateImportExportEngine {
  private static readonly MANIFEST_FILE = "manifest.json";
  private static readonly TEMPLATE_FILE = "template.json";
  private static readonly ASSETS_DIR = "assets/";
  private static readonly SCREENSHOTS_DIR = "screenshots/";
  private static readonly MAX_PACKAGE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly SUPPORTED_VERSIONS = ["1.0.0", "1.1.0"];

  // ===== EXPORT FUNCTIONALITY =====

  /**
   * Export template as ZIP package
   */
  static async exportTemplate(
    template: Template,
    options: ExportOptions = {}
  ): Promise<Blob> {
    try {
      const zip = new JSZip();

      // Create manifest
      const manifest = this.createManifest(template, options);
      zip.file(this.MANIFEST_FILE, JSON.stringify(manifest, null, 2));

      // Add template data
      const sanitizedTemplate = this.sanitizeTemplateForExport(template);
      zip.file(this.TEMPLATE_FILE, JSON.stringify(sanitizedTemplate, null, 2));

      // Add assets if included
      if (options.includeAssets !== false) {
        await this.addAssetsToZip(zip, template.assets);
      }

      // Add screenshots
      if (template.previewImages.length > 0) {
        await this.addScreenshotsToZip(zip, template.previewImages);
      }

      // Generate ZIP
      const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      // Validate size
      if (blob.size > this.MAX_PACKAGE_SIZE) {
        throw new Error(
          `Template package too large: ${this.formatFileSize(
            blob.size
          )}. Maximum allowed: ${this.formatFileSize(this.MAX_PACKAGE_SIZE)}`
        );
      }

      return blob;
    } catch (error) {
      throw new Error(
        `Failed to export template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Export multiple templates as collection
   */
  static async exportTemplateCollection(
    templates: Template[],
    collectionName: string,
    options: ExportOptions = {}
  ): Promise<Blob> {
    const zip = new JSZip();

    // Collection manifest
    const collectionManifest = {
      name: collectionName,
      version: "1.0.0",
      created: new Date().toISOString(),
      templates: templates.length,
      totalAssets: templates.reduce((sum, t) => sum + t.assets.length, 0),
    };

    zip.file("collection.json", JSON.stringify(collectionManifest, null, 2));

    // Add each template as subfolder
    for (const template of templates) {
      const templateFolder = zip.folder(`templates/${template.id}`);
      if (!templateFolder) continue;

      const manifest = this.createManifest(template, options);
      templateFolder.file(
        this.MANIFEST_FILE,
        JSON.stringify(manifest, null, 2)
      );

      const sanitizedTemplate = this.sanitizeTemplateForExport(template);
      templateFolder.file(
        this.TEMPLATE_FILE,
        JSON.stringify(sanitizedTemplate, null, 2)
      );

      if (options.includeAssets !== false) {
        await this.addAssetsToZip(templateFolder, template.assets);
      }
    }

    return await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });
  }

  // ===== IMPORT FUNCTIONALITY =====

  /**
   * Import template from ZIP package
   */
  static async importTemplate(
    zipBlob: Blob,
    options: ImportOptions = {}
  ): Promise<TemplatePackage> {
    try {
      // Validate file size
      if (zipBlob.size > this.MAX_PACKAGE_SIZE) {
        throw new Error(
          `File too large: ${this.formatFileSize(
            zipBlob.size
          )}. Maximum allowed: ${this.formatFileSize(this.MAX_PACKAGE_SIZE)}`
        );
      }

      // Load ZIP
      const zip = await JSZip.loadAsync(zipBlob);

      // Read and validate manifest
      const manifestFile = zip.file(this.MANIFEST_FILE);
      if (!manifestFile) {
        throw new Error("Invalid template package: missing manifest.json");
      }

      const manifestContent = await manifestFile.async("text");
      const manifest: TemplateManifest = JSON.parse(manifestContent);

      // Validate compatibility
      this.validateCompatibility(manifest);

      // Read template data
      const templateFile = zip.file(this.TEMPLATE_FILE);
      if (!templateFile) {
        throw new Error("Invalid template package: missing template.json");
      }

      const templateContent = await templateFile.async("text");
      let template: Template = JSON.parse(templateContent);

      // Security validation and sanitization
      template = await sanitizeTemplateData(
        template,
        options.securityLevel || "STRICT"
      );

      // Validate template structure
      const validationResult = await TemplateValidator.validateTemplate(
        template,
        manifest
      );
      if (!validationResult.isValid) {
        throw new Error(
          `Template validation failed: ${validationResult.errors.join(", ")}`
        );
      }

      // Extract assets
      const assets = new Map<string, ArrayBuffer>();
      const screenshots = new Map<string, ArrayBuffer>();

      if (options.includeAssets !== false) {
        await this.extractAssetsFromZip(zip, assets, manifest.assets);
      }

      await this.extractScreenshotsFromZip(zip, screenshots);

      return {
        manifest,
        template,
        assets,
        screenshots,
      };
    } catch (error) {
      throw new Error(
        `Failed to import template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Preview template package without full import
   */
  static async previewTemplate(zipBlob: Blob): Promise<TemplatePreview> {
    const zip = await JSZip.loadAsync(zipBlob);

    const manifestFile = zip.file(this.MANIFEST_FILE);
    if (!manifestFile) {
      throw new Error("Invalid template package: missing manifest.json");
    }

    const manifest: TemplateManifest = JSON.parse(
      await manifestFile.async("text")
    );

    // Get basic template info without full parsing
    const templateFile = zip.file(this.TEMPLATE_FILE);
    const templateData = templateFile
      ? JSON.parse(await templateFile.async("text"))
      : null;

    // Extract preview images
    const previewImages: string[] = [];
    for (const fileName of Object.keys(zip.files)) {
      if (
        fileName.startsWith(this.SCREENSHOTS_DIR) &&
        this.isImageFile(fileName)
      ) {
        const file = zip.file(fileName);
        if (file) {
          const blob = await file.async("blob");
          previewImages.push(URL.createObjectURL(blob));
        }
      }
    }

    return {
      manifest,
      sectionCount: templateData?.sections?.length || 0,
      assetCount: manifest.assets.length,
      packageSize: zipBlob.size,
      previewImages,
      isValid: true,
      warnings: [],
    };
  }

  // ===== HELPER METHODS =====

  private static createManifest(
    template: Template,
    options: ExportOptions
  ): TemplateManifest {
    return {
      version: "1.0.0",
      name: template.name,
      description: template.description,
      author: {
        name: template.author.name,
        email: options.includeAuthorEmail ? template.author.id : undefined,
      },
      created: new Date().toISOString(),
      templateVersion: template.version,
      compatibility: {
        minVersion: "1.0.0",
        maxVersion: "2.0.0",
      },
      assets: template.assets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        path: `${this.ASSETS_DIR}${asset.name}`,
        size: asset.size,
        mimeType: asset.mimeType,
      })),
      dependencies: options.dependencies || [],
      license: options.license,
      tags: template.tags,
      category: template.category,
      difficulty: template.difficulty,
    };
  }

  private static sanitizeTemplateForExport(
    template: Template
  ): Partial<Template> {
    const {
      id,
      author,
      createdAt,
      updatedAt,
      downloadCount,
      viewCount,
      rating,
      ratingCount,
      ...exportData
    } = template;

    // Remove sensitive data and generate new IDs
    return {
      ...exportData,
      sections: template.sections.map((section) => ({
        ...section,
        id: this.generateNewId(), // Generate new ID for import
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };
  }

  private static async addAssetsToZip(
    zip: JSZip,
    assets: TemplateAsset[]
  ): Promise<void> {
    const assetsFolder = zip.folder(this.ASSETS_DIR);
    if (!assetsFolder) return;

    for (const asset of assets) {
      try {
        // Fetch asset data
        const response = await fetch(asset.url);
        if (response.ok) {
          const blob = await response.blob();
          assetsFolder.file(asset.name, blob);
        }
      } catch (error) {
        console.warn(`Failed to include asset: ${asset.name}`, error);
      }
    }
  }

  private static async addScreenshotsToZip(
    zip: JSZip,
    screenshots: string[]
  ): Promise<void> {
    const screenshotsFolder = zip.folder(this.SCREENSHOTS_DIR);
    if (!screenshotsFolder) return;

    for (let i = 0; i < screenshots.length; i++) {
      try {
        const response = await fetch(screenshots[i]);
        if (response.ok) {
          const blob = await response.blob();
          const extension = this.getFileExtension(blob.type);
          screenshotsFolder.file(`preview-${i + 1}.${extension}`, blob);
        }
      } catch (error) {
        console.warn(`Failed to include screenshot: ${screenshots[i]}`, error);
      }
    }
  }

  private static async extractAssetsFromZip(
    zip: JSZip,
    assets: Map<string, ArrayBuffer>,
    manifestAssets: TemplateAssetManifest[]
  ): Promise<void> {
    for (const assetInfo of manifestAssets) {
      const file = zip.file(assetInfo.path);
      if (file) {
        const data = await file.async("arraybuffer");
        assets.set(assetInfo.id, data);
      }
    }
  }

  private static async extractScreenshotsFromZip(
    zip: JSZip,
    screenshots: Map<string, ArrayBuffer>
  ): Promise<void> {
    for (const fileName of Object.keys(zip.files)) {
      if (
        fileName.startsWith(this.SCREENSHOTS_DIR) &&
        this.isImageFile(fileName)
      ) {
        const file = zip.file(fileName);
        if (file) {
          const data = await file.async("arraybuffer");
          screenshots.set(fileName, data);
        }
      }
    }
  }

  private static validateCompatibility(manifest: TemplateManifest): void {
    if (!this.SUPPORTED_VERSIONS.includes(manifest.version)) {
      throw new Error(
        `Unsupported template version: ${
          manifest.version
        }. Supported versions: ${this.SUPPORTED_VERSIONS.join(", ")}`
      );
    }

    // Additional compatibility checks can be added here
  }

  private static isImageFile(fileName: string): boolean {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  }

  private static getFileExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
    };
    return extensions[mimeType] || "bin";
  }

  private static formatFileSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  private static generateNewId(): string {
    return `sect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ===== INTERFACES =====

export interface ExportOptions {
  includeAssets?: boolean;
  includeAuthorEmail?: boolean;
  dependencies?: string[];
  license?: string;
  compression?: "none" | "fast" | "best";
}

export interface ImportOptions {
  includeAssets?: boolean;
  securityLevel?: "STRICT" | "MODERATE" | "PERMISSIVE";
  overwriteExisting?: boolean;
  validateAssets?: boolean;
}

export interface TemplatePreview {
  manifest: TemplateManifest;
  sectionCount: number;
  assetCount: number;
  packageSize: number;
  previewImages: string[];
  isValid: boolean;
  warnings: string[];
}

// ===== USAGE EXAMPLES =====

/*
// Export template
const exportedBlob = await TemplateImportExportEngine.exportTemplate(template, {
  includeAssets: true,
  includeAuthorEmail: false,
  license: 'MIT'
});

// Import template
const templatePackage = await TemplateImportExportEngine.importTemplate(zipBlob, {
  includeAssets: true,
  securityLevel: 'STRICT'
});

// Preview before import
const preview = await TemplateImportExportEngine.previewTemplate(zipBlob);
console.log(`Template: ${preview.manifest.name}, Sections: ${preview.sectionCount}`);
*/
