// src/lib/ip-guard.ts
// Klasifikasi IP untuk mitigasi SSRF. Pure function (tanpa dependensi) agar mudah diuji.
import net from "node:net";

function ipv4ToParts(ip: string): number[] | null {
  const m = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const parts = m.slice(1).map(Number);
  return parts.every((n) => n >= 0 && n <= 255) ? parts : null;
}

/** true bila IPv4 termasuk private / loopback / link-local / CGNAT / multicast / reserved / unspecified. */
export function isPrivateIPv4(ip: string): boolean {
  const p = ipv4ToParts(ip);
  if (!p) return true; // tak bisa di-parse -> anggap berbahaya
  const [a, b, c] = p;
  if (a === 0) return true; // 0.0.0.0/8 (unspecified / "this network")
  if (a === 10) return true; // 10/8
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64/10 CGNAT
  if (a === 127) return true; // loopback
  if (a === 169 && b === 254) return true; // link-local (+ metadata 169.254.169.254)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16/12
  if (a === 192 && b === 0 && c === 0) return true; // 192.0.0.0/24 IETF protocol
  if (a === 192 && b === 0 && c === 2) return true; // TEST-NET-1
  if (a === 192 && b === 88 && c === 99) return true; // 6to4 relay (deprecated)
  if (a === 192 && b === 168) return true; // 192.168/16
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
  if (a === 198 && b === 51 && c === 100) return true; // TEST-NET-2
  if (a === 203 && b === 0 && c === 113) return true; // TEST-NET-3
  if (a >= 224) return true; // multicast 224/4 + reserved 240/4 + broadcast
  return false;
}

/** Expand IPv6 ke 8 hextet (angka 0..65535); null bila tidak valid. */
function parseIPv6(input: string): number[] | null {
  let ip = input;
  const zone = ip.indexOf("%");
  if (zone !== -1) ip = ip.slice(0, zone);
  if (net.isIP(ip) !== 6) return null;

  // IPv4 tertanam di akhir (mis. ::ffff:127.0.0.1)
  const lastColon = ip.lastIndexOf(":");
  const tail = ip.slice(lastColon + 1);
  if (tail.includes(".")) {
    const v4 = ipv4ToParts(tail);
    if (!v4) return null;
    const hi = ((v4[0] << 8) | v4[1]).toString(16);
    const lo = ((v4[2] << 8) | v4[3]).toString(16);
    ip = `${ip.slice(0, lastColon + 1)}${hi}:${lo}`;
  }

  const halves = ip.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const rest = halves.length === 2 ? (halves[1] ? halves[1].split(":") : []) : [];
  let groups: string[];
  if (halves.length === 2) {
    const missing = 8 - head.length - rest.length;
    if (missing < 0) return null;
    groups = [...head, ...Array(missing).fill("0"), ...rest];
  } else {
    groups = head;
  }
  if (groups.length !== 8) return null;
  const nums = groups.map((g) => parseInt(g, 16));
  return nums.every((n) => Number.isInteger(n) && n >= 0 && n <= 0xffff) ? nums : null;
}

function v4FromHextets(hi: number, lo: number): string {
  return `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;
}

/** true bila IPv6 loopback / unspecified / ULA / link-local / multicast / reserved / IPv4-mapped-private dst. */
export function isPrivateIPv6(ip: string): boolean {
  const h = parseIPv6(ip);
  if (!h) return true;
  const allZeroFirst5 = h.slice(0, 5).every((x) => x === 0);

  if (h.every((x) => x === 0)) return true; // ::
  if (h.slice(0, 7).every((x) => x === 0) && h[7] === 1) return true; // ::1
  // ::ffff:a.b.c.d (IPv4-mapped)
  if (allZeroFirst5 && h[5] === 0xffff) return isPrivateIPv4(v4FromHextets(h[6], h[7]));
  // ::a.b.c.d (IPv4-compatible, deprecated) -> tolak seluruhnya
  if (h.slice(0, 6).every((x) => x === 0)) return true;
  // 64:ff9b::/96 (NAT64) -> cek IPv4 tertanam
  if (h[0] === 0x64 && h[1] === 0xff9b && h.slice(2, 6).every((x) => x === 0)) {
    return isPrivateIPv4(v4FromHextets(h[6], h[7]));
  }
  if (h[0] === 0x64 && h[1] === 0xff9b && h[2] === 1) return true; // 64:ff9b:1::/48 local-use NAT64
  if (h[0] === 0x100 && h[1] === 0 && h[2] === 0 && h[3] === 0) return true; // 100::/64 discard
  if (h[0] === 0x2001 && h[1] === 0) return true; // Teredo 2001::/32
  if (h[0] === 0x2001 && h[1] === 0xdb8) return true; // documentation
  if (h[0] === 0x2002) return isPrivateIPv4(v4FromHextets(h[1], h[2])); // 6to4
  if ((h[0] & 0xfe00) === 0xfc00) return true; // fc00::/7 ULA
  if ((h[0] & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if ((h[0] & 0xffc0) === 0xfec0) return true; // fec0::/10 site-local (deprecated)
  if ((h[0] & 0xff00) === 0xff00) return true; // ff00::/8 multicast
  return false;
}

/** true bila alamat IP (v4/v6) tidak boleh dijangkau dari server. String non-IP -> true. */
export function isPrivateAddress(address: string): boolean {
  const ip = address.startsWith("[") && address.endsWith("]") ? address.slice(1, -1) : address;
  const kind = net.isIP(ip);
  if (kind === 4) return isPrivateIPv4(ip);
  if (kind === 6) return isPrivateIPv6(ip);
  return true;
}
