"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/Icons";

export function Spinner() {
  return (
    <div className="a-loading" aria-busy="true">
      <div className="a-spinner" />
    </div>
  );
}

export function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="a-modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="a-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="a-modal-head">
          <h3>{title}</h3>
          <button className="a-menu-btn" style={{ display: "grid" }} onClick={onClose} aria-label="Close"><CloseIcon size={18} /></button>
        </div>
        <div className="a-modal-body">{children}</div>
        {footer && <div className="a-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

type Toast = { text: string; kind: "ok" | "error" } | null;
const ToastContext = createContext<(text: string, kind?: "ok" | "error") => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = useCallback((text: string, kind: "ok" | "error" = "ok") => {
    clearTimeout(timer.current);
    setToast({ text, kind });
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && <div className={`a-toast ${toast.kind === "error" ? "error" : ""}`} role="status">{toast.text}</div>}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

export function Pager({ page, totalPages, total, onPage }: { page: number; totalPages: number; total: number; onPage: (p: number) => void }) {
  return (
    <div className="a-pager">
      <span>{total} total · page {page} of {totalPages}</span>
      <div style={{ display: "flex", gap: 6 }}>
        <button className="a-btn a-btn-ghost a-btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
        <button className="a-btn a-btn-ghost a-btn-sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export function formatDateTime(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(iso));
}
