"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminArticle, Category } from "@/types";
import { api, errorMessage, refreshSite } from "@/lib/admin-api";
import { articleUrl } from "@/lib/utils";
import BlockEditor, { fromContent, newBlock, toContent, type EditorBlock } from "./BlockEditor";
import ImageUpload from "./ImageUpload";
import TagInput from "./TagInput";
import { useAuth } from "./AdminShell";
import { Spinner, useToast } from "./ui";

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  location: string;
  tags: string[];
  status: "draft" | "published";
  isBreaking: boolean;
  isFeatured: boolean;
  publishedAt: string;
  cover: { url: string; publicId: string; alt: string; caption: string; credit: string };
};

const emptyForm: Form = {
  title: "",
  slug: "",
  excerpt: "",
  category: "",
  location: "",
  tags: [],
  status: "draft",
  isBreaking: false,
  isFeatured: false,
  publishedAt: "",
  cover: { url: "", publicId: "", alt: "", caption: "", credit: "" },
};

function toLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function ArticleEditor({ id }: { id?: string }) {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState<Form>(emptyForm);
  const [blocks, setBlocks] = useState<EditorBlock[]>([newBlock("paragraph")]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedSlug, setSavedSlug] = useState("");
  const [savedStatus, setSavedStatus] = useState<"draft" | "published">("draft");
  const dirty = useRef(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    dirty.current = true;
    setForm((f) => ({ ...f, [key]: value }));
  };
  const setCover = (patch: Partial<Form["cover"]>) => {
    dirty.current = true;
    setForm((f) => ({ ...f, cover: { ...f.cover, ...patch } }));
  };
  const setBlocksDirty = (b: EditorBlock[]) => {
    dirty.current = true;
    setBlocks(b);
  };

  useEffect(() => {
    api.get<Category[]>("/admin/categories").then((cats) => {
      setCategories(cats);
      if (!id && cats[0]) setForm((f) => (f.category ? f : { ...f, category: cats[0].id }));
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    api
      .get<AdminArticle>(`/admin/articles/${id}`)
      .then((a) => {
        setForm({
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          category: a.categoryId,
          location: a.location || "",
          tags: a.tags,
          status: a.status,
          isBreaking: Boolean(a.isBreaking),
          isFeatured: Boolean(a.isFeatured),
          publishedAt: toLocalInput(a.status === "published" ? a.publishedAt : undefined),
          cover: {
            url: a.coverImage.url,
            publicId: a.coverImage.publicId || "",
            alt: a.coverImage.alt || "",
            caption: a.coverImage.caption || "",
            credit: a.coverImage.credit || "",
          },
        });
        setBlocks(a.content.length ? fromContent(a.content) : [newBlock("paragraph")]);
        setSavedSlug(a.slug);
        setSavedStatus(a.status);
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const save = useCallback(
    async (status: "draft" | "published") => {
      setError("");
      if (form.title.trim().length < 5) return setError("Please write a headline (at least 5 characters).");
      if (!form.cover.url) return setError("Please upload a cover image.");
      if (!form.category) return setError("Please choose a category.");
      const content = toContent(blocks);
      if (status === "published" && content.length === 0) return setError("Please write the story before publishing.");

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        excerpt: form.excerpt.trim(),
        category: form.category,
        location: form.location.trim(),
        tags: form.tags,
        status,
        isBreaking: form.isBreaking,
        isFeatured: form.isFeatured,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : "",
        coverImage: { ...form.cover, alt: form.cover.alt.trim() || form.title.trim() },
        content,
      };

      setSaving(true);
      try {
        const res = id
          ? await api.put<{ id: string; slug: string }>(`/admin/articles/${id}`, payload)
          : await api.post<{ id: string; slug: string }>("/admin/articles", payload);
        dirty.current = false;
        await refreshSite();
        setSavedSlug(res.slug);
        setSavedStatus(status);
        setForm((f) => ({ ...f, slug: res.slug, status }));
        toast(status === "published" ? "Published! It is now live on the website." : "Draft saved");
        if (!id) router.replace(`/admin/articles/${res.id}`);
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setSaving(false);
      }
    },
    [form, blocks, id, router, toast]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving) save(form.status);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, saving, form.status]);

  async function remove() {
    if (!id || !confirm("Delete this article permanently?")) return;
    try {
      await api.del(`/admin/articles/${id}`);
      dirty.current = false;
      await refreshSite();
      toast("Article deleted");
      router.replace("/admin/articles");
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="a-editor">
      <div className="a-stack">
        {error && <div className="a-alert error" role="alert">{error}</div>}

        <div className="a-card a-card-pad a-stack">
          <div className="a-field">
            <label htmlFor="title">Headline</label>
            <textarea id="title" className="a-textarea a-input-title" rows={2} maxLength={250} value={form.title}
              placeholder="Write a clear, specific headline" onChange={(e) => set("title", e.target.value.replace(/\n/g, " "))} style={{ minHeight: 0 }} />
          </div>
          <div className="a-field">
            <label htmlFor="excerpt">Summary</label>
            <textarea id="excerpt" className="a-textarea" rows={2} maxLength={500} value={form.excerpt}
              placeholder="One or two sentences shown under the headline and on cards" onChange={(e) => set("excerpt", e.target.value)} />
            <span className="a-hint">{form.excerpt.length}/500</span>
          </div>
        </div>

        <div className="a-card a-card-pad a-stack">
          <h2 style={{ margin: 0 }}>Cover image</h2>
          <ImageUpload value={form.cover.url} height={260} onChange={(img) => setCover({ url: img?.url || "", publicId: img?.publicId || "" })} />
          <div className="a-grid-2">
            <input className="a-input" placeholder="Caption" maxLength={300} value={form.cover.caption} onChange={(e) => setCover({ caption: e.target.value })} />
            <input className="a-input" placeholder="Photo credit" maxLength={100} value={form.cover.credit} onChange={(e) => setCover({ credit: e.target.value })} />
          </div>
          <input className="a-input" placeholder="Describe the image (for screen readers)" maxLength={200} value={form.cover.alt} onChange={(e) => setCover({ alt: e.target.value })} />
        </div>

        <div className="a-card a-card-pad">
          <h2>Story</h2>
          <BlockEditor blocks={blocks} onChange={setBlocksDirty} />
        </div>
      </div>

      <div className="a-editor-side a-stack">
        <div className="a-card a-card-pad a-stack">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>Publish</h2>
            <span className={`a-pill ${savedStatus}`}>{id ? savedStatus : "new"}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="a-btn a-btn-ghost" style={{ flex: 1 }} disabled={saving} onClick={() => save("draft")}>
              {savedStatus === "published" ? "Unpublish" : "Save draft"}
            </button>
            <button className="a-btn a-btn-primary" style={{ flex: 1 }} disabled={saving} onClick={() => save("published")}>
              {saving ? "Saving…" : savedStatus === "published" ? "Update" : "Publish"}
            </button>
          </div>
          {savedStatus === "published" && savedSlug && (
            <a className="a-link" style={{ fontSize: "0.85rem" }} href={articleUrl(savedSlug)} target="_blank" rel="noopener noreferrer">View on website ↗</a>
          )}
          <span className="a-hint">Tip: press Ctrl+S (⌘S on Mac) to save.</span>
        </div>

        <div className="a-card a-card-pad a-stack">
          <div className="a-field">
            <label htmlFor="category">Category</label>
            <select id="category" className="a-select" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="a-field">
            <label htmlFor="location">Dateline (place)</label>
            <input id="location" className="a-input" maxLength={80} placeholder="e.g. New Delhi" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div className="a-field">
            <span className="a-label">Topics</span>
            <TagInput value={form.tags} onChange={(t) => set("tags", t)} />
          </div>
          <label className="a-check"><input type="checkbox" checked={form.isBreaking} onChange={(e) => set("isBreaking", e.target.checked)} /> Breaking news (shows in ticker)</label>
          <label className="a-check"><input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} /> Featured (top of homepage)</label>
        </div>

        <div className="a-card a-card-pad a-stack">
          <div className="a-field">
            <label htmlFor="publishedAt">Publish date &amp; time</label>
            <input id="publishedAt" type="datetime-local" className="a-input" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
            <span className="a-hint">Leave empty to publish now. A future time schedules the story.</span>
          </div>
          <div className="a-field">
            <label htmlFor="slug">URL</label>
            <input id="slug" className="a-input" maxLength={100} placeholder="auto-generated from headline" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            <span className="a-hint">/news/{form.slug || "…"}</span>
          </div>
        </div>

        {id && user.role === "admin" && (
          <button className="a-btn a-btn-danger" onClick={remove}>Delete article</button>
        )}
        <Link href="/admin/articles" className="a-link" style={{ fontSize: "0.85rem", textAlign: "center" }}>← Back to all articles</Link>
      </div>
    </div>
  );
}
