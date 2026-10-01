"use client";

import { useRef, useState } from "react";
import { api, errorMessage } from "@/lib/admin-api";
import { useToast } from "./ui";

type Uploaded = { url: string; publicId: string };

export default function ImageUpload({
  value,
  onChange,
  height = 200,
}: {
  value?: string;
  onChange: (img: Uploaded | null) => void;
  height?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function upload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Please choose an image file.", "error");
    if (file.size > 5 * 1024 * 1024) return toast("Image must be smaller than 5 MB.", "error");
    const form = new FormData();
    form.append("file", file);
    setBusy(true);
    try {
      const res = await api.post<Uploaded>("/admin/upload", form);
      onChange({ url: res.url, publicId: res.publicId });
    } catch (e) {
      toast(errorMessage(e), "error");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div
      className={`a-upload ${busy ? "busy" : ""} ${drag ? "drag" : ""}`}
      style={{ minHeight: height }}
      onClick={() => !value && input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files[0]); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
      aria-label="Upload image"
    >
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(e) => upload(e.target.files?.[0])} />
      {value ? (
        <>
          <img src={value} alt="" />
          <div className="a-upload-actions">
            <button type="button" className="a-btn a-btn-ghost a-btn-sm" onClick={(e) => { e.stopPropagation(); input.current?.click(); }}>Replace</button>
            <button type="button" className="a-btn a-btn-danger a-btn-sm" onClick={(e) => { e.stopPropagation(); onChange(null); }}>Remove</button>
          </div>
        </>
      ) : (
        <div className="a-upload-msg">
          <strong>Click or drop an image here</strong>
          JPG, PNG, WEBP or GIF · up to 5 MB
        </div>
      )}
    </div>
  );
}
