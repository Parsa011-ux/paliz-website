import { createClient } from "@libsql/client";
import type { Article } from "./types";

// اتصال به Turso
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// دریافت آخرین اخبار
export async function getLatestArticles(
  limit: number = 20,
  category?: string
): Promise<Article[]> {
  try {
    const query = `
      SELECT * FROM articles
      ${category && category !== "all" ? "WHERE category = ?" : ""}
      ORDER BY 
        is_breaking DESC,
        importance_score DESC,
        created_at DESC
      LIMIT ?
    `;

    const args = category && category !== "all" ? [category, limit] : [limit];

    const result = await turso.execute({
      sql: query,
      args: args,
    });

    return result.rows.map((row) => row as unknown as Article);
  } catch (error) {
    console.error("خطا در دریافت اخبار:", error);
    return [];
  }
}

// دریافت خبرهای فوری
export async function getBreakingNews(limit: number = 5): Promise<Article[]> {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM articles WHERE is_breaking = 1 ORDER BY created_at DESC LIMIT ?`,
      args: [limit],
    });
    return result.rows.map((row) => row as unknown as Article);
  } catch (error) {
    console.error("خطا در دریافت اخبار فوری:", error);
    return [];
  }
}

// دریافت یک خبر با slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM articles WHERE slug = ? LIMIT 1`,
      args: [slug],
    });

    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as Article;
  } catch (error) {
    console.error("خطا در دریافت خبر:", error);
    return null;
  }
}

// افزایش view count
export async function incrementViewCount(articleId: number): Promise<void> {
  try {
    await turso.execute({
      sql: `UPDATE articles SET view_count = view_count + 1 WHERE id = ?`,
      args: [articleId],
    });
  } catch (error) {
    console.error("خطا در افزایش بازدید:", error);
  }
}

// جستجو در اخبار
export async function searchArticles(
  query: string,
  limit: number = 50
): Promise<Article[]> {
  try {
    if (!query || query.trim().length < 2) return [];

    const searchTerm = `%${query.trim()}%`;

    const result = await turso.execute({
      sql: `
        SELECT * FROM articles
        WHERE title_fa LIKE ? 
           OR summary_fa LIKE ?
           OR title LIKE ?
           OR category LIKE ?
           OR source_name_fa LIKE ?
        ORDER BY 
          CASE 
            WHEN title_fa LIKE ? THEN 1
            WHEN summary_fa LIKE ? THEN 2
            ELSE 3
          END,
          importance_score DESC,
          created_at DESC
        LIMIT ?
      `,
      args: [
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        limit,
      ],
    });

    return result.rows.map((row) => row as unknown as Article);
  } catch (error) {
    console.error("خطا در جستجو:", error);
    return [];
  }
}
// دریافت اخبار بر اساس دسته‌بندی
export async function getArticlesByCategory(
  category: string,
  limit: number = 50
): Promise<Article[]> {
  try {
    const result = await turso.execute({
      sql: `
        SELECT * FROM articles
        WHERE category = ?
        ORDER BY 
          is_breaking DESC,
          importance_score DESC,
          created_at DESC
        LIMIT ?
      `,
      args: [category, limit],
    });

    return result.rows.map((row) => row as unknown as Article);
  } catch (error) {
    console.error("خطا در دریافت اخبار دسته‌بندی:", error);
    return [];
  }
}

// دریافت لیست دسته‌بندی‌ها
export async function getAllCategories(): Promise<string[]> {
  try {
    const result = await turso.execute({
      sql: `SELECT DISTINCT category FROM articles WHERE category IS NOT NULL ORDER BY category`,
      args: [],
    });
    return result.rows.map((row) => (row as any).category as string);
  } catch (error) {
    console.error("خطا:", error);
    return [];
  }
}