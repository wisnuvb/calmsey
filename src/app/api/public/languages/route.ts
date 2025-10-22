import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get only active languages
    const languages = await prisma.language.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        flag: true,
        isDefault: true,
      },
      orderBy: [
        { isDefault: "desc" }, // Default language first
        { name: "asc" }, // Then alphabetically
      ],
    });

    return NextResponse.json({
      success: true,
      data: languages,
    });
  } catch (error) {
    console.error("Error fetching active languages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch languages",
      },
      { status: 500 }
    );
  }
}
