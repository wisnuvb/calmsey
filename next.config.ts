import type { NextConfig } from "next";

type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname?: string;
};

function hostnameOf(raw: string | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  try {
    return new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`).hostname || null;
  } catch {
    return null;
  }
}

/**
 * Daftar host untuk next/image (/_next/image). NOTE: dibaca saat BUILD (bukan runtime);
 * ubah env lalu build ulang.
 *
 * DEFAULT: semua host http/https diizinkan (perilaku lama) — karena URL gambar dari
 * editor/DB bisa berasal dari host mana pun dan host yang tidak terdaftar membuat
 * next/image gagal (400) di production.
 *
 * - NEXT_IMAGE_RESTRICT_HOSTS=true -> aktifkan daftar host terbatas di bawah (menutup
 *   /_next/image sebagai open resize-proxy). Pastikan semua host gambar produksi sudah
 *   terdaftar via NEXT_IMAGE_EXTRA_HOSTS sebelum mengaktifkan.
 * - NEXT_IMAGE_EXTRA_HOSTS=a.com,cdn.b.org -> tambahan hostname (comma-separated).
 */
function buildImageRemotePatterns(): RemotePattern[] {
  if (process.env.NEXT_IMAGE_RESTRICT_HOSTS !== "true") {
    return [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ];
  }

  const hosts = new Set<string>([
    // DigitalOcean Spaces / CDN (bucket.region.digitaloceanspaces.com, bucket.region.cdn.digitaloceanspaces.com)
    "**.digitaloceanspaces.com",
    // Host yang dipakai kode / seed
    "images.unsplash.com",
    "ui-avatars.com",
    "s7d1.scene7.com",
    "encrypted-tbn0.gstatic.com",
    "www.unigib.edu.gi",
    "dakshin.org",
    // Situs sendiri
    "turningtidesfacility.org",
    "www.turningtidesfacility.org",
  ]);

  const bucket = process.env.DO_SPACES_BUCKET?.trim();
  const endpointHost = hostnameOf(process.env.DO_SPACES_ENDPOINT);
  const envHosts = [
    hostnameOf(process.env.DO_SPACES_CDN_URL),
    bucket && endpointHost ? `${bucket}.${endpointHost}` : null,
    endpointHost,
    hostnameOf(process.env.NEXT_PUBLIC_SITE_URL),
    hostnameOf(process.env.NEXTAUTH_URL),
  ];
  for (const h of envHosts) {
    if (h && h !== "localhost") hosts.add(h);
  }

  for (const h of (process.env.NEXT_IMAGE_EXTRA_HOSTS ?? "").split(",")) {
    const host = h.trim();
    if (host) hosts.add(host);
  }

  const patterns: RemotePattern[] = Array.from(hosts).map((hostname) => ({
    protocol: "https",
    hostname,
  }));

  // Dev lokal: gambar absolut dari server dev sendiri.
  if (process.env.NODE_ENV !== "production") {
    patterns.push({ protocol: "http", hostname: "localhost" });
  }
  return patterns;
}

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Tanpa includeSubDomains/preload (sengaja). Hanya production.
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
    : []),
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  // Lint & type-check dijalankan terpisah via scripts/build-prod.sh
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackMemoryOptimizations: true,
    // Worker terpisah sering kena SIGKILL saat build di server shared (banyak PM2 app).
    webpackBuildWorker: false,
    cpus: 1,
  },
  compiler: {
    // Pertahankan console.error/warn di production agar tetap muncul di log PM2.
    removeConsole: isProd ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    remotePatterns: buildImageRemotePatterns(),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
