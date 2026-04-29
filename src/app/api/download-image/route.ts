import { NextRequest, NextResponse } from "next/server";

function normalizeAllowedOrigins(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      try {
        return new URL(s).origin;
      } catch {
        return null;
      }
    })
    .filter((o): o is string => !!o);
}

/** True if dotted-quad parses as private / loopback / link-local IPv4 */
function ipv4LooksPrivate(a: number, b: number): boolean {
  if (a === 127 || a === 10 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return a === 192 && b === 168;
}

/**
 * SSRF heuristic: hostname is disallowed when it clearly points at local/private space.
 * (Does not mitigate DNS rebinding to private IPs—that needs DNS + resolver checks.)
 */
function isDangerousHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();

  if (h === "localhost") return true;
  if (h.endsWith(".localhost")) return true;

  const ipv4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [, aRaw, bRaw, cRaw, dRaw] = ipv4;
    const digits = [
      Number(aRaw),
      Number(bRaw),
      Number(cRaw),
      Number(dRaw),
    ] as const;
    if (
      digits.some((n) => !Number.isInteger(n) || n < 0 || n > 255)
    ) {
      return true;
    }

    const [a, b] = digits;

    return ipv4LooksPrivate(a, b);
  }

  // IPv6
  if (/:/.test(h)) {
    const v = h.startsWith("[") && h.endsWith("]") ? h.slice(1, -1) : h;
    const low = v.toLowerCase();

    return (
      low === "::1" ||
      low.startsWith("fe80") ||
      low.startsWith("fc") ||
      low.startsWith("fd")
    );
  }

  return h.endsWith(".local");
}

function allowsPublicHttpsUrl(target: URL): boolean {
  if (target.protocol !== "https:") return false;
  return !isDangerousHostname(target.hostname);
}

function isAllowedExternalUrl(request: NextRequest, target: URL): boolean {
  const siteOrigin = request.nextUrl.origin;
  if (target.origin === siteOrigin) return true;

  const extra = normalizeAllowedOrigins(process.env.DOWNLOAD_IMAGE_ALLOWED_ORIGINS);
  if (extra.includes(target.origin)) return true;

  if (allowsPublicHttpsUrl(target)) return true;

  const relaxHttp =
    process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "development";

  if (relaxHttp && target.protocol === "http:" && !isDangerousHostname(target.hostname)) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  if (!src?.trim()) {
    return new NextResponse("Missing src", { status: 400 });
  }

  const trimmed = src.trim();

  let targetUrl: URL;
  try {
    if (trimmed.startsWith("/")) {
      targetUrl = new URL(trimmed, request.nextUrl.origin);
    } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      targetUrl = new URL(trimmed);
      if (!(targetUrl.protocol === "http:" || targetUrl.protocol === "https:")) {
        return new NextResponse("Invalid protocol", { status: 400 });
      }
      if (!isAllowedExternalUrl(request, targetUrl)) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } else {
      return new NextResponse("Invalid src", { status: 400 });
    }
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (trimmed.startsWith("/") && targetUrl.origin !== request.nextUrl.origin) {
    return new NextResponse("Invalid src", { status: 400 });
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      headers: { Accept: "image/*,*/*" },
      next: { revalidate: 3600 },
    });
    if (!upstream.ok) {
      return new NextResponse("Upstream error", { status: 502 });
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";
    const pathname = targetUrl.pathname;
    const basename = pathname.split("/").filter(Boolean).pop() ?? "download";
    const safeName = basename.replace(/[^a-zA-Z0-9._-]/g, "_") || "download";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeName}"`,
      },
    });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }
}
