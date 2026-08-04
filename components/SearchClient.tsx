"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import NewsCard from "./NewsCard";
import type { Article } from "@/lib/types";

interface Props {
  initialArticles: Article[];
}

export default function SearchClient({ initialArticles }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query || query.trim().length < 2) return [];

    const searchTerm = query.trim().toLowerCase();

    return initialArticles.filter((article) => {
      const titleMatch = article.title_fa?.toLowerCase().includes(searchTerm);
      const summaryMatch = article.summary_fa?.toLowerCase().includes(searchTerm);
      const categoryMatch = article.category?.toLowerCase().includes(searchTerm);
      const sourceMatch = article.source_name_fa?.toLowerCase().includes(searchTerm);
      
      return titleMatch || summaryMatch || categoryMatch || sourceMatch;
    });
  }, [query, initialArticles]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
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

        {/* Search Input */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <SearchIcon className="absolute right-4 w-5 h-5 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در اخبار... (مثلاً: ایران، اقتصاد، فوتبال)"
              autoFocus
              className="w-full pr-12 pl-12 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute left-4 p-1 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            )}
          </div>
          <p className="text-xs text-neutral-600 text-center mt-3">
            برای جستجو حداقل ۲ کاراکتر وارد کنید
          </p>
        </div>
      </div>

      {/* Results */}
      {query.trim().length >= 2 && (
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

      {query.trim().length < 2 && (
        <div className="text-center py-10">
          <p className="text-neutral-500 text-sm">
            💡 چند پیشنهاد جستجو: «ایران»، «اقتصاد»، «تحریم»، «فوتبال»
          </p>
        </div>
      )}
    </main>
  );
}