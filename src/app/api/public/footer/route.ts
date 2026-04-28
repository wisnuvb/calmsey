import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findFooterBrandSafe } from "@/lib/prisma-fetch-footer-brand";
import { mergeFooterBrand } from "@/lib/footer-brand-defaults";

/**
 * GET /api/public/footer
 * Public API: footer link sections + singleton brand column (logos / sponsorship copy)
 */
export async function GET() {
  try {
    const sections = await prisma.footerSection.findMany({
      where: { isActive: true },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    const brandRow = await findFooterBrandSafe();

    return NextResponse.json({
      sections,
      brand: mergeFooterBrand(brandRow ?? undefined),
    });
  } catch (error) {
    console.error("Error fetching footer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
