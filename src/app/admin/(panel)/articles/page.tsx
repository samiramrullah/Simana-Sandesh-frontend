"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { AdminArticle, Category, Paginated } from "@/types";
import { api, errorMessage, refreshSite } from "@/lib/admin-api";
import { articleUrl, formatViews } from "@/lib/utils";
import { useAuth } from "@/components/admin/AdminShell";
import { formatDateTime, Pager, Spinner, useToast } from "@/components/admin/ui";

export default function ArticlesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState<Paginated<AdminArticle> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    if (category) params.set("category", category);
    api.get<Paginated<AdminArticle>>(`/admin/articles?${params}`).then(setData).catch((e) => setError(errorMessage(e)));
  }, [page, query, status, category]);

  useEffect(load, [load]);
  useEffect(() => {
    api.get<Category[]>("/admin/categories").then(setCategories).catch(() => {});
  }, []);
  useEffect(() => {
    const t = setTimeout(() => { setQuery(q.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  async function remove(a: AdminArticle) {
    if (!confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      await api.del(`/admin/articles/${a.id}`);
      await refreshSite();
      toast("Article deleted");
      load();
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  return (
    <>
      <div className="a-toolbar">
        <input className="a-input grow" placeholder="Search by title…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search articles" />
        <select className="a-select" style={{ width: "auto" }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <select className="a-select" style={{ width: "auto" }} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {error && <div className="a-alert error">{error}</div>}
      {!data ? (
        <Spinner />
      ) : (
        <div className="a-card">
          {data.items.length === 0 ? (
            <div className="a-empty">No articles found.</div>
          ) : (
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Views</th>
                    <th>Updated</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="title-cell">
                          <img className="thumb" src={a.coverImage.url} alt="" loading="lazy" />
                          <div>
                            <Link href={`/admin/articles/${a.id}`}>{a.title}</Link>
                            <div>
                              {a.isBreaking && <span className="a-pill flag" style={{ marginLeft: 0 }}>Breaking</span>}
                              {a.isFeatured && <span className="a-pill flag">Featured</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`a-pill ${a.status}`}>{a.status}</span></td>
                      <td>{a.category.name}</td>
                      <td>{a.author.name}</td>
                      <td>{formatViews(a.views)}</td>
                      <td className="a-muted">{formatDateTime(a.updatedAt)}</td>
                      <td>
                        <div className="actions">
                          {a.status === "published" && (
                            <a className="a-btn a-btn-ghost a-btn-sm" href={articleUrl(a.slug)} target="_blank" rel="noopener noreferrer">View</a>
                          )}
                          <Link className="a-btn a-btn-ghost a-btn-sm" href={`/admin/articles/${a.id}`}>Edit</Link>
                          {user.role === "admin" && (
                            <button className="a-btn a-btn-danger a-btn-sm" onClick={() => remove(a)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pager page={data.page} totalPages={data.totalPages} total={data.total} onPage={setPage} />
        </div>
      )}
    </>
  );
}
