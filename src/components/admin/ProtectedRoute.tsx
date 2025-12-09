"use client";

import { ROLE_VIEWER } from "@/lib/auth-helpers";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  excludePaths?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = ROLE_VIEWER,
  excludePaths = ["/admin/login"],
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isExcludedPath = excludePaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    if (status === "loading" || isExcludedPath) return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    if (!allowedRoles.includes(session.user.role)) {
      router.push("/admin/unauthorized");
      return;
    }
  }, [session, status, router, isExcludedPath, allowedRoles, pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isExcludedPath) {
    return <>{children}</>;
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return null;
  }

  return <>{children}</>;
}
