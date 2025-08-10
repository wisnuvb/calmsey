import AWS from "aws-sdk";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Configure DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT!);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY!,
  secretAccessKey: process.env.DO_SPACES_SECRET!,
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
  private static cdnUrl = process.env.DO_SPACES_CDN_URL!;

  static async compressAndUpload(
    file: File,
    options: {
      quality?: number;
      maxWidth?: number;
      maxHeight?: number;
      folder?: string;
    } = {}
  ): Promise<UploadResult> {
    const {
      quality = 80,
      maxWidth = 1920,
      maxHeight = 1080,
      folder = "uploads",
    } = options;

    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generate unique filename
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      const key = `${folder}/${new Date().getFullYear()}/${
        new Date().getMonth() + 1
      }/${uniqueFilename}`;

      // Compress image dengan Sharp
      let processedBuffer: Buffer;
      let finalMimeType: string;

      if (file.type.startsWith("image/")) {
        const sharpImage = sharp(buffer).resize(maxWidth, maxHeight, {
          fit: "inside",
          withoutEnlargement: true,
        });

        // Convert ke JPEG untuk size yang lebih kecil
        if (fileExtension === "png" && file.size > 500000) {
          // 500KB
          processedBuffer = await sharpImage
            .jpeg({ quality, progressive: true })
            .toBuffer();
          finalMimeType = "image/jpeg";
        } else if (fileExtension === "jpg" || fileExtension === "jpeg") {
          processedBuffer = await sharpImage
            .jpeg({ quality, progressive: true })
            .toBuffer();
          finalMimeType = "image/jpeg";
        } else if (fileExtension === "webp") {
          processedBuffer = await sharpImage.webp({ quality }).toBuffer();
          finalMimeType = "image/webp";
        } else {
          processedBuffer = await sharpImage
            .jpeg({ quality, progressive: true })
            .toBuffer();
          finalMimeType = "image/jpeg";
        }
      } else {
        processedBuffer = buffer;
        finalMimeType = file.type;
      }

      // Upload ke DigitalOcean Spaces
      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: finalMimeType,
        ACL: "public-read",
        CacheControl: "max-age=31536000", // 1 year
      };

      const uploadResult = await s3.upload(uploadParams).promise();

      // Return result dengan CDN URL jika available
      const finalUrl = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : uploadResult.Location;

      return {
        url: finalUrl,
        filename: uniqueFilename,
        originalName: file.name,
        size: processedBuffer.length,
        mimeType: finalMimeType,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  }

  static async deleteImage(url: string): Promise<void> {
    try {
      // Extract key from URL
      const key = url
        .replace(
          this.cdnUrl ||
            `https://${this.bucketName}.${process.env.DO_SPACES_ENDPOINT}`,
          ""
        )
        .substring(1);

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

  static generateThumbnail(originalUrl: string, width: number = 300): string {
    // Jika pakai CDN yang support image transformation (seperti ImageKit)
    // return `${originalUrl}?tr=w-${width},q-80`;

    // Untuk sekarang return original URL
    return originalUrl;
  }
}
