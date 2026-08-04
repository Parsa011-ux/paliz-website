// نوع خبر
export interface Article {
  id: number;
  slug: string;
  title: string;
  title_fa: string;
  summary: string | null;
  summary_fa: string | null;
  content: string | null;
  content_fa: string | null;
  link: string;
  image_url: string | null;
  source_name: string;
  source_name_fa: string;
  language: string;
  category: string;
  importance_score: number;
  is_breaking: number;
  view_count: number;
  published_at: string | null;
  created_at: string;
}

// دسته‌بندی‌ها
export const CATEGORIES = [
  { slug: "all", name: "همه", emoji: "📰" },
  { slug: "سیاسی", name: "سیاسی", emoji: "🏛" },
  { slug: "اقتصادی", name: "اقتصادی", emoji: "💰" },
  { slug: "ورزشی", name: "ورزشی", emoji: "⚽" },
  { slug: "اجتماعی", name: "اجتماعی", emoji: "👥" },
  { slug: "نظامی", name: "نظامی", emoji: "⚔️" },
  { slug: "فرهنگی", name: "فرهنگی", emoji: "🎭" },
] as const;