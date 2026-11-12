import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardSetupRoute } from "@/lib/site-setup";

export async function POST(request: NextRequest) {
  try {
    // Sama seperti route setup lain: terbuka hanya sebelum ada SUPER_ADMIN.
    const denied = await guardSetupRoute();
    if (denied) return denied;

    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      name.length > 200 ||
      email.length > 254 ||
      message.length > 5000
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Save contact submission
    const submission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      },
    });

    // TODO: Send notification email to admin
    // You can implement email sending here using nodemailer or similar

    return NextResponse.json({
      success: true,
      message:
        "Your message has been sent successfully. We'll get back to you soon!",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
