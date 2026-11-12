import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import type { ResourceDownloadModalSource } from "@/lib/track-resource-download";

const MODAL_SOURCES = new Set<ResourceDownloadModalSource>([
  "ACTION_PLANS",
  "PARTNERS",
  "GRANTMAKING_FRAMEWORK",
  "STRATEGY_2030",
  "ANNUAL_REPORT",
  "GUIDING_POLICIES",
  "FUND_DETAIL",
]);
const SELECTOR_TYPES = new Set(["language", "country"]);

function normalizeFileUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.startsWith("/")) return t;
  if (t.startsWith("https://") || t.startsWith("http://")) return t;
  return `https://${t}`;
}

function isSafeFileUrl(url: string): boolean {
  if (url.startsWith("/")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit per IP: 60 event / jam (endpoint tracking, jangan terlalu ketat)
    const ipLimit = rateLimit(`resource-downloads:${getClientIp(request)}`, {
      limit: 60,
      windowMs: 60 * 60 * 1000,
    });
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const body = await request.json();
    const modalSource =
      typeof body.modalSource === "string" ? body.modalSource.trim() : "";
    const documentItemId =
      typeof body.documentItemId === "string"
        ? body.documentItemId.trim()
        : body.documentItemId === null
          ? null
          : undefined;
    const documentTitle =
      typeof body.documentTitle === "string"
        ? body.documentTitle.trim()
        : body.documentTitle === null
          ? null
          : undefined;
    const selectorType =
      typeof body.selectorType === "string" ? body.selectorType.trim() : "";
    const selectedOptionLabel =
      typeof body.selectedOptionLabel === "string"
        ? body.selectedOptionLabel.trim()
        : "";
    const fileUrlRaw =
      typeof body.fileUrl === "string" ? body.fileUrl.trim() : "";

    if (!MODAL_SOURCES.has(modalSource as ResourceDownloadModalSource)) {
      return NextResponse.json(
        { error: "Invalid modal source" },
        { status: 400 },
      );
    }
    if (!SELECTOR_TYPES.has(selectorType)) {
      return NextResponse.json(
        { error: "Invalid selector type" },
        { status: 400 },
      );
    }
    if (!selectedOptionLabel || selectedOptionLabel.length > 500) {
      return NextResponse.json(
        { error: "Invalid or missing file option label" },
        { status: 400 },
      );
    }

    const fileUrl = normalizeFileUrl(fileUrlRaw);
    if (!fileUrl || fileUrl.length > 8000 || !isSafeFileUrl(fileUrl)) {
      return NextResponse.json(
        { error: "Invalid file URL" },
        { status: 400 },
      );
    }

    const docId =
      documentItemId === undefined || documentItemId === ""
        ? null
        : documentItemId.length <= 128
          ? documentItemId
          : null;

    let docTitle: string | null = null;
    if (documentTitle === undefined) {
      docTitle = null;
    } else if (documentTitle === null || documentTitle === "") {
      docTitle = null;
    } else {
      docTitle =
        documentTitle.length <= 2000
          ? documentTitle
          : documentTitle.slice(0, 2000);
    }

    await prisma.resourceDownloadSubmission.create({
      data: {
        fullName: null,
        email: null,
        countryCode: null,
        countryLabel: null,
        modalSource,
        documentItemId: docId,
        documentTitle: docTitle,
        selectorType,
        selectedOptionLabel: selectedOptionLabel.slice(0, 500),
        fileUrl,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("resource-downloads POST:", e);
    return NextResponse.json(
      { error: "Failed to save download event" },
      { status: 500 },
    );
  }
}
