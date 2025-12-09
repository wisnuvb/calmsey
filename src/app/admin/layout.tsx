"use client";

import { SessionProvider } from "next-auth/react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { SimpleFontLoader } from "@/components/SimpleFontLoader";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <SimpleFontLoader />
      <ProtectedRoute>
        <ToastProvider>
          <AdminLayout>{children}</AdminLayout>
        </ToastProvider>
      </ProtectedRoute>
    </SessionProvider>
  );
}
