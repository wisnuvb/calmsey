import { NextResponse } from "next/server";
import { getSiteSetupStatus } from "@/lib/site-setup";

export async function GET() {
  try {
    const status = await getSiteSetupStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Setup status error:", error);
    return NextResponse.json(
      {
        error: "Failed to get setup status",
        dbConnected: false,
        adminExists: false,
        settingsConfigured: false,
        landingPageExists: false,
        isSetupComplete: false,
      },
      { status: 500 }
    );
  }
}
