"use client";

import React from "react";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface LandingPageMissingProps {
  language: string;
}

export default function LandingPageMissing({
  language,
}: LandingPageMissingProps) {
  const content = {
    en: {
      title: "Landing Page Not Found",
      description: "The landing page for this site has not been created yet.",
      adminMessage:
        "Please create a landing page to display content to visitors.",
      contactMessage: "Please contact the site administrator.",
    },
    id: {
      title: "Halaman Landing Tidak Ditemukan",
      description: "Halaman landing untuk situs ini belum dibuat.",
      adminMessage:
        "Silakan buat halaman landing untuk menampilkan konten kepada pengunjung.",
      contactMessage: "Silakan hubungi administrator situs.",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.title}</h1>

        <p className="text-gray-600 mb-6">{t.description}</p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-sm text-yellow-700">{t.contactMessage}</p>
        </div>

        <Link
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
        >
          Administrator Login
        </Link>
      </div>
    </div>
  );
}
