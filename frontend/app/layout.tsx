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
    default: "Car Accessories Online in Bangladesh - Interior Car Lights & Cleaner",
    template: "%s",
  },
  description:
    "Buy car accessories online in Bangladesh. Shop car interior cleaner, interior car lights & more at the best car accessories shop. Free delivery over ৳999!",
  keywords: ["car accessories online", "car accessories shop in Bangladesh", "car interior cleaner", "interior car lights", "car accessories shop near me", "bike accessories", "auto parts"],
  applicationName: "RS Automart",
  openGraph: {
    siteName: "RS Automart",
    type: "website",
    locale: "en_BD",
    url: "https://www.rsautomart.shop",
    title: "Car Accessories Online in Bangladesh - Interior Car Lights & Cleaner",
    description:
      "Buy car accessories online in Bangladesh. Shop car interior cleaner, interior car lights & more at the best car accessories shop. Free delivery over ৳999!",
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
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://placehold.co" />
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
