import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const maintenanceSetting = await prisma.siteSetting.findUnique({
      where: { key: "maintenance_mode" },
    });

    const isMaintenanceMode = maintenanceSetting?.value === "true";

    return NextResponse.json({
      maintenanceMode: isMaintenanceMode,
    });
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
    // If error, assume not in maintenance mode
    return NextResponse.json({
      maintenanceMode: false,
    });
  }
}
