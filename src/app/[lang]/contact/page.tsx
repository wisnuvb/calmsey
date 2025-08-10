import { ContactPage } from "@/components/public/ContactPage";
import { SupportedLanguage } from "@/lib/public-api";
import { Metadata } from "next";

interface ContactPageProps {
  params: Promise<{ lang: SupportedLanguage }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === "en" ? "Contact Us" : "Hubungi Kami",
    description:
      lang === "en"
        ? "Get in touch with Turning Tides Facility"
        : "Hubungi Fasilitas Turning Tides",
    alternates: {
      canonical: `/${lang}/contact`,
      languages: {
        en: "/en/contact",
        id: "/id/contact",
      },
    },
  };
}

export default async function ContactPageRoute({ params }: ContactPageProps) {
  const { lang } = await params;

  return <ContactPage language={lang} />;
}
