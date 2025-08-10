import AWS from "aws-sdk";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Configure DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT!);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
  secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  region: process.env.DO_SPACES_REGION || "nyc3",
});

interface UploadOptions {
  userId: string;
  folder?: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  generateThumbnail?: boolean;
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
  private static cdnUrl = process.env.DO_SPACES_CDN_URL;

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
    } = options;

    // Generate unique filename
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = folder ? `${folder}/${uniqueFilename}` : uniqueFilename;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    let processedSize = buffer.length;
    let thumbnailUrl: string | undefined;

    const isImage = file.type.startsWith("image/");

    // Process image files
    if (isImage && file.type !== "image/svg+xml") {
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

        // Generate thumbnail for images
        if (generateThumbnail) {
          const thumbnailBuffer = await sharp(buffer)
            .resize(300, 300, {
              fit: "cover",
              position: "center",
            })
            .jpeg({ quality: 80 })
            .toBuffer();

          const thumbnailFilename = `thumb_${uniqueFilename}`;
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
    await this.uploadToSpaces(buffer, filePath, file.type);

    return {
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
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
    const uploadParams = {
      Bucket: this.bucketName,
      Key: filePath,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl: "max-age=31536000", // 1 year cache
    };

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
      this.bucketName
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
