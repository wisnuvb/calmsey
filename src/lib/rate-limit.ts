/**
 * Rate limiter in-memory (fixed window).
 *
 * Cocok untuk deployment 1 proses (PM2 `instances: 1`, lihat ecosystem.config.js).
 * Jika nanti di-scale ke banyak instance, ganti store ke Redis/DB — API fungsi ini
 * sengaja dibuat kecil agar mudah diganti.
 */

type Bucket = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as {
  __rateLimitBuckets?: Map<string, Bucket>;
  __rateLimitSweptAt?: number;
};

const buckets: Map<string, Bucket> =
  globalForRateLimit.__rateLimitBuckets ??
  (globalForRateLimit.__rateLimitBuckets = new Map());

const MAX_BUCKETS = 10_000;
const SWEEP_INTERVAL_MS = 60_000;

function sweep(now: number) {
  const last = globalForRateLimit.__rateLimitSweptAt ?? 0;
  if (now - last < SWEEP_INTERVAL_MS && buckets.size < MAX_BUCKETS) return;
  globalForRateLimit.__rateLimitSweptAt = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Pengaman memori: bila masih terlalu besar, buang yang paling lama.
  if (buckets.size >= MAX_BUCKETS) {
    const overflow = buckets.size - MAX_BUCKETS + 1;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++removed >= overflow) break;
    }
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Sisa percobaan pada window berjalan. */
  remaining: number;
  /** Detik sampai window reset (untuk header Retry-After). */
  retryAfter: number;
}

/**
 * Catat 1 percobaan untuk `key` dan kembalikan apakah masih diizinkan.
 * @param key  mis. `contact:${ip}` atau `login:${email}`
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfter };
  }
  return { ok: true, remaining: limit - existing.count, retryAfter };
}

/** Hapus counter (mis. setelah login sukses). */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

type HeaderLike =
  | Headers
  | Record<string, string | string[] | undefined>
  | { get(name: string): string | null };

function readHeader(headers: HeaderLike, name: string): string | null {
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name);
  }
  const raw = (headers as Record<string, string | string[] | undefined>)[name];
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

/**
 * IP klien di belakang reverse proxy (nginx).
 * Mengambil entri PERTAMA x-forwarded-for; pastikan nginx menimpa header ini
 * (`proxy_set_header X-Forwarded-For $remote_addr;`) agar tidak bisa dipalsukan klien.
 */
export function getClientIp(request: Request | HeaderLike): string {
  const headers: HeaderLike =
    typeof Request !== "undefined" && request instanceof Request
      ? request.headers
      : (request as HeaderLike);
  const xff = readHeader(headers, "x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = readHeader(headers, "x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}
