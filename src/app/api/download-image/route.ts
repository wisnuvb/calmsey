import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import net from "node:net";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isPrivateAddress } from "@/lib/ip-guard";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 10_000;
const RATE_LIMIT = { limit: 30, windowMs: 60_000 };

const SECURITY_HEADERS = { "X-Content-Type-Options": "nosniff" } as const;

function plain(message: string, status: number, extra?: Record<string, string>) {
  return new NextResponse(message, {
    status,
    headers: { ...SECURITY_HEADERS, ...extra },
  });
}

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

/** Hostname site sendiri dari env (untuk gate "same-origin" di production). */
function configuredSiteHosts(): string[] {
  const hosts: string[] = [];
  for (const key of [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_APP_URL",
    "SITE_URL",
    "NEXTAUTH_URL",
  ]) {
    const v = process.env[key]?.trim();
    if (!v) continue;
    try {
      hosts.push(new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`).hostname.toLowerCase());
    } catch {
      // abaikan nilai env yang tidak valid
    }
  }
  return hosts;
}

/**
 * Hostname jelas lokal/internal (tanpa DNS). Literal IP ditangani isPrivateAddress.
 */
function isDangerousHostname(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, "");
  if (!h) return true;
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h.endsWith(".local") || h.endsWith(".internal") || h.endsWith(".localdomain")) return true;
  const bare = h.startsWith("[") && h.endsWith("]") ? h.slice(1, -1) : h;
  if (net.isIP(bare)) return isPrivateAddress(bare);
  return false;
}

/** Origin dipercaya: situs sendiri atau DOWNLOAD_IMAGE_ALLOWED_ORIGINS. */
function isTrustedOrigin(request: NextRequest, target: URL): boolean {
  const extra = normalizeAllowedOrigins(process.env.DOWNLOAD_IMAGE_ALLOWED_ORIGINS);
  if (extra.includes(target.origin)) return true;

  if (target.origin !== request.nextUrl.origin) return false;
  // Origin situs diturunkan dari header Host (bisa dipalsukan bila proxy tidak menimpanya).
  // Di production, percayai hanya bila hostname cocok dengan env site; selain itu
  // diperlakukan sebagai target eksternal biasa (https + IP publik).
  if (process.env.NODE_ENV !== "production") return true;
  return configuredSiteHosts().includes(target.hostname.toLowerCase());
}

type Verdict = "ok" | "forbidden" | "unresolvable";

/** Validasi satu URL (dipanggil untuk SETIAP hop, termasuk redirect). */
async function checkTarget(request: NextRequest, target: URL): Promise<Verdict> {
  if (target.protocol !== "http:" && target.protocol !== "https:") return "forbidden";
  if (target.username || target.password) return "forbidden";

  if (isTrustedOrigin(request, target)) return "ok";

  const relaxHttp =
    process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "development";
  if (target.protocol === "http:" && !relaxHttp) return "forbidden";

  // URL parser membuang port default (443/80) -> port non-kosong = non-standar.
  if (target.port !== "") return "forbidden";

  if (isDangerousHostname(target.hostname)) return "forbidden";

  // Literal IP sudah divalidasi isDangerousHostname; nama host -> resolve DNS.
  const bare = target.hostname.startsWith("[") ? target.hostname.slice(1, -1) : target.hostname;
  if (net.isIP(bare)) return "ok";

  try {
    const addrs = await lookup(target.hostname, { all: true, verbatim: true });
    if (addrs.length === 0) return "unresolvable";
    if (addrs.some((a) => isPrivateAddress(a.address))) return "forbidden";
  } catch {
    return "unresolvable";
  }
  return "ok";
}

/** Batasi jumlah byte yang mengalir; error saat melewati batas. */
function capStream(body: ReadableStream<Uint8Array>, maxBytes: number): ReadableStream<Uint8Array> {
  let total = 0;
  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        total += chunk.byteLength;
        if (total > maxBytes) {
          controller.error(new Error("Upstream body too large"));
          return;
        }
        controller.enqueue(chunk);
      },
    })
  );
}

export async function GET(request: NextRequest) {
  const rl = rateLimit(`download-image:${getClientIp(request)}`, RATE_LIMIT);
  if (!rl.ok) {
    return plain("Too many requests", 429, { "Retry-After": String(rl.retryAfter) });
  }

  const src = request.nextUrl.searchParams.get("src");
  if (!src?.trim()) {
    return plain("Missing src", 400);
  }

  const trimmed = src.trim();

  let targetUrl: URL;
  try {
    if (trimmed.startsWith("//")) {
      // protocol-relative -> tidak pernah same-origin path; tolak seperti sebelumnya
      return plain("Invalid src", 400);
    } else if (trimmed.startsWith("/")) {
      targetUrl = new URL(trimmed, request.nextUrl.origin);
    } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      targetUrl = new URL(trimmed);
      if (!(targetUrl.protocol === "http:" || targetUrl.protocol === "https:")) {
        return plain("Invalid protocol", 400);
      }
    } else {
      return plain("Invalid src", 400);
    }
  } catch {
    return plain("Invalid URL", 400);
  }

  if (trimmed.startsWith("/") && targetUrl.origin !== request.nextUrl.origin) {
    return plain("Invalid src", 400);
  }

  try {
    let current = targetUrl;
    let upstream: Response | null = null;

    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const verdict = await checkTarget(request, current);
      if (verdict === "forbidden") return plain("Forbidden", 403);
      if (verdict === "unresolvable") return plain("Fetch failed", 502);

      const res = await fetch(current.toString(), {
        headers: { Accept: "image/*,*/*" },
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (res.status >= 300 && res.status < 400 && res.headers.has("location")) {
        await res.body?.cancel().catch(() => {});
        if (hop === MAX_REDIRECTS) return plain("Upstream error", 502);
        try {
          current = new URL(res.headers.get("location")!, current);
        } catch {
          return plain("Upstream error", 502);
        }
        continue;
      }

      upstream = res;
      break;
    }

    if (!upstream || !upstream.ok || !upstream.body) {
      await upstream?.body?.cancel().catch(() => {});
      return plain("Upstream error", 502);
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    if (!contentType.toLowerCase().startsWith("image/")) {
      await upstream.body.cancel().catch(() => {});
      return plain("Upstream is not an image", 415);
    }

    const declaredLength = Number(upstream.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BYTES) {
      await upstream.body.cancel().catch(() => {});
      return plain("Image too large", 413);
    }

    const pathname = current.pathname;
    const basename = pathname.split("/").filter(Boolean).pop() ?? "download";
    const safeName = basename.replace(/[^a-zA-Z0-9._-]/g, "_") || "download";

    const headers: Record<string, string> = {
      ...SECURITY_HEADERS,
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeName}"`,
    };
    if (contentType.toLowerCase().startsWith("image/svg+xml")) {
      headers["Content-Security-Policy"] = "sandbox";
    }

    return new NextResponse(capStream(upstream.body, MAX_BYTES), {
      status: 200,
      headers,
    });
  } catch {
    return plain("Fetch failed", 502);
  }
}
