"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/types";
import { api, errorMessage, refreshSite } from "@/lib/admin-api";
import { categoryUrl } from "@/lib/utils";
import { useAuth } from "@/components/admin/AdminShell";
import { Modal, Spinner, useToast } from "@/components/admin/ui";

type Draft = { id?: string; name: string; slug: string; color: string; order: number; showOnHome: boolean };
const blank: Draft = { name: "", slug: "", color: "#b3121b", order: 0, showOnHome: true };

export default function CategoriesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user.role === "admin";
  const [list, setList] = useState<Category[] | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.get<Category[]>("/admin/categories").then(setList).catch((e) => toast(errorMessage(e), "error"));
  }, [toast]);
  useEffect(load, [load]);

  async function save() {
    if (!editing) return;
    setError("");
    setSaving(true);
    const body = { name: editing.name, slug: editing.slug || undefined, color: editing.color, order: Number(editing.order) || 0, showOnHome: editing.showOnHome };
    try {
      if (editing.id) await api.put(`/admin/categories/${editing.id}`, body);
      else await api.post("/admin/categories", body);
      await refreshSite();
      toast(editing.id ? "Category updated" : "Category added");
      setEditing(null);
      load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: Category) {
    if (!confirm(`Delete the "${c.name}" category?`)) return;
    try {
      await api.del(`/admin/categories/${c.id}`);
      await refreshSite();
      toast("Category deleted");
      load();
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  if (!list) return <Spinner />;

  return (
    <>
      <div className="a-toolbar">
        <p className="grow a-muted" style={{ whiteSpace: "normal" }}>Categories appear in the site menu in this order.</p>
        {isAdmin && <button className="a-btn a-btn-dark" onClick={() => { setError(""); setEditing({ ...blank, order: list.length }); }}>+ Add category</button>}
      </div>

      <div className="a-card a-table-wrap">
        <table className="a-table">
          <thead>
            <tr><th>Name</th><th>URL</th><th>Order</th><th>On homepage</th><th>Articles</th><th /></tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td><span className="a-dot" style={{ background: c.color }} /><strong>{c.name}</strong></td>
                <td><a className="a-link" href={categoryUrl(c.slug)} target="_blank" rel="noopener noreferrer">/{c.slug}</a></td>
                <td>{c.order}</td>
                <td>{c.showOnHome ? "Yes" : "No"}</td>
                <td>{c.articleCount}</td>
                <td>
                  {isAdmin && (
                    <div className="actions">
                      <button className="a-btn a-btn-ghost a-btn-sm" onClick={() => { setError(""); setEditing({ id: c.id, name: c.name, slug: c.slug, color: c.color || "#b3121b", order: c.order || 0, showOnHome: c.showOnHome !== false }); }}>Edit</button>
                      <button className="a-btn a-btn-danger a-btn-sm" onClick={() => remove(c)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <div className="a-empty">No categories yet.</div>}
      </div>

      {editing && (
        <Modal
          title={editing.id ? "Edit category" : "Add category"}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="a-btn a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="a-btn a-btn-primary" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save"}</button>
            </>
          }
        >
          <div className="a-stack">
            {error && <div className="a-alert error">{error}</div>}
            <div className="a-field">
              <label htmlFor="c-name">Name</label>
              <input id="c-name" className="a-input" maxLength={50} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} autoFocus />
            </div>
            <div className="a-field">
              <label htmlFor="c-slug">URL name</label>
              <input id="c-slug" className="a-input" maxLength={60} placeholder="auto-generated from name" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div className="a-grid-2">
              <div className="a-field">
                <label htmlFor="c-color">Colour</label>
                <input id="c-color" type="color" className="a-input" style={{ padding: 4 }} value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} />
              </div>
              <div className="a-field">
                <label htmlFor="c-order">Menu order</label>
                <input id="c-order" type="number" min={0} className="a-input" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
              </div>
            </div>
            <label className="a-check"><input type="checkbox" checked={editing.showOnHome} onChange={(e) => setEditing({ ...editing, showOnHome: e.target.checked })} /> Show a section for this category on the homepage</label>
          </div>
        </Modal>
      )}
    </>
  );
}
