import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "پالیز نیوز | آخرین اخبار ایران و جهان",
  description: "پالیز نیوز - آخرین اخبار سیاسی، اقتصادی، اجتماعی، ورزشی و فرهنگی از معتبرترین منابع خبری",
  keywords: ["اخبار ایران", "پالیز نیوز", "خبر فوری", "اخبار روز"],
  openGraph: {
    title: "پالیز نیوز",
    description: "آخرین اخبار ایران و جهان",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}