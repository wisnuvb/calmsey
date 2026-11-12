import AWS from "aws-sdk";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import {
  UploadValidationError,
  contentDispositionFor,
  extensionForMime,
  normalizeBaseUrl,
  sanitizeOriginalName,
  validateUpload,
} from "@/lib/upload-validation";

// Configure DigitalOcean Spaces
// Catatan: nama env di sini (DO_SPACES_KEY/SECRET) berbeda dari media-upload.ts
// (DO_SPACES_ACCESS_KEY/SECRET_KEY); masing-masing fallback ke nama yang lain.
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT!);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: (process.env.DO_SPACES_KEY || process.env.DO_SPACES_ACCESS_KEY)!,
  secretAccessKey: (process.env.DO_SPACES_SECRET || process.env.DO_SPACES_SECRET_KEY)!,
});

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export class ImageUploadService {
  private static bucketName = process.env.DO_SPACES_BUCKET!;
  // Raw env (bisa tanpa skema); URL baru dibangun dari versi ter-normalisasi (https://).
  private static rawCdnUrl = process.env.DO_SPACES_CDN_URL || "";
  private static cdnUrl = normalizeBaseUrl(process.env.DO_SPACES_CDN_URL);

  static async compressAndUpload(
    file: File,
    options: {
      quality?: number;
      maxWidth?: number;
      maxHeight?: number;
      folder?: string;
      compress?: boolean;
    } = {}
  ): Promise<UploadResult> {
    const {
      quality = 80,
      maxWidth = 1920,
      maxHeight = 1080,
      folder = "uploads",
      compress = true,
    } = options;

    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const rawBuffer = Buffer.from(arrayBuffer);

      // Validasi: ukuran aktual, allowlist mime, ekstensi vs mime, magic bytes, sanitasi SVG
      const validated = validateUpload(file, rawBuffer, { allowMedia: false });
      const buffer = validated.buffer;
      const sourceExt = validated.ext;

      // Compress image with Sharp (or upload as-is when compress=false)
      let processedBuffer: Buffer;
      let finalMimeType: string;

      if (!compress || !validated.mime.startsWith("image/")) {
        // Upload as-is (no compression); ContentType dari mime tervalidasi
        processedBuffer = buffer;
        finalMimeType = validated.mime;
      } else {
        const sharpImage = sharp(buffer).resize(maxWidth, maxHeight, {
          fit: "inside",
          withoutEnlargement: true,
        });

        // Convert to JPEG for smaller size
        if (sourceExt === "png" && buffer.length > 500000) {
          processedBuffer = await sharpImage
            .jpeg({ quality, progressive: true })
            .toBuffer();
          finalMimeType = "image/jpeg";
        } else if (sourceExt === "jpg") {
          processedBuffer = await sharpImage
            .jpeg({ quality, progressive: true })
            .toBuffer();
          finalMimeType = "image/jpeg";
        } else if (sourceExt === "webp") {
          processedBuffer = await sharpImage.webp({ quality }).toBuffer();
          finalMimeType = "image/webp";
        } else {
          processedBuffer = await sharpImage
            .jpeg({ quality, progressive: true })
            .toBuffer();
          finalMimeType = "image/jpeg";
        }
      }

      // Ekstensi tersimpan diturunkan dari mime akhir, bukan dari nama file user
      const fileExtension = extensionForMime(finalMimeType);
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      const key = `${folder}/${new Date().getFullYear()}/${new Date().getMonth() + 1
        }/${uniqueFilename}`;

      // Upload to DigitalOcean Spaces
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: finalMimeType,
        ACL: "public-read",
        CacheControl: "max-age=31536000", // 1 year
      };
      const disposition = contentDispositionFor(finalMimeType);
      if (disposition) uploadParams.ContentDisposition = disposition;

      const uploadResult = await s3.upload(uploadParams).promise();

      // Return result with CDN URL if available
      const finalUrl = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : uploadResult.Location;

      return {
        url: finalUrl,
        filename: uniqueFilename,
        originalName: sanitizeOriginalName(file.name),
        size: processedBuffer.length,
        mimeType: finalMimeType,
      };
    } catch (error) {
      if (error instanceof UploadValidationError) throw error;
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  }

  static async deleteImage(url: string): Promise<void> {
    try {
      // Extract key from URL
      // URL lama bisa tersimpan tanpa skema (env CDN tanpa https://) atau dengan skema.
      const prefixes = [
        this.rawCdnUrl,
        this.cdnUrl,
        `https://${this.bucketName}.${process.env.DO_SPACES_ENDPOINT}`,
      ].filter(Boolean);
      const matched = prefixes.find((p) => url.startsWith(p));
      const key = url.replace(matched ?? prefixes[0] ?? "", "").substring(1);

      await s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();
    } catch (error) {
      console.error("Delete error:", error);
      throw new Error("Failed to delete image");
    }
  }

  static generateThumbnail(originalUrl: string): string {
    // If using CDN that supports image transformation (like ImageKit)
    // return `${originalUrl}?tr=w-${width},q-80`;

    // For now return original URL
    return originalUrl;
  }
}
