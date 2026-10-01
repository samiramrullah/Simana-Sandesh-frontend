import type { Article, ArticleSummary, Category, HomepageData, Paginated } from "@/types";

const API_URL = (process.env.API_URL || "http://localhost:8080").replace(/\/$/, "");
export const CONTENT_TAG = "content";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate, tags: [CONTENT_TAG] },
  });
  if (!res.ok) {
    const server = res.headers.get("server") || "";
    const hint = /airtunes/i.test(server)
      ? ` — ${API_URL} is answered by macOS AirPlay Receiver, not the backend. Set API_URL in frontend/.env.local to the port your backend prints.`
      : "";
    throw new ApiError(res.status, `API ${res.status} on ${API_URL}/api${path}${hint}`);
  }
  if (!(res.headers.get("content-type") || "").includes("application/json")) {
    throw new ApiError(502, `${API_URL} did not return JSON. Check that API_URL points to the backend.`);
  }
  return res.json() as Promise<T>;
}

async function orNull<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export function getCategories() {
  return request<Category[]>("/categories", 300);
}

export function getHomepageData() {
  return request<HomepageData>("/homepage", 60);
}

export function getArticleBySlug(slug: string) {
  return orNull(request<Article>(`/articles/${encodeURIComponent(slug)}`, 120));
}

export function getRelatedArticles(article: Article, limit = 4) {
  return request<ArticleSummary[]>(`/articles/${encodeURIComponent(article.slug)}/related?limit=${limit}`, 300);
}

export function getTrending(limit = 5) {
  return request<ArticleSummary[]>(`/articles/trending?limit=${limit}`, 120);
}

export function getArticlesByCategory(slug: string, page = 1, pageSize = 12) {
  return orNull(
    request<{ category: Category; data: Paginated<ArticleSummary> }>(
      `/categories/${encodeURIComponent(slug)}/articles?page=${page}&pageSize=${pageSize}`,
      60
    )
  );
}

export async function searchArticles(q: string) {
  if (!q.trim()) return [];
  return request<ArticleSummary[]>(`/search?q=${encodeURIComponent(q)}`, 30);
}

export async function getAllArticleSlugs() {
  try {
    return await request<string[]>("/articles/slugs", 300);
  } catch {
    return [];
  }
}
