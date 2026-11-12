import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit per IP: 5 submit / jam (selain cek per-email di DB di bawah)
    const ipLimit = rateLimit(`contact:${getClientIp(request)}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const body = await request.json();
    const { name, email, message } = body ?? {};

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      name.length > 200 ||
      email.length > 254
    ) {
      return NextResponse.json(
        { error: "Invalid name, email, or message" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long" },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be less than 5000 characters" },
        { status: 400 }
      );
    }

    // Rate limiting check (prevent spam)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSubmissions = await prisma.contactSubmission.count({
      where: {
        email,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    if (recentSubmissions >= 3) {
      return NextResponse.json(
        {
          error:
            "Too many submissions. Please wait 24 hours before submitting again.",
        },
        { status: 429 }
      );
    }

    // Create contact submission
    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        status: "UNREAD",
      },
    });

    // TODO: Send email notification to admins
    // You can integrate with email service like SendGrid, Nodemailer, etc.

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
      data: {
        id: contactSubmission.id,
        submittedAt: contactSubmission.createdAt,
      },
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form. Please try again." },
      { status: 500 }
    );
  }
}
