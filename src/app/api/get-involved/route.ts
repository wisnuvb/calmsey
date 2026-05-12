import { NextRequest, NextResponse } from "next/server";
import {
  getCountryLabelForValue,
  isAllowedCountryValue,
} from "@/lib/countries";

/** Normalizes env if someone pasted a markdown link `[label](url)` by mistake. */
function normalizeWebhookUrl(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  const markdown = trimmed.match(/^\[[^\]]*]\((https?:\/\/[^)]+)\)\s*$/);
  if (markdown) return markdown[1];
  return trimmed;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      organization,
      organizationName,
      country,
      partnershipType,
      message,
    } = body;

    const entityTypes = ["company", "institute", "organization", "individual"] as const;

    // Validation — empty fields to make "All fields are required" message still valid
    if (
      !fullName ||
      !email ||
      !organization ||
      !country ||
      !partnershipType ||
      !message
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const orgType =
      typeof organization === "string" ? organization.trim().toLowerCase() : "";
    if (!entityTypes.includes(orgType as (typeof entityTypes)[number])) {
      return NextResponse.json(
        { error: "Invalid type of entity" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const countryNormalized =
      typeof country === "string" ? country.trim().toLowerCase() : "";
    if (!isAllowedCountryValue(countryNormalized)) {
      return NextResponse.json(
        { error: "Invalid or unsupported country" },
        { status: 400 }
      );
    }
    const countryLabel = getCountryLabelForValue(countryNormalized);
    if (!countryLabel) {
      return NextResponse.json(
        { error: "Invalid or unsupported country" },
        { status: 400 }
      );
    }

    let trimmedOrganizationName: string | undefined;
    if (orgType !== "individual") {
      const raw =
        typeof organizationName === "string" ? organizationName.trim() : "";
      if (!raw) {
        return NextResponse.json(
          {
            error:
              "Company name, Institute name, or Organization name is required",
          },
          { status: 400 }
        );
      }
      if (raw.length > 500) {
        return NextResponse.json(
          { error: "Organization name is too long" },
          { status: 400 }
        );
      }
      trimmedOrganizationName = raw;
    }

    const webhookUrl = normalizeWebhookUrl(
      process.env.POWER_AUTOMATE_GET_INVOLVED_URL,
    );

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Power Automate webhook URL not configured" },
        { status: 500 }
      );
    }

    const powerAutomatePayload = {
      fullName,
      email,
      entityType: orgType,
      organizationName: trimmedOrganizationName ?? null,
      country: countryLabel,
      partnerType: partnershipType,
      message,
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(powerAutomatePayload),
    });

    if (!response.ok) {
      throw new Error("Power Automate webhook returned error");
    }

    const contentType = response.headers.get("content-type") ?? "";
    let upstreamBody: unknown = null;
    if (contentType.includes("application/json")) {
      try {
        upstreamBody = await response.json();
      } catch {
        upstreamBody = null;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent.",
      data: upstreamBody,
    });
  } catch (error) {
    console.error("Get Involved form submission error:", error);
    return NextResponse.json(
      { error: "Failed to send form. Please try again." },
      { status: 500 }
    );
  }
}
