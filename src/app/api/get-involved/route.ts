import { NextRequest, NextResponse } from "next/server";

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
    const { fullName, email, organization, country, partnershipType, message } =
      body;

    // Validation
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
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
      entityType: organization,
      country,
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
