import { notFound } from "next/navigation";
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  isValidLanguage,
} from "@/lib/public-api";
import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import { LanguageProvider } from "@/components/public/LanguageProvider";
import SessionProvider from "@/components/providers/SessionProvider";

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  const { lang } = await params;

  if (!isValidLanguage(lang)) {
    notFound();
  }

  return (
    <SessionProvider>
      <LanguageProvider language={lang}>
        <div className="min-h-screen flex flex-col">
          <PublicHeader language={lang} />
          <main className="flex-1">{children}</main>
          <PublicFooter language={lang} />
        </div>
      </LanguageProvider>
    </SessionProvider>
  );
}
