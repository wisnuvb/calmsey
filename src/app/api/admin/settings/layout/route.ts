import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_ADMIN } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    // Fetch layout configuration from site settings
    const layoutConfig = await prisma.siteSetting.findFirst({
      where: { key: "layout_config" },
    });

    const defaultConfig = {
      header: {
        enabled: true,
        type: "default",
        style: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          sticky: false,
          transparent: false,
        },
        navigation: {
          showMainNav: true,
          showLanguageSwitcher: true,
          showSearch: false,
        },
      },
      footer: {
        enabled: true,
        type: "default",
        style: {
          backgroundColor: "#1f2937",
          textColor: "#ffffff",
          showSocialLinks: true,
          showContactInfo: true,
        },
        content: {
          showQuickLinks: true,
          showLegalLinks: true,
          showSocialLinks: true,
          showContactInfo: true,
        },
      },
      layout: {
        containerWidth: "container",
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
    };

    const config = layoutConfig
      ? JSON.parse(layoutConfig.value)
      : defaultConfig;

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Layout settings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { layoutConfig } = body;

    // Save layout configuration to site settings
    await prisma.siteSetting.upsert({
      where: { key: "layout_config" },
      update: {
        value: JSON.stringify(layoutConfig),
        type: "JSON",
      },
      create: {
        key: "layout_config",
        value: JSON.stringify(layoutConfig),
        type: "JSON",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Layout settings updated successfully",
    });
  } catch (error) {
    console.error("Update layout settings error:", error);
    return NextResponse.json(
      { error: "Failed to update layout settings" },
      { status: 500 }
    );
  }
}
