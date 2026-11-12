import { NextRequest, NextResponse } from "next/server";
import {
  createDefaultAdminUser,
  hasSuperAdmin,
  SetupAlreadyCompleteError,
} from "@/lib/site-setup";

const FORBIDDEN_RESPONSE = { error: "Setup has already been completed" };

export async function POST(request: NextRequest) {
  try {
    // Admin hanya boleh dibuat bila belum ada SUPER_ADMIN.
    if (await hasSuperAdmin()) {
      return NextResponse.json(FORBIDDEN_RESPONSE, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password } = body ?? {};

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      name.length > 200 ||
      email.length > 254 ||
      password.length > 128
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Create admin user (cek ulang + create dalam satu transaksi)
    const admin = await createDefaultAdminUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: admin.id,
    });
  } catch (error) {
    if (error instanceof SetupAlreadyCompleteError) {
      return NextResponse.json(FORBIDDEN_RESPONSE, { status: 403 });
    }

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
