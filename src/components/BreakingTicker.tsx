import Link from "next/link";
import type { ArticleSummary } from "@/types";
import { articleUrl } from "@/lib/utils";

export default function BreakingTicker({ items }: { items: ArticleSummary[] }) {
  if (!items.length) return null;
  return (
    <div className="ticker" aria-label="Breaking news">
      <div className="container">
        <span className="badge"><span className="live-dot" /> Breaking</span>
        <div className="ticker-track">
          <div className="ticker-items">
            {items.map((a) => (
              <Link key={a.id} href={articleUrl(a.slug)}>{a.title}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
