import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PageRenderer from "@/components/public/PageRenderer";
import { PageTemplate } from "@prisma/client";
import { PageSection } from "@/types/page-builder";

interface PageProps {
  params: Promise<{ lang: string; slug: string[] }>;
}

// Generate static params for all published pages
export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { status: "PUBLISHED" },
    include: {
      translations: {
        include: { language: true },
      },
    },
  });

  const params = [];

  for (const page of pages) {
    for (const translation of page.translations) {
      // Handle different page types
      if (page.template === "LANDING") {
        // Landing page goes to root
        params.push({
          lang: translation.language.id,
          slug: [],
        });
      } else {
        // Regular pages use their slug
        params.push({
          lang: translation.language.id,
          slug: page.slug.split("/").filter(Boolean),
        });
      }
    }
  }

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const slugPath = slug?.join("/") || "";

  // Handle landing page
  const isLanding = slugPath === "" || slugPath === "home";
  const whereClause = isLanding
    ? { template: "LANDING" as PageTemplate }
    : { slug: slugPath };

  const page = await prisma.page.findFirst({
    where: {
      ...whereClause,
      status: "PUBLISHED",
    },
    include: {
      translations: {
        where: { language: { id: lang } },
        include: { language: true },
      },
    },
  });

  if (!page || !page.translations[0]) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const translation = page.translations[0];

  return {
    title: translation.seoTitle || translation.title,
    description: translation.seoDescription || translation.excerpt,
    openGraph: {
      title: translation.seoTitle || translation.title,
      description: translation.seoDescription || translation.excerpt || "",
      images: page.featuredImage ? [page.featuredImage] : [],
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: translation.seoTitle || translation.title,
      description: translation.seoDescription || translation.excerpt || "",
      images: page.featuredImage ? [page.featuredImage] : [],
    },
    alternates: {
      canonical: `/${lang}/${slugPath}`,
      languages: page.translations.reduce((acc, t) => {
        acc[t.language.id] = `/${t.language.id}/${slugPath}`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const slugPath = slug?.join("/") || "";

  // Handle landing page
  const isLanding = slugPath === "" || slugPath === "home";
  const whereClause = isLanding
    ? { template: "LANDING" as PageTemplate }
    : { slug: slugPath };

  // Fetch page with all necessary relations
  const page = await prisma.page.findFirst({
    where: {
      ...whereClause,
      status: "PUBLISHED",
    },
    include: {
      translations: {
        where: { language: { id: lang } },
        include: { language: true },
      },
      sections: {
        where: { isActive: true },
        include: {
          translations: {
            where: { language: { id: lang } },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!page || !page.translations[0]) {
    notFound();
  }

  const translation = page.translations[0];

  // Determine layout based on template
  const getLayoutClasses = (template: PageTemplate) => {
    switch (template) {
      case "LANDING":
        return "min-h-screen";
      case "FULL_WIDTH":
        return "w-full";
      case "CONTACT":
        return "min-h-screen bg-gray-50";
      case "ABOUT":
        return "min-h-screen";
      default:
        return "min-h-screen";
    }
  };

  return (
    <main className={getLayoutClasses(page.template)}>
      {/* Page Header (if not landing page) */}
      {page.template !== "LANDING" && (
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {translation.title}
            </h1>
            {translation.excerpt && (
              <p className="mt-4 text-xl text-gray-600">
                {translation.excerpt}
              </p>
            )}
          </div>
        </header>
      )}

      {/* Render page sections */}
      <PageRenderer
        sections={page.sections as unknown as PageSection[]}
        language={lang}
        className={
          page.template === "LANDING" ? "landing-page" : "content-page"
        }
      />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": page.template === "LANDING" ? "WebPage" : "Article",
            headline: translation.title,
            description: translation.excerpt,
            image: page.featuredImage,
            datePublished: page.publishedAt,
            dateModified: page.updatedAt,
            author: {
              "@type": "Organization",
              name: "Your Site Name", // Get from site settings
            },
            publisher: {
              "@type": "Organization",
              name: "Your Site Name", // Get from site settings
            },
          }),
        }}
      />
    </main>
  );
}

// src/app/[lang]/layout.tsx

// src/components/public/Header.tsx
// import Link from "next/link";
// import { useState } from "react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// interface HeaderProps {
//   language: string;
//   menuItems: any[];
// }

// export default function PublicHeader({ language, menuItems }: HeaderProps) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-md sticky top-0 z-50">
//       <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link
//               href={`/${language}`}
//               className="text-2xl font-bold text-blue-600"
//             >
//               Your Site
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               {menuItems.map((item) => {
//                 const translation = item.translations[0];
//                 const href = item.page
//                   ? `/${language}/${item.page.slug}`
//                   : item.url || "#";

//                 return (
//                   <Link
//                     key={item.id}
//                     href={href}
//                     className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                     target={item.openInNewTab ? "_blank" : undefined}
//                   >
//                     {translation?.title || item.title}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Language Switcher */}
//           <div className="hidden md:block">
//             <LanguageSwitcher currentLanguage={language} />
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
//             >
//               {mobileMenuOpen ? (
//                 <XMarkIcon className="h-6 w-6" />
//               ) : (
//                 <Bars3Icon className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {mobileMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
//               {menuItems.map((item) => {
//                 const translation = item.translations[0];
//                 const href = item.page
//                   ? `/${language}/${item.page.slug}`
//                   : item.url || "#";

//                 return (
//                   <Link
//                     key={item.id}
//                     href={href}
//                     className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
//                     target={item.openInNewTab ? "_blank" : undefined}
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     {translation?.title || item.title}
//                   </Link>
//                 );
//               })}
//               <div className="pt-4 border-t border-gray-200">
//                 <LanguageSwitcher currentLanguage={language} />
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// }

// function LanguageSwitcher({ currentLanguage }: { currentLanguage: string }) {
//   // This would fetch available languages from your database
//   const languages = [
//     { code: "en", name: "English" },
//     { code: "id", name: "Indonesia" },
//   ];

//   return (
//     <div className="relative">
//       <select
//         value={currentLanguage}
//         onChange={(e) => {
//           // Switch language by redirecting to the same page in different language
//           const newLang = e.target.value;
//           const currentPath = window.location.pathname;
//           const newPath = currentPath.replace(
//             `/${currentLanguage}`,
//             `/${newLang}`
//           );
//           window.location.href = newPath;
//         }}
//         className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         {languages.map((lang) => (
//           <option key={lang.code} value={lang.code}>
//             {lang.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
