import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { getLatestArticles } from "@/lib/turso";

// Static Export - همه چیز در زمان Build تولید می‌شه
export const dynamic = "force-static";

export default async function HomePage() {
  const articles = await getLatestArticles(30);

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1);

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-6">
              <span className="text-3xl">📰</span>
            </div>
            <p className="text-neutral-300 text-lg mb-2 font-medium">
              هنوز خبری منتشر نشده است
            </p>
            <p className="text-neutral-600 text-sm">
              لطفاً چند دقیقه دیگر مراجعه کنید
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <section className="mb-12">
                <NewsCard article={featuredArticle} featured />
              </section>
            )}

            {/* Section Title */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  آخرین اخبار
                </h2>
              </div>
              <p className="text-sm text-neutral-500">
                {restArticles.length} خبر
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}