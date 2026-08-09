"use client";

import { useEffect, useState } from "react";
import { Eye, TrendingUp } from "lucide-react";

interface Stats {
  total: number;
  today: number;
}

// شناسه یکتای سایت
const SITE_ID = "paliz-news-2025";

// تاریخ امروز به فرمت YYYY-MM-DD
function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// فرمت اعداد به فارسی
function formatNumber(num: number): string {
  return num.toLocaleString("fa-IR");
}

export default function StatsWidget() {
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackAndFetch = async () => {
      try {
        // چک اینکه یک ساعت گذشته یا نه (جلوگیری از spam)
        const lastVisit = localStorage.getItem("paliz_last_visit");
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        const shouldCount = !lastVisit || now - parseInt(lastVisit) > oneHour;

        const todayKey = getTodayKey();

        // اگه اولین بازدید در ساعت گذشته بود، count کن
        if (shouldCount) {
          // ثبت بازدید کلی
          await fetch(
            `https://abacus.jasoncameron.dev/hit/${SITE_ID}/total`
          );

          // ثبت بازدید امروز
          await fetch(
            `https://abacus.jasoncameron.dev/hit/${SITE_ID}/day-${todayKey}`
          );

          localStorage.setItem("paliz_last_visit", now.toString());
        }

        // خوندن آمار (بدون افزایش)
        const [totalRes, todayRes] = await Promise.all([
          fetch(`https://abacus.jasoncameron.dev/get/${SITE_ID}/total`),
          fetch(`https://abacus.jasoncameron.dev/get/${SITE_ID}/day-${todayKey}`),
        ]);

        const totalData = await totalRes.json();
        const todayData = await todayRes.json();

        setStats({
          total: totalData.value || 0,
          today: todayData.value || 0,
        });
      } catch (error) {
        console.error("خطا در خواندن آمار:", error);
      } finally {
        setLoading(false);
      }
    };

    trackAndFetch();
  }, []);

  if (loading) {
    return (
      <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-neutral-900/50 border border-neutral-800/50">
        <div className="w-16 h-3 bg-neutral-800 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-neutral-900/50 border border-neutral-800/50 backdrop-blur-sm">
      {/* بازدید امروز */}
      <div className="flex items-center gap-1.5" title="بازدید امروز">
        <Eye className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-semibold text-neutral-300">
          {formatNumber(stats.today)}
        </span>
        <span className="text-[10px] text-neutral-500">امروز</span>
      </div>

      {/* جدا کننده */}
      <div className="w-px h-4 bg-neutral-700"></div>

      {/* بازدید کل */}
      <div className="flex items-center gap-1.5" title="بازدید کل سایت">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-semibold text-neutral-300">
          {formatNumber(stats.total)}
        </span>
        <span className="text-[10px] text-neutral-500">کل</span>
      </div>
    </div>
  );
}
