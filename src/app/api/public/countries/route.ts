import { NextResponse } from "next/server";
import { buildCountrySelectOptions } from "@/lib/countries";

/**
 * Daftar negara untuk combobox di klien. Dibangun di server dengan `Intl`
 * (daftar penuh), agar tidak bergantung pada dukungan `Intl.supportedValuesOf`
 * di browser.
 */
export async function GET() {
  try {
    const data = buildCountrySelectOptions();
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/public/countries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load countries" },
      { status: 500 },
    );
  }
}
