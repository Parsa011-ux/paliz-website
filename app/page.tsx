import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { getLatestArticles } from "@/lib/turso";

export const dynamic = "force-static";

export default async function HomePage() {
  const articles = await getLatestArticles(30);

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 site-container py-8 md:py-12">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center mb-6">
              <span className="text-4xl">📰</span>
            </div>
            <p className="text-neutral-300 text-lg font-medium">
              هنوز خبری منتشر نشده است
            </p>
            <p className="text-neutral-600 text-sm mt-2">
              لطفاً چند دقیقه دیگر مراجعه کنید
            </p>
          </div>
        ) : (
          <>
            {featuredArticle && (
              <section className="mb-10 md:mb-12">
                <NewsCard article={featuredArticle} featured />
              </section>
            )}

            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  آخرین اخبار
                </h2>
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                {restArticles.length} خبر
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {restArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}