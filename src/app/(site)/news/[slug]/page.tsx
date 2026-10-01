import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleBody from "@/components/ArticleBody";
import ArticleCard from "@/components/ArticleCard";
import { ArticleTools, ReadingProgress, ShareBottom, ViewTracker } from "@/components/ArticleTools";
import Newsletter from "@/components/Newsletter";
import { Avatar, SectionHead, TrendingList } from "@/components/Widgets";
import { getAllArticleSlugs, getArticleBySlug, getRelatedArticles, getTrending } from "@/lib/api";
import { articleUrl, categoryUrl, formatDate, SITE_URL } from "@/lib/utils";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return { title: "Article not found" };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: articleUrl(a.slug) },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt,
      url: articleUrl(a.slug),
      images: [{ url: a.coverImage.url, alt: a.coverImage.alt }],
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      authors: [a.author.name],
      section: a.category.name,
      tags: a.tags,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, trending] = await Promise.all([getRelatedArticles(article, 4), getTrending(5)]);
  const path = articleUrl(article.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage.url],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: { "@type": "Organization", name: "Simana Sandesh" },
    mainEntityOfPage: `${SITE_URL}${path}`,
  };

  return (
    <>
      <ReadingProgress />
      <ViewTracker slug={article.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="article-page">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li><Link href={categoryUrl(article.category.slug)}>{article.category.name}</Link></li>
              <li aria-current="page">{article.title}</li>
            </ol>
          </nav>

          <div className="article-layout">
            <article className="article-main">
              <header className="article-header">
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  {article.isBreaking && <span className="badge"><span className="live-dot" /> Breaking</span>}
                  <Link href={categoryUrl(article.category.slug)} className="kicker">{article.category.name}</Link>
                </div>
                <h1 className="headline">{article.title}</h1>
                <p className="standfirst">{article.excerpt}</p>

                <div className="byline-row">
                  <div className="byline">
                    <Avatar name={article.author.name} src={article.author.avatar} />
                    <div>
                      <div className="name">By {article.author.name}</div>
                      <div className="meta">
                        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, true)} IST</time>
                        {article.updatedAt && <span className="dot">Updated {formatDate(article.updatedAt, true)}</span>}
                        <span className="dot">{article.readingTime} min read</span>
                      </div>
                    </div>
                  </div>
                  <ArticleTools title={article.title} path={path} id={article.id} />
                </div>
              </header>

              <figure className="article-figure">
                <div className="img-wrap">
                  <Image src={article.coverImage.url} alt={article.coverImage.alt} fill priority sizes="(min-width: 1024px) 760px, 100vw" />
                </div>
                {(article.coverImage.caption || article.coverImage.credit) && (
                  <figcaption>
                    {article.coverImage.caption}
                    {article.coverImage.credit && <span className="credit">{article.coverImage.credit}</span>}
                  </figcaption>
                )}
              </figure>

              <ArticleBody blocks={article.content} location={article.location} />

              {article.tags.length > 0 && (
                <div className="tags">
                  <span className="tags-label">Topics</span>
                  {article.tags.map((t) => (
                    <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="tag">{t}</Link>
                  ))}
                </div>
              )}

              <ShareBottom title={article.title} path={path} />

              <div className="author-box">
                <Avatar name={article.author.name} src={article.author.avatar} large />
                <div>
                  <h4>{article.author.name}</h4>
                  {article.author.role && <div className="role">{article.author.role}</div>}
                  {article.author.bio && <p>{article.author.bio}</p>}
                </div>
              </div>
            </article>

            <aside className="sidebar sticky">
              <TrendingList items={trending.filter((t) => t.id !== article.id).slice(0, 5)} />
              <Newsletter />
            </aside>
          </div>

          {related.length > 0 && (
            <section className="related" aria-label="Related stories">
              <SectionHead title="You May Also Like" href={categoryUrl(article.category.slug)} moreLabel={`More ${article.category.name}`} />
              <div className="grid-4">
                {related.map((a) => <ArticleCard key={a.id} article={a} showExcerpt={false} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
