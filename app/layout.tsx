import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import ProgressBar from "@/components/ProgressBar";
import PWAInstaller from "@/components/PWAInstaller";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "پالیز نیوز | آخرین اخبار ایران و جهان",
  description:
    "پالیز نیوز - آخرین اخبار سیاسی، اقتصادی، اجتماعی، ورزشی و فرهنگی از معتبرترین منابع خبری",
  keywords: ["اخبار ایران", "پالیز نیوز", "خبر فوری", "اخبار روز"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "پالیز نیوز",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://paliz-website.pages.dev",
    siteName: "پالیز نیوز",
    title: "پالیز نیوز | آخرین اخبار ایران و جهان",
    description: "آخرین اخبار از معتبرترین منابع خبری",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "پالیز نیوز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "پالیز نیوز",
    description: "آخرین اخبار ایران و جهان",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="پالیز نیوز" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${vazirmatn.className} antialiased`}>
        <ProgressBar />
        {children}
        <PWAInstaller />
      </body>
    </html>
  );
}
