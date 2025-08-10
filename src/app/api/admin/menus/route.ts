/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const menuKey = searchParams.get("key"); // e.g., 'main-navigation'

    const where: any = {};
    if (menuKey) {
      where.key = menuKey;
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        items: {
          include: {
            translations: {
              where: { languageId: "en" },
              take: 1,
            },
            category: {
              include: {
                translations: {
                  where: { languageId: "en" },
                  take: 1,
                },
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    // Format menu items
    const formattedMenus = menus.map((menu) => ({
      ...menu,
      items: menu.items.map((item) => ({
        id: item.id,
        title: item.translations[0]?.title || "Untitled",
        url: item.url,
        type: item.type,
        target: item.target,
        parentId: item.parentId,
        order: item.order,
        isActive: item.isActive,
        categoryId: item.articleCategoryId,
        categoryName: item.category?.translations[0]?.name,
      })),
    }));

    return NextResponse.json({ data: formattedMenus });
  } catch (error) {
    console.error("Menus API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 }
    );
  }
}
