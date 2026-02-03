import "./globals.css";

import { SimpleFontLoader } from "@/components/SimpleFontLoader";
import { ToastProvider } from "@/components/ui/toast";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "Turning Tides Facility",
  description: "Premier rehabilitation and treatment facility",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

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
    </html>
  );
}
