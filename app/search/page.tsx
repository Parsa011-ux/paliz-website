import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchClient from "@/components/SearchClient";
import { getLatestArticles } from "@/lib/turso";

export const dynamic = "force-static";

export default async function SearchPage() {
  // در زمان Build، همه اخبار رو می‌گیریم
  // جستجو در Client انجام می‌شه
  const allArticles = await getLatestArticles(200);

  return (
    <>
      <Header />
      <SearchClient initialArticles={allArticles} />
      <Footer />
    </>
  );
}