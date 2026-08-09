"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/types";
import StatsWidget from "./StatsWidget";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Section */}
      <div className="bg-black border-b border-neutral-800/50">
        <div className="site-container">
          {/* Top Bar - Stats + Search */}
          <div className="flex items-center justify-between py-2 border-b border-neutral-900/50 gap-3">
            <StatsWidget />
            <Link
              href="/search"
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600 border border-neutral-800 hover:border-transparent transition-all duration-300"
            >
              <Search className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              <span className="text-xs sm:text-sm text-neutral-400 group-hover:text-white transition-colors font-semibold hidden sm:inline">
                جستجو
              </span>
            </Link>
          </div>

          {/* Logo - سایز کوچک‌تر در موبایل */}
          <div className="flex justify-center py-2 md:py-4">
            <Link href="/" className="flex items-center justify-center group">
              <div className="relative w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="پالیز نیوز"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Bar - Sticky */}
      <nav
        className={`sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-neutral-800/50 transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-black/50" : ""
        }`}
      >
        <div className="site-container">
          <div className="category-nav scrollbar-hide">
            {/* Small Logo (when scrolled) */}
            {scrolled && (
              <Link
                href="/"
                className="flex items-center gap-2 ml-2 shrink-0 animate-fade-in"
              >
                <div className="relative w-8 h-8 md:w-10 md:h-10">
                  <Image
                    src="/logo.png"
                    alt="پالیز نیوز"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            )}

            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "all" ? "/" : `/category/${cat.slug}`}
                className="nav-link-large"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
