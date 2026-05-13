import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCountryLabelForValue,
  isAllowedCountryValue,
} from "@/lib/countries";

const MODAL_SOURCES = new Set([
  "ACTION_PLANS",
  "PARTNERS",
  "GRANTMAKING_FRAMEWORK",
  "STRATEGY_2030",
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
    const body = await request.json();
    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const countryCodeRaw =
      typeof body.countryCode === "string" ? body.countryCode.trim() : "";
    const countryCode = countryCodeRaw.toLowerCase();
    const countryLabelRaw =
      typeof body.countryLabel === "string" ? body.countryLabel.trim() : "";
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

    if (!fullName || fullName.length > 500) {
      return NextResponse.json(
        { error: "Invalid or missing full name" },
        { status: 400 },
      );
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk || email.length > 320) {
      return NextResponse.json(
        { error: "Invalid or missing email" },
        { status: 400 },
      );
    }
    if (!countryCode || !isAllowedCountryValue(countryCode)) {
      return NextResponse.json(
        { error: "Invalid or missing country" },
        { status: 400 },
      );
    }
    const resolvedLabel =
      getCountryLabelForValue(countryCode) ??
      (countryLabelRaw || countryCode);
    if (!resolvedLabel || resolvedLabel.length > 200) {
      return NextResponse.json(
        { error: "Invalid country label" },
        { status: 400 },
      );
    }
    if (!MODAL_SOURCES.has(modalSource)) {
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
        fullName,
        email,
        countryCode,
        countryLabel: resolvedLabel.slice(0, 200),
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
      { error: "Failed to save download request" },
      { status: 500 },
    );
  }
}
