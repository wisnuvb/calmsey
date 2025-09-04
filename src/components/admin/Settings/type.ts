export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: "TEXT" | "NUMBER" | "BOOLEAN" | "JSON" | "IMAGE";
}

export interface Language {
  id: string;
  name: string;
  flag?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface SettingsData {
  siteSettings: SiteSetting[];
  languages: Language[];
}
