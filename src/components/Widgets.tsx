import Link from "next/link";
import type { ArticleSummary } from "@/types";
import { articleUrl, formatViews } from "@/lib/utils";
import { EyeIcon } from "./Icons";
import TimeAgo from "./TimeAgo";

export function SectionHead({ title, href, moreLabel = "See all" }: { title: string; href?: string; moreLabel?: string }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {href && <Link className="more" href={href}>{moreLabel} →</Link>}
    </div>
  );
}

export function TrendingList({ items, title = "Most Read" }: { items: ArticleSummary[]; title?: string }) {
  return (
    <section aria-labelledby="trending-title">
      <div className="section-head"><h2 id="trending-title">{title}</h2></div>
      <ol className="trending-list">
        {items.map((a) => (
          <li key={a.id} className="trending-item">
            <div>
              <h3 className="headline"><Link href={articleUrl(a.slug)}>{a.title}</Link></h3>
              <div className="meta">
                <span>{a.category.name}</span>
                <span className="dot"><TimeAgo iso={a.publishedAt} /></span>
                {a.views ? <span className="dot" style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><EyeIcon /> {formatViews(a.views)}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Avatar({ name, src, large }: { name: string; src?: string; large?: boolean }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className={`avatar ${large ? "lg" : ""}`} aria-hidden>
      {src ? <img src={src} alt="" width={64} height={64} /> : initials}
    </div>
  );
}
