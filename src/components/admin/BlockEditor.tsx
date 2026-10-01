"use client";

import type { ContentBlock } from "@/types";
import ImageUpload from "./ImageUpload";

export type EditorBlock = {
  key: string;
  type: ContentBlock["type"];
  text: string;
  cite: string;
  image: { url: string; publicId: string; alt: string; caption: string; credit: string };
};

const emptyImage = { url: "", publicId: "", alt: "", caption: "", credit: "" };
let counter = 0;
const newKey = () => `b${Date.now().toString(36)}${counter++}`;

export function newBlock(type: ContentBlock["type"]): EditorBlock {
  return { key: newKey(), type, text: "", cite: "", image: { ...emptyImage } };
}

export function fromContent(blocks: ContentBlock[]): EditorBlock[] {
  return blocks.map((b) => {
    const base = newBlock(b.type);
    if (b.type === "list") return { ...base, text: b.items.join("\n") };
    if (b.type === "image") return { ...base, image: { ...emptyImage, ...b.image, caption: b.image.caption || "", credit: b.image.credit || "", publicId: b.image.publicId || "" } };
    if (b.type === "quote") return { ...base, text: b.text, cite: b.cite || "" };
    return { ...base, text: b.text };
  });
}

export function toContent(blocks: EditorBlock[]): ContentBlock[] {
  const out: ContentBlock[] = [];
  for (const b of blocks) {
    const text = b.text.trim();
    if (b.type === "paragraph") {
      text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).forEach((p) => out.push({ type: "paragraph", text: p }));
    } else if (b.type === "heading" && text) {
      out.push({ type: "heading", text });
    } else if (b.type === "quote" && text) {
      out.push({ type: "quote", text, ...(b.cite.trim() ? { cite: b.cite.trim() } : {}) });
    } else if (b.type === "list") {
      const items = b.text.split("\n").map((i) => i.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
      if (items.length) out.push({ type: "list", items });
    } else if (b.type === "image" && b.image.url) {
      out.push({ type: "image", image: { ...b.image, alt: b.image.alt.trim(), caption: b.image.caption.trim(), credit: b.image.credit.trim() } });
    }
  }
  return out;
}

const LABELS: Record<ContentBlock["type"], string> = {
  paragraph: "Paragraph",
  heading: "Subheading",
  quote: "Quote",
  list: "Bullet list",
  image: "Image",
};

export default function BlockEditor({ blocks, onChange }: { blocks: EditorBlock[]; onChange: (b: EditorBlock[]) => void }) {
  const update = (key: string, patch: Partial<EditorBlock>) => onChange(blocks.map((b) => (b.key === key ? { ...b, ...patch } : b)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...blocks];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  const remove = (key: string) => {
    const b = blocks.find((x) => x.key === key);
    const hasContent = b && (b.text.trim() || b.image.url);
    if (hasContent && !confirm("Remove this block?")) return;
    onChange(blocks.filter((x) => x.key !== key));
  };
  const add = (type: ContentBlock["type"]) => onChange([...blocks, newBlock(type)]);
  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  };

  return (
    <div className="a-blocks">
      {blocks.map((b, i) => (
        <div key={b.key} className={`a-block ${b.type}`}>
          <div className="a-block-head">
            <span className="a-block-type">{LABELS[b.type]}</span>
            <div className="a-block-tools">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label="Move down">↓</button>
              <button type="button" onClick={() => remove(b.key)} aria-label="Remove block">✕</button>
            </div>
          </div>
          <div className="a-block-body">
            {b.type === "paragraph" && (
              <textarea className="a-textarea" rows={4} value={b.text} placeholder="Write your paragraph. Leave a blank line to start a new paragraph."
                onChange={(e) => { update(b.key, { text: e.target.value }); autoGrow(e.target); }} onFocus={(e) => autoGrow(e.target)} />
            )}
            {b.type === "heading" && (
              <input className="a-input" value={b.text} maxLength={200} placeholder="Subheading" onChange={(e) => update(b.key, { text: e.target.value })} />
            )}
            {b.type === "quote" && (
              <>
                <textarea className="a-textarea" rows={2} value={b.text} maxLength={1000} placeholder="Quote text" onChange={(e) => update(b.key, { text: e.target.value })} />
                <input className="a-input" value={b.cite} maxLength={150} placeholder="Who said it? (optional)" onChange={(e) => update(b.key, { cite: e.target.value })} />
              </>
            )}
            {b.type === "list" && (
              <textarea className="a-textarea" rows={4} value={b.text} placeholder={"One point per line\nSecond point\nThird point"}
                onChange={(e) => { update(b.key, { text: e.target.value }); autoGrow(e.target); }} />
            )}
            {b.type === "image" && (
              <>
                <ImageUpload value={b.image.url} height={180}
                  onChange={(img) => update(b.key, { image: { ...b.image, url: img?.url || "", publicId: img?.publicId || "" } })} />
                <div className="a-grid-2">
                  <input className="a-input" value={b.image.caption} maxLength={300} placeholder="Caption" onChange={(e) => update(b.key, { image: { ...b.image, caption: e.target.value } })} />
                  <input className="a-input" value={b.image.credit} maxLength={100} placeholder="Photo credit" onChange={(e) => update(b.key, { image: { ...b.image, credit: e.target.value } })} />
                </div>
                <input className="a-input" value={b.image.alt} maxLength={200} placeholder="Describe the image (for screen readers)" onChange={(e) => update(b.key, { image: { ...b.image, alt: e.target.value } })} />
              </>
            )}
          </div>
        </div>
      ))}
      <div className="a-add-bar">
        <span>Add:</span>
        {(Object.keys(LABELS) as ContentBlock["type"][]).map((t) => (
          <button key={t} type="button" className="a-btn a-btn-ghost a-btn-sm" onClick={() => add(t)}>+ {LABELS[t]}</button>
        ))}
      </div>
    </div>
  );
}
