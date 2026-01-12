import { NextRequest, NextResponse } from "next/server";

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

    // Kirim ke Google Apps Script Web App
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      return NextResponse.json(
        { error: "Google Script URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        organization,
        country,
        partnershipType,
        message,
      }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to send to Google Form");
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent.",
      data: result,
    });
  } catch (error) {
    console.error("Get Involved form submission error:", error);
    return NextResponse.json(
      { error: "Failed to send form. Please try again." },
      { status: 500 }
    );
  }
}
