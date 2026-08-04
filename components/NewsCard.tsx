import { Clock, Zap } from "lucide-react";
import type { Article } from "@/lib/types";

interface Props {
  article: Article;
  featured?: boolean;
}

const CATEGORY_STYLES: Record<string, string> = {
  "سیاسی": "bg-blue-500 text-white",
  "اقتصادی": "bg-emerald-500 text-white",
  "ورزشی": "bg-orange-500 text-white",
  "اجتماعی": "bg-purple-500 text-white",
  "نظامی": "bg-red-500 text-white",
  "فرهنگی": "bg-pink-500 text-white",
};

const CATEGORY_EMOJI: Record<string, string> = {
  "سیاسی": "🏛",
  "اقتصادی": "💰",
  "ورزشی": "⚽",
  "اجتماعی": "👥",
  "نظامی": "⚔️",
  "فرهنگی": "🎭",
};

function timeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "لحظاتی پیش";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} روز پیش`;
    return date.toLocaleDateString("fa-IR");
  } catch {
    return "";
  }
}

export default function NewsCard({ article, featured = false }: Props) {
  const categoryStyle = CATEGORY_STYLES[article.category] || "bg-neutral-700 text-white";
  const categoryEmoji = CATEGORY_EMOJI[article.category] || "📰";
  const isBreaking = article.is_breaking === 1;

  // ===== Featured Card =====
  if (featured) {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-neutral-900 animate-fade-in"
      >
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title_fa}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="absolute bottom-0 right-0 left-0 p-6 md:p-10">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {isBreaking && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold pulse-breaking">
                <Zap className="w-3 h-3" fill="currentColor" />
                فوری
              </span>
            )}
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${categoryStyle} shadow-lg`}>
              {categoryEmoji} {article.category}
            </span>
          </div>

          <h2 
            className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-300"
            style={{ lineHeight: '1.6' }}
          >
            {article.title_fa}
          </h2>

          {article.summary_fa && article.summary_fa.length > 0 && (
            <p 
              className="text-neutral-200 text-sm md:text-base mb-5 max-w-3xl line-clamp-2"
              style={{ lineHeight: '1.9' }}
            >
              {article.summary_fa}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-neutral-300 flex-wrap">
            <span className="font-semibold">{article.source_name_fa}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-500"></span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(article.created_at)}
            </span>
          </div>
        </div>
      </a>
    );
  }

  // ===== Regular Card =====
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-neutral-900/60 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-300 animate-fade-in"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-800 flex-shrink-0">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title_fa}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950">
            <span className="text-6xl opacity-30">{categoryEmoji}</span>
          </div>
        )}

        {isBreaking && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold pulse-breaking shadow-lg">
            <Zap className="w-2.5 h-2.5" fill="currentColor" />
            <span>فوری</span>
          </div>
        )}

        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${categoryStyle} shadow-lg`}>
          {categoryEmoji} {article.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 
          className="text-base md:text-lg font-bold text-white line-clamp-2 group-hover:text-amber-400 transition-colors"
          style={{ lineHeight: '1.8' }}
        >
          {article.title_fa}
        </h3>

        {article.summary_fa && article.summary_fa.length > 0 && (
          <p 
            className="text-sm text-neutral-400 line-clamp-2 flex-1"
            style={{ lineHeight: '1.9' }}
          >
            {article.summary_fa}
          </p>
        )}

        {/* Footer - Fixed padding for source name */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-neutral-800 text-xs gap-3">
          <span className="font-medium text-neutral-300 min-w-0 flex-1 truncate">
            {article.source_name_fa}
          </span>
          <span className="flex items-center gap-1 text-neutral-500 shrink-0">
            <Clock className="w-3 h-3" />
            <span className="whitespace-nowrap">{timeAgo(article.created_at)}</span>
          </span>
        </div>
      </div>
    </a>
  );
}