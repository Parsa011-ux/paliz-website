import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticleBySlug, getArticlesPaginated } from "@/lib/turso";
import { CATEGORIES } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-static";
export const dynamicParams = false;

function hasRealContent(content: string | null | undefined): boolean {
  if (!content) return false;
  if (typeof content !== "string") return false;
  const trimmed = content.trim();
  if (trimmed === "") return false;
  if (trimmed === "null") return false;
  if (trimmed === "undefined") return false;
  if (trimmed.length < 200) return false;
  return true;
}

export async function generateStaticParams() {
  const articles = await getArticlesPaginated(1, 500);
  return articles
    .filter((a) => hasRealContent(a.content_fa) && a.slug)
    .map((article) => ({
      slug: article.slug,
    }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await getArticleBySlug(decodedSlug);

  if (!article) {
    return { title: "خبر یافت نشد | پالیز نیوز" };
  }

  return {
    title: `${article.title_fa} | پالیز نیوز`,
    description: article.summary_fa || article.summary || "",
    openGraph: {
      title: article.title_fa,
      description: article.summary_fa || "",
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await getArticleBySlug(decodedSlug);

  if (!article || !hasRealContent(article.content_fa)) {
    notFound();
  }

  const categoryInfo = CATEGORIES.find((cat) => cat.slug === article.category);
  const publishDate = formatDate(article.published_at || article.created_at);
  const paragraphs = article.content_fa!
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12" style={{ width: "100%" }}>
        <div
          style={{
            maxWidth: "900px",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <article>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6 flex-wrap">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                خانه
              </Link>
              <span>/</span>
              {categoryInfo && (
                <>
                  <Link
                    href={`/category/${article.category}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {categoryInfo.emoji} {categoryInfo.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-neutral-400 truncate">
                {article.title_fa}
              </span>
            </nav>

            {/* Breaking Badge */}
            {article.is_breaking === 1 && (
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-red-400 font-bold text-sm">
                  🔴 خبر فوری
                </span>
              </div>
            )}

            {/* Category & Date */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {categoryInfo && (
                <Link
                  href={`/category/${article.category}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors"
                >
                  <span>{categoryInfo.emoji}</span>
                  <span>{categoryInfo.name}</span>
                </Link>
              )}
              {publishDate && (
                <span className="text-sm text-neutral-500">
                  📅 {publishDate}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title_fa}
            </h1>

            {/* Source & Views */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-6 mb-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  {article.source_name_fa?.[0] ||
                    article.source_name?.[0] ||
                    "پ"}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">
                    {article.source_name_fa || article.source_name}
                  </div>
                  <div className="text-neutral-500 text-xs">منبع خبر</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>
                  👁 {article.view_count.toLocaleString("fa-IR")} بازدید
                </span>
                <span>⭐ اهمیت: {article.importance_score}/10</span>
              </div>
            </div>

            {/* Featured Image */}
            {article.image_url && (
              <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image_url}
                  alt={article.title_fa}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Summary */}
            {article.summary_fa && (
              <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                <p
                  className="text-lg md:text-xl text-neutral-100 font-medium"
                  style={{ lineHeight: "2" }}
                >
                  {article.summary_fa}
                </p>
              </div>
            )}

            {/* Content */}
            {paragraphs.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
                  متن کامل خبر
                </h3>
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base md:text-lg text-neutral-300 mb-6"
                    style={{ lineHeight: "2.2" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Source Button */}
<div className="mt-10 flex justify-center">
  <a
    href={article.link}
    target="_blank"
    rel="noopener noreferrer"
    className="view-source-btn"
  >
    <span>
      READ ARTICLE
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </span>
  </a>
</div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>بازگشت به صفحه اصلی</span>
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
