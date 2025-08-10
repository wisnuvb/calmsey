/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_AUTHOR, ROLE_ADMIN } from "@/lib/auth-helpers";

// Mapping dari frontend types ke database enum values
const SECTION_TYPE_MAPPING: Record<string, string> = {
  TEXT: "RICH_TEXT",
  HERO: "HERO",
  IMAGE: "IMAGE",
  IMAGE_TEXT: "IMAGE_GALLERY", // atau buat enum baru
  VIDEO: "VIDEO_EMBED",
  CONTACT_FORM: "CONTACT_FORM",
  CTA: "BUTTON_GROUP",
  GALLERY: "IMAGE_GALLERY",
};

// Reverse mapping untuk saat mengambil data dari database
const REVERSE_SECTION_TYPE_MAPPING: Record<string, string> = {
  RICH_TEXT: "TEXT",
  HERO: "HERO",
  IMAGE: "IMAGE",
  IMAGE_GALLERY: "GALLERY",
  VIDEO_EMBED: "VIDEO",
  CONTACT_FORM: "CONTACT_FORM",
  BUTTON_GROUP: "CTA",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        translations: {
          orderBy: { languageId: "asc" },
        },
        sections: {
          include: {
            translations: {
              orderBy: { languageId: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Map section types back to frontend format
    const mappedPage = {
      ...page,
      sections: page.sections.map((section) => ({
        ...section,
        type: REVERSE_SECTION_TYPE_MAPPING[section.type] || section.type,
      })),
    };

    return NextResponse.json({
      success: true,
      data: mappedPage,
    });
  } catch (error) {
    console.error("Get page error:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { slug, template, featuredImage, status, translations, sections } =
      body;

    // Update page
    const page = await prisma.page.update({
      where: { id },
      data: {
        slug,
        template,
        featuredImage,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    // Update translations
    if (translations && translations.length > 0) {
      for (const translation of translations) {
        await prisma.pageTranslation.upsert({
          where: {
            pageId_languageId: {
              pageId: id,
              languageId: translation.languageId,
            },
          },
          update: {
            title: translation.title,
            content: translation.content,
            excerpt: translation.excerpt,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
          },
          create: {
            pageId: id,
            languageId: translation.languageId,
            title: translation.title,
            content: translation.content,
            excerpt: translation.excerpt,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
          },
        });
      }
    }

    // Update sections if provided
    if (sections !== undefined) {
      // Delete existing sections
      await prisma.pageSection.deleteMany({
        where: { pageId: id },
      });

      // Create new sections
      if (sections.length > 0) {
        await prisma.pageSection.createMany({
          data: sections.map((section: any, index: number) => ({
            pageId: id,
            type: SECTION_TYPE_MAPPING[section.type] || section.type, // Map to database enum
            order: index,
            isActive: true,
            // Store section settings in appropriate fields
            contentSettings: JSON.stringify(section.settings || {}),
            layoutSettings: JSON.stringify({}),
            styleSettings: JSON.stringify({}),
            responsiveSettings: JSON.stringify({}),
            animationSettings: JSON.stringify({}),
            customSettings: JSON.stringify({}),
          })),
        });

        const createdSections = await prisma.pageSection.findMany({
          where: { pageId: id },
          orderBy: { order: "asc" },
        });

        // Create section translations
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const dbSection = createdSections[i];

          if (section.translations && section.translations.length > 0) {
            await prisma.pageSectionTranslation.createMany({
              data: section.translations.map((translation: any) => ({
                sectionId: dbSection.id,
                title: translation.title,
                content: translation.content,
                languageId: translation.languageId,
              })),
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Update page error:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete page error:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
