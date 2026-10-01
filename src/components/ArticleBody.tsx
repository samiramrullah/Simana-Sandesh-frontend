import Image from "next/image";
import type { ContentBlock } from "@/types";
export default function ArticleBody({ blocks, location }: { blocks: ContentBlock[]; location?: string }) {
  return (
    <div className="article-body" id="article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "paragraph":
            return (
              <p key={i} className={i === 0 && !location ? "has-dropcap" : undefined}>
                {i === 0 && location && <span className="dateline">{location}: </span>}
                {b.text}
              </p>
            );
          case "heading":
            return <h2 key={i}>{b.text}</h2>;
          case "quote":
            return (
              <blockquote key={i}>
                {b.text}
                {b.cite && <cite>{b.cite}</cite>}
              </blockquote>
            );
          case "list":
            return <ul key={i}>{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
          case "image":
            return (
              <figure key={i} className="article-figure" style={{ fontFamily: "var(--font-sans)" }}>
                <div className="img-wrap">
                  <Image src={b.image.url} alt={b.image.alt} fill sizes="(min-width: 1024px) 760px, 100vw" />
                </div>
                {b.image.caption && <figcaption>{b.image.caption}</figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
