import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_ADMIN } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    // Fetch site settings and languages
    const [siteSettings, languages] = await Promise.all([
      prisma.siteSetting.findMany({
        orderBy: { key: "asc" },
      }),
      prisma.language.findMany({
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        siteSettings,
        languages,
      },
    });
  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { siteSettings, languages } = body;

    await prisma.$transaction(async (tx) => {
      // Update site settings
      if (siteSettings) {
        for (const setting of siteSettings) {
          await tx.siteSetting.upsert({
            where: { key: setting.key },
            update: {
              value: setting.value,
              type: setting.type || "TEXT",
            },
            create: {
              key: setting.key,
              value: setting.value,
              type: setting.type || "TEXT",
            },
          });
        }
      }

      // Update languages
      if (languages) {
        for (const language of languages) {
          await tx.language.upsert({
            where: { id: language.id },
            update: {
              name: language.name,
              flag: language.flag,
              isDefault: language.isDefault,
              isActive: language.isActive,
            },
            create: language,
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
