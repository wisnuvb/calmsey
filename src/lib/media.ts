import {
  DocumentIcon,
  FilmIcon,
  MusicalNoteIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { FaFilePdf, FaFileWord } from "react-icons/fa";

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    name: string;
    email: string;
  };
}

export function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return PhotoIcon;
  if (mimeType.startsWith("video/")) return FilmIcon;
  if (mimeType.startsWith("audio/")) return MusicalNoteIcon;
  if (mimeType.includes("pdf")) return FaFilePdf;
  if (mimeType.includes("word") || mimeType.includes("document"))
    return FaFileWord;
  if (mimeType.includes("sheet") || mimeType.includes("excel"))
    return DocumentIcon;
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return DocumentIcon;
  return DocumentIcon;
}

export function getFileTypeLabel(mimeType: string) {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType.startsWith("audio/")) return "Audio";
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "Document";
  if (mimeType.includes("sheet") || mimeType.includes("excel"))
    return "Spreadsheet";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "Presentation";
  return "File";
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
