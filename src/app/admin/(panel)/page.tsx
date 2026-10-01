"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminStats } from "@/types";
import { api, errorMessage } from "@/lib/admin-api";
import { formatViews } from "@/lib/utils";
import { useAuth } from "@/components/admin/AdminShell";
import { formatDateTime, Spinner } from "@/components/admin/ui";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<AdminStats>("/admin/stats").then(setStats).catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <div className="a-alert error">{error}</div>;
  if (!stats) return <Spinner />;

  const cards = [
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.drafts },
    { label: "Total views", value: formatViews(stats.views) },
    { label: "Categories", value: stats.categories },
    { label: "Team members", value: stats.users },
    { label: "Subscribers", value: stats.subscribers },
  ];

  return (
    <>
      <p style={{ marginBottom: 18, color: "var(--a-muted)" }}>Welcome back, <strong style={{ color: "var(--a-text)" }}>{user.name}</strong>.</p>
      <div className="a-stats">
        {cards.map((c) => (
          <div key={c.label} className="a-card a-stat">
            <div className="num">{c.value}</div>
            <div className="lbl">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="a-card a-card-pad">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <h2 style={{ margin: 0 }}>Recently updated</h2>
          <Link href="/admin/articles" className="a-link" style={{ fontSize: "0.84rem" }}>All articles →</Link>
        </div>
        {stats.recent.length === 0 ? (
          <div className="a-empty">
            No articles yet. <Link href="/admin/articles/new" className="a-link">Write the first one</Link>.
          </div>
        ) : (
          <ul className="a-list-clean">
            {stats.recent.map((a) => (
              <li key={a.id}>
                <div>
                  <Link href={`/admin/articles/${a.id}`}>{a.title}</Link>
                  <div className="a-muted" style={{ marginTop: 3 }}>{a.category.name} · {a.author.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`a-pill ${a.status}`}>{a.status}</span>
                  <div className="a-muted" style={{ marginTop: 4 }}>{formatDateTime(a.updatedAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
