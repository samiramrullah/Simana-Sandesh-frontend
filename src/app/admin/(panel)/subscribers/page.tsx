"use client";

import { useCallback, useEffect, useState } from "react";
import type { Subscriber } from "@/types";
import { api, errorMessage } from "@/lib/admin-api";
import { useAuth } from "@/components/admin/AdminShell";
import { formatDateTime, Spinner, useToast } from "@/components/admin/ui";

export default function SubscribersPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [list, setList] = useState<Subscriber[] | null>(null);

  const load = useCallback(() => {
    api.get<Subscriber[]>("/admin/subscribers").then(setList).catch((e) => toast(errorMessage(e), "error"));
  }, [toast]);
  useEffect(() => {
    if (user.role === "admin") load();
  }, [load, user.role]);

  if (user.role !== "admin") return <div className="a-alert error">Only admins can view subscribers.</div>;
  if (!list) return <Spinner />;

  function exportCsv() {
    const rows = ["email,subscribed_at", ...list!.map((s) => `${/^[=+\-@]/.test(s.email) ? `'${s.email}` : s.email},${s.createdAt || ""}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function remove(s: Subscriber) {
    if (!confirm(`Remove ${s.email}?`)) return;
    try {
      await api.del(`/admin/subscribers/${s.id}`);
      load();
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  return (
    <>
      <div className="a-toolbar">
        <p className="grow a-muted">{list.length} newsletter subscribers</p>
        <button className="a-btn a-btn-ghost" disabled={!list.length} onClick={exportCsv}>Download CSV</button>
      </div>
      <div className="a-card a-table-wrap">
        {list.length === 0 ? (
          <div className="a-empty">No subscribers yet.</div>
        ) : (
          <table className="a-table">
            <thead><tr><th>Email</th><th>Subscribed</th><th /></tr></thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td className="a-muted">{formatDateTime(s.createdAt)}</td>
                  <td><div className="actions"><button className="a-btn a-btn-danger a-btn-sm" onClick={() => remove(s)}>Remove</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
