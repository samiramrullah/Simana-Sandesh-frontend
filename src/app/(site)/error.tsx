"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container">
      <div className="empty" style={{ padding: "96px 16px" }}>
        <h2>We couldn&apos;t load the news right now</h2>
        <p style={{ margin: "8px 0 24px" }}>Please check your connection and try again.</p>
        <button className="btn btn-primary" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
