import Link from "next/link";
import {
  PublicArticle,
  SupportedLanguage,
  SiteSettings,
} from "@/lib/public-api";
import { ArticleCard } from "./ArticleCard";

interface HomePageProps {
  data: {
    recentArticles: PublicArticle[];
    siteSettings: SiteSettings | null;
  };
  language: SupportedLanguage;
}

export function HomePage({ data, language }: HomePageProps) {
  const { recentArticles, siteSettings } = data;
  const prefix = language === "en" ? "" : `/${language}`;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {language === "en"
                ? "Welcome to Turning Tides"
                : "Selamat Datang di Turning Tides"}
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100 max-w-3xl mx-auto">
              {language === "en"
                ? "Premier rehabilitation and treatment facility providing comprehensive care and support for recovery and healing."
                : "Fasilitas rehabilitasi dan perawatan premier yang menyediakan perawatan dan dukungan komprehensif untuk pemulihan dan penyembuhan."}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={`${prefix}/contact`}
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {language === "en" ? "Contact Us" : "Hubungi Kami"}
              </Link>
              <Link
                href={`${prefix}/about`}
                className="text-base font-semibold leading-6 text-white hover:text-blue-100"
              >
                {language === "en" ? "Learn more" : "Pelajari lebih lanjut"}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      {recentArticles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                {language === "en" ? "Latest Articles" : "Artikel Terbaru"}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {language === "en"
                  ? "Stay informed with our latest insights and updates"
                  : "Tetap terinformasi dengan wawasan dan pembaruan terbaru kami"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.slice(0, 6).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  language={language}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href={`${prefix}/articles`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
              >
                {language === "en"
                  ? "View All Articles"
                  : "Lihat Semua Artikel"}
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {language === "en" ? "Our Services" : "Layanan Kami"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Expert Care */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "en" ? "Expert Care" : "Perawatan Ahli"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Professional medical staff providing 24/7 comprehensive care"
                  : "Staf medis profesional memberikan perawatan komprehensif 24/7"}
              </p>
            </div>

            {/* Family Support */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "en" ? "Family Support" : "Dukungan Keluarga"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Comprehensive support programs for patients and their families"
                  : "Program dukungan komprehensif untuk pasien dan keluarga mereka"}
              </p>
            </div>

            {/* Modern Facilities */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "en" ? "Modern Facilities" : "Fasilitas Modern"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "State-of-the-art treatment facilities and comfortable accommodations"
                  : "Fasilitas perawatan canggih dan akomodasi yang nyaman"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              {language === "en"
                ? "Ready to Start Your Recovery Journey?"
                : "Siap Memulai Perjalanan Pemulihan Anda?"}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {language === "en"
                ? "Take the first step towards healing and recovery. Our team is here to support you every step of the way."
                : "Ambil langkah pertama menuju penyembuhan dan pemulihan. Tim kami siap mendukung Anda di setiap langkah perjalanan."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`${prefix}/contact`}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {language === "en" ? "Get in Touch" : "Hubungi Kami"}
              </Link>
              <Link
                href={`${prefix}/about`}
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {language === "en" ? "Learn More" : "Pelajari Lebih Lanjut"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      {siteSettings && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                {language === "en" ? "Contact Information" : "Informasi Kontak"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Phone */}
              {siteSettings.contactPhone && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === "en" ? "Phone" : "Telepon"}
                  </h3>
                  <p className="text-gray-600">
                    <a
                      href={`tel:${siteSettings.contactPhone}`}
                      className="hover:text-blue-600"
                    >
                      {siteSettings.contactPhone}
                    </a>
                  </p>
                </div>
              )}

              {/* Email */}
              {siteSettings.contactEmail && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === "en" ? "Email" : "Email"}
                  </h3>
                  <p className="text-gray-600">
                    <a
                      href={`mailto:${siteSettings.contactEmail}`}
                      className="hover:text-blue-600"
                    >
                      {siteSettings.contactEmail}
                    </a>
                  </p>
                </div>
              )}

              {/* Address */}
              {siteSettings.address && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === "en" ? "Address" : "Alamat"}
                  </h3>
                  <p className="text-gray-600">{siteSettings.address}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
