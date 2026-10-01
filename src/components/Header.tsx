"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/types";
import { categoryUrl, formatLongDate } from "@/lib/utils";
import { ChevronRight, CloseIcon, MenuIcon, SearchIcon } from "./Icons";

export default function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [today, setToday] = useState("");
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setToday(formatLongDate()), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    const open = menuOpen || searchOpen;
    document.body.style.overflow = open ? "hidden" : "";
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenuOpen(false); setSearchOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const isActive = (slug: string) => pathname === categoryUrl(slug);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      <div className="topbar">
        <div className="container">
          <span suppressHydrationWarning>{today || " "}</span>
          <nav className="topbar-links" aria-label="Utility">
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </div>

      <header className="masthead">
        <div className="container">
          <div className="masthead-left">
            <button className="icon-btn menu-toggle" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <MenuIcon size={22} />
            </button>
            <div className="masthead-edition">
              <strong>Today&apos;s Edition</strong>
              Truth from the frontier
            </div>
          </div>

          <Link href="/" className="brand" aria-label="Simana Sandesh home">
            <div className="brand-name">Simana <span>Sandesh</span></div>
            <div className="brand-tag">Voice of the border, news for the nation</div>
          </Link>

          <div className="masthead-right">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={21} />
            </button>
            <Link href="/#newsletter" className="btn btn-primary subscribe-btn">Subscribe</Link>
          </div>
        </div>
      </header>

      <nav className={`nav ${scrolled ? "scrolled" : ""}`} aria-label="Sections">
        <div className="container">
          <Link href="/" className="nav-mini-brand" aria-hidden={!scrolled} tabIndex={scrolled ? 0 : -1}>
            Simana <span>Sandesh</span>
          </Link>
          <ul className="nav-list">
            <li><Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>Home</Link></li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={categoryUrl(c.slug)} className={`nav-link ${isActive(c.slug) ? "active" : ""}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
          {scrolled && (
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={19} />
            </button>
          )}
        </div>
      </nav>

      <div className={`drawer-backdrop ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside className={`drawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen} aria-label="Menu">
        <div className="drawer-head">
          <div className="brand-name" style={{ fontSize: "1.5rem" }}>Simana <span>Sandesh</span></div>
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}><CloseIcon /></button>
        </div>
        <div className="drawer-body">
          <Link href="/">Home <ChevronRight /></Link>
          {categories.map((c) => (
            <Link key={c.id} href={categoryUrl(c.slug)}>{c.name} <ChevronRight /></Link>
          ))}
          <Link href="/about">About Us <ChevronRight /></Link>
          <Link href="/contact">Contact <ChevronRight /></Link>
        </div>
        <div className="drawer-foot">
          <Link href="/#newsletter" className="btn btn-primary" style={{ width: "100%" }}>Subscribe</Link>
        </div>
      </aside>

      <div className={`search-overlay ${searchOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!searchOpen}>
        <button className="icon-btn search-close" aria-label="Close search" onClick={() => setSearchOpen(false)}><CloseIcon size={24} /></button>
        <form onSubmit={submitSearch} role="search">
          <label htmlFor="site-search" className="sr-only">Search news</label>
          <input id="site-search" ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search news, topics, places…" />
          <button type="submit" className="icon-btn" aria-label="Submit search"><SearchIcon size={26} /></button>
        </form>
        <div className="search-hint">
          Popular:{" "}
          {["Monsoon", "Cricket", "Metro", "Border", "UPI"].map((t) => (
            <Link key={t} href={`/search?q=${t}`}>{t}</Link>
          ))}
        </div>
      </div>
    </>
  );
}
