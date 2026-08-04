import Link from "next/link";
import { Newspaper, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
      <div className="site-container">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
              <Newspaper className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white leading-tight">
                پالیز نیوز
              </h1>
              <p className="text-[10px] text-neutral-500 tracking-widest uppercase font-medium">
                Paliz News
              </p>
            </div>
          </Link>

          {/* Search Button */}
          <Link 
            href="/search"
            className="group flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all duration-200"
          >
            <Search className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
            <span className="text-sm text-neutral-400 group-hover:text-white transition-colors hidden sm:inline font-medium">
              جستجو
            </span>
          </Link>
        </div>

        {/* Categories */}
        <nav className="flex items-center gap-1 pb-4 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === "all" ? "/" : `/category/${cat.slug}`}
              className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all duration-200 whitespace-nowrap font-medium"
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}