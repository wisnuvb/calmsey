import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
    console.error("Public layout config API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout config" },
      { status: 500 }
    );
  }
}
