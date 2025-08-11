"use client";

import React from "react";
import Link from "next/link";
import {
  DocumentPlusIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";

interface CreateLandingPagePromptProps {
  language: string;
}

export default function CreateLandingPagePrompt({
  language,
}: CreateLandingPagePromptProps) {
  const content = {
    en: {
      title: "Create Your Landing Page",
      description:
        "Your site is almost ready! Create a landing page to welcome your visitors.",
      createButton: "Create Landing Page",
      templateButton: "Browse Templates",
      features: [
        "Drag & drop page builder",
        "Professional templates",
        "Mobile responsive design",
        "SEO optimized",
      ],
    },
    id: {
      title: "Buat Halaman Landing Anda",
      description:
        "Situs Anda hampir siap! Buat halaman landing untuk menyambut pengunjung.",
      createButton: "Buat Halaman Landing",
      templateButton: "Lihat Template",
      features: [
        "Page builder drag & drop",
        "Template profesional",
        "Desain responsive mobile",
        "Dioptimasi SEO",
      ],
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg p-8 text-center">
        <DocumentPlusIcon className="w-20 h-20 text-indigo-500 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>

        <p className="text-lg text-gray-600 mb-8">{t.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="bg-indigo-50 rounded-lg p-4 flex items-center justify-center"
            >
              <p className="text-sm text-indigo-700 font-medium">{feature}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Link
            href="/admin/pages/new?template=LANDING"
            className="block w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
          >
            <CursorArrowRaysIcon className="w-6 h-6 inline-block mr-2" />
            {t.createButton}
          </Link>

          <Link
            href="/admin/templates?category=LANDING"
            className="block w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            {t.templateButton}
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Check our{" "}
            <Link
              href="/admin/help"
              className="text-indigo-600 hover:text-indigo-800"
            >
              documentation
            </Link>{" "}
            or{" "}
            <Link
              href="/admin/support"
              className="text-indigo-600 hover:text-indigo-800"
            >
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
