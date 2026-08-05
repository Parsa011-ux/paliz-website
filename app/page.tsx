import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import NewsTicker from "@/components/NewsTicker";
import HeroSection from "@/components/HeroSection";
import { getLatestArticles, getBreakingNews } from "@/lib/turso";
import type { Article } from "@/lib/types";

export const dynamic = "force-static";

export default async function HomePage() {
  // گرفتن اخبار
  const [articlesRaw, breakingNews] = await Promise.all([
    getLatestArticles(50),        // 50 خبر آخر
    getBreakingNews(10),          // 10 خبر فوری برای ticker
  ]);

  // مرتب‌سازی همه اخبار بر اساس زمان (جدیدترین اول)
  const articles = [...articlesRaw].sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });

  // پیدا کردن Hero: اولین خبر فوری با تصویر
  // اگر خبر فوری با تصویر نبود → اولین خبر با تصویر
  // اگر هیچ خبری با تصویر نبود → اولین خبر
  let featuredArticle: Article | undefined;

  // اولویت 1: خبر فوری با تصویر
  featuredArticle = articles.find(
    (a) => a.is_breaking === 1 && a.image_url && a.image_url.trim().length > 0
  );

  // اولویت 2: هر خبری با تصویر
  if (!featuredArticle) {
    featuredArticle = articles.find(
      (a) => a.image_url && a.image_url.trim().length > 0
    );
  }

  // اولویت 3: اولین خبر
  if (!featuredArticle) {
    featuredArticle = articles[0];
  }

  // حذف Hero از لیست بقیه اخبار
  const remainingArticles = articles.filter(
    (a) => a.id !== featuredArticle?.id
  );

  // 3 خبر بعدی به عنوان Secondary (کنار Hero)
  const secondaryArticles = remainingArticles.slice(0, 3);

  // بقیه اخبار برای گرید پایین (به ترتیب زمانی)
  const restArticles = remainingArticles.slice(3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {breakingNews.length > 0 && <NewsTicker articles={breakingNews} />}

      <main className="flex-1 site-container py-8 md:py-10">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center mb-6">
              <span className="text-4xl">📰</span>
            </div>
            <p className="text-neutral-300 text-lg font-medium">
              هنوز خبری منتشر نشده است
            </p>
          </div>
        ) : (
          <>
            {featuredArticle && (
              <HeroSection
                featured={featuredArticle}
                secondary={secondaryArticles}
              />
            )}

            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  آخرین اخبار
                </h2>
              </div>
              <p className="text-sm text-neutral-500 font-semibold">
                {restArticles.length} خبر
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {restArticles.map((article, index) => (
                <div
                  key={article.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
