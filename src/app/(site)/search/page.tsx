import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { searchArticles } from "@/lib/api";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? "").trim();
  const results = q ? await searchArticles(q) : [];

  return (
    <div className="container" style={{ paddingBottom: 48, maxWidth: 900 }}>
      <header className="cat-hero">
        <h1>Search</h1>
        <form action="/search" role="search" style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 14 }}>
          <label htmlFor="q" className="sr-only">Search</label>
          <input id="q" name="q" defaultValue={q} placeholder="Search news…"
            style={{ flex: 1, minWidth: 0, height: 44, padding: "0 14px", border: "1px solid var(--rule)", borderRadius: 4, fontSize: "1rem", background: "#fff" }} />
          <button className="btn btn-primary">Search</button>
        </form>
        {q && <p>{results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;</p>}
      </header>

      {q && results.length === 0 ? (
        <div className="empty">
          <h2>No results</h2>
          <p>Try a different word or check the spelling.</p>
        </div>
      ) : (
        <div className="cat-list">
          {results.map((a) => <ArticleCard key={a.id} article={a} variant="horizontal" showExcerpt />)}
        </div>
      )}
    </div>
  );
}
