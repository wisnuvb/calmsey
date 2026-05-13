import { LOCALE_COOKIE_NAME } from "@/lib/constants";
import { getMiddlewareLocaleConfig } from "@/lib/middleware-locale-config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function localeCookieOptions() {
  return {
    path: "/" as const,
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
  };
}

/** Cocokkan Accept-Language ke daftar bahasa yang didukung (urutan q, lalu prioritas daftar). */
function matchAcceptLanguage(
  acceptLanguage: string | null,
  supportedLanguages: string[]
): string | null {
  if (!acceptLanguage) return null;
  const prefs: { lang: string; q: number }[] = [];
  for (const part of acceptLanguage.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [tag, ...params] = trimmed.split(";").map((s) => s.trim());
    if (!tag) continue;
    const base = tag.split("-")[0]?.toLowerCase();
    if (!base) continue;
    let q = 1;
    for (const p of params) {
      const m = /^q=([\d.]+)$/i.exec(p);
      if (m) q = parseFloat(m[1]);
    }
    prefs.push({ lang: base, q });
  }
  prefs.sort((a, b) => b.q - a.q);
  for (const { lang } of prefs) {
    if (supportedLanguages.includes(lang)) return lang;
  }
  return null;
}

function resolveActiveLanguage(
  request: NextRequest,
  supportedLanguages: string[],
  defaultLanguage: string
): string {
  const fromCookie = firstForwardedValue(
    request.cookies.get(LOCALE_COOKIE_NAME)?.value ?? null
  );
  const cookieLang = fromCookie?.trim().toLowerCase();
  if (cookieLang && supportedLanguages.includes(cookieLang)) {
    return cookieLang;
  }
  const fromAccept = matchAcceptLanguage(
    request.headers.get("accept-language"),
    supportedLanguages
  );
  if (fromAccept) return fromAccept;
  return defaultLanguage;
}

function matchedPathLocale(
  pathname: string,
  supportedLanguages: string[]
): string | null {
  return (
    supportedLanguages.find(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    ) ?? null
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, admin routes, maintenance page, and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/monitoring") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Maintenance mode check is handled in [lang]/layout.tsx
  // This middleware only handles language routing

  const { supportedLanguages, defaultLanguage } =
    await getMiddlewareLocaleConfig(request);

  return handleLanguageRouting(request, supportedLanguages, defaultLanguage);
}

/** Ambil nilai pertama bila proxy menggabungkan header duplikat (mis. "https, https"). */
function firstForwardedValue(header: string | null): string | null {
  if (!header) return null;
  const first = header.split(",")[0];
  return first?.trim() ?? null;
}

function handleLanguageRouting(
  request: NextRequest,
  supportedLanguages: string[],
  defaultLanguage: string
) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.search;
  const activeLanguage = resolveActiveLanguage(
    request,
    supportedLanguages,
    defaultLanguage
  );

  // Get the correct origin, handling proxy/load balancer scenarios
  // Priority: x-forwarded-host header > host header > nextUrl.origin
  const forwardedHost = firstForwardedValue(
    request.headers.get("x-forwarded-host")
  );
  const forwardedProto =
    firstForwardedValue(request.headers.get("x-forwarded-proto")) || "https";
  const host = firstForwardedValue(request.headers.get("host"));

  let origin: string;
  if (forwardedHost) {
    // Use forwarded host if available (common in production with proxy/load balancer)
    origin = `${forwardedProto}://${forwardedHost}`;
  } else if (host) {
    // Fallback to host header
    const protocol = request.nextUrl.protocol || forwardedProto;
    origin = `${protocol}//${host}`;
  } else {
    // Last resort: use nextUrl.origin
    origin = request.nextUrl.origin;
  }

  // Ensure origin doesn't contain localhost in production
  // This is a safety check
  if (process.env.NODE_ENV === "production" && origin.includes("localhost")) {
    console.warn("Warning: Origin contains localhost in production:", origin);
    // Try to construct from host header as fallback
    if (host && !host.includes("localhost")) {
      origin = `${forwardedProto}://${host}`;
    }
  }

  const localeFromPath = matchedPathLocale(pathname, supportedLanguages);
  if (localeFromPath) {
    const res = NextResponse.next();
    res.cookies.set(
      LOCALE_COOKIE_NAME,
      localeFromPath,
      localeCookieOptions()
    );
    return res;
  }

  // Tanpa prefix bahasa di URL
  const segments = pathname.split("/");
  const possibleLang = segments[1];

  // Segmen pertama 2–3 huruf kecil yang bukan bahasa aktif di DB → bukan locale valid
  const looksLikeLocaleSegment =
    !!possibleLang && /^[a-z]{2,3}$/.test(possibleLang);

  if (
    looksLikeLocaleSegment &&
    !supportedLanguages.includes(possibleLang)
  ) {
    const withoutInvalid = pathname.replace(/^\/[^/]+/, "") || "/";
    const newPath =
      withoutInvalid === "/"
        ? `/${activeLanguage}`
        : `/${activeLanguage}${withoutInvalid}`;
    const newUrl = new URL(newPath, origin);
    newUrl.search = searchParams;
    const res = NextResponse.redirect(newUrl, 307);
    res.cookies.set(
      LOCALE_COOKIE_NAME,
      activeLanguage,
      localeCookieOptions()
    );
    return res;
  }

  // Path tanpa lang: REWRITE agar URL browser & hash tetap
  if (pathname !== "/") {
    const newUrl = new URL(`/${activeLanguage}${pathname}`, origin);
    newUrl.search = searchParams;
    const res = NextResponse.rewrite(newUrl);
    res.cookies.set(
      LOCALE_COOKIE_NAME,
      activeLanguage,
      localeCookieOptions()
    );
    return res;
  }

  // Root: REWRITE ke locale aktif; URL browser tetap "/"
  const rootUrl = new URL(`/${activeLanguage}`, origin);
  const rootRes = NextResponse.rewrite(rootUrl);
  rootRes.cookies.set(
    LOCALE_COOKIE_NAME,
    activeLanguage,
    localeCookieOptions()
  );
  return rootRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|admin|monitoring).*)",
  ],
};
