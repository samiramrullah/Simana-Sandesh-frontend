"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, errorMessage } from "@/lib/admin-api";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      const next = params.get("next") || "";
      router.replace(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="a-login">
      <div className="a-login-card">
        <div className="a-login-brand">
          <div className="brand-name">Simana <span>Sandesh</span></div>
          <p>Newsroom admin</p>
        </div>
        <form className="a-card a-card-pad a-stack" onSubmit={onSubmit}>
          {error && <div className="a-alert error" role="alert">{error}</div>}
          <div className="a-field">
            <label htmlFor="email">Email</label>
            <input id="email" className="a-input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="a-field">
            <label htmlFor="password">Password</label>
            <div className="a-pw">
              <input id="password" className="a-input" type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"}</button>
            </div>
          </div>
          <button className="a-btn a-btn-primary" style={{ height: 44 }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
