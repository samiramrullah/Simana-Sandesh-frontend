"use client";

import { useEffect, useState } from "react";
import { formatDate, timeAgo } from "@/lib/utils";
export default function TimeAgo({ iso }: { iso: string }) {
  const [label, setLabel] = useState(() => formatDate(iso));
  useEffect(() => {
    setLabel(timeAgo(iso));
    const t = setInterval(() => setLabel(timeAgo(iso)), 60_000);
    return () => clearInterval(t);
  }, [iso]);
  return (
    <time dateTime={iso} title={formatDate(iso, true)} suppressHydrationWarning>
      {label}
    </time>
  );
}
