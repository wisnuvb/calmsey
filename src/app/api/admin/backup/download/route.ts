import { requireAuth, ROLES } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

// Sebelumnya mengembalikan file SQL placeholder seolah-olah backup asli.
// Jangan pernah melakukan itu; lihat catatan di ../route.ts.
export async function GET() {
  const authResult = await requireAuth([ROLES.SUPER_ADMIN]);
  if (!authResult.success) return authResult.response;

  return NextResponse.json(
    { error: "Backup is not implemented" },
    { status: 501 }
  );
}
