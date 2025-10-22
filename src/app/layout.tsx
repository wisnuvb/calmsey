import "./globals.css";
import { FontLoader } from "@/components/FontLoader";

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
        <FontLoader />
        {children}
      </body>
    </html>
  );
}
