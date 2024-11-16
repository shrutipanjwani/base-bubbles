import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "./client";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_BASE_URL || ""),
  title: "Base Bubbles",
  description: "Navigate the Base ecosystem with Ease",
  icons: {
    icon: "/logo_blue.png",
  },
  openGraph: {
    title: "Base Bubbles",
    description: "Navigate the Base ecosystem with Ease",
    url: "/",
    images: "/images/preview.png",
    siteName: "Base Bubbles",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
