import { Zap } from "lucide-react";
import type { Article } from "@/lib/types";

interface Props {
  articles: Article[];
}

export default function NewsTicker({ articles }: Props) {
  if (!articles || articles.length === 0) return null;

  // دوبار تکرار برای loop بدون قطع
  const tickerItems = [...articles, ...articles];

  return (
    <div className="bg-gradient-to-r from-red-950/80 via-red-900/60 to-red-950/80 border-y border-red-900/50 backdrop-blur-sm">
      <div className="flex items-center h-12">
        <div className="flex items-center gap-2 px-4 md:px-6 h-full bg-red-600 shrink-0 shadow-lg shadow-red-900/50">
          <Zap className="w-4 h-4 text-white pulse-breaking" fill="currentColor" />
          <span className="text-white font-bold text-xs md:text-sm whitespace-nowrap">
            خبر فوری
          </span>
        </div>

        <div className="ticker-wrapper flex-1 h-full flex items-center">
          <div className="ticker-track-slow">
            {tickerItems.map((article, index) => (
              <a
                key={`${article.id}-${index}`}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-white/95 hover:text-amber-300 text-sm md:text-base font-medium transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
                <span>{article.title_fa}</span>
                <span className="text-red-300/60 text-xs">
                  — {article.source_name_fa}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}