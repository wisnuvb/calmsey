import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ROLE_EDITOR } from "@/lib/auth-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> } // ✅ Promise type
) {
  try {
    const { key } = await params;

    const authResult = await requireAuth(ROLE_EDITOR);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { items } = body;

    // Find or create menu
    const menu = await prisma.menu.upsert({
      where: { key }, // ✅ Use awaited key
      update: {},
      create: {
        key, // ✅ Use awaited key
        name: key === "main-navigation" ? "Main Navigation" : "Footer Links", // ✅ Use awaited key
      },
    });

    // Delete all existing items and recreate
    await prisma.menuItem.deleteMany({
      where: { menuId: menu.id },
    });

    // Create new menu items if any
    if (items && items.length > 0) {
      // First pass: Create all menu items without parentId
      const createdItems = new Map();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (!item.title?.trim()) {
          console.warn(`Skipping item without title:`, item);
          continue;
        }

        // Create menu item without parentId first
        const menuItem = await prisma.menuItem.create({
          data: {
            menuId: menu.id,
            parentId: null, // Set to null initially
            order: i,
            url: item.url || null,
            target: item.target || "SELF",
            type: item.type || "CUSTOM",
            isActive: item.isActive !== false,
            articleCategoryId: item.categoryId || null,
            pageId: item.pageId || null,
            isVisibleToAll: true,
          },
        });

        // Store the created item with its original data
        createdItems.set(item.id, { menuItem, originalItem: item });

        // Create English translation
        await prisma.menuItemTranslation.create({
          data: {
            menuItemId: menuItem.id,
            title: item.title,
            languageId: "en",
          },
        });

        // Create Indonesian translation if provided
        if (item.titleId) {
          await prisma.menuItemTranslation.create({
            data: {
              menuItemId: menuItem.id,
              title: item.titleId,
              languageId: "id",
            },
          });
        }
      }

      // Second pass: Update parentId relationships
      for (const [{ menuItem, originalItem }] of createdItems) {
        if (originalItem.parentId) {
          const parentItem = createdItems.get(originalItem.parentId);
          if (parentItem) {
            await prisma.menuItem.update({
              where: { id: menuItem.id },
              data: { parentId: parentItem.menuItem.id },
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update menu error:", error);
    return NextResponse.json(
      {
        error: "Failed to update menu",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
