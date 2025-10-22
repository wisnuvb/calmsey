// src/app/[lang]/layout.tsx
import { notFound } from "next/navigation";
import { SUPPORTED_LANGUAGES, isValidLanguage } from "@/lib/public-api";
import { AdvancedConfigurableHeader } from "@/components/public/AdvancedConfigurableHeader";
import { AdvancedConfigurableFooter } from "@/components/public/AdvancedConfigurableFooter";
import { LanguageProvider } from "@/components/public/LanguageProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import { prisma } from "@/lib/prisma";
import { PageLayoutConfig } from "@/types/layout-settings";

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

  // Fetch layout configuration from public API
  let layoutConfig: PageLayoutConfig;
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/public/layout-config`);

    if (response.ok) {
      const data = await response.json();
      layoutConfig = data.data;
    } else {
      throw new Error("Failed to fetch layout config");
    }
  } catch (error) {
    console.error("Failed to fetch layout config, using default:", error);
    // Fallback to default config
    layoutConfig = {
      header: {
        enabled: true,
        type: "default",
        style: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          sticky: false,
          transparent: false,
        },
        navigation: {
          showMainNav: true,
          showLanguageSwitcher: true,
          showSearch: false,
        },
      },
      footer: {
        enabled: true,
        type: "default",
        style: {
          backgroundColor: "#1f2937",
          textColor: "#ffffff",
          showSocialLinks: true,
          showContactInfo: true,
        },
        content: {
          showQuickLinks: true,
          showLegalLinks: true,
          showSocialLinks: true,
          showContactInfo: true,
        },
      },
      layout: {
        containerWidth: "container",
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
    };
  }

  // Fetch global data for header/footer
  const [siteSettings, mainNavigation, footerNavigation, categories] =
    await Promise.all([
      prisma.siteSetting.findMany({
        where: {
          key: {
            in: [
              "siteName",
              "siteDescription",
              "address",
              "contactPhone",
              "contactEmail",
            ],
          },
        },
      }),
      prisma.menuItem.findMany({
        where: { menu: { key: "main-navigation" } },
        include: { translations: { where: { languageId: lang } } },
      }),
      prisma.menuItem.findMany({
        where: { menu: { key: "footer-links" } },
        include: { translations: { where: { languageId: lang } } },
      }),
      prisma.category.findMany({
        include: { translations: { where: { languageId: lang } } },
      }),
    ]);

  // Transform site settings
  const siteSettingsObj = siteSettings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <SessionProvider>
      <LanguageProvider language={lang}>
        <div className="min-h-screen flex flex-col">
          <AdvancedConfigurableHeader
            language={lang}
            settings={layoutConfig.header}
            siteSettings={siteSettingsObj}
            mainNavigation={mainNavigation}
          />
          <main
            className="flex-1"
            style={{
              paddingTop: layoutConfig.layout.padding.top,
              paddingBottom: layoutConfig.layout.padding.bottom,
              paddingLeft: layoutConfig.layout.padding.left,
              paddingRight: layoutConfig.layout.padding.right,
            }}
          >
            {children}
          </main>
          <AdvancedConfigurableFooter
            language={lang}
            settings={layoutConfig.footer}
            siteSettings={siteSettingsObj}
            footerNavigation={footerNavigation}
            categories={categories}
          />
        </div>
      </LanguageProvider>
    </SessionProvider>
  );
}
