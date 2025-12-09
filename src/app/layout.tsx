import { SimpleFontLoader } from "@/components/SimpleFontLoader";
import { ToastProvider } from "@/components/ui/toast";

import "./globals.css";

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
    </html>
  );
}
