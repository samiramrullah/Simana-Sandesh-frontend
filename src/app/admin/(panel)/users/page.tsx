"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminUser, Role } from "@/types";
import { api, errorMessage } from "@/lib/admin-api";
import { useAuth } from "@/components/admin/AdminShell";
import { formatDateTime, Modal, Spinner, useToast } from "@/components/admin/ui";

type Draft = { id?: string; name: string; email: string; password: string; role: Role; designation: string; bio: string; active: boolean };
const blank: Draft = { name: "", email: "", password: "", role: "editor", designation: "Correspondent", bio: "", active: true };

export default function UsersPage() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [list, setList] = useState<AdminUser[] | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.get<AdminUser[]>("/admin/users").then(setList).catch((e) => toast(errorMessage(e), "error"));
  }, [toast]);
  useEffect(() => {
    if (me.role === "admin") load();
  }, [load, me.role]);

  if (me.role !== "admin") return <div className="a-alert error">Only admins can manage the team.</div>;

  async function save() {
    if (!editing) return;
    setError("");
    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/admin/users/${editing.id}`, {
          name: editing.name, role: editing.role, designation: editing.designation, bio: editing.bio, active: editing.active, password: editing.password,
        });
      } else {
        await api.post("/admin/users", {
          name: editing.name, email: editing.email, password: editing.password, role: editing.role, designation: editing.designation, bio: editing.bio,
        });
      }
      toast(editing.id ? "Team member updated" : "Team member added");
      setEditing(null);
      load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove(u: AdminUser) {
    if (!confirm(`Delete ${u.name}'s account?`)) return;
    try {
      await api.del(`/admin/users/${u.id}`);
      toast("Account deleted");
      load();
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  if (!list) return <Spinner />;
  const isSelf = editing?.id === me.id;

  return (
    <>
      <div className="a-toolbar">
        <p className="grow a-muted" style={{ whiteSpace: "normal" }}>Editors can write and publish articles. Admins can also delete articles and manage categories and the team.</p>
        <button className="a-btn a-btn-dark" onClick={() => { setError(""); setEditing({ ...blank }); }}>+ Add member</button>
      </div>

      <div className="a-card a-table-wrap">
        <table className="a-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th /></tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong><div className="a-muted">{u.designation}</div></td>
                <td>{u.email}</td>
                <td><span className={`a-pill ${u.role}`}>{u.role}</span></td>
                <td><span className={`a-pill ${u.active ? "active" : "inactive"}`}>{u.active ? "Active" : "Disabled"}</span></td>
                <td className="a-muted">{formatDateTime(u.lastLoginAt)}</td>
                <td>
                  <div className="actions">
                    <button className="a-btn a-btn-ghost a-btn-sm" onClick={() => { setError(""); setEditing({ id: u.id, name: u.name, email: u.email, password: "", role: u.role, designation: u.designation, bio: u.bio, active: u.active }); }}>Edit</button>
                    {u.id !== me.id && <button className="a-btn a-btn-danger a-btn-sm" onClick={() => remove(u)}>Delete</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal
          title={editing.id ? "Edit team member" : "Add team member"}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="a-btn a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="a-btn a-btn-primary" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save"}</button>
            </>
          }
        >
          <form className="a-stack" onSubmit={(e) => { e.preventDefault(); save(); }} autoComplete="off">
            {error && <div className="a-alert error">{error}</div>}
            <div className="a-grid-2">
              <div className="a-field">
                <label htmlFor="u-name">Full name</label>
                <input id="u-name" className="a-input" maxLength={80} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="a-field">
                <label htmlFor="u-desig">Designation</label>
                <input id="u-desig" className="a-input" maxLength={80} placeholder="e.g. Senior Correspondent" value={editing.designation} onChange={(e) => setEditing({ ...editing, designation: e.target.value })} />
              </div>
            </div>
            <div className="a-field">
              <label htmlFor="u-email">Email</label>
              <input id="u-email" type="email" className="a-input" disabled={Boolean(editing.id)} value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
            </div>
            <div className="a-field">
              <label htmlFor="u-pw">{editing.id ? "New password (leave empty to keep)" : "Password"}</label>
              <input id="u-pw" type="password" className="a-input" autoComplete="new-password" value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} />
              <span className="a-hint">At least 10 characters, with letters and numbers.</span>
            </div>
            <div className="a-grid-2">
              <div className="a-field">
                <label htmlFor="u-role">Role</label>
                <select id="u-role" className="a-select" disabled={isSelf} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as Role })}>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {editing.id && (
                <label className="a-check" style={{ alignSelf: "end", height: 40 }}>
                  <input type="checkbox" disabled={isSelf} checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Account active
                </label>
              )}
            </div>
            <div className="a-field">
              <label htmlFor="u-bio">Short bio (shown under articles)</label>
              <textarea id="u-bio" className="a-textarea" maxLength={500} value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
