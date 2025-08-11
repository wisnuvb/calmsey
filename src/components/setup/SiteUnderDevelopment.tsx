"use client";

import React from "react";
import Link from "next/link";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

interface SiteUnderDevelopmentProps {
  language: string;
}

export default function SiteUnderDevelopment({
  language,
}: SiteUnderDevelopmentProps) {
  const content = {
    en: {
      title: "Site Under Development",
      description:
        "This website is currently being set up. Please check back soon!",
      adminLogin: "Administrator Login",
      estimatedTime: "Estimated completion: Soon",
      contact: "For urgent inquiries, please contact our team directly.",
    },
    id: {
      title: "Situs Dalam Pengembangan",
      description:
        "Website ini sedang dalam tahap pengaturan. Silakan kembali lagi nanti!",
      adminLogin: "Login Administrator",
      estimatedTime: "Perkiraan selesai: Segera",
      contact: "Untuk pertanyaan mendesak, silakan hubungi tim kami langsung.",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8 text-center">
        <WrenchScrewdriverIcon className="w-16 h-16 text-blue-500 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>

        <p className="text-gray-600 mb-8">{t.description}</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">{t.estimatedTime}</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            {t.adminLogin}
          </Link>

          <p className="text-sm text-gray-500">{t.contact}</p>
        </div>
      </div>
    </div>
  );
}
