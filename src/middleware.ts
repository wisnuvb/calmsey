import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isValidLanguage,
} from "./lib/public-api";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, admin routes, and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a language code
  const pathnameHasValidLocale = SUPPORTED_LANGUAGES.some(
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
      !isValidLanguage(possibleLang)
    ) {
      const newUrl = new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url);
      return NextResponse.redirect(newUrl);
    }

    // If no language specified and not root, add default language
    if (pathname !== "/") {
      const newUrl = new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url);
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
