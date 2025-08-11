/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      siteName,
      siteTagline,
      siteDescription,
      contactPhone,
      contactEmail,
      address,
    } = body;

    // Validate required fields
    if (!siteName) {
      return NextResponse.json(
        { error: "Site name is required" },
        { status: 400 }
      );
    }

    // Create/update settings
    const settings = [
      { key: "site_name", value: siteName, type: "TEXT" },
      { key: "site_tagline", value: siteTagline || "", type: "TEXT" },
      { key: "site_description", value: siteDescription || "", type: "TEXT" },
      { key: "contact_phone", value: contactPhone || "", type: "TEXT" },
      { key: "contact_email", value: contactEmail || "", type: "TEXT" },
      { key: "address", value: address || "", type: "TEXT" },
    ];

    // Use upsert to create or update each setting
    for (const setting of settings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { ...setting, type: setting.type as any },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Site settings saved successfully",
    });
  } catch (error) {
    console.error("Settings setup error:", error);
    return NextResponse.json(
      { error: "Failed to save site settings" },
      { status: 500 }
    );
  }
}
