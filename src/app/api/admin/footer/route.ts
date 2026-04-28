/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { findFooterBrandSafe } from "@/lib/prisma-fetch-footer-brand";
import { mergeFooterBrand, type FooterBrandDTO } from "@/lib/footer-brand-defaults";

/**
 * GET /api/admin/footer
 * Fetch footer sections + brand column
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sections = await prisma.footerSection.findMany({
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

/**
 * POST /api/admin/footer
 * Create or update footer sections
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "EDITOR"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { sections, brand } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Invalid sections format" },
        { status: 400 }
      );
    }

    type BrandInput = Partial<FooterBrandDTO> & Record<string, unknown>;

    if (brand !== undefined && brand !== null && typeof brand === "object") {
      const mergedBrand = mergeFooterBrand(brand as BrandInput);
      await prisma.footerBrand.upsert({
        where: { id: "singleton" },
        create: {
          id: "singleton",
          mainLogoSrc: mergedBrand.mainLogoSrc,
          mainLogoAlt: mergedBrand.mainLogoAlt,
          mainLogoHref: mergedBrand.mainLogoHref,
          sponsorLogoSrc: mergedBrand.sponsorLogoSrc,
          sponsorLogoAlt: mergedBrand.sponsorLogoAlt,
          sponsorshipParagraph: mergedBrand.sponsorshipParagraph,
        },
        update: {
          mainLogoSrc: mergedBrand.mainLogoSrc,
          mainLogoAlt: mergedBrand.mainLogoAlt,
          mainLogoHref: mergedBrand.mainLogoHref,
          sponsorLogoSrc: mergedBrand.sponsorLogoSrc,
          sponsorLogoAlt: mergedBrand.sponsorLogoAlt,
          sponsorshipParagraph: mergedBrand.sponsorshipParagraph,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing links first (due to foreign key constraint)
      await tx.footerLink.deleteMany({});
      // Then delete all existing sections
      await tx.footerSection.deleteMany({});

      // Create new sections with links
      const createdSections = await Promise.all(
        sections.map(async (section: any, index: number) => {
          const { links, ...sectionData } = section;

          // Remove id if present (we're creating new records)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...sectionDataWithoutId } = sectionData;

          const createdSection = await tx.footerSection.create({
            data: {
              ...sectionDataWithoutId,
              order: index,
            },
          });

          if (links && Array.isArray(links) && links.length > 0) {
            await Promise.all(
              links.map(async (link: any, linkIndex: number) => {
                // Remove id if present
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: linkId, ...linkDataWithoutId } = link;

                await tx.footerLink.create({
                  data: {
                    ...linkDataWithoutId,
                    sectionId: createdSection.id,
                    order: linkIndex,
                  },
                });
              })
            );
          }

          // Return section with links for response
          const sectionWithLinks = await tx.footerSection.findUnique({
            where: { id: createdSection.id },
            include: { links: true },
          });

          return sectionWithLinks;
        })
      );

      return createdSections;
    });

    const brandOut = await findFooterBrandSafe();

    return NextResponse.json({
      success: true,
      message: "Footer saved successfully",
      sections: result,
      brand: mergeFooterBrand(brandOut ?? undefined),
    });
  } catch (error: any) {
    console.error("Error saving footer:", error);

    // More detailed error logging
    if (error.code) {
      console.error("Prisma error code:", error.code);
    }
    if (error.meta) {
      console.error("Prisma error meta:", error.meta);
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
