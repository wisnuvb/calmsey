import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, admin routes, maintenance page, and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin/") ||
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

  // Temporary: Use hardcoded languages that match database
  const supportedLanguages = [
    "af",
    "am",
    "ar",
    "ay",
    "az",
    "be",
    "bg",
    "bi",
    "bn",
    "bo",
    "bs",
    "cs",
    "cy",
    "da",
    "de",
    "dz",
    "el",
    "en",
    "es",
    "et",
    "fa",
    "fi",
    "fj",
    "fo",
    "fr",
    "ga",
    "gn",
    "ha",
    "haw",
    "he",
    "hi",
    "ho",
    "hr",
    "ht",
    "hu",
    "hy",
    "id",
    "ig",
    "ii",
    "is",
    "it",
    "ja",
    "ka",
    "kk",
    "kl",
    "km",
    "ko",
    "ku",
    "ky",
    "lb",
    "lo",
    "lt",
    "lv",
    "md",
    "mg",
    "mh",
    "mk",
    "mn",
    "ms",
    "mt",
    "my",
    "na",
    "nd",
    "ne",
    "nl",
    "no",
    "ny",
    "om",
    "pau",
    "pl",
    "ps",
    "pt",
    "qu",
    "rm",
    "ro",
    "ru",
    "rw",
    "se",
    "si",
    "sk",
    "sl",
    "sm",
    "sn",
    "so",
    "sq",
    "sr",
    "ss",
    "st",
    "sv",
    "sw",
    "ta",
    "tg",
    "th",
    "ti",
    "tk",
    "tl",
    "tn",
    "to",
    "tpi",
    "tr",
    "ts",
    "tvl",
    "ug",
    "uk",
    "ur",
    "uz",
    "ve",
    "vi",
    "xh",
    "yo",
    "zh",
    "zu",
  ];
  const defaultLanguage = "en";

  return handleLanguageRouting(request, supportedLanguages, defaultLanguage);
}

function handleLanguageRouting(
  request: NextRequest,
  supportedLanguages: string[],
  defaultLanguage: string
) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.search;

  // Get the correct origin, handling proxy/load balancer scenarios
  // Priority: x-forwarded-host header > host header > nextUrl.origin
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host");

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

  // Check if pathname starts with a language code
  const pathnameHasValidLocale = supportedLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no valid language in pathname
  if (!pathnameHasValidLocale) {
    // Extract potential language from pathname
    const segments = pathname.split("/");
    const possibleLang = segments[1];

    // If it's an invalid language, redirect to default language
    if (
      possibleLang &&
      possibleLang.length === 2 &&
      !supportedLanguages.includes(possibleLang)
    ) {
      // Preserve search params and construct new URL using correct origin
      const newUrl = new URL(`/${defaultLanguage}${pathname}`, origin);
      newUrl.search = searchParams;
      return NextResponse.redirect(newUrl, 307);
    }

    // If no language specified and not root, add default language
    if (pathname !== "/") {
      // Preserve search params and construct new URL using correct origin
      const newUrl = new URL(`/${defaultLanguage}${pathname}`, origin);
      newUrl.search = searchParams;
      return NextResponse.redirect(newUrl, 307);
    }
  }

  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico|admin).*)",
  ],
};
