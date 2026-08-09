import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import Pagination from "@/components/Pagination";
import {
  getArticlesPaginated,
  getArticlesCount,
} from "@/lib/turso";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

const PER_PAGE = 50;

// تولید Static Params برای همه صفحات
export async function generateStaticParams() {
  const totalCount = await getArticlesCount();
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // صفحات 2 تا totalPages (صفحه 1 خودش app/page.tsx هست)
  const pages: { num: string }[] = [];
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ num: i.toString() });
  }

  return pages;
}

interface Props {
  params: Promise<{ num: string }>;
}

// Metadata
export async function generateMetadata({ params }: Props) {
  const { num } = await params;
  return {
    title: `صفحه ${num} | پالیز نیوز`,
    description: `آخرین اخبار ایران و جهان - صفحه ${num}`,
  };
}

export default async function PaginatedHomePage({ params }: Props) {
  const { num } = await params;
  const pageNumber = parseInt(num, 10);

  // اعتبارسنجی
  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  // گرفتن اخبار و تعداد کل
  const [articlesRaw, totalCount] = await Promise.all([
    getArticlesPaginated(pageNumber, PER_PAGE),
    getArticlesCount(),
  ]);

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // اگه صفحه از تعداد کل بیشتره → 404
  if (pageNumber > totalPages) {
    notFound();
  }

  // مرتب‌سازی
  const articles = [...articlesRaw].sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 site-container py-8 md:py-10">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              اخبار - صفحه {pageNumber.toLocaleString("fa-IR")}
            </h2>
          </div>
          <p className="text-sm text-neutral-500 font-semibold">
            {totalCount.toLocaleString("fa-IR")} خبر کل
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center mb-6">
              <span className="text-4xl">📰</span>
            </div>
            <p className="text-neutral-300 text-lg font-medium">
              خبری در این صفحه وجود ندارد
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination currentPage={pageNumber} totalPages={totalPages} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
