import { Clock, Zap } from "lucide-react";
import type { Article } from "@/lib/types";

interface Props {
  article: Article;
  featured?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  "سیاسی": "text-blue-400",
  "اقتصادی": "text-emerald-400",
  "ورزشی": "text-orange-400",
  "اجتماعی": "text-purple-400",
  "نظامی": "text-red-400",
  "فرهنگی": "text-pink-400",
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
  const categoryColor = CATEGORY_COLORS[article.category] || "text-neutral-400";
  const isBreaking = article.is_breaking === 1;

  // ===== Featured Card =====
  if (featured) {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-[420px] md:h-[520px] rounded-3xl overflow-hidden bg-neutral-900 animate-fade-in"
      >
        {/* Background Image */}
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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 right-0 left-0 p-8 md:p-10">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {isBreaking && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold pulse-breaking">
                <Zap className="w-3 h-3" fill="currentColor" />
                فوری
              </span>
            )}
            <span className={`px-3 py-1 rounded-full bg-white/10 backdrop-blur-md ${categoryColor} text-xs font-semibold border border-white/10`}>
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 line-clamp-3 group-hover:text-amber-400 transition-colors duration-300">
            {article.title_fa}
          </h2>

          {/* Summary */}
          {article.summary_fa && (
            <p className="text-neutral-300 text-sm md:text-base line-clamp-2 mb-5 max-w-3xl leading-relaxed">
              {article.summary_fa}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="font-medium">{article.source_name_fa}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
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
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-neutral-900">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title_fa}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black">
            <div className={`text-6xl opacity-20 ${categoryColor}`}>
              {article.category === "سیاسی" && "🏛"}
              {article.category === "اقتصادی" && "💰"}
              {article.category === "ورزشی" && "⚽"}
              {article.category === "اجتماعی" && "👥"}
              {article.category === "نظامی" && "⚔️"}
              {article.category === "فرهنگی" && "🎭"}
            </div>
          </div>
        )}

        {/* Breaking Badge */}
        {isBreaking && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold pulse-breaking">
            <Zap className="w-2.5 h-2.5" fill="currentColor" />
            <span>فوری</span>
          </div>
        )}

        {/* Category */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
          {article.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="text-base font-bold text-white mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors leading-relaxed">
          {article.title_fa}
        </h3>

        {/* Summary */}
        {article.summary_fa && (
          <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed flex-1">
            {article.summary_fa}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-neutral-900">
          <span className="text-xs font-medium text-neutral-400 line-clamp-1">
            {article.source_name_fa}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-600 shrink-0 mr-3">
            <Clock className="w-3 h-3" />
            {timeAgo(article.created_at)}
          </span>
        </div>
      </div>
    </a>
  );
}