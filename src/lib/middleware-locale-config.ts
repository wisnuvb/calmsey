import type { NextRequest } from "next/server";

type LocaleCache = {
  supportedLanguages: string[];
  defaultLanguage: string;
  expiresAt: number;
};

const CACHE_MS = 60_000;

let localeCache: LocaleCache | null = null;

const FALLBACK = {
  supportedLanguages: ["en", "id"],
  defaultLanguage: "en",
} as const;

/**
 * Bahasa aktif + default untuk middleware (Edge).
 * Mengambil dari GET /api/public/languages (Prisma → tabel `languages`), dengan cache in-memory.
 */
export async function getMiddlewareLocaleConfig(
  request: NextRequest,
): Promise<{ supportedLanguages: string[]; defaultLanguage: string }> {
  const now = Date.now();
  if (localeCache && localeCache.expiresAt > now) {
    return {
      supportedLanguages: localeCache.supportedLanguages,
      defaultLanguage: localeCache.defaultLanguage,
    };
  }

  try {
    const url = new URL("/api/public/languages", request.nextUrl.origin);
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return staleOrFallback();
    }

    const json = (await res.json()) as {
      success?: boolean;
      data?: Array<{ id: string; isDefault?: boolean }>;
    };

    if (
      !json.success ||
      !Array.isArray(json.data) ||
      json.data.length === 0
    ) {
      return staleOrFallback();
    }

    const supportedLanguages = json.data.map((l) => l.id);
    const defaultRow = json.data.find((l) => l.isDefault);
    const defaultLanguage =
      defaultRow?.id ?? json.data[0]?.id ?? FALLBACK.defaultLanguage;

    localeCache = {
      supportedLanguages,
      defaultLanguage,
      expiresAt: now + CACHE_MS,
    };

    return { supportedLanguages, defaultLanguage };
  } catch (e) {
    console.error("[middleware] locale config fetch failed:", e);
    return staleOrFallback();
  }
}

function staleOrFallback() {
  if (localeCache && localeCache.supportedLanguages.length > 0) {
    return {
      supportedLanguages: localeCache.supportedLanguages,
      defaultLanguage: localeCache.defaultLanguage,
    };
  }
  return {
    supportedLanguages: [...FALLBACK.supportedLanguages],
    defaultLanguage: FALLBACK.defaultLanguage,
  };
}
