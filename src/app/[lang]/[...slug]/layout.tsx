import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import { SupportedLanguage } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  const languages = await prisma.language.findMany({
    where: { isActive: true },
  });

  return languages.map((lang) => ({
    lang: lang.id,
  }));
}

export default async function LanguageLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Verify language exists
  const language = await prisma.language.findFirst({
    where: { id: lang, isActive: true },
  });

  if (!language) {
    notFound();
  }

  // Fetch menu items for navigation
  // const menuItems = await prisma.menuItem.findMany({
  //   where: {
  //     menu: { isActive: true },
  //     isActive: true,
  //   },
  //   include: {
  //     translations: {
  //       where: { language: { code: lang } },
  //     },
  //     page: true,
  //   },
  //   orderBy: { order: "asc" },
  // });

  return (
    <html lang={lang} className={inter.className}>
      <body className="bg-white">
        <PublicHeader language={lang as SupportedLanguage} />

        {children}

        <PublicFooter language={lang as SupportedLanguage} />
      </body>
    </html>
  );
}
