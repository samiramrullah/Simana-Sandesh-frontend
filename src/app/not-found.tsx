import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty" style={{ padding: "96px 16px" }}>
        <div className="kicker">Error 404</div>
        <h2 style={{ fontSize: "2.2rem", marginTop: 8 }}>This page has gone to press elsewhere</h2>
        <p style={{ margin: "8px 0 24px" }}>The story you&apos;re looking for may have been moved or removed.</p>
        <Link href="/" className="btn btn-primary">Back to the front page</Link>
      </div>
    </div>
  );
}
