import { Clock, Zap } from "lucide-react";
import Link from "next/link";
import type { Article } from "@/lib/types";

interface Props {
  article: Article;
  featured?: boolean;
}

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

export default function NewsCard({ article }: Props) {
  const isBreaking = article.is_breaking === 1;
  
  // اگر خبر content_fa داره → لینک داخلی
  // اگه نداره → لینک به منبع اصلی
  const hasFullContent = article.content_fa && article.content_fa.length > 100;
  const linkProps = hasFullContent
    ? { href: `/news/${article.slug}` as const }
    : {
        href: article.link,
        target: "_blank" as const,
        rel: "noopener noreferrer" as const,
      };

  const CardContent = (
    <>
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-800 flex-shrink-0">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title_fa}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950">
            <span className={`cat-${article.category} text-6xl font-black opacity-30`}>
              {article.category?.charAt(0)}
            </span>
          </div>
        )}

        {isBreaking && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold pulse-breaking shadow-lg">
            <Zap className="w-2.5 h-2.5" fill="currentColor" />
            <span>فوری</span>
          </div>
        )}

        <div className={`cat-bg-${article.category} absolute top-3 left-3 px-2.5 py-1 rounded-md text-white text-[10px] font-bold shadow-lg`}>
          {article.category}
        </div>

        {/* نشانگر لینک خارجی */}
        {!hasFullContent && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>منبع</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className="text-base md:text-lg font-bold text-white line-clamp-2 group-hover:text-amber-400 transition-colors"
          style={{ lineHeight: '1.7' }}
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

        <div className="flex items-center justify-between pt-3 mt-auto border-t border-neutral-800/50 text-xs gap-3">
          <span className="font-semibold text-neutral-300 min-w-0 flex-1 truncate">
            {article.source_name_fa}
          </span>
          <span className="flex items-center gap-1 text-neutral-500 shrink-0">
            <Clock className="w-3 h-3" />
            <span className="whitespace-nowrap">{timeAgo(article.created_at)}</span>
          </span>
        </div>
      </div>
    </>
  );

  const cardClass = "group flex flex-col h-full rounded-2xl overflow-hidden bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 animate-fade-in card-glow backdrop-blur-sm";

  // اگر لینک داخلی → از Next Link
  if (hasFullContent) {
    return (
      <Link href={linkProps.href} className={cardClass}>
        {CardContent}
      </Link>
    );
  }

  // اگه لینک خارجی → از <a>
  return (
    <a {...linkProps} className={cardClass}>
      {CardContent}
    </a>
  );
}
