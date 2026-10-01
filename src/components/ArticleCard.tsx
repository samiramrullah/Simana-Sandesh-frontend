import Image from "next/image";
import Link from "next/link";
import type { ArticleSummary } from "@/types";
import { articleUrl, categoryUrl } from "@/lib/utils";
import TimeAgo from "./TimeAgo";

type Variant = "lead" | "standard" | "horizontal" | "text";

interface Props {
  article: ArticleSummary;
  variant?: Variant;
  showExcerpt?: boolean;
  showCategory?: boolean;
  priority?: boolean;
}

export default function ArticleCard({
  article: a,
  variant = "standard",
  showExcerpt = variant !== "text" && variant !== "horizontal",
  showCategory = true,
  priority = false,
}: Props) {
  const href = articleUrl(a.slug);

  const image = variant !== "text" && (
    <Link href={href} tabIndex={-1} aria-hidden>
      <div className="img-wrap">
        <Image
          src={a.coverImage.url}
          alt={a.coverImage.alt}
          fill
          priority={priority}
          sizes={
            variant === "lead" ? "(min-width: 1024px) 60vw, 100vw"
            : variant === "horizontal" ? "(min-width: 600px) 240px, 108px"
            : "(min-width: 1024px) 25vw, (min-width: 600px) 50vw, 100vw"
          }
        />
      </div>
    </Link>
  );

  const text = (
    <div>
      {showCategory && (
        <Link href={categoryUrl(a.category.slug)} className="kicker">
          {a.isBreaking && variant !== "lead" ? "● " : ""}{a.category.name}
        </Link>
      )}
      {variant === "lead" ? (
        <h2 className="headline"><Link href={href}>{a.title}</Link></h2>
      ) : (
        <h3 className="headline" style={{ marginTop: showCategory ? 6 : 0 }}><Link href={href}>{a.title}</Link></h3>
      )}
      {showExcerpt && <p className="excerpt" style={{ marginTop: 8 }}>{a.excerpt}</p>}
      <div className="meta" style={{ marginTop: 8 }}>
        {variant === "lead" && <span>By <strong>{a.author.name}</strong></span>}
        <span className={variant === "lead" ? "dot" : ""}><TimeAgo iso={a.publishedAt} /></span>
        <span className="dot">{a.readingTime} min read</span>
      </div>
    </div>
  );

  if (variant === "lead") {
    return (
      <article className="lead card">
        {a.isBreaking && <span className="badge" style={{ alignSelf: "flex-start" }}><span className="live-dot" /> Breaking</span>}
        {image}
        {a.coverImage.caption && <p className="lead-caption">{a.coverImage.caption}</p>}
        {text}
      </article>
    );
  }

  if (variant === "horizontal") {
    return <article className="card-horizontal card">{text}{image}</article>;
  }

  return (
    <article className={`card ${variant === "text" ? "card-text-only" : ""}`}>
      {image}
      {text}
    </article>
  );
}
