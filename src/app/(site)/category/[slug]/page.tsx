import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { TrendingList } from "@/components/Widgets";
import { getArticlesByCategory, getCategories, getTrending } from "@/lib/api";
import { categoryUrl } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await getCategories()).find((c) => c.slug === slug);
  return cat
    ? { title: `${cat.name} News`, description: `Latest ${cat.name} news, updates and analysis from Simana Sandesh.` }
    : { title: "Section not found" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [result, trending] = await Promise.all([getArticlesByCategory(slug, page), getTrending(5)]);
  if (!result) notFound();
  const { category, data } = result;

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      <header className="cat-hero">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb" style={{ marginBottom: 8 }}>
            <li><Link href="/">Home</Link></li>
            <li aria-current="page">{category.name}</li>
          </ol>
        </nav>
        <h1>{category.name}</h1>
        <p>Latest {category.name.toLowerCase()} news, updates and analysis.</p>
      </header>

      <div className="article-layout">
        <div>
          {data.items.length === 0 ? (
            <div className="empty">
              <h2>No stories yet</h2>
              <p>Check back soon for the latest in {category.name}.</p>
            </div>
          ) : (
            <>
              <ArticleCard article={data.items[0]} variant="lead" showCategory={false} priority />
              <div className="cat-list" style={{ marginTop: 24 }}>
                {data.items.slice(1).map((a) => (
                  <ArticleCard key={a.id} article={a} variant="horizontal" showCategory={false} showExcerpt />
                ))}
              </div>
            </>
          )}

          {data.totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              {page > 1 && <Link href={`${categoryUrl(slug)}?page=${page - 1}`}>‹</Link>}
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) =>
                p === page ? (
                  <span key={p} className="current" aria-current="page">{p}</span>
                ) : (
                  <Link key={p} href={`${categoryUrl(slug)}?page=${p}`}>{p}</Link>
                )
              )}
              {page < data.totalPages && <Link href={`${categoryUrl(slug)}?page=${page + 1}`}>›</Link>}
            </nav>
          )}
        </div>

        <aside className="sidebar sticky">
          <TrendingList items={trending} />
          <Newsletter />
        </aside>
      </div>
    </div>
  );
}
