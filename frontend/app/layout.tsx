import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rsautomart.shop"),
  title: {
    default: "RS Automart - Premium Auto Accessories in Bangladesh",
    template: "%s | RS Automart",
  },
  description:
    "Shop premium car & bike accessories, electronics, tools, and more. Free delivery on orders above ৳999. Cash on Delivery available.",
  keywords: ["car accessories", "bike accessories", "auto parts", "bangladesh", "online shop"],
  applicationName: "RS Automart",
  openGraph: {
    siteName: "RS Automart",
    type: "website",
    locale: "en_BD",
    url: "https://www.rsautomart.shop",
    title: "RS Automart - Premium Auto Accessories in Bangladesh",
    description:
      "Shop premium car & bike accessories, electronics, tools, and more. Free delivery on orders above ৳999. Cash on Delivery available.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "RS Automart Logo",
      },
    ],
  },
  other: {
    "google-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-T96H39V3P2" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T96H39V3P2');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>


        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
