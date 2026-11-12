// src/app/api/admin/pages/[id]/layout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PageLayoutConfig } from "@/types/layout-settings";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

// id halaman (cuid/uuid-like) dipakai sebagai bagian key SiteSetting
const PAGE_ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // PUT mengubah konfigurasi layout: wajib login (EDITOR ke atas)
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { id } = await params;
    if (!PAGE_ID_REGEX.test(id)) {
      return NextResponse.json({ error: "Invalid page id" }, { status: 400 });
    }

    const body = await request.json();
    const { layoutConfig }: { layoutConfig: PageLayoutConfig } = body ?? {};

    if (!isPlainObject(layoutConfig)) {
      return NextResponse.json(
        { error: "layoutConfig must be an object" },
        { status: 400 }
      );
    }

    // Store layout config as JSON in SiteSetting
    const settingKey = `page_layout_${id}`;
    const layoutData = JSON.stringify(layoutConfig);

    // Upsert layout settings
    await prisma.siteSetting.upsert({
      where: { key: settingKey },
      update: { value: layoutData },
      create: {
        key: settingKey,
        value: layoutData,
        type: "JSON",
      },
    });

    return NextResponse.json({
      success: true,
      data: layoutConfig,
    });
  } catch (error) {
    console.error("Error updating layout settings:", error);
    return NextResponse.json(
      { error: "Failed to update layout settings" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!PAGE_ID_REGEX.test(id)) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Fetch layout config from SiteSetting
    const settingKey = `page_layout_${id}`;
    const setting = await prisma.siteSetting.findUnique({
      where: { key: settingKey },
    });

    // Parse layout configuration or return defaults
    const layoutConfig: PageLayoutConfig = setting
      ? JSON.parse(setting.value)
      : {
          header: {
            enabled: true,
            type: "default",
            style: { backgroundColor: "#ffffff", textColor: "#000000" },
            navigation: {
              showMainNav: true,
              showLanguageSwitcher: true,
              showSearch: false,
            },
          },
          footer: {
            enabled: true,
            type: "default",
            style: { backgroundColor: "#1f2937", textColor: "#ffffff" },
            content: {
              showQuickLinks: true,
              showLegalLinks: true,
              showSocialLinks: true,
              showContactInfo: true,
            },
          },
          layout: {
            containerWidth: "container",
            padding: { top: 0, bottom: 0, left: 0, right: 0 },
          },
        };

    return NextResponse.json({
      success: true,
      data: layoutConfig,
    });
  } catch (error) {
    console.error("Error fetching layout settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout settings" },
      { status: 500 }
    );
  }
}
