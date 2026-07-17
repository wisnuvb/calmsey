import "./globals.css";

import { SimpleFontLoader } from "@/components/SimpleFontLoader";
import { ToastProvider } from "@/components/ui/toast";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export const metadata = {
  title: "Turning Tides Facility",
  description: "Premier rehabilitation and treatment facility",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_ID || "xjidve7hny";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SimpleFontLoader />
        <ToastProvider>{children}</ToastProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      {CLARITY_PROJECT_ID ? (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `,
          }}
        />
      ) : null}
    </html>
  );
}
