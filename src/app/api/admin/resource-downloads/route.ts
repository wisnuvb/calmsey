import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";
import type { ResourceDownloadModalSource } from "@/lib/track-resource-download";

type DownloadStatRow = {
  modalSource: string;
  documentItemId: string | null;
  documentTitle: string | null;
  selectedOptionLabel: string;
  fileUrl: string;
  downloadCount: number;
  lastDownloadedAt: string;
};

const MODAL_SOURCES: ResourceDownloadModalSource[] = [
  "ACTION_PLANS",
  "PARTNERS",
  "GRANTMAKING_FRAMEWORK",
  "STRATEGY_2030",
  "ANNUAL_REPORT",
  "GUIDING_POLICIES",
  "FUND_DETAIL",
];

function statKey(row: {
  modalSource: string;
  documentItemId: string | null;
  documentTitle: string | null;
  selectedOptionLabel: string;
  fileUrl: string;
}) {
  return [
    row.modalSource,
    row.documentItemId ?? "",
    row.documentTitle ?? "",
    row.selectedOptionLabel,
    row.fileUrl,
  ].join("\0");
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const modalSource = (searchParams.get("modalSource") || "").trim();

    const where =
      modalSource && MODAL_SOURCES.includes(modalSource as ResourceDownloadModalSource)
        ? { modalSource }
        : {};

    const events = await prisma.resourceDownloadSubmission.findMany({
      where,
      select: {
        modalSource: true,
        documentItemId: true,
        documentTitle: true,
        selectedOptionLabel: true,
        fileUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const grouped = new Map<string, DownloadStatRow>();

    for (const event of events) {
      const key = statKey(event);
      const existing = grouped.get(key);
      const createdAtIso = event.createdAt.toISOString();

      if (!existing) {
        grouped.set(key, {
          modalSource: event.modalSource,
          documentItemId: event.documentItemId,
          documentTitle: event.documentTitle,
          selectedOptionLabel: event.selectedOptionLabel,
          fileUrl: event.fileUrl,
          downloadCount: 1,
          lastDownloadedAt: createdAtIso,
        });
        continue;
      }

      existing.downloadCount += 1;
      if (createdAtIso > existing.lastDownloadedAt) {
        existing.lastDownloadedAt = createdAtIso;
      }
    }

    let rows = Array.from(grouped.values()).sort(
      (a, b) =>
        b.downloadCount - a.downloadCount ||
        b.lastDownloadedAt.localeCompare(a.lastDownloadedAt),
    );

    if (search) {
      rows = rows.filter((row) => {
        const haystack = [
          row.documentTitle,
          row.documentItemId,
          row.selectedOptionLabel,
          row.fileUrl,
          row.modalSource,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    const totalDownloads = rows.reduce((sum, row) => sum + row.downloadCount, 0);

    return NextResponse.json({
      success: true,
      data: rows,
      summary: {
        totalDownloads,
        uniqueFiles: rows.length,
      },
    });
  } catch (e) {
    console.error("admin resource-downloads GET:", e);
    return NextResponse.json(
      { error: "Failed to fetch download statistics" },
      { status: 500 },
    );
  }
}
