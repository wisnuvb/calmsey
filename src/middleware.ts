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
      // Use HTML response with client-side redirect to preserve hash fragment
      return createRedirectResponse(newUrl.toString());
    }

    // If no language specified and not root, add default language
    if (pathname !== "/") {
      // Preserve search params and construct new URL using correct origin
      const newUrl = new URL(`/${defaultLanguage}${pathname}`, origin);
      newUrl.search = searchParams;
      // Use HTML response with client-side redirect to preserve hash fragment
      return createRedirectResponse(newUrl.toString());
    }
  }

  return NextResponse.next();
}

/**
 * Create a response that redirects client-side to preserve hash fragments
 * Hash fragments are not available in server-side middleware, so we use
 * client-side JavaScript to perform the redirect while preserving the hash
 */
function createRedirectResponse(targetUrl: string): NextResponse {
  // Ensure targetUrl is absolute and doesn't contain localhost in production
  if (process.env.NODE_ENV === "production" && targetUrl.includes("localhost")) {
    console.error("Error: Redirect URL contains localhost in production:", targetUrl);
    // This should not happen, but if it does, we should log it
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Preserve hash fragment from current URL
    const currentHash = window.location.hash;
    const targetUrl = ${JSON.stringify(targetUrl)};
    
    // Ensure we're using the correct protocol and domain
    // If targetUrl is relative or has wrong domain, use current origin
    let finalUrl = targetUrl;
    if (currentHash) {
      // Only add hash if targetUrl doesn't already have one
      finalUrl = targetUrl.includes('#') ? targetUrl : targetUrl + currentHash;
    }
    
    // Double check: if finalUrl contains localhost but we're not on localhost, fix it
    if (finalUrl.includes('localhost') && !window.location.hostname.includes('localhost')) {
      const currentOrigin = window.location.origin;
      try {
        const urlObj = new URL(finalUrl, window.location.href);
        const urlPath = urlObj.pathname + urlObj.search;
        finalUrl = currentOrigin + urlPath + (currentHash || '');
      } catch (e) {
        // If URL parsing fails, use current origin + path from targetUrl
        const pathMatch = finalUrl.match(/\\/[^\\s]*/);
        const path = pathMatch ? pathMatch[0] : '';
        finalUrl = currentOrigin + path + (currentHash || '');
      }
    }
    
    window.location.replace(finalUrl);
  </script>
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
</head>
<body>
  <p>Redirecting... <a href="${targetUrl}" aria-label="Redirect to ${targetUrl}">Click here if you are not redirected.</a></p>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
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
