import { SimpleFontLoader } from "@/components/SimpleFontLoader";
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
        {children}
      </body>
    </html>
  );
}
