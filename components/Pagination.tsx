import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  // ساخت لیست صفحات نمایش داده شده
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const showAround = 1; // چند صفحه اطراف صفحه فعلی

    // همیشه صفحه 1
    pages.push(1);

    // ... بعد از 1 اگه فاصله زیاد بود
    if (currentPage - showAround > 2) {
      pages.push("...");
    }

    // صفحات اطراف
    for (
      let i = Math.max(2, currentPage - showAround);
      i <= Math.min(totalPages - 1, currentPage + showAround);
      i++
    ) {
      pages.push(i);
    }

    // ... قبل از آخرین صفحه
    if (currentPage + showAround < totalPages - 1) {
      pages.push("...");
    }

    // همیشه آخرین صفحه (اگه بیشتر از 1 صفحه بود)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const getPageUrl = (page: number): string => {
    if (page === 1) return "/";
    return `/page/${page}`;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-12 mb-8"
      aria-label="صفحه‌بندی"
    >
      {/* دکمه قبلی */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600 text-neutral-300 hover:text-white border border-neutral-800 hover:border-transparent transition-all font-semibold text-sm"
        >
          <ChevronRight className="w-4 h-4" />
          <span>قبلی</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-900/50 text-neutral-600 border border-neutral-800/50 cursor-not-allowed font-semibold text-sm">
          <ChevronRight className="w-4 h-4" />
          <span>قبلی</span>
        </span>
      )}

      {/* شماره صفحات */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-2 text-neutral-500"
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800"
              }`}
            >
              {page.toLocaleString("fa-IR")}
            </Link>
          );
        })}
      </div>

      {/* دکمه بعدی */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600 text-neutral-300 hover:text-white border border-neutral-800 hover:border-transparent transition-all font-semibold text-sm"
        >
          <span>بعدی</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-900/50 text-neutral-600 border border-neutral-800/50 cursor-not-allowed font-semibold text-sm">
          <span>بعدی</span>
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
