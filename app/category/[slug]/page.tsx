import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { getArticlesByCategory } from "@/lib/turso";
import { CATEGORIES } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

// تولید مسیرهای Static برای همه دسته‌بندی‌ها
export async function generateStaticParams() {
  return CATEGORIES
    .filter((cat) => cat.slug !== "all")
    .map((cat) => ({
      slug: cat.slug,
    }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const category = CATEGORIES.find((cat) => cat.slug === decodedSlug);
  
  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(decodedSlug, 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 site-container py-8 md:py-12">
        {/* Category Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{category.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              اخبار {category.name}
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            {articles.length} خبر
          </p>
        </div>

        {/* Articles */}
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center mb-6">
              <span className="text-4xl">{category.emoji}</span>
            </div>
            <p className="text-neutral-300 text-lg font-medium">
              هنوز خبری در این دسته‌بندی نیست
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}