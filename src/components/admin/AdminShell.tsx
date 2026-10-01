"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import type { AdminUser } from "@/types";
import { api } from "@/lib/admin-api";
import { MenuIcon } from "@/components/Icons";
import { Spinner, ToastProvider } from "./ui";

type AuthValue = { user: AdminUser; setUser: (u: AdminUser) => void };
const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AdminShell");
  return ctx;
}

const NAV = [
  { href: "/admin", label: "Dashboard", adminOnly: false },
  { href: "/admin/articles", label: "Articles", adminOnly: false },
  { href: "/admin/articles/new", label: "Write new article", adminOnly: false },
  { href: "/admin/categories", label: "Categories", adminOnly: false },
  { href: "/admin/users", label: "Team", adminOnly: true },
  { href: "/admin/subscribers", label: "Subscribers", adminOnly: true },
  { href: "/admin/profile", label: "My profile", adminOnly: false },
];

const TITLES: [RegExp, string][] = [
  [/^\/admin$/, "Dashboard"],
  [/^\/admin\/articles\/new$/, "New article"],
  [/^\/admin\/articles\/.+/, "Edit article"],
  [/^\/admin\/articles$/, "Articles"],
  [/^\/admin\/categories/, "Categories"],
  [/^\/admin\/users/, "Team"],
  [/^\/admin\/subscribers/, "Subscribers"],
  [/^\/admin\/profile/, "My profile"],
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get<{ user: AdminUser }>("/auth/me").then((d) => setUser(d.user)).catch(() => {});
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await api.post("/auth/logout").catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  if (!user) return <Spinner />;

  const title = TITLES.find(([rx]) => rx.test(pathname))?.[1] ?? "Admin";
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : href === "/admin/articles" ? pathname === "/admin/articles" || /^\/admin\/articles\/(?!new)/.test(pathname) : pathname.startsWith(href);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ToastProvider>
        <div className="a-shell">
          {open && <div className="a-backdrop" onClick={() => setOpen(false)} />}
          <aside className={`a-side ${open ? "open" : ""}`}>
            <Link href="/admin" className="a-side-brand">
              Simana <span>Sandesh</span>
              <small>Newsroom</small>
            </Link>
            <nav className="a-nav">
              {NAV.filter((n) => !n.adminOnly || user.role === "admin").map((n) => (
                <Link key={n.href} href={n.href} className={isActive(n.href) ? "active" : ""}>{n.label}</Link>
              ))}
              <div className="a-nav-label">Website</div>
              <a href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
            </nav>
            <div className="a-side-foot">
              <div className="who">{user.name}</div>
              <div className="role">{user.role}</div>
              <button onClick={logout}>Log out</button>
            </div>
          </aside>
          <div className="a-main">
            <header className="a-topbar">
              <button className="a-menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}><MenuIcon /></button>
              <h1>{title}</h1>
              {!pathname.startsWith("/admin/articles/") && (
                <Link href="/admin/articles/new" className="a-btn a-btn-primary">+ New article</Link>
              )}
            </header>
            <div className="a-content">{children}</div>
          </div>
        </div>
      </ToastProvider>
    </AuthContext.Provider>
  );
}
