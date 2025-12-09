import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, admin routes, and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

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
      const newUrl = new URL(`/${defaultLanguage}${pathname}`, request.url);
      return NextResponse.redirect(newUrl);
    }

    // If no language specified and not root, add default language
    if (pathname !== "/") {
      const newUrl = new URL(`/${defaultLanguage}${pathname}`, request.url);
      return NextResponse.redirect(newUrl);
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
