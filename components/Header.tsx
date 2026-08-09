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
      {/* Top Section - Not Sticky */}
      <div className="bg-black border-b border-neutral-800/50">
        <div className="site-container">
          {/* Top Bar with Search + Stats */}
          <div className="flex items-center justify-between py-2 border-b border-neutral-900/50 gap-3">
            {/* Stats Widget (سمت راست در RTL) */}
            <StatsWidget />

            {/* Search Button */}
            <Link
              href="/search"
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600 border border-neutral-800 hover:border-transparent transition-all duration-300"
            >
              <Search className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              <span className="text-sm text-neutral-400 group-hover:text-white transition-colors hidden sm:inline font-semibold">
                جستجو
              </span>
            </Link>
          </div>

          {/* Logo Center */}
          <div className="flex justify-center py-3 md:py-4">
            <Link href="/" className="flex items-center justify-center group">
              <div className="relative w-32 h-32 md:w-40 md:h-40 group-hover:scale-105 transition-transform duration-300">
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
                <div className="relative w-10 h-10">
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
                className="nav-link-large whitespace-nowrap"
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
