// src/lib/upload-validation.ts
// Validasi upload bersama (dipakai ImageUploadService & MediaUploadService).
// Server-only: mengimpor sanitize-html (jangan di-import dari komponen client).
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { rateLimit } from "@/lib/rate-limit";
import { MEDIA_CONFIG, formatFileSize } from "@/lib/media-types";

/** Error validasi upload -> route mengembalikan HTTP 400 dengan pesan ini. */
export class UploadValidationError extends Error {
  readonly status = 400;
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

/** mime kanonik -> ekstensi tersimpan + ekstensi nama file yang dianggap konsisten. */
const MIME_TABLE: Record<string, { ext: string; accepts: string[] }> = {
  "image/jpeg": { ext: "jpg", accepts: ["jpg", "jpeg", "jpe", "jfif"] },
  "image/png": { ext: "png", accepts: ["png"] },
  "image/gif": { ext: "gif", accepts: ["gif"] },
  "image/webp": { ext: "webp", accepts: ["webp"] },
  "image/svg+xml": { ext: "svg", accepts: ["svg"] },
  "application/pdf": { ext: "pdf", accepts: ["pdf"] },
  "application/msword": { ext: "doc", accepts: ["doc", "dot"] },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    ext: "docx",
    accepts: ["docx"],
  },
  "application/vnd.ms-excel": { ext: "xls", accepts: ["xls", "xlt"] },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    ext: "xlsx",
    accepts: ["xlsx"],
  },
  "application/vnd.ms-powerpoint": { ext: "ppt", accepts: ["ppt", "pot", "pps"] },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    ext: "pptx",
    accepts: ["pptx"],
  },
  "text/plain": {
    ext: "txt",
    accepts: ["txt", "text", "log", "md", "csv", "ini", "conf"],
  },
  "video/mp4": { ext: "mp4", accepts: ["mp4", "m4v"] },
  "video/webm": { ext: "webm", accepts: ["webm"] },
  "video/avi": { ext: "avi", accepts: ["avi"] },
  "video/quicktime": { ext: "mov", accepts: ["mov", "qt"] },
  "audio/mpeg": { ext: "mp3", accepts: ["mp3", "mpeg", "mpga"] },
  "audio/wav": { ext: "wav", accepts: ["wav"] },
  "audio/ogg": { ext: "ogg", accepts: ["ogg", "oga", "opus"] },
  "audio/mp4": { ext: "m4a", accepts: ["m4a", "mp4", "aac"] },
};

/** Normalisasi `image/jpg` -> `image/jpeg`, lowercase, buang parameter (`; charset=`). */
export function canonicalMime(mime: string | undefined | null): string {
  const base = (mime || "").split(";")[0].trim().toLowerCase();
  return base === "image/jpg" ? "image/jpeg" : base;
}

/** Ekstensi (tanpa titik) yang disimpan untuk mime tervalidasi; "" bila tidak dikenal. */
export function extensionForMime(mime: string): string {
  return MIME_TABLE[canonicalMime(mime)]?.ext ?? "";
}

/** Ekstensi nama file (lowercase, tanpa titik) atau "" bila tidak ada. */
export function filenameExtension(name: string): string {
  const base = (name || "").split(/[\\/]/).pop() ?? "";
  const idx = base.lastIndexOf(".");
  if (idx <= 0 || idx === base.length - 1) return "";
  return base.slice(idx + 1).toLowerCase();
}

/** Nama file tanpa ekstensi boleh; bila ada ekstensi harus cocok dengan mime. */
export function extensionMatchesMime(name: string, mime: string): boolean {
  const entry = MIME_TABLE[canonicalMime(mime)];
  if (!entry) return false;
  const ext = filenameExtension(name);
  if (!ext) return true;
  return entry.accepts.includes(ext);
}

/** Daftar mime yang boleh di-upload. Video/audio hanya untuk endpoint multi-upload admin. */
export function getUploadAllowedMimes(allowMedia: boolean): string[] {
  const t = MEDIA_CONFIG.ALLOWED_TYPES;
  const list = [...t.images, ...t.documents, ...(allowMedia ? [...t.videos, ...t.audio] : [])];
  return Array.from(new Set(list.map(canonicalMime)));
}

/* ------------------------------------------------------------------ */
/* Magic bytes                                                         */
/* ------------------------------------------------------------------ */

function startsWithBytes(buf: Uint8Array, bytes: number[], offset = 0): boolean {
  if (buf.length < offset + bytes.length) return false;
  for (let i = 0; i < bytes.length; i++) {
    if (buf[offset + i] !== bytes[i]) return false;
  }
  return true;
}

function asciiAt(buf: Uint8Array, offset: number, text: string): boolean {
  if (buf.length < offset + text.length) return false;
  for (let i = 0; i < text.length; i++) {
    if (buf[offset + i] !== text.charCodeAt(i)) return false;
  }
  return true;
}

const OLE_MAGIC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

/**
 * Cek signature byte terhadap mime TERDEKLARASI. true = cocok.
 * SVG tidak dicek di sini (lihat sanitizeSvg).
 */
export function checkMagicBytes(buf: Uint8Array, mimeInput: string): boolean {
  const mime = canonicalMime(mimeInput);
  switch (mime) {
    case "image/jpeg":
      return startsWithBytes(buf, [0xff, 0xd8, 0xff]);
    case "image/png":
      return startsWithBytes(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/gif":
      return asciiAt(buf, 0, "GIF87a") || asciiAt(buf, 0, "GIF89a");
    case "image/webp":
      return asciiAt(buf, 0, "RIFF") && asciiAt(buf, 8, "WEBP");
    case "application/pdf": {
      // Spesifikasi PDF mengizinkan header dalam 1024 byte pertama.
      const head = Buffer.from(buf.subarray(0, 1024)).toString("latin1");
      return head.includes("%PDF-");
    }
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return startsWithBytes(buf, [0x50, 0x4b, 0x03, 0x04]);
    case "application/msword":
    case "application/vnd.ms-excel":
    case "application/vnd.ms-powerpoint":
      return startsWithBytes(buf, OLE_MAGIC);
    case "text/plain": {
      // BOM UTF-16 -> NUL byte wajar; selain itu NUL = biner.
      if (startsWithBytes(buf, [0xff, 0xfe]) || startsWithBytes(buf, [0xfe, 0xff])) return true;
      return buf.indexOf(0) === -1;
    }
    case "video/mp4":
    case "audio/mp4":
    case "video/quicktime":
      return (
        asciiAt(buf, 4, "ftyp") ||
        asciiAt(buf, 4, "moov") ||
        asciiAt(buf, 4, "mdat") ||
        asciiAt(buf, 4, "wide") ||
        asciiAt(buf, 4, "free") ||
        asciiAt(buf, 4, "skip")
      );
    case "video/webm":
      return startsWithBytes(buf, [0x1a, 0x45, 0xdf, 0xa3]);
    case "video/avi":
      return asciiAt(buf, 0, "RIFF") && asciiAt(buf, 8, "AVI ");
    case "audio/wav":
      return asciiAt(buf, 0, "RIFF") && asciiAt(buf, 8, "WAVE");
    case "audio/ogg":
      return asciiAt(buf, 0, "OggS");
    case "audio/mpeg":
      return (
        asciiAt(buf, 0, "ID3") || (buf.length > 1 && buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0)
      );
    default:
      return false;
  }
}

/* ------------------------------------------------------------------ */
/* SVG sanitizing                                                      */
/* ------------------------------------------------------------------ */

const SVG_ALLOWED_TAGS = [
  "svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline", "polygon",
  "defs", "linearGradient", "radialGradient", "stop", "clipPath", "mask", "pattern",
  "symbol", "use", "title", "desc", "text", "tspan", "textPath", "image", "style",
  "filter", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite",
  "feFlood", "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology", "feOffset",
  "feDropShadow", "feFuncA", "feFuncB", "feFuncG", "feFuncR",
];

const SVG_ALLOWED_ATTRS = [
  "id", "class", "style", "transform", "fill", "fill-opacity", "fill-rule",
  "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit",
  "stroke-dasharray", "stroke-dashoffset", "stroke-opacity", "opacity", "clip-path",
  "clip-rule", "mask", "filter", "d", "points", "x", "y", "x1", "y1", "x2", "y2",
  "cx", "cy", "r", "rx", "ry", "fx", "fy", "width", "height", "viewBox",
  "preserveAspectRatio", "xmlns", "xmlns:xlink", "version", "offset", "stop-color",
  "stop-opacity", "gradientUnits", "gradientTransform", "spreadMethod",
  "patternUnits", "patternTransform", "patternContentUnits", "clipPathUnits",
  "maskUnits", "maskContentUnits", "href", "xlink:href", "font-family", "font-size",
  "font-weight", "font-style", "text-anchor", "text-decoration", "letter-spacing",
  "dominant-baseline", "dx", "dy", "rotate", "textLength", "lengthAdjust",
  "visibility", "display", "overflow", "vector-effect", "color", "xml:space",
  "role", "aria-label", "aria-hidden", "aria-labelledby", "focusable", "data-name",
  "mix-blend-mode", "isolation", "color-interpolation-filters", "in", "in2",
  "result", "stdDeviation", "values", "type", "mode", "operator", "flood-color",
  "flood-opacity", "k1", "k2", "k3", "k4", "radius", "tableValues", "slope",
  "intercept", "amplitude", "exponent", "scale", "xChannelSelector", "yChannelSelector",
];

const SAFE_DATA_IMAGE = /^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=\s]*$/i;

function decodeEntitiesForCheck(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);?/gi, (_, h: string) => safeFromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);?/g, (_, d: string) => safeFromCodePoint(parseInt(d, 10)))
    .replace(/&colon;/gi, ":")
    .replace(/&(?:tab|newline);/gi, "")
    .replace(/&lpar;/gi, "(")
    .replace(/&rpar;/gi, ")");
}

function safeFromCodePoint(n: number): string {
  try {
    return Number.isFinite(n) && n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
  } catch {
    return "";
  }
}

/** Lempar UploadValidationError bila teks SVG mengandung konstruksi berbahaya. */
function assertSvgSafe(raw: string): void {
  const bad = (reason: string): never => {
    throw new UploadValidationError(`SVG rejected: ${reason}`);
  };

  const text = decodeEntitiesForCheck(raw);
  const squashed = text.replace(/[\s\u0000-\u001f]+/g, "").toLowerCase();

  if (/<!entity/i.test(text) || /<!doctype[^>]*\[/i.test(text)) bad("entity declarations are not allowed");
  if (/<\?xml-stylesheet/i.test(text)) bad("external stylesheets are not allowed");
  if (
    /<\s*\/?\s*(?:script|foreignObject|iframe|frame|frameset|embed|object|applet|meta|link|base|audio|video|canvas|animate|set|handler|listener|html|body|form|input|button|textarea|template|math|a)\b/i.test(
      text
    )
  ) {
    bad("script or embedded content is not allowed");
  }
  if (/[\s"'/]on[a-z0-9_-]+\s*=/i.test(text)) bad("event handler attributes are not allowed");
  if (/javascript:|vbscript:|livescript:|data:text\/|data:application\/|data:image\/svg/.test(squashed)) {
    bad("script URLs are not allowed");
  }
  if (/@import|expression\(|-moz-binding|behavior:/.test(squashed)) bad("unsafe CSS is not allowed");

  // href / xlink:href hanya boleh fragment (#id) atau gambar raster data:
  const hrefRe = /(?:^|[\s"'/])(?:xlink:)?href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let m: RegExpExecArray | null;
  while ((m = hrefRe.exec(text)) !== null) {
    const value = (m[1] ?? m[2] ?? m[3] ?? "").trim();
    if (!(value.startsWith("#") || SAFE_DATA_IMAGE.test(value))) {
      bad("external references are not allowed");
    }
  }

  // url(...) hanya boleh menunjuk fragment lokal
  const urlRe = /url\(\s*([^)]*)\)/gi;
  while ((m = urlRe.exec(text)) !== null) {
    const inner = m[1].trim().replace(/^["']|["']$/g, "").trim();
    if (!inner.startsWith("#")) bad("external url() references are not allowed");
  }
}

/** Sanitasi SVG. Menolak (UploadValidationError) bila ada konstruksi berbahaya. */
export function sanitizeSvg(input: Buffer): Buffer {
  if (input.indexOf(0) !== -1) throw new UploadValidationError("SVG rejected: binary content");
  let text = input.toString("utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  // Root element harus <svg> (setelah prolog xml/komentar/doctype).
  const stripped = text
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<!doctype[^>]*>/gi, "")
    .trimStart();
  if (!/^<svg[\s>]/i.test(stripped)) {
    throw new UploadValidationError("File content does not match its declared type");
  }

  assertSvgSafe(text);

  const clean = sanitizeHtml(text, {
    allowedTags: SVG_ALLOWED_TAGS,
    allowedAttributes: { "*": SVG_ALLOWED_ATTRS },
    allowedSchemes: ["data"],
    allowedSchemesByTag: {},
    allowProtocolRelative: false,
    allowVulnerableTags: true, // <style> diizinkan; isinya sudah divalidasi assertSvgSafe
    nonTextTags: ["style", "script", "textarea", "option", "metadata"],
    disallowedTagsMode: "discard",
    parser: { xmlMode: true, lowerCaseTags: false, lowerCaseAttributeNames: false },
  });

  if (!/^<svg[\s>]/.test(clean.trimStart())) {
    throw new UploadValidationError("SVG rejected: invalid structure");
  }
  assertSvgSafe(clean); // defense in depth
  return Buffer.from(clean, "utf8");
}

/* ------------------------------------------------------------------ */
/* Orkestrasi                                                          */
/* ------------------------------------------------------------------ */

export interface ValidatedUpload {
  /** mime kanonik tervalidasi -> dipakai sebagai ContentType */
  mime: string;
  /** ekstensi (tanpa titik) turunan dari mime */
  ext: string;
  /** buffer yang aman di-upload (SVG sudah disanitasi) */
  buffer: Buffer;
}

/**
 * Validasi penuh: ukuran (panjang buffer sebenarnya), allowlist mime, kecocokan
 * ekstensi nama file, magic bytes, dan sanitasi SVG.
 */
export function validateUpload(
  file: { name: string; type: string },
  buffer: Buffer,
  opts: { allowMedia?: boolean } = {}
): ValidatedUpload {
  const { allowMedia = false } = opts;

  if (buffer.length === 0) throw new UploadValidationError("File is empty");
  if (buffer.length > MEDIA_CONFIG.MAX_FILE_SIZE) {
    throw new UploadValidationError(
      `File size exceeds ${formatFileSize(MEDIA_CONFIG.MAX_FILE_SIZE)} limit`
    );
  }

  const mime = canonicalMime(file.type);
  if (!getUploadAllowedMimes(allowMedia).includes(mime)) {
    throw new UploadValidationError("Unsupported file type");
  }
  if (!extensionMatchesMime(file.name, mime)) {
    throw new UploadValidationError("File extension does not match file type");
  }

  let out = buffer;
  if (mime === "image/svg+xml") {
    out = sanitizeSvg(buffer);
  } else if (!checkMagicBytes(buffer, mime)) {
    throw new UploadValidationError("File content does not match its declared type");
  }

  return { mime, ext: extensionForMime(mime), buffer: out };
}

/** Content-Disposition untuk objek di Spaces: dokumen non-PDF dipaksa unduh. */
export function contentDispositionFor(mime: string): string | undefined {
  const m = canonicalMime(mime);
  if (m.startsWith("image/") || m === "application/pdf") return undefined;
  if (m.startsWith("video/") || m.startsWith("audio/")) return undefined;
  return "attachment";
}

/** Nama asli untuk DB: tanpa path/kontrol char, maks 255 karakter. */
export function sanitizeOriginalName(name: string | undefined | null): string {
  const base = String(name ?? "").split(/[\\/]/).pop() ?? "";
  const cleaned = base.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, "").trim();
  if (!cleaned || cleaned === "." || cleaned === "..") return "file";
  return cleaned.slice(0, 255);
}

/** Tambah `https://` bila base URL (mis. DO_SPACES_CDN_URL) tak punya skema; buang trailing slash. */
export function normalizeBaseUrl(raw: string | undefined | null): string {
  const v = (raw ?? "").trim().replace(/\/+$/, "");
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/* ------------------------------------------------------------------ */
/* Rate limit upload                                                   */
/* ------------------------------------------------------------------ */

const UPLOAD_LIMIT = { limit: 120, windowMs: 60 * 60 * 1000 };

/**
 * Rate limit per user (bersama untuk semua endpoint upload). `count` = jumlah file.
 * Mengembalikan Response 429 bila terlampaui, selain itu null.
 */
export function uploadRateLimitResponse(userId: string, count = 1): NextResponse | null {
  for (let i = 0; i < Math.max(1, count); i++) {
    const rl = rateLimit(`upload:${userId}`, UPLOAD_LIMIT);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }
  }
  return null;
}
