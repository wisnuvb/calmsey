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

function isAllowedTarget(request: NextRequest, target: URL): boolean {
  const siteOrigin = request.nextUrl.origin;
  if (target.origin === siteOrigin) return true;
  const extra = normalizeAllowedOrigins(process.env.DOWNLOAD_IMAGE_ALLOWED_ORIGINS);
  return extra.includes(target.origin);
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
      if (!isAllowedTarget(request, targetUrl)) {
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
