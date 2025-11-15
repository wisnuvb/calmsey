import { Footer, Navbar } from "@/components/layout";
import SessionProvider from "@/components/providers/SessionProvider";
import { LanguageProvider } from "@/components/public/LanguageProvider";
import React from "react";

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

const FrontendLayout = async ({ children, params }: LanguageLayoutProps) => {
  const { lang } = await params;

  return (
    <SessionProvider>
      <LanguageProvider language={lang || "en"}>
        {/* Hidden Google Translate widget container for auto-translation */}
        <div id="google_translate_element" style={{ display: 'none' }} />

        <Navbar />
        {children}
        <Footer />
      </LanguageProvider>
    </SessionProvider>
  );
};

export default FrontendLayout;
