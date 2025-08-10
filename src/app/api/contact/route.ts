import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
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

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { name, email, message } = body;

//     // Validation
//     if (!name || !email || !message) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Save contact submission
//     const contact = await prisma.contactSubmission.create({
//       data: {
//         name: name.trim(),
//         email: email.trim(),
//         message: message.trim(),
//         status: "UNREAD",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Contact submission received",
//       id: contact.id,
//     });
//   } catch (error) {
//     console.error("Contact submission error:", error);
//     return NextResponse.json(
//       { error: "Failed to submit contact form" },
//       { status: 500 }
//     );
//   }
// }
