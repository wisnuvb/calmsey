import { NextResponse } from "next/server";
import { buildCountrySelectOptions } from "@/lib/countries";

/**
 * List of countries for the combobox on the client. Built on the server with `Intl`
 * (full list), so as not to rely on `Intl.supportedValuesOf` support
 * in the browser.
 */
export async function GET() {
  try {
    const data = buildCountrySelectOptions();
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
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
