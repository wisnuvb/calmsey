import { Footer, Navbar } from "@/components/layout";
import SessionProvider from "@/components/providers/SessionProvider";
import { LanguageProvider } from "@/components/public/LanguageProvider";
import React from "react";
import Script from "next/script";

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
        <div id="google_translate_element" style={{ display: "none" }} />

        {/* Script to hide Google Translate bar after it loads */}
        <Script
          id="hide-google-translate-bar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function hideTranslateBar() {
                  // Hide the translate bar
                  const banner = document.querySelector('.goog-te-banner-frame');
                  const skipTranslate = document.querySelector('.skiptranslate');
                  
                  if (banner) {
                    banner.style.display = 'none';
                    banner.style.visibility = 'hidden';
                    banner.style.height = '0';
                    banner.style.width = '0';
                    banner.style.overflow = 'hidden';
                    banner.style.position = 'absolute';
                    banner.style.top = '-9999px';
                  }
                  
                  if (skipTranslate) {
                    skipTranslate.style.display = 'none';
                    skipTranslate.style.visibility = 'hidden';
                  }
                  
                  // Fix body positioning
                  document.body.style.top = '0';
                  document.body.style.position = 'relative';
                  
                  // Hide iframe
                  const iframes = document.querySelectorAll('iframe[src*="translate.google.com"]');
                  iframes.forEach(function(iframe) {
                    iframe.style.display = 'none';
                    iframe.style.visibility = 'hidden';
                  });
                }
                
                // Run immediately
                hideTranslateBar();
                
                // Also run after a delay to catch dynamically loaded elements
                setTimeout(hideTranslateBar, 100);
                setTimeout(hideTranslateBar, 500);
                setTimeout(hideTranslateBar, 1000);
                setTimeout(hideTranslateBar, 2000);
                
                // Use MutationObserver to catch elements added dynamically
                const observer = new MutationObserver(function(mutations) {
                  hideTranslateBar();
                });
                
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
              })();
            `,
          }}
        />

        <Navbar />
        {children}
        <Footer />
      </LanguageProvider>
    </SessionProvider>
  );
};

export default FrontendLayout;
