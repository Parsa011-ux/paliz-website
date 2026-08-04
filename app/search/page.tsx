import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";
import { searchArticles } from "@/lib/turso";
import { Search as SearchIcon } from "lucide-react";
import { Suspense } from "react";

export const revalidate = 0; // همیشه fresh

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const results = query.length >= 2 ? await searchArticles(query) : [];

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <SearchIcon className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-semibold">جستجوی اخبار</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">
            چی می‌خوای پیدا کنی؟
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            در تمام اخبار پالیز نیوز جستجو کنید
          </p>

          <Suspense fallback={<div className="h-14 bg-neutral-900 rounded-2xl animate-pulse" />}>
            <SearchBar autoFocus />
          </Suspense>
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-neutral-400">
                {results.length > 0 ? (
                  <>
                    <span className="text-amber-400 font-bold">{results.length}</span>
                    {" "}نتیجه برای{" "}
                    <span className="text-neutral-100 font-semibold">«{query}»</span>
                  </>
                ) : (
                  <>
                    نتیجه‌ای برای{" "}
                    <span className="text-neutral-100 font-semibold">«{query}»</span>
                    {" "}پیدا نشد
                  </>
                )}
              </p>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-900 mb-4">
                  <SearchIcon className="w-8 h-8 text-neutral-600" />
                </div>
                <p className="text-neutral-400 text-lg mb-2">
                  هیچ خبری با این کلیدواژه پیدا نشد
                </p>
                <p className="text-neutral-600 text-sm">
                  کلیدواژه دیگری امتحان کنید یا املا رو بررسی کنید
                </p>
              </div>
            )}
          </>
        )}

        {query.length < 2 && (
          <div className="text-center py-10">
            <p className="text-neutral-500 text-sm">
              💡 چند پیشنهاد جستجو: «ایران»، «اقتصاد»، «تحریم»، «فوتبال»
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}