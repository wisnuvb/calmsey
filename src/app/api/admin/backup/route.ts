import { NextResponse } from "next/server";
import { requireAuth, ROLES } from "@/lib/auth-helpers";

// Backup via API belum diimplementasikan. Versi sebelumnya membangun shell string
// dari env (command injection / password di argv) dan langsung mengembalikan
// "success" tanpa menunggu hasil. Lakukan backup lewat mysqldump terjadwal di
// server (di luar aplikasi) sampai fitur ini dibuat dengan benar.
export async function POST() {
  const authResult = await requireAuth([ROLES.SUPER_ADMIN]);
  if (!authResult.success) return authResult.response;

  return NextResponse.json(
    { error: "Backup is not implemented" },
    { status: 501 }
  );
}
