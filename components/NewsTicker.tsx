import { Zap } from "lucide-react";
import type { Article } from "@/lib/types";

interface Props {
  articles: Article[];
}

export default function NewsTicker({ articles }: Props) {
  if (!articles || articles.length === 0) return null;

  // فقط 10 خبر آخر (اگه بیشتر بود)
  const tickerArticles = articles.slice(0, 10);

  return (
    <div className="bg-gradient-to-r from-red-950/80 via-red-900/60 to-red-950/80 border-y border-red-900/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center h-12">
        <div className="flex items-center gap-2 px-4 md:px-6 h-full bg-red-600 shrink-0 shadow-lg shadow-red-900/50 z-10">
          <Zap className="w-4 h-4 text-white pulse-breaking" fill="currentColor" />
          <span className="text-white font-bold text-xs md:text-sm whitespace-nowrap">
            خبر فوری
          </span>
        </div>

        <div className="ticker-container flex-1 h-full flex items-center overflow-hidden relative">
          <div className="ticker-move">
            {/* گروه اول */}
            <div className="ticker-group">
              {tickerArticles.map((article, index) => (
                <a
                  key={`first-${article.id}-${index}`}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-white/95 hover:text-amber-300 text-sm md:text-base font-medium transition-colors mx-8"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
                  <span>{article.title_fa}</span>
                  <span className="text-red-300/60 text-xs">
                    — {article.source_name_fa}
                  </span>
                </a>
              ))}
            </div>
            
            {/* گروه دوم - تکرار برای loop بی‌وقفه */}
            <div className="ticker-group" aria-hidden="true">
              {tickerArticles.map((article, index) => (
                <a
                  key={`second-${article.id}-${index}`}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-white/95 hover:text-amber-300 text-sm md:text-base font-medium transition-colors mx-8"
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
    </div>
  );
}
