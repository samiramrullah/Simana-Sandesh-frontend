"use client";

import { useState } from "react";

export default function TagInput({ value, onChange, max = 15 }: { value: string[]; onChange: (tags: string[]) => void; max?: number }) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const parts = raw.split(",").map((t) => t.trim().slice(0, 40)).filter(Boolean);
    const next = [...value];
    for (const p of parts) if (!next.some((t) => t.toLowerCase() === p.toLowerCase()) && next.length < max) next.push(p);
    onChange(next);
    setDraft("");
  }

  return (
    <div className="a-tags">
      {value.map((t) => (
        <span key={t} className="a-tag">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}>×</button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={value.length ? "" : "Type a topic and press Enter"}
        onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); add(draft); }
          if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => draft && add(draft)}
        aria-label="Add topic"
      />
    </div>
  );
}
