// src/lib/media-types.ts
export const MEDIA_CONFIG = {
  // File size limits (in bytes)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_UPLOAD: 10,

  // Image processing settings
  IMAGE_QUALITY: 85,
  IMAGE_MAX_WIDTH: 1920,
  IMAGE_MAX_HEIGHT: 1080,
  THUMBNAIL_SIZE: 300,

  // Allowed file types
  ALLOWED_TYPES: {
    images: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ],
    videos: ["video/mp4", "video/webm", "video/avi", "video/quicktime"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
  },

  // File type labels for UI
  TYPE_LABELS: {
    "image/jpeg": "JPEG Image",
    "image/jpg": "JPG Image",
    "image/png": "PNG Image",
    "image/gif": "GIF Image",
    "image/webp": "WebP Image",
    "image/svg+xml": "SVG Image",
    "application/pdf": "PDF Document",
    "application/msword": "Word Document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word Document",
    "application/vnd.ms-excel": "Excel Spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel Spreadsheet",
    "application/vnd.ms-powerpoint": "PowerPoint Presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PowerPoint Presentation",
    "text/plain": "Text File",
    "video/mp4": "MP4 Video",
    "video/webm": "WebM Video",
    "video/avi": "AVI Video",
    "video/quicktime": "QuickTime Video",
    "audio/mpeg": "MP3 Audio",
    "audio/wav": "WAV Audio",
    "audio/ogg": "OGG Audio",
    "audio/mp4": "M4A Audio",
  },
};

export function getAllowedTypes(): string[] {
  return [
    ...MEDIA_CONFIG.ALLOWED_TYPES.images,
    ...MEDIA_CONFIG.ALLOWED_TYPES.documents,
    ...MEDIA_CONFIG.ALLOWED_TYPES.videos,
    ...MEDIA_CONFIG.ALLOWED_TYPES.audio,
  ];
}

export function isImageType(mimeType: string): boolean {
  return MEDIA_CONFIG.ALLOWED_TYPES.images.includes(mimeType);
}

export function getFileTypeCategory(mimeType: string): string {
  if (MEDIA_CONFIG.ALLOWED_TYPES.images.includes(mimeType)) return "images";
  if (MEDIA_CONFIG.ALLOWED_TYPES.documents.includes(mimeType))
    return "documents";
  if (MEDIA_CONFIG.ALLOWED_TYPES.videos.includes(mimeType)) return "videos";
  if (MEDIA_CONFIG.ALLOWED_TYPES.audio.includes(mimeType)) return "audio";
  return "unknown";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(
        MEDIA_CONFIG.MAX_FILE_SIZE
      )} limit`,
    };
  }

  // Check file type
  if (!getAllowedTypes().includes(file.type)) {
    return {
      valid: false,
      error: "Unsupported file type",
    };
  }

  return { valid: true };
}

// src/lib/spaces-config.ts
export const SPACES_CONFIG = {
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  region: process.env.DO_SPACES_REGION || "nyc3",
  bucket: process.env.DO_SPACES_BUCKET!,
  accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
  secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  cdnUrl: process.env.DO_SPACES_CDN_URL,
};

export function validateSpacesConfig(): void {
  const requiredVars = [
    "DO_SPACES_ENDPOINT",
    "DO_SPACES_BUCKET",
    "DO_SPACES_ACCESS_KEY",
    "DO_SPACES_SECRET_KEY",
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
}

// src/middleware/file-validation.ts
import { NextRequest } from "next/server";

export async function validateFileUpload(request: NextRequest): Promise<{
  valid: boolean;
  error?: string;
  files?: File[];
}> {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return { valid: false, error: "No files provided" };
    }

    if (files.length > MEDIA_CONFIG.MAX_FILES_PER_UPLOAD) {
      return {
        valid: false,
        error: `Maximum ${MEDIA_CONFIG.MAX_FILES_PER_UPLOAD} files per upload`,
      };
    }

    // Validate each file
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        return {
          valid: false,
          error: `${file.name}: ${validation.error}`,
        };
      }
    }

    return { valid: true, files };
  } catch {
    return { valid: false, error: "Invalid form data" };
  }
}
