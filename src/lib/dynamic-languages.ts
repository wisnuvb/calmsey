import { prisma } from "@/lib/prisma";

export interface DynamicLanguage {
  id: string;
  name: string;
  flag: string | null;
  isDefault: boolean;
  isActive: boolean;
}

// Cache untuk bahasa aktif
let activeLanguagesCache: DynamicLanguage[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

export async function getActiveLanguages(): Promise<DynamicLanguage[]> {
  const now = Date.now();

  // Return cache jika masih valid
  if (activeLanguagesCache && now - cacheTimestamp < CACHE_DURATION) {
    return activeLanguagesCache;
  }

  try {
    const languages = await prisma.language.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        flag: true,
        isDefault: true,
        isActive: true,
      },
      orderBy: [
        { isDefault: "desc" }, // Default language first
        { name: "asc" }, // Then alphabetically
      ],
    });

    // Update cache
    activeLanguagesCache = languages;
    cacheTimestamp = now;

    return languages;
  } catch (error) {
    console.error("Error fetching active languages:", error);
    // Return cache jika ada error
    return activeLanguagesCache || [];
  }
}

export async function getDefaultLanguage(): Promise<string> {
  try {
    const defaultLang = await prisma.language.findFirst({
      where: {
        isDefault: true,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    return defaultLang?.id || "en"; // Fallback ke "en"
  } catch (error) {
    console.error("Error fetching default language:", error);
    return "en"; // Fallback ke "en"
  }
}

export async function isValidLanguage(lang: string): Promise<boolean> {
  const activeLanguages = await getActiveLanguages();
  return activeLanguages.some((language) => language.id === lang);
}

export async function getSupportedLanguages(): Promise<string[]> {
  const activeLanguages = await getActiveLanguages();
  return activeLanguages.map((lang) => lang.id);
}

// Clear cache (untuk admin saat update bahasa)
export function clearLanguageCache(): void {
  activeLanguagesCache = null;
  cacheTimestamp = 0;
}
