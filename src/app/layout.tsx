import { SimpleFontLoader } from "@/components/SimpleFontLoader";
import { ToastProvider } from "@/components/ui/toast";

import "./globals.css";

export const metadata = {
  title: "Turning Tides Facility",
  description: "Premier rehabilitation and treatment facility",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SimpleFontLoader />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
