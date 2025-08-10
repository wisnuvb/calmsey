/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/template-system/zip-package-handler.ts
import JSZip from "jszip";
import { TemplateAsset } from "@/types/page-builder";

export interface ZipPackageInfo {
  totalFiles: number;
  totalSize: number;
  hasManifest: boolean;
  hasTemplate: boolean;
  assetCount: number;
  screenshotCount: number;
  structure: ZipFileStructure;
}

export interface ZipFileStructure {
  manifest?: ZipFileInfo;
  template?: ZipFileInfo;
  assets: ZipFileInfo[];
  screenshots: ZipFileInfo[];
  other: ZipFileInfo[];
}

export interface ZipFileInfo {
  name: string;
  path: string;
  size: number;
  compressedSize: number;
  type: "file" | "folder";
  mimeType?: string;
  lastModified?: Date;
}

export interface AssetProcessingResult {
  processed: TemplateAsset[];
  failed: AssetProcessingError[];
  totalSize: number;
}

export interface AssetProcessingError {
  name: string;
  path: string;
  error: string;
}

export interface ZipValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: ZipPackageInfo;
}

export class ZipPackageHandler {
  private static readonly MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
  private static readonly MAX_FILES = 1000;
  private static readonly ALLOWED_EXTENSIONS = new Set([
    ".json",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".mp4",
    ".webm",
    ".mp3",
    ".wav",
    ".ogg",
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".css",
    ".js",
    ".html",
  ]);

  private static readonly DANGEROUS_EXTENSIONS = new Set([
    ".exe",
    ".bat",
    ".cmd",
    ".scr",
    ".pif",
    ".vbs",
    ".js",
    ".jar",
    ".com",
    ".msi",
    ".dll",
    ".app",
    ".deb",
    ".rpm",
  ]);

  /**
   * Validate ZIP package structure and content
   */
  static async validateZipPackage(zipBlob: Blob): Promise<ZipValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Basic size check
      if (zipBlob.size > this.MAX_TOTAL_SIZE) {
        errors.push(
          `Package size (${this.formatFileSize(
            zipBlob.size
          )}) exceeds maximum allowed (${this.formatFileSize(
            this.MAX_TOTAL_SIZE
          )})`
        );
      }

      // Load ZIP
      const zip = await JSZip.loadAsync(zipBlob);
      const info = await this.analyzeZipStructure(zip);

      // Validate structure
      if (!info.hasManifest) {
        errors.push("Missing required manifest.json file");
      }

      if (!info.hasTemplate) {
        errors.push("Missing required template.json file");
      }

      if (info.totalFiles > this.MAX_FILES) {
        errors.push(
          `Too many files (${info.totalFiles}). Maximum allowed: ${this.MAX_FILES}`
        );
      }

      // Validate individual files
      await this.validateFiles(zip, errors, warnings);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        info,
      };
    } catch (error) {
      errors.push(
        `Failed to read ZIP package: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      return {
        isValid: false,
        errors,
        warnings,
        info: this.createEmptyPackageInfo(),
      };
    }
  }

  /**
   * Analyze ZIP package structure
   */
  static async analyzeZipStructure(zip: JSZip): Promise<ZipPackageInfo> {
    const structure: ZipFileStructure = {
      assets: [],
      screenshots: [],
      other: [],
    };

    let totalSize = 0;
    let assetCount = 0;
    let screenshotCount = 0;

    for (const [path, file] of Object.entries(zip.files)) {
      if (file.dir) continue; // Skip directories

      const fileInfo: ZipFileInfo = {
        name: this.getFileName(path),
        path,
        size: (file as any)._data?.uncompressedSize || 0,
        compressedSize: (file as any)._data?.compressedSize || 0,
        type: "file",
        mimeType: this.getMimeType(path),
        lastModified: file.date,
      };

      totalSize += fileInfo.size;

      // Categorize files
      if (path === "manifest.json") {
        structure.manifest = fileInfo;
      } else if (path === "template.json") {
        structure.template = fileInfo;
      } else if (path.startsWith("assets/")) {
        structure.assets.push(fileInfo);
        assetCount++;
      } else if (path.startsWith("screenshots/")) {
        structure.screenshots.push(fileInfo);
        screenshotCount++;
      } else {
        structure.other.push(fileInfo);
      }
    }

    return {
      totalFiles: Object.keys(zip.files).filter((path) => !zip.files[path].dir)
        .length,
      totalSize,
      hasManifest: !!structure.manifest,
      hasTemplate: !!structure.template,
      assetCount,
      screenshotCount,
      structure,
    };
  }

  /**
   * Extract and process assets from ZIP
   */
  static async processAssetsFromZip(
    zip: JSZip,
    assetManifest: Array<{
      id: string;
      name: string;
      path: string;
      type: string;
    }>
  ): Promise<AssetProcessingResult> {
    const processed: TemplateAsset[] = [];
    const failed: AssetProcessingError[] = [];
    let totalSize = 0;

    for (const assetInfo of assetManifest) {
      try {
        const file = zip.file(assetInfo.path);
        if (!file) {
          failed.push({
            name: assetInfo.name,
            path: assetInfo.path,
            error: "File not found in package",
          });
          continue;
        }

        // Validate file size
        const fileSize = (file as any)._data?.uncompressedSize || 0;
        if (fileSize > this.MAX_FILE_SIZE) {
          failed.push({
            name: assetInfo.name,
            path: assetInfo.path,
            error: `File too large: ${this.formatFileSize(fileSize)}`,
          });
          continue;
        }

        // Validate file type
        const extension = this.getFileExtension(assetInfo.name);
        if (!this.ALLOWED_EXTENSIONS.has(extension)) {
          failed.push({
            name: assetInfo.name,
            path: assetInfo.path,
            error: `File type not allowed: ${extension}`,
          });
          continue;
        }

        // Extract file data
        const arrayBuffer = await file.async("arraybuffer");
        new Blob([arrayBuffer], {
          type: this.getMimeType(assetInfo.name),
        });

        // Create asset object
        const asset: TemplateAsset = {
          id: assetInfo.id,
          type: assetInfo.type as any,
          name: assetInfo.name,
          url: "", // Will be set after upload
          size: fileSize,
          mimeType: this.getMimeType(assetInfo.name),
          description: `Imported from template package`,
        };

        processed.push(asset);
        totalSize += fileSize;
      } catch (error) {
        failed.push({
          name: assetInfo.name,
          path: assetInfo.path,
          error: error instanceof Error ? error.message : "Processing failed",
        });
      }
    }

    return {
      processed,
      failed,
      totalSize,
    };
  }

  /**
   * Extract file as blob
   */
  static async extractFileAsBlob(
    zip: JSZip,
    path: string
  ): Promise<Blob | null> {
    const file = zip.file(path);
    if (!file) return null;

    try {
      const arrayBuffer = await file.async("arraybuffer");
      return new Blob([arrayBuffer], { type: this.getMimeType(path) });
    } catch (error) {
      console.error(`Failed to extract file ${path}:`, error);
      return null;
    }
  }

  /**
   * Extract file as text
   */
  static async extractFileAsText(
    zip: JSZip,
    path: string
  ): Promise<string | null> {
    const file = zip.file(path);
    if (!file) return null;

    try {
      return await file.async("text");
    } catch (error) {
      console.error(`Failed to extract text file ${path}:`, error);
      return null;
    }
  }

  /**
   * Create ZIP package from files
   */
  static async createZipPackage(
    files: Map<string, Blob | string>
  ): Promise<Blob> {
    const zip = new JSZip();

    for (const [path, content] of files.entries()) {
      if (typeof content === "string") {
        zip.file(path, content);
      } else {
        zip.file(path, content);
      }
    }

    return await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });
  }

  /**
   * Compress files into ZIP with progress callback
   */
  static async createZipWithProgress(
    files: Map<string, Blob | string>,
    onProgress?: (progress: number, currentFile: string) => void
  ): Promise<Blob> {
    const zip = new JSZip();
    const totalFiles = files.size;
    let processedFiles = 0;

    for (const [path, content] of files.entries()) {
      zip.file(path, content);
      processedFiles++;

      if (onProgress) {
        onProgress(Math.round((processedFiles / totalFiles) * 100), path);
      }
    }

    return await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });
  }

  /**
   * Get package statistics
   */
  static async getPackageStats(zipBlob: Blob): Promise<PackageStats> {
    try {
      const zip = await JSZip.loadAsync(zipBlob);
      const info = await this.analyzeZipStructure(zip);

      const fileTypes = new Map<string, number>();
      const sizeBuckets = {
        small: 0, // < 1KB
        medium: 0, // 1KB - 100KB
        large: 0, // 100KB - 1MB
        huge: 0, // > 1MB
      };

      for (const [path, file] of Object.entries(zip.files)) {
        if (file.dir) continue;

        const extension = this.getFileExtension(path);
        fileTypes.set(extension, (fileTypes.get(extension) || 0) + 1);

        const size = (file as any)._data?.uncompressedSize || 0;
        if (size < 1024) sizeBuckets.small++;
        else if (size < 100 * 1024) sizeBuckets.medium++;
        else if (size < 1024 * 1024) sizeBuckets.large++;
        else sizeBuckets.huge++;
      }

      return {
        packageSize: zipBlob.size,
        uncompressedSize: info.totalSize,
        compressionRatio: Math.round((1 - zipBlob.size / info.totalSize) * 100),
        fileCount: info.totalFiles,
        fileTypes: Object.fromEntries(fileTypes),
        sizeBuckets,
        hasAssets: info.assetCount > 0,
        hasScreenshots: info.screenshotCount > 0,
      };
    } catch (error) {
      throw new Error(
        `Failed to analyze package: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  // ===== PRIVATE HELPER METHODS =====

  private static async validateFiles(
    zip: JSZip,
    errors: string[],
    warnings: string[]
  ): Promise<void> {
    for (const [path, file] of Object.entries(zip.files)) {
      if (file.dir) continue;

      const size = (file as any)._data?.uncompressedSize || 0;
      const extension = this.getFileExtension(path);

      // Check file size
      if (size > this.MAX_FILE_SIZE) {
        errors.push(`File too large: ${path} (${this.formatFileSize(size)})`);
      }

      // Check dangerous extensions
      if (this.DANGEROUS_EXTENSIONS.has(extension)) {
        errors.push(`Dangerous file type detected: ${path}`);
      }

      // Check allowed extensions
      if (!this.ALLOWED_EXTENSIONS.has(extension)) {
        warnings.push(`Unsupported file type: ${path} (${extension})`);
      }
    }
  }

  private static getFileExtension(path: string): string {
    const lastDotIndex = path.lastIndexOf(".");
    return lastDotIndex !== -1
      ? path.substring(lastDotIndex).toLowerCase()
      : "";
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

  private static getFileName(path: string): string {
    return path.split("/").pop() || path;
  }

  private static getMimeType(path: string): string {
    const extension = this.getFileExtension(path);
    const mimeTypes: Record<string, string> = {
      ".json": "application/json",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".ogg": "audio/ogg",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".txt": "text/plain",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".ttf": "font/ttf",
      ".otf": "font/otf",
      ".css": "text/css",
      ".js": "application/javascript",
      ".html": "text/html",
    };
    return mimeTypes[extension] || "application/octet-stream";
  }

  private static createEmptyPackageInfo(): ZipPackageInfo {
    return {
      totalFiles: 0,
      totalSize: 0,
      hasManifest: false,
      hasTemplate: false,
      assetCount: 0,
      screenshotCount: 0,
      structure: {
        assets: [],
        screenshots: [],
        other: [],
      },
    };
  }
}

// Interface PackageStats
export interface PackageStats {
  packageSize: number;
  uncompressedSize: number;
  compressionRatio: number;
  fileCount: number;
  fileTypes: Record<string, number>;
  sizeBuckets: {
    small: number;
    medium: number;
    large: number;
    huge: number;
  };
  hasAssets: boolean;
  hasScreenshots: boolean;
}
