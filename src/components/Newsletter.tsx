"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setState("err"); setMsg("Please enter a valid email address."); return; }
    setState("loading");
    try {
      const res = await fetch("/backend/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setState("ok"); setMsg("You're subscribed. Look out for tomorrow morning's briefing."); setEmail("");
    } catch (err) {
      setState("err"); setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="newsletter" id="newsletter" aria-labelledby="nl-title">
      <h3 id="nl-title">The Morning Sandesh</h3>
      <p>The day&apos;s most important stories, in your inbox by 7 AM. Free, every day.</p>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input id="nl-email" type="email" placeholder="Your email address" value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <button className="btn btn-primary" disabled={state === "loading"}>
          {state === "loading" ? "Subscribing…" : "Subscribe free"}
        </button>
        {msg && <p className={`msg ${state === "ok" ? "ok" : "err"}`} role="status">{msg}</p>}
      </form>
    </section>
  );
}
