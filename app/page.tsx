import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import NewsTicker from "@/components/NewsTicker";
import HeroSection from "@/components/HeroSection";
import { getLatestArticles, getBreakingNews } from "@/lib/turso";

export const dynamic = "force-static";

export default async function HomePage() {
  const [articles, breakingNews] = await Promise.all([
    getLatestArticles(30),
    getBreakingNews(10),
  ]);

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);
  const restArticles = articles.slice(4);

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