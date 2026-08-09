"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstaller() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // ثبت Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("✅ Service Worker registered:", registration.scope);
          })
          .catch((err) => {
            console.error("❌ Service Worker registration failed:", err);
          });
      });
    }

    // چک اینکه آیا PWA نصب شده یا نه
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return; // نصبه، بنر رو نشون نده
    }

    // چک iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !("standalone" in (navigator as any));
    setIsIOS(iOS);

    // چک اینکه قبلاً بنر رو رد کرده یا نه
    const dismissed = localStorage.getItem("pwa_banner_dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (dismissed && Date.now() - dismissedTime < oneWeek) {
      return; // کمتر از یک هفته گذشته، نشون نده
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // بعد از 5 ثانیه بنر رو نشون بده
      setTimeout(() => setShowBanner(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // iOS: بعد از 10 ثانیه بنر iOS رو نشون بده
    if (iOS) {
      setTimeout(() => setShowBanner(true), 10000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    
    if (result.outcome === "accepted") {
      console.log("✅ PWA installed");
    }
    
    setInstallPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa_banner_dismissed", Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-sm z-50 animate-fade-in"
      role="dialog"
      aria-label="نصب اپلیکیشن"
    >
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/30 rounded-2xl p-4 shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
        <button
          onClick={handleDismiss}
          className="absolute top-3 left-3 p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          aria-label="بستن"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>

        <div className="flex items-start gap-3">
          {/* آیکون */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Download className="w-6 h-6 text-white" />
          </div>

          {/* متن */}
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="text-white font-bold text-sm md:text-base mb-1">
              نصب پالیز نیوز
            </h3>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-3">
              {isIOS
                ? "برای نصب: دکمه اشتراک‌گذاری Safari را بزنید و «افزودن به صفحه اصلی» را انتخاب کنید."
                : "با نصب اپلیکیشن، دسترسی سریع‌تری به آخرین اخبار داشته باشید."}
            </p>

            {!isIOS && installPrompt && (
              <button
                onClick={handleInstall}
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                نصب اپلیکیشن
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
