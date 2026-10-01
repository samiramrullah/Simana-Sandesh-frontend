"use client";

import { useEffect, useState } from "react";
import { BookmarkIcon, FacebookIcon, LinkIcon, PrintIcon, ShareIcon, WhatsAppIcon, XIcon } from "./Icons";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `ss-viewed-${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    fetch(`/backend/articles/${encodeURIComponent(slug)}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);
  return null;
}

export function ReadingProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("article-body");
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const total = height - window.innerHeight * 0.6;
      setW(Math.min(100, Math.max(0, (-top / Math.max(total, 1)) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="progress" style={{ width: `${w}%` }} role="progressbar" aria-label="Reading progress" aria-valuenow={Math.round(w)} aria-valuemin={0} aria-valuemax={100} />;
}

const SIZES = ["1.0625rem", "1.1875rem", "1.3125rem", "1.4375rem"];

export function ArticleTools({ title, path, id }: { title: string; path: string; id: string }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [size, setSize] = useState(1);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    try {
      const list: string[] = JSON.parse(localStorage.getItem("ss-saved") || "[]");
      setSaved(list.includes(id));
      const s = Number(localStorage.getItem("ss-text-size"));
      if (s >= 0 && s < SIZES.length) setSize(s);
    } catch {}
  }, [id]);

  useEffect(() => {
    document.documentElement.style.setProperty("--article-size", SIZES[size]);
    try { localStorage.setItem("ss-text-size", String(size)); } catch {}
  }, [size]);

  const url = () => (typeof window !== "undefined" ? window.location.origin + path : path);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  const nativeShare = () => navigator.share?.({ title, url: url() }).catch(() => {});
  const toggleSave = () => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem("ss-saved") || "[]");
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      localStorage.setItem("ss-saved", JSON.stringify(next));
      setSaved(next.includes(id));
    } catch { setSaved((s) => !s); }
  };
  const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer,width=600,height=520");
  const enc = (s: string) => encodeURIComponent(s);

  return (
    <div className="tools">
      <button className="tool-btn" onClick={() => setSize((s) => Math.max(0, s - 1))} aria-label="Smaller text" disabled={size === 0}>A−</button>
      <button className="tool-btn" onClick={() => setSize((s) => Math.min(SIZES.length - 1, s + 1))} aria-label="Larger text" disabled={size === SIZES.length - 1}>A+</button>
      <span className="tool-sep" aria-hidden />
      <button className="tool-btn whatsapp" aria-label="Share on WhatsApp" onClick={() => open(`https://wa.me/?text=${enc(`${title} ${url()}`)}`)}><WhatsAppIcon /></button>
      <button className="tool-btn" aria-label="Share on X" onClick={() => open(`https://x.com/intent/post?text=${enc(title)}&url=${enc(url())}`)}><XIcon size={14} /></button>
      <button className="tool-btn" aria-label="Share on Facebook" onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url())}`)}><FacebookIcon /></button>
      <button className="tool-btn" aria-label="Copy link" onClick={copy}><LinkIcon />{copied && "Copied"}</button>
      {canNativeShare && <button className="tool-btn" aria-label="More share options" onClick={nativeShare}><ShareIcon /></button>}
      <button className="tool-btn" aria-label={saved ? "Remove bookmark" : "Save article"} aria-pressed={saved} onClick={toggleSave} style={saved ? { color: "var(--accent)", borderColor: "var(--accent)" } : undefined}>
        <BookmarkIcon filled={saved} />
      </button>
      <button className="tool-btn" aria-label="Print" onClick={() => window.print()}><PrintIcon /></button>
    </div>
  );
}

export function ShareBottom({ title, path }: { title: string; path: string }) {
  const url = () => (typeof window !== "undefined" ? window.location.origin + path : path);
  const enc = (s: string) => encodeURIComponent(s);
  return (
    <div className="share-bottom">
      <strong>Found this useful? Share it.</strong>
      <div className="tools">
        <a className="tool-btn whatsapp" href={`https://wa.me/?text=${enc(title)}`} target="_blank" rel="noopener noreferrer"
          onClick={(e) => { e.currentTarget.href = `https://wa.me/?text=${enc(`${title} ${url()}`)}`; }}>
          <WhatsAppIcon /> WhatsApp
        </a>
        <a className="tool-btn" href={`https://x.com/intent/post?text=${enc(title)}`} target="_blank" rel="noopener noreferrer"
          onClick={(e) => { e.currentTarget.href = `https://x.com/intent/post?text=${enc(title)}&url=${enc(url())}`; }}>
          <XIcon size={14} /> Post
        </a>
      </div>
    </div>
  );
}
