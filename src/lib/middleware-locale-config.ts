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

/** Ambil segmen pertama bila proxy mengirim header berganda */
function firstForwarded(header: string | null): string | null {
  if (!header) return null;
  return header.split(",")[0]?.trim() ?? null;
}

/**
 * Origin untuk self-fetch middleware → /api/public/languages.
 *
 * Di VPS/PM2, fetch lewat domain publik sering kena redirect loop nginx
 * (http→https, IP→domain, www↔non-www) → "redirect count exceeded".
 *
 * Urutan prioritas:
 * 1. Production self-hosted: `http://127.0.0.1:PORT` (langsung ke proses Next.js, tanpa nginx)
 * 2. `MIDDLEWARE_INTERNAL_ORIGIN` (override manual, mis. port berbeda)
 * 3. `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL` (Vercel / fallback)
 * 4. `VERCEL_URL`
 * 5. Header proxy / `request.nextUrl.origin`
 */
export function resolveMiddlewareFetchOrigin(request: NextRequest): string {
  const internalOverride = process.env.MIDDLEWARE_INTERNAL_ORIGIN?.trim();
  if (internalOverride) {
    return internalOverride.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "production" && !process.env.VERCEL_URL) {
    const port = (process.env.PORT || "2039").trim();
    return `http://127.0.0.1:${port}`;
  }

  const fromEnv = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ""
  ).trim();
  if (fromEnv) {
    const trimmed = fromEnv.replace(/\/+$/, "");
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (process.env.NODE_ENV === "production" && vercel) {
    const host = vercel.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    return `https://${host}`;
  }

  const forwardedHost = firstForwarded(request.headers.get("x-forwarded-host"));
  const forwardedProto =
    firstForwarded(request.headers.get("x-forwarded-proto")) || "https";
  const hostHdr = firstForwarded(request.headers.get("host"));

  if (forwardedHost) {
    let scheme = forwardedProto.replace(/:$/, "").toLowerCase();
    if (scheme !== "http" && scheme !== "https") {
      scheme = "https";
    }
    return `${scheme}://${forwardedHost}`;
  }

  if (hostHdr) {
    const p =
      typeof request.nextUrl.protocol === "string" ?
        request.nextUrl.protocol.replace(/:$/, "")
      : "";
    const protocol =
      p === "http" || p === "https" ? p : "https";
    return `${protocol}://${hostHdr}`;
  }

  return request.nextUrl.origin;
}

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

  const origin = resolveMiddlewareFetchOrigin(request);
  const apiUrl = new URL("/api/public/languages", origin).toString();

  try {
    let res = await fetch(apiUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      await new Promise((r) => setTimeout(r, 120));
      res = await fetch(apiUrl, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
    }

    if (!res.ok) {
      console.error(
        `[middleware] /api/public/languages failed (${res.status}) from ${origin}`,
      );
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

    const supportedLanguages = json.data.map((l) =>
      String(l.id).trim().toLowerCase(),
    );
    const defaultRow = json.data.find((l) => l.isDefault);
    const defaultLanguage =
      String(defaultRow?.id ?? supportedLanguages[0] ?? FALLBACK.defaultLanguage)
        .trim()
        .toLowerCase();

    localeCache = {
      supportedLanguages,
      defaultLanguage,
      expiresAt: now + CACHE_MS,
    };

    return { supportedLanguages, defaultLanguage };
  } catch (e) {
    console.error("[middleware] locale config fetch failed:", e, apiUrl);
    return staleOrFallback();
  }
}

/** Hapus cache in-memory agar bahasa baru langsung dikenali middleware (dipanggil dari API admin). */
export function clearMiddlewareLocaleRuntimeCache(): void {
  localeCache = null;
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
