import { Clock, Zap } from "lucide-react";
import Link from "next/link";
import type { Article } from "@/lib/types";

interface Props {
  featured: Article;
  secondary: Article[];
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
    return `${Math.floor(hours / 24)} روز پیش`;
  } catch {
    return "";
  }
}

// چک دقیق برای اینکه محتوای واقعی داره یا نه
function hasRealContent(content: string | null | undefined): boolean {
  if (!content) return false;
  if (typeof content !== "string") return false;
  const trimmed = content.trim();
  if (trimmed === "") return false;
  if (trimmed === "null") return false;
  if (trimmed === "undefined") return false;
  if (trimmed.length < 200) return false;
  return true;
}

// تشخیص اینکه خبر باید داخلی باز شه یا خارجی
function hasInternalPage(article: Article): boolean {
  return hasRealContent(article.content_fa);
}

// کامپوننت Wrapper هوشمند - داخلی یا خارجی
function SmartLink({
  article,
  className,
  children,
  style,
}: {
  article: Article;
  className: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  if (hasInternalPage(article)) {
    return (
      <Link href={`/news/${article.slug}`} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

export default function HeroSection({ featured, secondary }: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
      {/* Featured - Left Big */}
      <SmartLink
        article={featured}
        className="lg:col-span-2 group relative block h-[400px] md:h-[520px] rounded-2xl overflow-hidden bg-neutral-900 animate-fade-in card-glow"
      >
        {featured.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featured.image_url}
            alt={featured.title_fa}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute bottom-0 right-0 left-0 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {featured.is_breaking === 1 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-bold pulse-breaking">
                <Zap className="w-3 h-3" fill="currentColor" />
                فوری
              </span>
            )}
            <span className={`cat-bg-${featured.category} px-3 py-1.5 rounded-md text-white text-xs font-bold shadow-lg`}>
              {featured.category}
            </span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-black text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-3"
            style={{ lineHeight: '1.5' }}
          >
            {featured.title_fa}
          </h2>

          {featured.summary_fa && (
            <p
              className="text-neutral-200 text-sm md:text-base mb-4 line-clamp-2 max-w-3xl"
              style={{ lineHeight: '1.8' }}
            >
              {featured.summary_fa}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <span className="font-semibold">{featured.source_name_fa}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-500"></span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(featured.created_at)}
            </span>
          </div>
        </div>
      </SmartLink>

      {/* Secondary - Right List */}
      <div className="flex flex-col gap-4 h-[400px] md:h-[520px]">
        {secondary.slice(0, 3).map((article, index) => (
          <SmartLink
            key={article.id}
            article={article}
            className="group relative flex-1 block rounded-xl overflow-hidden bg-neutral-900 card-glow"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {article.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.image_url}
                alt={article.title_fa}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute bottom-0 right-0 left-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                {article.is_breaking === 1 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold">
                    فوری
                  </span>
                )}
                <span className={`cat-${article.category} text-[10px] font-bold uppercase tracking-wider`}>
                  {article.category}
                </span>
              </div>

              <h3
                className="text-white text-sm md:text-base font-bold line-clamp-2 group-hover:text-amber-400 transition-colors"
                style={{ lineHeight: '1.7' }}
              >
                {article.title_fa}
              </h3>

              <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400">
                <span>{article.source_name_fa}</span>
                <span>•</span>
                <span>{timeAgo(article.created_at)}</span>
              </div>
            </div>
          </SmartLink>
        ))}
      </div>
    </section>
  );
}
