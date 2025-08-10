// src/types/template-system.ts
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

// Add this to page-builder.ts types
