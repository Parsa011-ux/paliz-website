import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import ProgressBar from "@/components/ProgressBar";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "پالیز نیوز | آخرین اخبار ایران و جهان",
  description: "پالیز نیوز - آخرین اخبار سیاسی، اقتصادی، اجتماعی، ورزشی و فرهنگی از معتبرترین منابع خبری",
  keywords: ["اخبار ایران", "پالیز نیوز", "خبر فوری", "اخبار روز"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={`${vazirmatn.className} antialiased`}>
        <ProgressBar />
        {children}
      </body>
    </html>
  );
}