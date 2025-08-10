/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_AUTHOR } from "@/lib/auth-helpers";
import { Prisma } from "@prisma/client";

// Mapping dari frontend types ke database enum values
const SECTION_TYPE_MAPPING: Record<string, string> = {
  TEXT: "RICH_TEXT",
  HERO: "HERO",
  IMAGE: "IMAGE",
  IMAGE_TEXT: "IMAGE_GALLERY",
  VIDEO: "VIDEO_EMBED",
  CONTACT_FORM: "CONTACT_FORM",
  CTA: "BUTTON_GROUP",
  GALLERY: "IMAGE_GALLERY",
};

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          translations: {
            where: { languageId: "en" },
            take: 1,
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.page.count({ where }),
    ]);

    // Format response
    const formattedPages = pages.map((page) => ({
      id: page.id,
      slug: page.slug,
      status: page.status,
      template: page.template,
      featuredImage: page.featuredImage,
      publishedAt: page.publishedAt,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      author: page.author,
      title: page.translations[0]?.title || "Untitled",
      excerpt: page.translations[0]?.excerpt || "",
    }));

    return NextResponse.json({
      data: formattedPages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Pages API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_AUTHOR);
    if (!authResult.success) return authResult.response;

    const { session } = authResult;

    // ✅ Validasi user masih ada di database
    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found or session invalid" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug, template, featuredImage, status, translations, sections } =
      body;

    // ✅ Validasi slug unik
    const existingPage = await prisma.page.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Page with this slug already exists" },
        { status: 409 }
      );
    }

    // ✅ Generate slug otomatis jika tidak ada
    let finalSlug = slug;
    if (!finalSlug && translations?.[0]?.title) {
      finalSlug = translations[0].title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      // Pastikan slug unik dengan menambahkan timestamp jika perlu
      let counter = 1;
      let uniqueSlug = finalSlug;
      while (await prisma.page.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${finalSlug}-${counter}`;
        counter++;
      }
      finalSlug = uniqueSlug;
    }

    // Create page dengan user ID yang sudah divalidasi
    const page = await prisma.page.create({
      data: {
        slug: finalSlug,
        template: template || "BASIC",
        featuredImage,
        status: status || "DRAFT",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: user.id,
        translations: {
          create: translations.map((translation: any) => ({
            title: translation.title,
            content: translation.content,
            excerpt: translation.excerpt,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            languageId: translation.languageId,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    // Create page sections if provided
    if (sections && sections.length > 0) {
      await prisma.pageSection.createMany({
        data: sections.map((section: any, index: number) => ({
          pageId: page.id,
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

      // Create section translations
      const createdSections = await prisma.pageSection.findMany({
        where: { pageId: page.id },
        orderBy: { order: "asc" },
      });

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

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("Create page error:", error);

    // Handle specific Prisma errors
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Page with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
