import AWS from "aws-sdk";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import {
  contentDispositionFor,
  extensionForMime,
  normalizeBaseUrl,
  sanitizeOriginalName,
  validateUpload,
} from "@/lib/upload-validation";

// Configure DigitalOcean Spaces
// Catatan: nama env di sini (DO_SPACES_ACCESS_KEY/SECRET_KEY) berbeda dari upload.ts
// (DO_SPACES_KEY/SECRET); masing-masing fallback ke nama yang lain.
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT!);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: (process.env.DO_SPACES_ACCESS_KEY || process.env.DO_SPACES_KEY)!,
  secretAccessKey: (process.env.DO_SPACES_SECRET_KEY || process.env.DO_SPACES_SECRET)!,
  region: process.env.DO_SPACES_REGION || "nyc3",
});

interface UploadOptions {
  userId: string;
  folder?: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  generateThumbnail?: boolean;
  compress?: boolean;
}

interface UploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
}

export class MediaUploadService {
  private static bucketName = process.env.DO_SPACES_BUCKET!;
  // Normalisasi: tambahkan https:// bila env CDN tanpa skema.
  private static cdnUrl = normalizeBaseUrl(process.env.DO_SPACES_CDN_URL);

  static async uploadFile(
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> {
    const {
      folder = "uploads",
      quality = 85,
      maxWidth = 1920,
      maxHeight = 1080,
      generateThumbnail = true,
      compress = true,
    } = options;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // Validasi: ukuran aktual, allowlist mime, ekstensi vs mime, magic bytes, sanitasi SVG
    const validated = validateUpload(file, rawBuffer, { allowMedia: true });
    let buffer = validated.buffer;
    let processedSize = buffer.length;
    let thumbnailUrl: string | undefined;
    let contentType = validated.mime;

    // ID unik; ekstensi final diturunkan dari ContentType akhir (bukan nama file user)
    const uniqueId = uuidv4();
    const thumbnailFilename = `thumb_${uniqueId}.jpg`;

    const isImage = validated.mime.startsWith("image/");

    // Process image files (only when compress=true)
    if (compress && isImage && validated.mime !== "image/svg+xml") {
      try {
        // Compress and resize main image
        const processedBuffer = await sharp(buffer)
          .resize(maxWidth, maxHeight, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality, progressive: true })
          .toBuffer();

        buffer = Buffer.from(processedBuffer);
        processedSize = buffer.length;
        contentType = "image/jpeg";

        // Generate thumbnail for images
        if (generateThumbnail) {
          const thumbnailBuffer = await sharp(buffer)
            .resize(300, 300, {
              fit: "cover",
              position: "center",
            })
            .jpeg({ quality: 80 })
            .toBuffer();

          const thumbnailPath = folder
            ? `${folder}/thumbnails/${thumbnailFilename}`
            : `thumbnails/${thumbnailFilename}`;

          // Upload thumbnail
          await this.uploadToSpaces(
            thumbnailBuffer,
            thumbnailPath,
            "image/jpeg"
          );
          thumbnailUrl = this.generatePublicUrl(thumbnailPath);
        }
      } catch (error) {
        console.error("Image processing error:", error);
        // If processing fails, upload original
      }
    }

    // Upload main file to Spaces
    const uniqueFilename = `${uniqueId}.${extensionForMime(contentType)}`;
    const filePath = folder ? `${folder}/${uniqueFilename}` : uniqueFilename;
    await this.uploadToSpaces(buffer, filePath, contentType);

    return {
      filename: uniqueFilename,
      originalName: sanitizeOriginalName(file.name),
      mimeType: contentType,
      size: processedSize,
      url: this.generatePublicUrl(filePath),
      thumbnailUrl,
    };
  }

  private static async uploadToSpaces(
    buffer: Buffer,
    filePath: string,
    contentType: string
  ): Promise<void> {
    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: filePath,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl: "max-age=31536000", // 1 year cache
    };
    const disposition = contentDispositionFor(contentType);
    if (disposition) uploadParams.ContentDisposition = disposition;

    try {
      await s3.upload(uploadParams).promise();
    } catch (error) {
      console.error("Spaces upload error:", error);
      throw new Error("Failed to upload to DigitalOcean Spaces");
    }
  }

  private static generatePublicUrl(filePath: string): string {
    if (this.cdnUrl) {
      return `${this.cdnUrl}/${filePath}`;
    }
    return `https://${
      process.env.DO_SPACES_BUCKET
    }.${process.env.DO_SPACES_ENDPOINT?.replace("https://", "")}/${filePath}`;
  }

  static async deleteFile(filename: string, folder = "uploads"): Promise<void> {
    const filePath = folder ? `${folder}/${filename}` : filename;
    const thumbnailPath = folder
      ? `${folder}/thumbnails/thumb_${filename}`
      : `thumbnails/thumb_${filename}`;

    try {
      // Delete main file
      await s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: filePath,
        })
        .promise();

      // Try to delete thumbnail (ignore if doesn't exist)
      try {
        await s3
          .deleteObject({
            Bucket: this.bucketName,
            Key: thumbnailPath,
          })
          .promise();
      } catch {
        // Thumbnail might not exist, ignore error
      }
    } catch (error) {
      console.error("Spaces delete error:", error);
      throw new Error("Failed to delete from DigitalOcean Spaces");
    }
  }

  static async getFileInfo(
    filename: string,
    folder = "uploads"
  ): Promise<{
    size?: number;
    lastModified?: Date;
    contentType?: string;
    etag?: string;
  } | null> {
    const filePath = folder ? `${folder}/${filename}` : filename;

    try {
      const result = await s3
        .headObject({
          Bucket: this.bucketName,
          Key: filePath,
        })
        .promise();

      return {
        size: result.ContentLength,
        lastModified: result.LastModified,
        contentType: result.ContentType,
        etag: result.ETag,
      };
    } catch (error) {
      console.error("Get file info error:", error);
      return null;
    }
  }
}
