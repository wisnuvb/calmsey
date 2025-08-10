import Link from "next/link";
import { PublicAPI, SupportedLanguage } from "@/lib/public-api";

interface PublicFooterProps {
  language: SupportedLanguage;
}

export async function PublicFooter({ language }: PublicFooterProps) {
  const [siteSettings, footerNavigation, categories] = await Promise.all([
    PublicAPI.getSiteSettings(),
    PublicAPI.getNavigationMenu("footer-links", language),
    PublicAPI.getCategoryHierarchy(language),
  ]);

  const currentYear = new Date().getFullYear();
  const prefix = language === "en" ? "" : `/${language}`;

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-bold text-white">
                {siteSettings?.siteName || "Turning Tides"}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              {siteSettings?.siteDescription ||
                "Premier rehabilitation and treatment facility"}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              {siteSettings?.address && (
                <p className="flex items-start">
                  <span className="w-5 h-5 mr-2 mt-0.5">📍</span>
                  {siteSettings.address}
                </p>
              )}
              {siteSettings?.contactPhone && (
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2">📞</span>
                  {siteSettings.contactPhone}
                </p>
              )}
              {siteSettings?.contactEmail && (
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2">✉️</span>
                  {siteSettings.contactEmail}
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {language === "en" ? "Quick Links" : "Tautan Cepat"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${prefix}/articles`}
                  className="text-gray-300 hover:text-white text-sm"
                >
                  {language === "en" ? "Articles" : "Artikel"}
                </Link>
              </li>
              {categories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`${prefix}/${category.slug}`}
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {language === "en" ? "Legal" : "Legal"}
            </h3>
            <ul className="space-y-2">
              {footerNavigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url || "#"}
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear}{" "}
              {siteSettings?.siteName || "Turning Tides Facility"}.
              {language === "en"
                ? " All rights reserved."
                : " Semua hak dilindungi."}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              {siteSettings?.socialLinks.facebook && (
                <a
                  href={siteSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {siteSettings?.socialLinks.twitter && (
                <a
                  href={siteSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
              {siteSettings?.socialLinks.instagram && (
                <a
                  href={siteSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.243 14.814 3.75 13.662 3.75 12.365c0-1.297.493-2.448 1.371-3.328.878-.88 2.031-1.371 3.328-1.371 1.297 0 2.448.491 3.328 1.371.88.88 1.371 2.031 1.371 3.328 0 1.297-.491 2.449-1.371 3.326-.88.878-2.031 1.297-3.328 1.297zm7.718-1.33c-.878.88-2.031 1.371-3.328 1.371-1.297 0-2.448-.491-3.328-1.371-.88-.877-1.371-2.029-1.371-3.326 0-1.297.491-2.448 1.371-3.328.88-.88 2.031-1.371 3.328-1.371 1.297 0 2.45.491 3.328 1.371.88.88 1.371 2.031 1.371 3.328 0 1.297-.491 2.449-1.371 3.326z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
