// src/app/api/admin/pages/[id]/layout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PageLayoutConfig } from "@/types/layout-settings";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { layoutConfig }: { layoutConfig: PageLayoutConfig } = body;

    // Update page with layout settings
    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        showHeader: layoutConfig.header.enabled,
        showFooter: layoutConfig.footer.enabled,
        headerSettings: JSON.stringify(layoutConfig.header),
        footerSettings: JSON.stringify(layoutConfig.footer),
        layoutSettings: JSON.stringify(layoutConfig.layout),
        customHeader:
          layoutConfig.header.type === "custom"
            ? layoutConfig.header.customContent
            : null,
        customFooter:
          layoutConfig.footer.type === "custom"
            ? layoutConfig.footer.customContent
            : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPage,
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const page = await prisma.page.findUnique({
      where: { id },
      select: {
        showHeader: true,
        showFooter: true,
        headerSettings: true,
        footerSettings: true,
        layoutSettings: true,
        customHeader: true,
        customFooter: true,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Parse layout configuration
    const layoutConfig: PageLayoutConfig = {
      header: page.headerSettings
        ? JSON.parse(page.headerSettings)
        : {
            enabled: page.showHeader,
            type: "default",
            style: { backgroundColor: "#ffffff", textColor: "#000000" },
            navigation: {
              showMainNav: true,
              showLanguageSwitcher: true,
              showSearch: false,
            },
          },
      footer: page.footerSettings
        ? JSON.parse(page.footerSettings)
        : {
            enabled: page.showFooter,
            type: "default",
            style: { backgroundColor: "#1f2937", textColor: "#ffffff" },
            content: {
              showQuickLinks: true,
              showLegalLinks: true,
              showSocialLinks: true,
              showContactInfo: true,
            },
          },
      layout: page.layoutSettings
        ? JSON.parse(page.layoutSettings)
        : {
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
