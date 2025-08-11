import { NextRequest, NextResponse } from "next/server";
import { createDefaultAdminUser } from "@/lib/site-setup";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Create admin user
    const admin = await createDefaultAdminUser({ name, email, password });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: admin.id,
    });
  } catch (error) {
    console.error("Admin setup error:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "An admin user already exists or email is already taken" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
