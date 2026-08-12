"use client";

import { Clock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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

export default function NewsCard({ article }: Props) {
  const isBreaking = article.is_breaking === 1;
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // چک کن آیا محتوای واقعی داره
  const hasFullContent = hasRealContent(article.content_fa);

  // تشخیص موبایل (touch device)
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  // بستن کارت وقتی بیرون کلیک کرد
  useEffect(() => {
    if (!isFlipped) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsFlipped(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isFlipped]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // موبایل: کلیک اول → flip، کلیک دوم → لینک
    if (isTouchDevice) {
      if (!isFlipped) {
        setIsFlipped(true);
        return;
      }
    }

    // بره به لینک (داخلی یا خارجی)
    if (hasFullContent) {
      router.push(`/news/${article.slug}`);
    } else {
      window.open(article.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`news-card group ${isFlipped ? "flipped" : ""}`}
      role="button"
      tabIndex={0}
    >
      {/* Front - تصویر */}
      <div className="news-card__front">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title_fa}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950">
            <span className={`cat-${article.category} text-6xl font-black opacity-30`}>
              {article.category?.charAt(0)}
            </span>
          </div>
        )}

        {/* Breaking Badge */}
        {isBreaking && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold pulse-breaking shadow-lg z-10">
            <Zap className="w-2.5 h-2.5" fill="currentColor" />
            <span>فوری</span>
          </div>
        )}

        {/* Category Badge */}
        <div className={`cat-bg-${article.category} absolute top-3 left-3 px-2.5 py-1 rounded-md text-white text-[10px] font-bold shadow-lg z-10`}>
          {article.category}
        </div>

        {/* نشانگر لینک خارجی */}
        {!hasFullContent && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold z-10">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>منبع</span>
          </div>
        )}
      </div>

      {/* Back - محتوا (با hover یا کلیک باز میشه) */}
      <div className="news-card__content">
        <div className="news-card__inner">
          <h3 className="news-card__title">
            {article.title_fa}
          </h3>

          {article.summary_fa && article.summary_fa.length > 0 && (
            <p className="news-card__description">
              {article.summary_fa}
            </p>
          )}

          <div className="news-card__footer">
            <span className="news-card__source">
              {article.source_name_fa}
            </span>
            <span className="news-card__time">
              <Clock className="w-3 h-3" />
              <span>{timeAgo(article.created_at)}</span>
            </span>
          </div>

          {/* Hint در موبایل */}
          {isTouchDevice && isFlipped && (
            <div className="news-card__hint">
              دوباره کلیک کنید تا خبر باز شود
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
