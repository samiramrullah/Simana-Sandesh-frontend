import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import BreakingTicker from "@/components/BreakingTicker";
import Newsletter from "@/components/Newsletter";
import { Avatar, SectionHead, TrendingList } from "@/components/Widgets";
import { getHomepageData } from "@/lib/api";
import { articleUrl, categoryUrl } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomepageData();
  const lead = data.lead;

  if (!lead) {
    return (
      <div className="container">
        <div className="empty" style={{ padding: "96px 16px" }}>
          <h2>No stories published yet</h2>
          <p>Log in to the admin panel and publish your first article.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BreakingTicker items={data.breaking} />

      <div className="home">
        <div className="container">
          <div className="home-top">
            <div>
              <div className="lead-grid">
                <ArticleCard article={lead} variant="lead" priority />
                <div className="secondary-col">
                  {data.secondary.map((a, i) =>
                    i === 0 ? (
                      <ArticleCard key={a.id} article={a} showExcerpt={false} />
                    ) : (
                      <ArticleCard key={a.id} article={a} variant="horizontal" />
                    )
                  )}
                </div>
              </div>

              <section className="block" aria-label="Top stories">
                <SectionHead title="Top Stories" />
                <div className="grid-3">
                  {data.topStories.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="sidebar sticky">
              <TrendingList items={data.trending} />
              <Newsletter />
            </aside>
          </div>
        </div>

        {data.opinion.length > 0 && (
          <section className="opinion-strip" aria-label="Opinion">
            <div className="container">
              <SectionHead title="Opinion & Editorial" href={categoryUrl("opinion")} />
              <div className="opinion-grid">
                {data.opinion.slice(0, 2).map((a) => (
                  <article key={a.id} className="opinion-card">
                    <Avatar name={a.author.name} src={a.author.avatar} />
                    <div>
                      <div className="by">{a.author.name} <span>· {a.author.role}</span></div>
                      <h3 className="headline"><Link href={articleUrl(a.slug)}>{a.title}</Link></h3>
                      <p className="excerpt" style={{ fontSize: "0.95rem" }}>{a.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="container block">
          <div className="cat-sections">
            {data.sections.map(({ category, articles }) => (
              <section key={category.id} aria-label={category.name}>
                <SectionHead title={category.name} href={categoryUrl(category.slug)} moreLabel={`More ${category.name}`} />
                <div className="cat-section-body">
                  {articles[0] && <ArticleCard article={articles[0]} showCategory={false} />}
                  <div className="cat-section-list">
                    {articles.slice(1).map((a) => (
                      <ArticleCard key={a.id} article={a} variant="text" showCategory={false} />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
