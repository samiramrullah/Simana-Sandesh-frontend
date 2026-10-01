"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "./Icons";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button className={`to-top ${show ? "show" : ""}`} aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <ArrowUp />
    </button>
  );
}
